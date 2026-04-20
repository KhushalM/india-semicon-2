"""
Build two interactive Folium supply-chain maps:
 1. maps/tsmc-supply-chain.html - global TSMC supply chain (tiers T0-T5)
 2. maps/india-semicon.html - India 2026 live ecosystem with import dependencies

Run: python scripts/build_maps.py
"""
from __future__ import annotations
import os
import folium
from folium import plugins
from folium.features import DivIcon

# ─────────────────────────────────────────────
# Design tokens (match the main dashboard)
# ─────────────────────────────────────────────
PAGE_BG = "#edf2f7"
ACCENT = "#2563eb"
TEXT = "#0f172a"
TEXT_2 = "#475569"

# Colorblind-safe tier palette (Wong 2011 palette adapted)
TIER_COLORS = {
    "T0": "#8b5a2b",  # brown — raw materials
    "T1": "#0d9488",  # teal — refined inputs
    "T2": "#7c3aed",  # violet — equipment
    "T3": "#2563eb",  # blue — front-end fabs
    "T4": "#d97706",  # amber — OSAT / back-end
    "T5": "#db2777",  # pink — design & customers
}

TIER_LABELS = {
    "T0": "Raw Materials",
    "T1": "Refined Inputs",
    "T2": "Equipment",
    "T3": "Front-End Fabs",
    "T4": "OSAT / Back-End",
    "T5": "Design & Customers",
}

# ─────────────────────────────────────────────
# Popup template — the teaching moment
# ─────────────────────────────────────────────
def make_popup(name: str, tier: str, what_is_it: str, role: str,
               why_matters: str, key_facts: str, confidence: str = "High",
               source: str | None = None) -> str:
    tier_color = TIER_COLORS[tier]
    tier_label = TIER_LABELS[tier]
    src_html = f'<div style="margin-top:10px;font-size:11px;color:#64748b"><em>Source: {source}</em></div>' if source else ""
    return f"""
<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;width:320px;line-height:1.55;color:{TEXT}">
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
    <span style="display:inline-block;padding:2px 8px;border-radius:6px;background:{tier_color};color:#fff;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase">{tier} · {tier_label}</span>
  </div>
  <div style="font-size:15px;font-weight:700;color:{TEXT};margin-bottom:8px">{name}</div>

  <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:{tier_color};margin-top:10px">What this is</div>
  <div style="font-size:13px;color:{TEXT_2};margin-top:2px">{what_is_it}</div>

  <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:{tier_color};margin-top:10px">Role in the chain</div>
  <div style="font-size:13px;color:{TEXT_2};margin-top:2px">{role}</div>

  <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:{tier_color};margin-top:10px">Why it matters</div>
  <div style="font-size:13px;color:{TEXT_2};margin-top:2px">{why_matters}</div>

  <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:{tier_color};margin-top:10px">Key facts</div>
  <div style="font-size:13px;color:{TEXT_2};margin-top:2px">{key_facts}</div>

  <div style="margin-top:10px;font-size:11px;color:#94a3b8">
    Confidence: <strong style="color:{TEXT_2}">{confidence}</strong>
  </div>
  {src_html}
</div>
"""


def tier_marker(tier: str, label: str, size: int = 28) -> DivIcon:
    """Circular DivIcon with tier letter inside — colorblind-safe and shape-distinct."""
    color = TIER_COLORS[tier]
    return DivIcon(
        icon_size=(size, size),
        icon_anchor=(size // 2, size // 2),
        html=f"""
        <div style="
          width:{size}px;height:{size}px;border-radius:50%;
          background:{color};border:2px solid #fff;
          box-shadow:0 2px 8px rgba(15,22,41,.35);
          display:flex;align-items:center;justify-content:center;
          color:#fff;font-weight:700;font-size:11px;
          font-family:-apple-system,BlinkMacSystemFont,sans-serif;
          ">{tier}</div>
        """,
    )


def add_entity(feature_group, *, lat: float, lng: float, name: str, tier: str,
               tooltip: str, **popup_kwargs) -> None:
    folium.Marker(
        location=(lat, lng),
        tooltip=tooltip,
        popup=folium.Popup(make_popup(name=name, tier=tier, **popup_kwargs), max_width=360),
        icon=tier_marker(tier, name),
    ).add_to(feature_group)


# ─────────────────────────────────────────────
# Legend (bottom-right floating panel, doubles as glossary)
# ─────────────────────────────────────────────
def build_legend(title: str, subtitle: str) -> folium.Element:
    swatches = "".join(
        f'<div style="display:flex;align-items:center;gap:10px;margin:6px 0">'
        f'<span style="width:16px;height:16px;border-radius:50%;background:{c};flex-shrink:0;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.15)"></span>'
        f'<span style="font-size:12px;color:#334155"><strong style="color:#0f172a">{t}</strong> · {TIER_LABELS[t]}</span>'
        f"</div>"
        for t, c in TIER_COLORS.items()
    )
    html = f"""
<div style="
  position: fixed; bottom: 20px; right: 20px; z-index: 9999;
  background: #fff; border-radius: 12px; padding: 16px 18px;
  box-shadow: 0 8px 32px rgba(15,22,41,.18);
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  max-width: 280px;
  border: 1px solid rgba(15,23,42,.08);
  ">
  <div style="font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .1em; color: {ACCENT}; margin-bottom: 4px">Legend</div>
  <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 2px">{title}</div>
  <div style="font-size: 12px; color: #64748b; margin-bottom: 10px; line-height: 1.5">{subtitle}</div>
  {swatches}
  <div style="margin-top:10px;padding-top:10px;border-top:1px solid #e2e8f0;font-size:11px;color:#64748b;line-height:1.55">
    <strong style="color:#334155">Tip:</strong> Click any marker for a plain-English explainer. Use the layer control (top-right) to toggle tiers.
  </div>
</div>
"""
    return folium.Element(html)


# ─────────────────────────────────────────────
# MAP 1 — TSMC GLOBAL SUPPLY CHAIN
# ─────────────────────────────────────────────
def build_tsmc_map() -> folium.Map:
    m = folium.Map(
        location=[25.0, 100.0],
        zoom_start=3,
        tiles="CartoDB positron",
        control_scale=True,
        prefer_canvas=True,
    )

    # Create a FeatureGroup per tier (toggleable)
    fgs = {t: folium.FeatureGroup(name=f"{t} — {TIER_LABELS[t]}", show=True) for t in TIER_COLORS}

    # ── T0 Raw Materials ──
    add_entity(
        fgs["T0"], lat=35.912, lng=-82.076,
        name="Spruce Pine, NC — quartzite mining",
        tier="T0",
        tooltip="Spruce Pine — high-purity quartz (the silicon feedstock)",
        what_is_it="A small town in North Carolina that mines the world's purest quartzite — the feedstock from which semiconductor-grade silicon is made.",
        role="The quartz is refined into silicon, then grown into ingots, then sliced into the wafers every chip starts from.",
        why_matters="~90% of the world's semiconductor-grade quartz comes from this one region. Single geographic choke-point.",
        key_facts="Operators: Sibelco, The Quartz Corp. If Spruce Pine is disrupted (e.g., hurricane), the entire industry feels it.",
        confidence="High", source="USITC, industry reports",
    )
    add_entity(
        fgs["T0"], lat=46.482, lng=30.723,
        name="Odesa, Ukraine — neon production",
        tier="T0",
        tooltip="Odesa — neon (chip-making gas)",
        what_is_it="Ukrainian cities Odesa and pre-2022 Mariupol produced purified neon gas from by-products of Russian/Ukrainian steel mills.",
        role="Neon is used inside excimer lasers that power DUV lithography — the machines that draw circuit patterns onto wafers.",
        why_matters="Ukraine supplied ~70% of world's neon pre-2022. When war broke out, prices spiked 10x and fabs scrambled for alternatives.",
        key_facts="Primary producers: Iceblick, Cryoin. Post-invasion: most capacity offline or relocated; industry now hedges with Japan, China, US.",
        confidence="High", source="CSIS, USITC",
    )

    # ── T1 Refined Inputs (wafers, chemicals, resist, gases) ──
    add_entity(
        fgs["T1"], lat=35.912, lng=136.167,
        name="Shin-Etsu Chemical — Takefu, Japan",
        tier="T1",
        tooltip="Shin-Etsu — world's largest silicon wafer maker (27% share)",
        what_is_it="World's largest maker of polished silicon wafers — the mirror-smooth discs that fabs pattern into chips. Also makes photoresist and silicone.",
        role="Wafers flow to TSMC (and every other fab) as the blank canvas. Without wafers, no chips.",
        why_matters="27% of global 300mm wafer supply. Combined with #2 SUMCO (Japan), two Japanese firms = 51% of wafers.",
        key_facts="Invested JPY 150B (~$1B) expanding Shirakawa + Takefu for 2nm-3nm-grade wafers. 200k wafers/month added.",
        confidence="High", source="Mordor Intelligence market data",
    )
    add_entity(
        fgs["T1"], lat=33.270, lng=129.874,
        name="SUMCO — Imari, Japan",
        tier="T1",
        tooltip="SUMCO — #2 silicon wafer maker (24% share)",
        what_is_it="Japanese silicon wafer maker, spun off from Sumitomo. Specializes in 300mm prime/epitaxial wafers for leading-edge logic and memory.",
        role="Supplies TSMC, Samsung, Intel, Micron. Competes head-to-head with Shin-Etsu on the top-tier 2nm-capable wafers.",
        why_matters="24% global share. Japan concentration = geopolitical risk concentration.",
        key_facts="Major site: Imari, Kyushu. Public on Tokyo Stock Exchange.",
        confidence="High", source="Mordor, SEMI",
    )
    add_entity(
        fgs["T1"], lat=24.813, lng=120.974,
        name="GlobalWafers — Hsinchu, Taiwan",
        tier="T1",
        tooltip="GlobalWafers — #3 silicon wafer maker (17% share)",
        what_is_it="Taiwanese wafer maker, owns German silicon firms Siltronic-adjacent capacity (attempted merger blocked 2022) and new Sherman, TX fab.",
        role="Supplies TSMC locally in Taiwan + global foundries.",
        why_matters="17% global share. New Sherman, TX plant hit 300,000 wafers/year run rate — rare Western capacity.",
        key_facts="Parent of MEMC Electronic Materials legacy assets.",
        confidence="High",
    )
    add_entity(
        fgs["T1"], lat=48.165, lng=12.820,
        name="Siltronic — Burghausen, Germany",
        tier="T1",
        tooltip="Siltronic — EU silicon wafer maker (12% share)",
        what_is_it="German silicon wafer manufacturer, one of only two non-Asian producers at scale (the other is GlobalWafers USA).",
        role="Strategic EU wafer supply for European fabs (Intel Magdeburg, ESMC Dresden).",
        why_matters="12% global share. The EU's own wafer champion. Critical for sovereign silicon strategy.",
        key_facts="Parent: Wacker Chemie AG.",
        confidence="High",
    )
    add_entity(
        fgs["T1"], lat=35.527, lng=139.716,
        name="Tokyo Ohka Kogyo (TOK) — Kawasaki, Japan",
        tier="T1",
        tooltip="TOK — photoresist (EUV-grade, Japanese monopoly)",
        what_is_it="Maker of photoresist — a light-sensitive liquid coated onto wafers. Where UV light hits, the resist changes chemically, transferring a circuit pattern.",
        role="EUV photoresist is the 'photographic film' that lets ASML's EUV machines etch circuits at 2nm scale. TOK is a top-3 global supplier.",
        why_matters="Japanese firms (TOK, JSR, Shin-Etsu, Fujifilm) control ~90% of photoresist and ~75% of EUV resist. Any disruption halts leading-edge chip production.",
        key_facts="Clients: TSMC, Samsung, Intel.",
        confidence="High", source="Fountyl, Fortune Business Insights",
    )
    add_entity(
        fgs["T1"], lat=35.681, lng=139.767,
        name="JSR Corporation — Tokyo, Japan",
        tier="T1",
        tooltip="JSR — EUV photoresist leader",
        what_is_it="Japanese specialty chemicals firm, originally a synthetic rubber maker, now a leader in ArF-immersion and EUV photoresists.",
        role="Supplies EUV photoresist to TSMC, Samsung, Intel. Also makes anti-reflective coatings and planarization films.",
        why_matters="~25% share of EUV resist market. Taken private by JIC (Japan Investment Corp) in 2024 — a strategic sovereignty move.",
        key_facts="Post-take-private, JSR is a state-aligned pillar of Japan's semiconductor materials strategy.",
        confidence="High",
    )
    add_entity(
        fgs["T1"], lat=48.110, lng=11.582,
        name="Merck EMD Electronics — Darmstadt, Germany",
        tier="T1",
        tooltip="Merck — specialty chemicals for chip manufacturing",
        what_is_it="German specialty chemicals giant (Merck KGaA). Makes photoresists, CMP slurries, planarization chemistry, and deposition precursors.",
        role="Supplies ~30,000 different chemicals to fabs worldwide. Acquired Versum Materials in 2019 to deepen semiconductor presence.",
        why_matters="Strategic non-Japanese source of advanced chemistries. EU's main chemical supplier for leading-edge fabs.",
        key_facts="Not the US Merck (pharma) — German Merck is ~350 years old.",
        confidence="High",
    )
    add_entity(
        fgs["T1"], lat=48.877, lng=2.305,
        name="Air Liquide — Paris, France",
        tier="T1",
        tooltip="Air Liquide — industrial + specialty gases",
        what_is_it="French industrial gases giant. Supplies nitrogen, oxygen, hydrogen, plus specialty gases (neon, xenon, krypton, NF3, SF6) to fabs.",
        role="A fab uses ~50 different high-purity gases. Air Liquide co-locates gas plants next to fabs for reliability.",
        why_matters="Air Liquide + Linde + Taiyo Nippon Sanso = ~80% global specialty gas supply.",
        key_facts="Gas supply is a 'utility' but utterly critical — a 2-hour nitrogen outage can scrap millions in work-in-progress.",
        confidence="High", source="Industry reports",
    )
    add_entity(
        fgs["T1"], lat=51.236, lng=-0.575,
        name="Linde plc — Guildford, UK (global HQ)",
        tier="T1",
        tooltip="Linde — world's largest industrial gas supplier",
        what_is_it="World's largest industrial gas company (Linde AG + Praxair merger). Supplies the same portfolio of gases as Air Liquide to semiconductor fabs.",
        role="Linde operates on-site air separation units (ASUs) at most major fabs, delivering nitrogen, oxygen, argon directly via pipelines.",
        why_matters="Duopoly with Air Liquide on Western-world gas supply to chip fabs.",
        key_facts="Dual-listed US (NYSE:LIN) after 2018 merger.",
        confidence="High",
    )
    # ── T1 Sputtering targets ──
    add_entity(
        fgs["T1"], lat=35.676, lng=139.770,
        name="JX Nippon Mining & Metals — Tokyo, Japan",
        tier="T1",
        tooltip="JX Nippon — sputtering target leader (copper, tantalum, ruthenium)",
        what_is_it="Sputtering targets are solid metal or compound 'pucks' that get atom-blasted inside deposition tools to lay down the thin metal films of a chip (copper interconnects, tungsten plugs, tantalum barriers, etc.). JX Nippon is the global leader.",
        role="Every metal layer of every chip involves a sputtering target. TSMC, Samsung, Intel all source from JX Nippon for leading-edge copper + ruthenium.",
        why_matters="Sputtering-target market ~$1.8B (2024) → $3.1B by 2032. Japan + US duopoly in high-purity grades.",
        key_facts="Competes with Materion (USA), Plansee (Austria), Mitsui Mining.",
        confidence="High", source="Verified Market Research",
    )
    add_entity(
        fgs["T1"], lat=41.485, lng=-81.741,
        name="Materion — Mayfield Heights, OH, USA",
        tier="T1",
        tooltip="Materion — specialty sputtering targets + photomask materials",
        what_is_it="US specialty materials firm (formerly Brush Engineered Materials). Makes sputtering targets for copper/cobalt/ruthenium barrier layers, plus photomask raw materials.",
        role="Alternative to Japanese targets for US-based fabs. Strategic for Arizona Fab 21, Intel Ohio.",
        why_matters="Domestic US supply option for Micron, Intel, GlobalFoundries.",
        key_facts="Revenue ~$1.7B. NYSE:MTRN.",
        confidence="High",
    )
    # ── T1 CMP Slurries ──
    add_entity(
        fgs["T1"], lat=42.535, lng=-71.279,
        name="Entegris / CMC Materials — Billerica, MA",
        tier="T1",
        tooltip="Entegris (CMC Materials) — CMP slurry leader (30%+ share)",
        what_is_it="CMP (Chemical Mechanical Planarization) slurries are liquid abrasives used to polish wafer surfaces between layers, leveling atomic-scale bumps so the next layer can be patterned cleanly. Entegris (after acquiring CMC Materials) is global #1.",
        role="Every layer of a modern chip is planarized via CMP. Slurry chemistry must match metal (copper, tungsten, cobalt) and dielectric (oxide, low-k) being polished.",
        why_matters=">30% market share. Long-term supply contracts with Intel, TSMC, Samsung. Without slurry, yield collapses.",
        key_facts="CMC was acquired by Entegris for $6.5B in 2022. DuPont 22%, Fujimi 15% are next-largest competitors.",
        confidence="High", source="Business Research Insights",
    )
    add_entity(
        fgs["T1"], lat=35.181, lng=136.906,
        name="Fujimi Incorporated — Nagoya, Japan",
        tier="T1",
        tooltip="Fujimi — high-purity CMP abrasives (~15% share)",
        what_is_it="Japanese specialty abrasives maker focused on high-purity CMP slurries and polishing compounds for silicon wafers and chip CMP steps.",
        role="Supplies abrasives (alumina, silica, ceria) used to polish wafer substrates at Shin-Etsu/SUMCO before chips are made, plus layer-level CMP slurries.",
        why_matters="~15% CMP slurry share. Critical input at multiple supply-chain points.",
        key_facts="Also supplies polishing powders for optics and precision tooling.",
        confidence="High",
    )
    # ── T1 Wet Chemicals ──
    add_entity(
        fgs["T1"], lat=34.693, lng=135.502,
        name="Stella Chemifa — Osaka, Japan",
        tier="T1",
        tooltip="Stella Chemifa — ultra-pure hydrofluoric acid for chips",
        what_is_it="Japanese specialty chemical maker focused on ultra-high-purity hydrofluoric acid (HF), used to etch silicon oxide during chip manufacturing.",
        role="Semiconductor-grade HF (parts-per-trillion impurity level) is used at multiple etch steps. Stella Chemifa is one of two global leaders (with Morita Chemical).",
        why_matters="When South Korea–Japan trade dispute hit in 2019, HF supply to Samsung became a national crisis.",
        key_facts="Also makes fluorine gas (F2) and BOE (buffered oxide etchant).",
        confidence="High",
    )
    add_entity(
        fgs["T1"], lat=49.493, lng=8.445,
        name="BASF — Ludwigshafen, Germany",
        tier="T1",
        tooltip="BASF — semiconductor-grade wet chemicals + H2SO4",
        what_is_it="German specialty chemicals giant. Supplies hydrogen peroxide, sulfuric acid, and planarization chemistry at semiconductor grade.",
        role="Competing with Mitsubishi Chemical in wet chemicals. Breaking ground on a new semi-grade sulfuric acid plant in Ludwigshafen (2027 ops).",
        why_matters="BASF + Mitsubishi Chemical combined: ~25% wet chemicals share. European sovereign supply option.",
        key_facts="Market 2024: $4.78B; growing to $8.65B by 2032 (6.8% CAGR).",
        confidence="High", source="OpenPR / SNS Insider",
    )
    add_entity(
        fgs["T1"], lat=35.696, lng=139.739,
        name="Mitsubishi Chemical — Tokyo, Japan",
        tier="T1",
        tooltip="Mitsubishi Chemical — wet chemicals + specialty materials",
        what_is_it="Japanese specialty chemicals giant. Wet chemicals (HF, H2O2, H2SO4, NH4OH, BOE) at sub-ppb purity for fabs.",
        role="Along with BASF, a top-2 wet chemicals supplier. Also supplies polymer materials for packaging.",
        why_matters="Vertical integration across wet chemicals gives Japan a sovereign wet-process supply chain.",
        key_facts="Combined Mitsubishi Chemical Group includes Nippon Polyester, Japan Polyethylene.",
        confidence="High",
    )
    # ── T1 Photomasks & Mask Blanks ──
    add_entity(
        fgs["T1"], lat=41.473, lng=-73.411,
        name="Photronics — Brookfield, CT, USA",
        tier="T1",
        tooltip="Photronics — merchant photomask leader",
        what_is_it="A photomask is the 'stencil' through which lithography tools project circuit patterns onto wafers. Photronics is the largest merchant (non-captive) photomask supplier — fabs without their own mask shops buy from Photronics.",
        role="Every new chip design requires a mask set ($200k–$30M+ depending on node). Photronics makes masks for TSMC, UMC, Samsung, GlobalFoundries at 28nm and older.",
        why_matters="Leading-edge masks (EUV) are typically made in-house at TSMC/Samsung/Intel; Photronics dominates everything else.",
        key_facts="NYSE:PLAB. Photomask market: $4.8B (2024) → $6.6B by 2031.",
        confidence="High", source="Mordor Intelligence",
    )
    add_entity(
        fgs["T1"], lat=35.695, lng=139.771,
        name="Toppan / Tekscend — Tokyo, Japan",
        tier="T1",
        tooltip="Toppan (Tekscend) — EUV + advanced photomasks",
        what_is_it="Japanese printing-origin conglomerate. Tekscend (Toppan subsidiary) is a top-tier photomask maker for advanced nodes including EUV.",
        role="Supplies EUV photomasks to TSMC, Samsung, Intel. Runs multibeam writer fleets and phase-shift mask capability.",
        why_matters="Together with DNP and Photronics, forms the top-3 mask makers. Japan ~60% of market share.",
        key_facts="Partner with ASML on pellicle compatibility for high-NA EUV.",
        confidence="High",
    )
    add_entity(
        fgs["T1"], lat=35.703, lng=139.750,
        name="Dai Nippon Printing (DNP) — Tokyo, Japan",
        tier="T1",
        tooltip="DNP — photomasks + mask blanks + metal masks",
        what_is_it="Japanese printing / materials giant. Photomask operations rival Toppan. Also makes FMMs (fine metal masks) for OLED displays.",
        role="Mask supplier to every major foundry. Also a major player in semiconductor lead frames and advanced substrates.",
        why_matters="Japan's mask duopoly with Toppan gives Japan structural control over a critical fab input.",
        key_facts="Public on Tokyo Stock Exchange.",
        confidence="High",
    )
    add_entity(
        fgs["T1"], lat=35.659, lng=139.703,
        name="Hoya Corporation — Tokyo, Japan",
        tier="T1",
        tooltip="Hoya — EUV photomask blanks (world leader)",
        what_is_it="Japanese optics + materials firm (founded as an optical glass maker). Makes the blank mask substrate (quartz + multilayer reflective coating) that mask shops then pattern with circuit designs.",
        role="For EUV, the blank is a stack of 40+ alternating molybdenum/silicon layers on ultra-flat quartz. Hoya + AGC = near-monopoly on EUV blanks.",
        why_matters="Without Hoya blanks, no EUV masks. Without EUV masks, no EUV-patterned chips.",
        key_facts="Tripling EUV blank output at Kumamoto plant (2024–2025 actions).",
        confidence="High", source="Photo-Sciences, Wikipedia",
    )
    # ── T2 Additions: lithography alternatives, diffusion, test, metrology, implant ──
    add_entity(
        fgs["T2"], lat=35.676, lng=139.773,
        name="Canon — Tokyo, Japan",
        tier="T2",
        tooltip="Canon — DUV lithography + nanoimprint (FPA-1200NZ2C)",
        what_is_it="Japanese camera/optics giant. Second-largest lithography maker (after ASML). Makes DUV i-line, KrF, and ArF immersion scanners, plus the new nanoimprint lithography (NIL) tools (FPA-1200NZ2C).",
        role="Supplies lithography at 28nm+ nodes where EUV isn't needed — most automotive, analog, power, and industrial chips.",
        why_matters="Only non-ASML alternative for advanced DUV. Nanoimprint is Canon's long-shot play at sub-EUV costs for memory.",
        key_facts="Sold first FPA-1200NZ2C to Kioxia/Western Digital (2024) for NAND production.",
        confidence="High",
    )
    add_entity(
        fgs["T2"], lat=35.691, lng=139.770,
        name="Nikon — Tokyo, Japan",
        tier="T2",
        tooltip="Nikon — DUV lithography (legacy leader)",
        what_is_it="Japanese precision optics maker. Historical lithography leader before ASML overtook them in the 2000s. Still supplies DUV i-line and KrF tools.",
        role="Secondary lithography option at mature nodes. Major legacy install base in Japan + Korea.",
        why_matters="Shrinking market share (ASML dominates) but strategically relevant as a sovereign option for partner countries.",
        key_facts="NASDAQ:NINOY / TSE:7731.",
        confidence="High",
    )
    add_entity(
        fgs["T2"], lat=35.706, lng=139.751,
        name="Kokusai Electric — Tokyo, Japan",
        tier="T2",
        tooltip="Kokusai Electric — LP-CVD + ALD + diffusion furnaces",
        what_is_it="Japanese equipment maker (Hitachi spinoff). Specializes in batch thermal processes: low-pressure CVD, atomic layer deposition (ALD), oxidation, annealing, diffusion furnaces.",
        role="Every silicon oxide layer, every nitride, every polysilicon gate starts in a Kokusai furnace. Critical complement to TEL and Applied Materials.",
        why_matters="Near-monopoly in vertical batch furnaces for 300mm fabs.",
        key_facts="TSE:6525. Went public 2023.",
        confidence="High", source="Kokusai Electric",
    )
    add_entity(
        fgs["T2"], lat=35.011, lng=135.768,
        name="Screen Holdings — Kyoto, Japan",
        tier="T2",
        tooltip="Screen Holdings — wafer cleaning + photoresist coaters",
        what_is_it="Japanese equipment maker. Dominant in single-wafer cleaning tools; also makes coat/develop tools (competing with TEL).",
        role="Wafer cleaning happens dozens of times during chip manufacturing. Screen + TEL split this market.",
        why_matters="Alternate to TEL for coat/develop at leading-edge fabs.",
        key_facts="TSE:7735.",
        confidence="High",
    )
    add_entity(
        fgs["T2"], lat=35.683, lng=139.772,
        name="Advantest — Tokyo, Japan",
        tier="T2",
        tooltip="Advantest — semiconductor test equipment leader ('ASML of test')",
        what_is_it="Japanese test equipment maker. Makes the huge machines (testers) that verify every finished chip works before shipping. Leader in SoC, DRAM, HBM testing.",
        role="Every AI chip from Nvidia, every Apple SoC, every HBM stack gets tested on Advantest (or Teradyne) before OSAT.",
        why_matters="Advantest + Teradyne + Cohu = ~55% of test equipment market. Advantest is #1 by revenue in leading-edge.",
        key_facts="Test equipment market: $16B (2026) → $21.6B by 2031.",
        confidence="High", source="Fortune Business Insights, Mordor",
    )
    add_entity(
        fgs["T2"], lat=42.575, lng=-71.063,
        name="Teradyne — North Reading, MA, USA",
        tier="T2",
        tooltip="Teradyne — test equipment #2 + Technoprobe stake",
        what_is_it="US test equipment maker. Second-largest ATE (automated test equipment) supplier after Advantest. Also owns robotics (Universal Robots).",
        role="Test platforms for digital, analog, RF, image sensors. Major customer of every fabless company.",
        why_matters="Bought 10% of Technoprobe for $516M in April 2025 — vertical integration into probe cards.",
        key_facts="NYSE:TER.",
        confidence="High",
    )
    add_entity(
        fgs["T2"], lat=37.676, lng=-121.771,
        name="FormFactor — Livermore, CA",
        tier="T2",
        tooltip="FormFactor — probe cards (wafer-level test)",
        what_is_it="US maker of probe cards — the precision arrays of thousands of tiny needles that touch every die on a wafer during wafer-level test, before dicing.",
        role="No probe card, no wafer test. FormFactor is partnered with Advantest and dominates leading-edge probe cards.",
        why_matters="Probe cards scale with pin count — at 3nm+ nodes pin counts exceed 10,000 channels per card.",
        key_facts="Doubled Taiwan service capacity May 2025. NYSE:FORM.",
        confidence="High",
    )
    add_entity(
        fgs["T2"], lat=42.539, lng=-70.880,
        name="Axcelis Technologies — Beverly, MA",
        tier="T2",
        tooltip="Axcelis — ion implant leader",
        what_is_it="US specialty equipment maker focused on ion implantation — shooting dopant atoms (boron, phosphorus, arsenic) into silicon to give it electrical properties.",
        role="Every transistor in every chip involves 10+ implant steps. Axcelis + Applied Materials + Sumitomo Heavy = the global market.",
        why_matters="Specialist in power and mature-node implant (silicon carbide, image sensors, automotive).",
        key_facts="NASDAQ:ACLS.",
        confidence="High",
    )
    add_entity(
        fgs["T2"], lat=42.612, lng=-71.258,
        name="Onto Innovation — Wilmington, MA",
        tier="T2",
        tooltip="Onto Innovation — metrology + inspection (after Rudolph+Nanometrics merger)",
        what_is_it="US metrology firm formed by merger of Rudolph Technologies + Nanometrics. Optical metrology, overlay inspection, film thickness measurement.",
        role="Alternative to KLA for process control metrology. Growing fast with advanced packaging demand.",
        why_matters="2nd-tier metrology player behind KLA. NASDAQ:ONTO.",
        key_facts="Revenue ~$1B.",
        confidence="High",
    )
    add_entity(
        fgs["T2"], lat=35.667, lng=139.619,
        name="Ebara Corporation — Tokyo, Japan",
        tier="T2",
        tooltip="Ebara — CMP tools + dry vacuum pumps",
        what_is_it="Japanese industrial machinery maker. Two big semiconductor businesses: CMP polishers (competing with Applied Materials) and dry vacuum pumps (used inside every deposition/etch tool).",
        role="Vacuum pumps are the unseen utility of every fab — thousands per fab. Ebara + Edwards split this market.",
        why_matters="Dual role as tool maker + critical sub-supplier.",
        key_facts="TSE:6361.",
        confidence="High",
    )
    add_entity(
        fgs["T2"], lat=51.762, lng=-0.208,
        name="Edwards Vacuum (Atlas Copco) — Crawley, UK",
        tier="T2",
        tooltip="Edwards — vacuum pumps + abatement systems",
        what_is_it="British vacuum-technology firm (now part of Swedish Atlas Copco). Dry vacuum pumps for CVD, etch, implant, plus abatement systems that burn toxic effluent gases.",
        role="Every process chamber in every fab has Edwards pumps. Abatement handles the dangerous gases before they reach the atmosphere.",
        why_matters="Duopoly with Ebara on vacuum; near-monopoly on advanced abatement.",
        key_facts="Private (owned by Atlas Copco NASDAQ:ATLKF).",
        confidence="High",
    )

    # ── T2 Equipment ──
    add_entity(
        fgs["T2"], lat=51.443, lng=5.478,
        name="ASML — Veldhoven, Netherlands",
        tier="T2",
        tooltip="ASML — EUV lithography monopoly (sole global supplier)",
        what_is_it="Dutch company that makes lithography machines — the $200M machines that 'print' circuit patterns onto wafers using UV/EUV light.",
        role="The only company on Earth that makes EUV (Extreme Ultraviolet, 13.5nm wavelength) lithography. Required for every chip at 7nm and smaller.",
        why_matters="Single point of failure for the entire global chip industry at leading edge. TSMC, Samsung, Intel, SK Hynix all depend on ASML EUV. US export controls block EUV sales to China.",
        key_facts="EUV market share: 100%. Overall lithography: 83%. Suppliers: Zeiss (optics), Trumpf (laser), Cymer (source). TSMC is ASML's #1 customer.",
        confidence="High", source="TrendForce, ASML",
    )
    add_entity(
        fgs["T2"], lat=48.783, lng=10.098,
        name="Zeiss SMT — Oberkochen, Germany",
        tier="T2",
        tooltip="Zeiss — EUV mirrors (ASML's exclusive optics supplier)",
        what_is_it="The optics division of Carl Zeiss. Makes the mirrors inside ASML's EUV scanners — 'the most precise mirrors in the world,' with surface accuracy measured in picometers.",
        role="Exclusive supplier of EUV projection optics to ASML. If Zeiss can't deliver, ASML can't ship EUV machines.",
        why_matters="Another single point of failure. A single EUV mirror takes months to polish and costs tens of millions of euros.",
        key_facts="Zeiss SMT is the semiconductor-focused business of the 180-year-old Zeiss group.",
        confidence="High", source="Zeiss SMT, ASML",
    )
    add_entity(
        fgs["T2"], lat=48.834, lng=9.046,
        name="Trumpf — Ditzingen, Germany",
        tier="T2",
        tooltip="Trumpf — 40 kW CO2 laser for EUV light source",
        what_is_it="German precision-tool and laser giant. Makes the 40 kW CO2 laser that vaporizes tin droplets to generate EUV light inside ASML scanners.",
        role="Laser zaps tin droplets 50,000 times per second; plasma emits 13.5nm EUV light. Trumpf's laser = ASML's flashlight.",
        why_matters="This laser requires 1 MW of power supply. No other company builds production-grade CO2 lasers at this scale.",
        key_facts="Only Trumpf and ASML's in-house Cymer unit together can make the EUV source work.",
        confidence="High",
    )
    add_entity(
        fgs["T2"], lat=37.353, lng=-121.955,
        name="Applied Materials — Santa Clara, CA",
        tier="T2",
        tooltip="Applied Materials — #1 equipment maker (deposition, implant, CMP)",
        what_is_it="World's largest semiconductor equipment company by revenue. Makes deposition (PVD, CVD, ALD), ion implant, chemical-mechanical planarization (CMP), and inspection tools.",
        role="A chip goes through 1,000+ process steps; Applied's tools handle a huge fraction of the non-lithography steps.",
        why_matters="Critical US equipment champion. US export controls on China go through companies like AMAT.",
        key_facts="Revenue ~$27B. Customers: TSMC, Samsung, Intel, every major fab.",
        confidence="High",
    )
    add_entity(
        fgs["T2"], lat=37.562, lng=-121.998,
        name="Lam Research — Fremont, CA",
        tier="T2",
        tooltip="Lam Research — etch + deposition equipment leader",
        what_is_it="US equipment maker specializing in plasma etch, thin-film deposition, and photoresist strip.",
        role="After lithography patterns the resist, etch tools (Lam dominates) remove unprotected material to carve circuits.",
        why_matters="Top-3 US equipment company. Dominates etch, which is ~15-20% of fab capex.",
        key_facts="Revenue ~$15B.",
        confidence="High",
    )
    add_entity(
        fgs["T2"], lat=37.437, lng=-121.893,
        name="KLA Corporation — Milpitas, CA",
        tier="T2",
        tooltip="KLA — metrology + inspection (quality control)",
        what_is_it="US company that makes the measurement and inspection tools used at every process step to catch defects before they compound.",
        role="Every wafer is measured dozens of times during its 3-month journey through a fab. KLA tools do the measuring.",
        why_matters="Near-monopoly (>50% share) in semiconductor metrology.",
        key_facts="Revenue ~$10B. Without metrology, yield collapses.",
        confidence="High",
    )
    add_entity(
        fgs["T2"], lat=35.683, lng=139.769,
        name="Tokyo Electron (TEL) — Tokyo, Japan",
        tier="T2",
        tooltip="Tokyo Electron — coat/develop + etch (#2 non-ASML Asian equipment)",
        what_is_it="Japan's largest semiconductor equipment maker. Dominates coat/develop (applying photoresist) and is a top-3 etch supplier.",
        role="Every wafer entering a lithography step is coated by a TEL tool. Then the exposed resist is developed in a TEL tool.",
        why_matters="TEL coat/develop tools are paired with ASML scanners — they sit literally side-by-side on the fab floor.",
        key_facts="Revenue ~$15B. Headquarters: Tokyo; major R&D site Kumamoto.",
        confidence="High",
    )

    # ── T3 TSMC Fabs (all known operational + announced facilities) ──
    add_entity(
        fgs["T3"], lat=24.784, lng=120.996,
        name="TSMC Hsinchu Fab 2/3/5/8 + HQ",
        tier="T3",
        tooltip="Hsinchu — oldest fabs + HQ + R&D center",
        what_is_it="TSMC's corporate headquarters and oldest fab cluster in Hsinchu Science Park. Fabs 2, 3, 5, 8 run mature processes; corporate R&D sits here.",
        role="The origin of every TSMC node. Node development happens at Hsinchu R&D before ramping elsewhere.",
        why_matters="If Hsinchu is disrupted, TSMC's entire roadmap stalls.",
        key_facts="Founded 1987. Fab 1 (original) was here. Mix of 8-inch (200mm) and 12-inch (300mm) lines.",
        confidence="High",
    )
    add_entity(
        fgs["T3"], lat=24.779, lng=121.010,
        name="TSMC Hsinchu Fab 12 + Fab 20",
        tier="T3",
        tooltip="Hsinchu Fab 12/20 — 16/10/7nm + N2 R&D",
        what_is_it="Fab 12 is TSMC's flagship Hsinchu 300mm complex (16/10/7nm nodes). Fab 20 is the new N2 R&D and pilot production site, adjacent to the global R&D center.",
        role="Where N2 (2nm) was developed before ramping to Kaohsiung Fab 22.",
        why_matters="Fab 20 proves every new node before high-volume manufacturing starts elsewhere.",
        key_facts="Fab 20 broke ground 2022; N2 R&D there through 2025.",
        confidence="High",
    )
    add_entity(
        fgs["T3"], lat=24.841, lng=121.003,
        name="TSMC Longtan — Fab 10",
        tier="T3",
        tooltip="Longtan Fab 10 — mature 200mm",
        what_is_it="TSMC Longtan Science Park Fab 10 — 200mm (8-inch) wafer fab running 250/180nm nodes.",
        role="Legacy analog / embedded / automotive-grade chip production. Part of TSMC's mature-node capacity.",
        why_matters="Mature 200mm capacity remains strategically important for automotive and industrial customers.",
        key_facts="Opened 1999. Taoyuan County.",
        confidence="Medium",
    )
    add_entity(
        fgs["T3"], lat=24.192, lng=120.624,
        name="TSMC Taichung — Fab 15",
        tier="T3",
        tooltip="Taichung Fab 15 — 28/16nm Gigafab",
        what_is_it="TSMC Central Taiwan Science Park 300mm Gigafab 15. Runs 28nm and 16nm nodes.",
        role="Mid-Taiwan hub for mature-to-mid-advanced capacity — between Hsinchu (north) and Tainan (south).",
        why_matters="Key 28nm capacity for automotive, IoT, and consumer chips.",
        key_facts="~100k wpm capacity across phases.",
        confidence="High",
    )
    add_entity(
        fgs["T3"], lat=23.014, lng=120.219,
        name="TSMC Tainan — Fab 14",
        tier="T3",
        tooltip="Tainan Fab 14 — 7nm / 5nm Gigafab",
        what_is_it="TSMC Southern Taiwan Science Park Fab 14. Runs 7nm and 5nm nodes in high volume.",
        role="The workhorse of TSMC's mature leading-edge output — where Apple A-series, Nvidia, AMD chips are produced.",
        why_matters="Backbone of TSMC's 5/7nm revenue through mid-decade.",
        key_facts="~5x the size of a typical European fab.",
        confidence="High",
    )
    add_entity(
        fgs["T3"], lat=23.100, lng=120.249,
        name="TSMC Tainan — Fab 18 (3nm HVM)",
        tier="T3",
        tooltip="Tainan Fab 18 — 3nm (N3) high-volume manufacturing",
        what_is_it="TSMC's largest Gigafab — the N3 (3nm) high-volume manufacturing site. Eventually will also ramp N2.",
        role="Where every 3nm Apple, Qualcomm, and AMD chip is made today.",
        why_matters="The most valuable fab in the world as of 2025–2026.",
        key_facts="Multiple phases online since 2022.",
        confidence="High",
    )
    add_entity(
        fgs["T3"], lat=22.635, lng=120.302,
        name="TSMC Kaohsiung — Fab 22 (N2 = 2nm HVM)",
        tier="T3",
        tooltip="Kaohsiung Fab 22 — 2nm HVM, fully sold out 2026",
        what_is_it="TSMC's newest Gigafab complex, purpose-built for the 2nm node. Five phases planned (P1–P5); P1 in HVM as of late 2025.",
        role="Produces 2nm chips for Apple, Nvidia, AMD through ~2028.",
        why_matters="P1 HVM + P2 trial + P3 building = ~100k wafers/month target end-2026. **Capacity is fully sold out for 2026.**",
        key_facts="P1 HVM Q4 2025. All 5 phases operational by Q4 2027 (planned).",
        confidence="High", source="WCCFTech, TrendForce",
    )
    add_entity(
        fgs["T3"], lat=45.590, lng=-122.404,
        name="TSMC WaferTech — Camas, WA, USA",
        tier="T3",
        tooltip="WaferTech Camas — legacy 200mm (165-500nm)",
        what_is_it="TSMC's first overseas subsidiary, founded 1996 in Camas, Washington. 200mm (8-inch) wafers, mature 0.16–0.5µm nodes.",
        role="Legacy fab for automotive, industrial, consumer analog. Still operational but modest scale compared to Taiwan gigafabs.",
        why_matters="Historical anchor of TSMC's US presence — 20+ years before Arizona Fab 21.",
        key_facts="Founded 1996. Acquired by TSMC in 1999. ~37,000 wpm capacity.",
        confidence="High",
    )
    add_entity(
        fgs["T3"], lat=32.037, lng=118.766,
        name="TSMC Nanjing — Fab 16 (28nm / 16nm)",
        tier="T3",
        tooltip="TSMC Nanjing — mature-node fab for Chinese customers",
        what_is_it="TSMC's wholly-owned subsidiary in Nanjing, China. Produces 28nm and 16nm chips for Chinese domestic customers.",
        role="A hedge to serve Chinese customers without diverting Taiwan capacity, while staying within US/Taiwan export rules.",
        why_matters="Increasingly geopolitically constrained by US export controls on China chip equipment.",
        key_facts="Launched 2018; capacity ~40k wpm.",
        confidence="High",
    )
    add_entity(
        fgs["T3"], lat=33.467, lng=-112.052,
        name="TSMC Arizona Fab 21 — Phoenix, USA",
        tier="T3",
        tooltip="TSMC Arizona — 4nm now, 3nm mid-2026, 2nm planned",
        what_is_it="TSMC's US fab complex in Phoenix, AZ. Phase 1 runs 4nm (in production). Phase 2 starts 3nm equipment install Q3 2026 (ahead of schedule).",
        role="US-sited production of leading-edge chips for American customers (Apple, Nvidia, AMD). Backed by $6.6B CHIPS Act grant.",
        why_matters="The centerpiece of US 'reshoring' strategy. Whether it works at comparable cost and yield to Taiwan is TBD.",
        key_facts="Phase 2 production start: calendar 2027. Phase 3 under discussion for 2nm.",
        confidence="High", source="Tom's Hardware, TrendForce",
    )
    add_entity(
        fgs["T3"], lat=32.872, lng=130.783,
        name="JASM — Kumamoto, Japan (TSMC + Sony + Denso)",
        tier="T3",
        tooltip="JASM Kumamoto Fab 23 — 12/22/28nm HVM since Dec 2024",
        what_is_it="TSMC-majority joint venture with Sony and Denso. First fab (Fab 23) entered commercial operations December 2024.",
        role="Serves Japan's automotive and imaging sensor demand at mature nodes. Second fab may shift to 4nm.",
        why_matters="Japan's strategic bet to anchor a leading-edge adjacent fab on home soil.",
        key_facts="~$7B first phase. Site: Kikuyo, Kumamoto prefecture.",
        confidence="High", source="Wikipedia JASM",
    )
    add_entity(
        fgs["T3"], lat=51.076, lng=13.738,
        name="ESMC — Dresden, Germany (TSMC + Bosch + Infineon + NXP)",
        tier="T3",
        tooltip="ESMC Dresden — 22/28nm for EU automotive (fully operational 2029)",
        what_is_it="European Semiconductor Manufacturing Company. TSMC 70% owner; Bosch, Infineon, NXP 10% each.",
        role="22nm and 28nm chips for European automotive and industrial demand.",
        why_matters="Europe's answer to supply shocks; EU's first advanced-mature-node fab.",
        key_facts="40,000 wafers/month capacity; fully operational 2029.",
        confidence="Medium (still under construction)",
    )

    # ── T4 ABF Substrates (packaging consumables — top 5 = 74%) ──
    add_entity(
        fgs["T4"], lat=24.993, lng=121.440,
        name="Unimicron — Taoyuan, Taiwan",
        tier="T4",
        tooltip="Unimicron — ABF substrate leader (22% share)",
        what_is_it="ABF (Ajinomoto Build-up Film) substrate is the tiny high-density printed circuit board that sits underneath a chip die, connecting it to the motherboard. Unimicron is the global #1 ABF substrate maker.",
        role="Every advanced-package CPU, GPU, AI accelerator needs an ABF substrate. Supply is chronically tight; 2021–22 was a global bottleneck.",
        why_matters="22% global share. Taiwan alone produces >45% of global ABF substrates.",
        key_facts="Expanded 150,000 sq-m/month Taiwan capacity in 2023. Market $4.9B (2024) → $9.5B by 2032.",
        confidence="High", source="Market Growth Reports",
    )
    add_entity(
        fgs["T4"], lat=35.430, lng=136.461,
        name="Ibiden — Ogaki, Japan",
        tier="T4",
        tooltip="Ibiden — ABF substrate #2 (AI/HPC focus)",
        what_is_it="Japanese ceramics/substrate maker, now one of the top ABF substrate makers. Strong at highest-layer-count substrates for AI and HPC processors.",
        role="Supplies Intel, AMD, Nvidia with substrates for top-end datacenter processors.",
        why_matters="Intel's Ponte Vecchio, Nvidia Blackwell packages use Ibiden substrates.",
        key_facts="TSE:4062. Ogaki plant in Gifu Prefecture.",
        confidence="High",
    )
    add_entity(
        fgs["T4"], lat=36.244, lng=138.010,
        name="Shinko Electric Industries — Nagano, Japan",
        tier="T4",
        tooltip="Shinko — ABF substrates + lead frames (new Osaka plant 2026)",
        what_is_it="Japanese packaging-materials firm (Fujitsu subsidiary). Makes ABF substrates, lead frames, and test sockets.",
        role="Top-3 ABF substrate supplier alongside Unimicron and Ibiden.",
        why_matters="New Osaka plant +30% output (2024), plus additional ABF facility coming online 2026.",
        key_facts="TSE:6967.",
        confidence="High",
    )
    add_entity(
        fgs["T4"], lat=47.380, lng=15.098,
        name="AT&S — Leoben, Austria",
        tier="T4",
        tooltip="AT&S — European ABF substrate (Intel + AMD supplier)",
        what_is_it="Austrian printed-circuit-board maker. Only major European ABF substrate producer. Rapidly expanding capacity in Malaysia.",
        role="Strategic European sovereign option for advanced packaging. Supplies Intel's Meteor Lake and similar.",
        why_matters="The only non-Asian top-5 ABF substrate player.",
        key_facts="Public on Vienna Stock Exchange.",
        confidence="High",
    )
    add_entity(
        fgs["T4"], lat=35.009, lng=135.750,
        name="Kyocera — Kyoto, Japan",
        tier="T4",
        tooltip="Kyocera — ceramic substrates (military/aerospace)",
        what_is_it="Japanese ceramics giant. Makes ceramic substrates (alumina, aluminum nitride) for high-power, high-reliability applications.",
        role="Packaging substrates for power electronics, defense, automotive power modules. Complements the ABF organic substrate market.",
        why_matters="Niche leader at the ceramic/high-reliability end.",
        key_facts="TSE:6971. Also makes solar cells, phones, and cutting tools.",
        confidence="High",
    )

    # ── T4 OSAT ──
    add_entity(
        fgs["T4"], lat=22.643, lng=120.291,
        name="ASE Technology — Kaohsiung, Taiwan",
        tier="T4",
        tooltip="ASE — world's #1 OSAT (45% of top-10 revenue)",
        what_is_it="World's largest Outsourced Semiconductor Assembly and Test company. After a wafer is patterned, it comes here to be diced, packaged, and tested.",
        role="Bridges fab output → finished chip shipped to customer. Packages protect the die, connect it to a circuit board, and add thermal management.",
        why_matters="ASE (merged with SPIL in 2018) accounts for ~45% of the top-10 OSAT revenue. 2024 revenue: $18.5B.",
        key_facts="HQ Kaohsiung; fabs across Taiwan, Korea, China, Vietnam, USA.",
        confidence="High", source="TrendForce 2024 OSAT ranking",
    )
    add_entity(
        fgs["T4"], lat=33.371, lng=-111.907,
        name="Amkor Technology — Tempe, AZ (HQ)",
        tier="T4",
        tooltip="Amkor — #2 OSAT (US HQ, Asian fabs)",
        what_is_it="American OSAT headquartered in Tempe, AZ, with most actual assembly/test fabs in Korea, Philippines, Vietnam, Japan, Portugal.",
        role="Major customer of Apple, TSMC pipeline; building a $2B Arizona site to co-locate with TSMC.",
        why_matters="Only major OSAT with US HQ; strategic for CHIPS Act reshoring.",
        key_facts="2024 revenue: $6.3B.",
        confidence="High",
    )
    add_entity(
        fgs["T4"], lat=31.811, lng=120.274,
        name="JCET — Jiangyin, China",
        tier="T4",
        tooltip="JCET — #3 OSAT, China's champion ($5B revenue)",
        what_is_it="China's largest OSAT. Acquired Singapore's STATS ChipPAC in 2014 to become a global top-3 player.",
        role="Assembles/tests chips for Chinese fabless firms + foreign customers; major beneficiary of China's semiconductor self-sufficiency push.",
        why_matters="2024 revenue: $5B (+19% YoY). Chinese OSATs are gaining share rapidly.",
        key_facts="Listed on Shanghai Stock Exchange.",
        confidence="High",
    )

    # ── T5 Design & Customers ──
    add_entity(
        fgs["T5"], lat=37.335, lng=-122.009,
        name="Apple — Cupertino, CA",
        tier="T5",
        tooltip="Apple — TSMC's #1 customer (iPhone, Mac, iPad silicon)",
        what_is_it="The fabless company that designs A-series (iPhone), M-series (Mac), and other silicon — and has them fabricated exclusively at TSMC.",
        role="TSMC's #1 revenue customer by far — ~20-25% of TSMC sales in some quarters. Apple consumes the first year of every new TSMC node.",
        why_matters="When Apple launches a new iPhone, TSMC has already been running that silicon in volume for 6 months.",
        key_facts="Apple reportedly buys >90% of TSMC's earliest leading-edge capacity each cycle.",
        confidence="High",
    )
    add_entity(
        fgs["T5"], lat=37.370, lng=-121.964,
        name="Nvidia — Santa Clara, CA",
        tier="T5",
        tooltip="Nvidia — TSMC's #2 customer (AI accelerators)",
        what_is_it="Fabless GPU / AI accelerator designer. H100, B100, B200 (Blackwell) and successor chips are all made at TSMC.",
        role="Currently the most valuable customer of leading-edge capacity (2nm, 3nm) alongside Apple. Hunger for silicon has reshaped TSMC's capex.",
        why_matters="Without TSMC, Nvidia cannot exist at its current scale. No alternative foundry can produce what Nvidia needs.",
        key_facts="Nvidia does not own fabs. Everything is TSMC-made (with some Samsung for older products).",
        confidence="High",
    )
    add_entity(
        fgs["T5"], lat=37.381, lng=-121.978,
        name="AMD — Santa Clara, CA",
        tier="T5",
        tooltip="AMD — major TSMC customer (CPU, GPU, datacenter)",
        what_is_it="Fabless designer of x86 CPUs (Ryzen, EPYC) and GPUs (Radeon). Uses TSMC's 5nm, 4nm, 3nm for most products.",
        role="Major buyer of TSMC capacity across multiple nodes. MI300 AI chips = TSMC 5nm + 6nm chiplets.",
        why_matters="AMD's resurgence is literally built on TSMC process advantage over Intel's internal fabs.",
        key_facts="Spun off its fabs in 2009 to create GlobalFoundries — then went all-in fabless.",
        confidence="High",
    )
    add_entity(
        fgs["T5"], lat=32.900, lng=-117.241,
        name="Qualcomm — San Diego, CA",
        tier="T5",
        tooltip="Qualcomm — Snapdragon, automotive modems",
        what_is_it="Fabless designer of Snapdragon SoCs (dominant in Android smartphones), modems, and automotive chips.",
        role="Large TSMC customer (Snapdragon 8 series on 3nm/2nm); also a recently-announced partner with Tata for automotive modules in Jagiroad, Assam.",
        why_matters="Qualcomm is the India OSAT story's biggest announced customer (Tata Jagiroad automotive deal).",
        key_facts="Automotive SoCs going to Jagiroad for assembly + test.",
        confidence="High",
    )
    add_entity(
        fgs["T5"], lat=37.338, lng=-122.038,
        name="Broadcom — Palo Alto, CA",
        tier="T5",
        tooltip="Broadcom — networking, custom AI chips (Google TPU)",
        what_is_it="Fabless + acquisitive chip design firm. Networking silicon (Tomahawk), custom AI (Google TPU, Meta MTIA), plus VMware software.",
        role="Major TSMC customer for networking + AI ASIC chips.",
        why_matters="Quietly one of the largest consumers of TSMC leading-edge capacity.",
        key_facts="Market cap > $1T as of late 2025.",
        confidence="High",
    )
    add_entity(
        fgs["T5"], lat=24.805, lng=120.997,
        name="MediaTek — Hsinchu, Taiwan",
        tier="T5",
        tooltip="MediaTek — #2 smartphone SoC (Dimensity), major TSMC customer",
        what_is_it="Taiwan's second-largest fabless company (after Realtek). Dimensity smartphone SoCs, TV chips, IoT.",
        role="Large TSMC customer, co-located in Hsinchu.",
        why_matters="#2 smartphone chipset player globally after Qualcomm.",
        key_facts="Listed on Taiwan Stock Exchange.",
        confidence="High",
    )
    add_entity(
        fgs["T5"], lat=37.380, lng=-122.034,
        name="Synopsys — Sunnyvale, CA",
        tier="T5",
        tooltip="Synopsys — #1 EDA (design software, 46% share) + Ansys",
        what_is_it="The #1 EDA (Electronic Design Automation) company. Makes the software engineers use to design chips — like Photoshop for silicon.",
        role="Every fabless company on this map uses Synopsys tools. Without Synopsys, no chips can be designed.",
        why_matters="46% of EDA revenue. Acquired Ansys (July 2025, $35B) — now a single 'device-to-system' design stack.",
        key_facts="Tools: Design Compiler, PrimeTime, IC Validator. IP: ARC CPU cores, DesignWare USB / PCIe / DDR.",
        confidence="High", source="Embedded.com",
    )
    add_entity(
        fgs["T5"], lat=37.391, lng=-121.948,
        name="Cadence Design Systems — San Jose, CA",
        tier="T5",
        tooltip="Cadence — #2 EDA (35% share), analog/mixed-signal leader",
        what_is_it="The #2 EDA vendor. Strongest in analog and mixed-signal design (Virtuoso) and custom-layout tools.",
        role="Every analog chip (power management, RF, data converters) goes through Cadence Virtuoso.",
        why_matters="35% of EDA revenue. Synopsys + Cadence + Siemens = 85%+ — tight oligopoly.",
        key_facts="Tools: Virtuoso, Innovus, Tempus, Palladium (emulation).",
        confidence="High",
    )
    add_entity(
        fgs["T5"], lat=52.203, lng=0.121,
        name="Arm Holdings — Cambridge, UK",
        tier="T5",
        tooltip="Arm — dominant CPU IP licensor (every smartphone)",
        what_is_it="UK-based IP company. Designs CPU cores (Cortex-A, Cortex-M, Neoverse) that are licensed to Apple, Qualcomm, MediaTek, Samsung, Nvidia — used in virtually every smartphone and embedded device.",
        role="Arm is the 'engine' every chip designer licenses rather than designing CPUs from scratch.",
        why_matters="Owned by SoftBank (~90%). Re-IPO'd on Nasdaq 2023. RISC-V (open alternative) hit 25% market penetration by Jan 2026 — first real competition.",
        key_facts="Arm is now moving into complete chips: AGI CPU on TSMC 3nm, H2 2026.",
        confidence="High", source="Omdia, Adafruit",
    )

    # Add feature groups to map
    for fg in fgs.values():
        fg.add_to(m)

    # Flow lines (directional, using PolyLine with dashed style)
    # T1 wafers → T3 fabs
    wafer_to_fab = [
        ((35.912, 136.167), (24.784, 120.996), "Shin-Etsu wafers → TSMC Hsinchu"),
        ((33.270, 129.874), (23.014, 120.219), "SUMCO wafers → TSMC Tainan"),
        ((24.813, 120.974), (22.635, 120.302), "GlobalWafers → TSMC Kaohsiung (local)"),
        ((35.912, 136.167), (33.467, -112.052), "Shin-Etsu wafers → TSMC Arizona"),
    ]
    for a, b, tip in wafer_to_fab:
        folium.plugins.AntPath(
            locations=[a, b], color=TIER_COLORS["T1"], weight=2, opacity=0.55,
            dash_array=[10, 20], delay=2000, tooltip=tip,
        ).add_to(m)

    # T2 equipment → T3 fabs (ASML to main hubs)
    equip_to_fab = [
        ((51.443, 5.478), (24.784, 120.996), "ASML EUV → TSMC Hsinchu"),
        ((51.443, 5.478), (23.014, 120.219), "ASML EUV → TSMC Tainan"),
        ((51.443, 5.478), (22.635, 120.302), "ASML EUV → TSMC Kaohsiung (2nm)"),
        ((51.443, 5.478), (33.467, -112.052), "ASML → TSMC Arizona"),
    ]
    for a, b, tip in equip_to_fab:
        folium.plugins.AntPath(
            locations=[a, b], color=TIER_COLORS["T2"], weight=2, opacity=0.55,
            dash_array=[10, 20], delay=1500, tooltip=tip,
        ).add_to(m)

    # T3 fabs → T4 OSAT (illustrative)
    fab_to_osat = [
        ((23.014, 120.219), (22.643, 120.291), "TSMC Tainan → ASE Kaohsiung"),
        ((22.635, 120.302), (22.643, 120.291), "TSMC Kaohsiung → ASE Kaohsiung"),
        ((33.467, -112.052), (33.371, -111.907), "TSMC Arizona → Amkor Tempe (co-located)"),
    ]
    for a, b, tip in fab_to_osat:
        folium.plugins.AntPath(
            locations=[a, b], color=TIER_COLORS["T3"], weight=2, opacity=0.55,
            dash_array=[10, 20], delay=1200, tooltip=tip,
        ).add_to(m)

    # T4 OSAT → T5 customers
    osat_to_cust = [
        ((22.643, 120.291), (37.335, -122.009), "ASE → Apple Cupertino"),
        ((33.371, -111.907), (37.370, -121.964), "Amkor → Nvidia Santa Clara"),
    ]
    for a, b, tip in osat_to_cust:
        folium.plugins.AntPath(
            locations=[a, b], color=TIER_COLORS["T4"], weight=2, opacity=0.45,
            dash_array=[10, 20], delay=1000, tooltip=tip,
        ).add_to(m)

    # Layer control
    folium.LayerControl(position="topright", collapsed=False).add_to(m)

    # Legend
    m.get_root().html.add_child(build_legend(
        title="TSMC Global Supply Chain",
        subtitle="Click any marker for a plain-English explainer. Toggle tiers in the top-right panel. Animated dashed lines show directional flow.",
    ))

    # Attribution
    m.get_root().html.add_child(folium.Element("""
    <div style="position:fixed;bottom:20px;left:20px;z-index:9999;
      font:11px/1.4 -apple-system,BlinkMacSystemFont,sans-serif;color:#64748b;
      background:rgba(255,255,255,.92);padding:6px 10px;border-radius:6px;
      box-shadow:0 1px 4px rgba(0,0,0,.08)">
      Map: CartoDB · Data: industry reports, SEMI, company filings (2025-26)
    </div>
    """))

    return m


# ─────────────────────────────────────────────
# MAP 2 — INDIA 2026 SEMICONDUCTOR ECOSYSTEM
# ─────────────────────────────────────────────
def build_india_map() -> folium.Map:
    m = folium.Map(
        location=[23.5, 80.0],
        zoom_start=5,
        tiles="CartoDB positron",
        control_scale=True,
    )

    fgs = {t: folium.FeatureGroup(name=f"{t} — {TIER_LABELS[t]}", show=True) for t in TIER_COLORS}

    # ── Gujarat cluster highlight (Dholera + Sanand) ──
    folium.Circle(
        location=[23.00, 72.40],
        radius=75_000,
        color=ACCENT, weight=2, fill=True, fillColor=ACCENT, fillOpacity=0.06,
        tooltip="Gujarat Semiconductor Cluster — Dholera + Sanand",
    ).add_to(m)

    # ── T1: INOX + Linde India (first local specialty gas for semis) ──
    add_entity(
        fgs["T1"], lat=22.260, lng=72.510,
        name="INOX Air Products Specialty Gas Hub — Dholera, Gujarat",
        tier="T1",
        tooltip="INOX Air Products Dholera — India's first semi-grade specialty gas hub (₹500 cr)",
        what_is_it="Electronic Specialty Gas Hub under construction in Dholera. Ultra-High Purity nitrogen, oxygen, argon, hydrogen for the semiconductor ecosystem anchored around Tata Electronics.",
        role="First Indian-built specialty gas supply for fabs. Without local gas supply, every Indian fab imports every gas at 3–4× cost + 6–8 week lead times.",
        why_matters="₹500 cr commitment. Construction started 2025; operational in 12–18 months. Proof point that Indian firms CAN enter T1.",
        key_facts="INOX Group (Siddharth Jain MD). Positioned as both production and fulfillment centre.",
        confidence="High", source="Indian Chemical News, ProjectX Media",
    )
    add_entity(
        fgs["T1"], lat=22.255, lng=72.505,
        name="Linde India Dholera — Gujarat",
        tier="T1",
        tooltip="Linde India — semiconductor gas plant (under negotiation)",
        what_is_it="Linde (global #1 industrial gas) is in advanced-stage discussions with Tata and other Dholera customers to set up a dedicated semiconductor gas plant on-site.",
        role="Co-located gas supply is standard for fabs. Linde's existing India operations need a retrofit to serve semiconductor-grade demand.",
        why_matters="Second foreign-partner gas plant in Dholera after INOX. Evidence that the Gujarat cluster is attracting real upstream participation.",
        key_facts="Partnership model with Tata Electronics + other ecosystem customers.",
        confidence="Medium",
    )

    # ── T3 front-end fabs ──
    add_entity(
        fgs["T3"], lat=20.270, lng=85.840,
        name="RIR Power Electronics SiC Fab — Bhubaneswar, Odisha",
        tier="T3",
        tooltip="RIR Power — India's first Silicon Carbide semiconductor fab (₹618 cr)",
        what_is_it="India's first Silicon Carbide (SiC) semiconductor fabrication facility. Produces high-voltage SiC MOSFETs, IGBTs, diodes (3.3 kV to 20 kV) for EVs, renewable energy, industrial automation.",
        role="SiC is the next-gen wide-bandgap semiconductor for power electronics. Complementary to silicon — not a replacement.",
        why_matters="₹618 cr. First SiC fab in India. Epitaxy wafer production expected March 2026, then phased commercial launch.",
        key_facts="750 direct+indirect jobs. Partner: ProAsia Semiconductor (Taiwan) already shipping 1200V SiC diodes from Taiwan pre-ramp.",
        confidence="High", source="RIR Power, DIGITIMES, EQ Magpro",
    )
    add_entity(
        fgs["T3"], lat=22.250, lng=72.500,
        name="Tata Electronics–PSMC Fab — Dholera, Gujarat",
        tier="T3",
        tooltip="Tata-PSMC Dholera — India's first large-scale fab (28-110nm)",
        what_is_it="India's first commercial wafer fabrication plant. Joint venture: Tata Electronics + Powerchip Semiconductor (Taiwan). Covers analog and logic at 28, 40, 55, 90, 110 nm nodes.",
        role="FRONT-END: patterns bare silicon wafers into circuits. This is the first time India will actually *make* chips on home soil at scale.",
        why_matters="India's first domestic wafer fab. ₹91,000 cr (~$11B) — the largest single semiconductor investment in India's history. 50,000 wafers/month capacity at full ramp.",
        key_facts="First commercial silicon: late 2026. Tool-in milestones underway. Technology transfer from Taiwan's PSMC. 20,000 direct + indirect jobs.",
        confidence="High", source="Tata Electronics, ISM",
    )
    add_entity(
        fgs["T3"], lat=30.705, lng=76.709,
        name="SCL Mohali — legacy 180nm (strategic/research)",
        tier="T3",
        tooltip="SCL Mohali — legacy fab for ISRO/strategic chips",
        what_is_it="Semi-Conductor Laboratory, a government research fab near Chandigarh. Legacy 180nm process, primarily for ISRO, DRDO, and strategic defense chips.",
        role="Not a commercial fab — it's India's strategic sovereign silicon capability. Being modernized under ISM.",
        why_matters="Historically India's only actual fab. A tiny but symbolic anchor.",
        key_facts="Under Department of Space. Node: 180nm. Modernization plans in progress.",
        confidence="High",
    )

    # ── T4 OSAT ──
    add_entity(
        fgs["T4"], lat=23.018, lng=72.320,
        name="Micron ATMP — Sanand, Gujarat (OPERATIONAL)",
        tier="T4",
        tooltip="Micron Sanand — INDIA'S FIRST OSAT (commercial production Feb 2026)",
        what_is_it="Micron's semiconductor Assembly, Test, Marking & Packaging facility. Converts DRAM and NAND wafers (imported from Micron's global fabs) into finished memory modules.",
        role="BACK-END: receives wafers from outside India, dices them into chips, packages and tests them. No patterning done here.",
        why_matters="India's first operational semiconductor facility. Opened by PM Modi Feb 28, 2026. Target: tens of millions of chips in 2026, hundreds of millions in 2027.",
        key_facts="$2.75B total ($825M Micron + $1.93B govt subsidies). 500,000 sq ft cleanroom — one of the world's largest single-floor cleanrooms.",
        confidence="High", source="Micron press, PIB",
    )
    add_entity(
        fgs["T4"], lat=22.987, lng=72.300,
        name="Kaynes Semicon — Sanand, Gujarat (OPERATIONAL)",
        tier="T4",
        tooltip="Kaynes Semicon Sanand — commercial production Mar 2026",
        what_is_it="Indian-owned OSAT (Kaynes Technology subsidiary). Wire-bond, flip-chip, and system-in-package (SiP) assembly.",
        role="Assembles packaged chips from externally-sourced wafers for Indian + export customers.",
        why_matters="India's **second operational** semiconductor facility. ₹3,300 cr (~$400M). Target: 6.3 million chips/day (2.3 billion/year).",
        key_facts="Commercial production opened Mar 31, 2026. Ramp: 1.5M/day Q1 2026 → full capacity later. First Indian-owned OSAT online.",
        confidence="High", source="Kaynes Semicon, Communications Today",
    )
    add_entity(
        fgs["T4"], lat=23.035, lng=72.305,
        name="CG Semi — Sanand, Gujarat (pilot production)",
        tier="T4",
        tooltip="CG Semi Sanand — pilot, commercial imminent",
        what_is_it="Joint venture: CG Power + Renesas Electronics (Japan) + Stars Microelectronics (Thailand). Legacy + automotive packaging.",
        role="Adds a third OSAT to the Sanand cluster, targeting automotive + industrial customers.",
        why_matters="CG Power + Renesas partnership gives India immediate access to Japanese automotive design wins.",
        key_facts="Capex: ~₹7,600 cr (~$900M). Commercial production imminent (announced March 2026).",
        confidence="High",
    )
    add_entity(
        fgs["T4"], lat=26.075, lng=92.160,
        name="Tata Semiconductor Assembly & Test — Jagiroad, Assam",
        tier="T4",
        tooltip="Tata Jagiroad — commissioning April 2026 ($3.6B, 48M chips/day)",
        what_is_it="Tata Electronics' flagship OSAT in Assam. Wire-bond + flip-chip + SiP. Qualcomm automotive modules will be assembled here.",
        role="India's largest OSAT by capex — anchors the North-East as a semiconductor region.",
        why_matters="₹27,000 cr (~$3.6B), 48 million chips/day target, 25,000 jobs. Qualcomm automotive modules deal (Feb 2026) is the first big export customer.",
        key_facts="Commissioning April 2026. Construction began 2024.",
        confidence="High", source="Tata Electronics, PIB",
    )
    # India PCB / substrate makers (T4 adjacent)
    add_entity(
        fgs["T4"], lat=16.515, lng=80.632,
        name="Syrma SGS–Shinhyup PCB Facility — Andhra Pradesh",
        tier="T4",
        tooltip="Syrma SGS × Shinhyup — India's largest multi-layer PCB + CCL facility (₹1,800 cr)",
        what_is_it="India's largest multi-layer PCB and Copper Clad Laminate (CCL) manufacturing facility. Joint venture with South Korean Shinhyup Electronics. Critical substrate supply for OSAT and packaging customers.",
        role="Bridges the substrate gap for India's OSATs. Multi-layer PCBs are the step between bare die and finished product board-level assembly.",
        why_matters="₹1,800 cr. Phase 1 expected December 2026; fully operational 2027.",
        key_facts="India's bare PCB market: $3.5B (2024) → $8.2B by 2030. CCL: $135M → $335M.",
        confidence="High", source="IBEF, Business Standard",
    )
    add_entity(
        fgs["T4"], lat=28.125, lng=77.550,
        name="HCL–Foxconn OSAT — Jewar, UP (under construction)",
        tier="T4",
        tooltip="HCL-Foxconn Jewar — display drivers, operational 2028",
        what_is_it="India Chip Private Limited (60% HCL, 40% Foxconn). Display driver chips for mobile, laptop, automotive, consumer electronics.",
        role="Specialized OSAT focused on one narrow but high-volume product category.",
        why_matters="₹3,706 cr (~$445M). 20,000 wafers/month input → 36 million chips/month output. Near Jewar airport (Noida international).",
        key_facts="Groundbreaking Feb 2026 by PM Modi. Operational 2028. Subsidy covers 60-70%.",
        confidence="Medium (construction just started)",
    )

    # ── T5 Design centers (Indian design presence) ──
    add_entity(
        fgs["T5"], lat=12.971, lng=77.594,
        name="Bangalore design cluster — Qualcomm / Intel / Nvidia / AMD / Arm India",
        tier="T5",
        tooltip="Bangalore — India's chip design capital (~80,000 engineers)",
        what_is_it="India's largest chip design ecosystem. Qualcomm Bangalore, Intel Bangalore, Nvidia Bangalore, AMD Bangalore, Arm India, and dozens of fabless startups (Signalchip, InCore, Saankhya Labs) are here.",
        role="India is ~20% of global chip design labor. Most MNC design centers do verification + implementation for advanced nodes (3nm, 2nm).",
        why_matters="India's existing strength. The fabs/OSATs are new; the design capability is already world-class.",
        key_facts="~80,000 semiconductor design engineers across Bangalore. 24 chip design projects approved under DLI scheme as of Jan 2026.",
        confidence="High",
    )
    add_entity(
        fgs["T5"], lat=17.385, lng=78.487,
        name="Hyderabad design cluster — AMD / Qualcomm / Synopsys",
        tier="T5",
        tooltip="Hyderabad — 2nd-largest chip design cluster",
        what_is_it="India's second-largest design center. AMD has ~1,500 engineers; Qualcomm, Synopsys, Cadence all present.",
        role="Co-equal to Bangalore for physical design + verification.",
        why_matters="Concentrated AMD + EDA presence; talent pool for future design startups.",
        key_facts="Telangana government pushing aggressive fab-adjacent incentives.",
        confidence="High",
    )
    add_entity(
        fgs["T5"], lat=13.083, lng=80.270,
        name="IIT Madras — RISC-V Shakti processor",
        tier="T5",
        tooltip="IIT Madras — indigenous RISC-V CPU (Shakti)",
        what_is_it="IIT Madras's Shakti project: an open-source, indigenous RISC-V processor family. E-class (IoT) through C-class (servers).",
        role="India's sovereign CPU IP. Doesn't depend on Arm licensing.",
        why_matters="If India wants a sovereign chip stack, indigenous IP is foundational. Shakti is the real candidate.",
        key_facts="Taped-out on SCL Mohali 180nm silicon. Used in ISRO test chips.",
        confidence="High",
    )
    # ── Indian fabless startups ──
    add_entity(
        fgs["T5"], lat=13.008, lng=80.235,
        name="Mindgrove Technologies — Chennai",
        tier="T5",
        tooltip="Mindgrove — India's first indigenous commercial MCU ($8M Series A)",
        what_is_it="Chennai-based fabless SoC startup founded 2021. Uses Shakti RISC-V cores. Launched India's first indigenously-designed commercial high-performance MCU chip.",
        role="Shipping commercial chips to CCTV, dashcam, ADAS, smart TV customers. DLI-approved (₹15 cr for Vision SoC).",
        why_matters="$8M Series A Dec 2024 (Rocketship.vc + Speciale Invest). Proof that Indian startups can now ship real silicon at RISC-V.",
        key_facts="Co-founder: Shashwath TR (IIT Madras alumnus).",
        confidence="High", source="Business Standard, Design & Reuse",
    )
    add_entity(
        fgs["T5"], lat=13.013, lng=80.238,
        name="InCore Semiconductors — IIT Madras Research Park, Chennai",
        tier="T5",
        tooltip="InCore — RISC-V processor IP solutions ($3M seed, Peak XV)",
        what_is_it="RISC-V-based processor IP solutions company founded 2018 by the creators of IIT Madras's SHAKTI project. Generates SoC from concept to FPGA in <10 minutes.",
        role="Commercial IP spinout of Shakti. Target: license RISC-V cores to Indian + global fabless customers.",
        why_matters="$3M seed 2023 from Peak XV (Sequoia Capital India). One of the earliest commercial RISC-V spinouts from India.",
        key_facts="Headquartered at IIT Madras Research Park.",
        confidence="High",
    )
    add_entity(
        fgs["T5"], lat=12.972, lng=77.594,
        name="Saankhya Labs — Bangalore",
        tier="T5",
        tooltip="Saankhya Labs — 5G / AI / defense chips (DLI approved for 5G SoC)",
        what_is_it="Bangalore-based fabless semi startup. AI processors for defense and telecom; 5G modems. Received DLI approval Feb 2024 to develop 5G telecom SoC.",
        role="Defense and telecom-focused sovereign chip supplier. Partnered with BEL, ISRO, and strategic customers.",
        why_matters="~$18M total funding. Multi-decade India-based fabless track record.",
        key_facts="Founded 2007. Now part of Tejas Networks (Tata Group acquired Tejas 2021).",
        confidence="High",
    )
    add_entity(
        fgs["T5"], lat=12.975, lng=77.597,
        name="SignalChip — Bangalore",
        tier="T5",
        tooltip="SignalChip — India's first indigenous 4G/5G modem chipsets",
        what_is_it="Bangalore-based fabless startup (founded 2010). India's first company to successfully design and develop indigenous 4G LTE and 5G modem chipsets from the ground up.",
        role="Sovereign cellular modem capability. Critical for BSNL 5G and defense telecom use cases.",
        why_matters="Multi-generation indigenous baseband processor development — rare capability globally.",
        key_facts="Substantial backing from private investors + government programs.",
        confidence="High",
    )
    add_entity(
        fgs["T5"], lat=12.977, lng=77.570,
        name="Calligo Technologies — Bangalore",
        tier="T5",
        tooltip="Calligo — 8-core Posit RISC-V CPU (TUNGA) for HPC/AI",
        what_is_it="Bangalore-based fabless startup for high-performance computing, Big Data, and AI/ML workloads. Unveiled an 8-core Posit-enabled RISC-V CPU 'TUNGA' in June 2024.",
        role="India's answer to the AI datacenter chip race. Posit arithmetic is a floating-point alternative gaining traction.",
        why_matters="Indian HPC+AI silicon attempt — rare at this performance tier.",
        key_facts="Posit arithmetic = real-valued computing alternative to IEEE 754.",
        confidence="Medium",
    )
    add_entity(
        fgs["T5"], lat=8.524, lng=76.937,
        name="Netrasemi — Trivandrum, Kerala",
        tier="T5",
        tooltip="Netrasemi — Edge AI SoC ($14.6M, Zoho + Unicorn India)",
        what_is_it="Kerala-based Edge AI semiconductor startup (founded 2020). Building SoCs for smart IoT products with a power-efficient deep-neural AI acceleration core (NPU).",
        role="Validates Kerala as a credible chip design hub beyond Bangalore/Hyderabad/Chennai.",
        why_matters="Series A ₹107 cr (~$14.6M total) July 2025 led by Zoho Corporation + Unicorn India Ventures.",
        key_facts="Rich portfolio of silicon IPs. Geographic diversification of Indian chip design.",
        confidence="High", source="Special Invest blog",
    )
    add_entity(
        fgs["T5"], lat=12.972, lng=77.587,
        name="Morphing Machines — IISc Bangalore",
        tier="T5",
        tooltip="Morphing Machines — REDEFINE many-core processor",
        what_is_it="Incubated at IISc Bangalore since 2006. Developing REDEFINE — a many-core processor for data analysis, AI, telecom.",
        role="One of India's longest-running fabless chip design startups. Dense many-core architecture.",
        why_matters="Raised Series A within 18 months of seed; long-horizon deep-tech.",
        key_facts="IISc research-origin commercial spinout.",
        confidence="Medium",
    )
    # ── Research / academic ──
    add_entity(
        fgs["T5"], lat=13.010, lng=80.235,
        name="Bharat Semiconductor Research Centre — IIT Madras + SCL Mohali",
        tier="T5",
        tooltip="BSRC — India's answer to IMEC / ITRI ($8B over 5 years)",
        what_is_it="Government-backed semiconductor research centre, co-located at IIT Madras and SCL Mohali. Modeled on IMEC (Belgium), ITRI (Taiwan), MIT Microelectronics Lab.",
        role="Long-term R&D engine for India's sovereign semiconductor stack — process R&D, advanced packaging, compound semi, talent pipeline.",
        why_matters="₹66,500 cr ($8B) investment over 5 years. Announced 2023, establishing from 2024. SCL Mohali also modernized with $2B.",
        key_facts="Partnerships with industry, academia, startups. IMEC-style 'shared cleanroom' model.",
        confidence="Medium", source="Business Standard, GKToday",
    )
    add_entity(
        fgs["T5"], lat=12.944, lng=77.572,
        name="CeNSE IISc Bangalore — Centre for Nano Science & Engineering",
        tier="T5",
        tooltip="CeNSE IISc — India's flagship nanoelectronics research center",
        what_is_it="The Centre for Nano Science and Engineering at IISc Bangalore. One of six Centres of Excellence in Nanoelectronics (CEN) established 2006 (IISc + IITB) under MeitY.",
        role="Coordinates INUP-i2i (Indian Nanoelectronics Users' Programme — Idea to Innovation) across six nanoelectronics centers.",
        why_matters="Anchor of India's research-grade nanoelectronics fabrication capacity. Has taped out processors, MEMS, photonics.",
        key_facts="Nodes at IITB, IITD, IITG, IITKgp, IITM — all under INUP-i2i umbrella.",
        confidence="High", source="inup.cense.iisc.ac.in",
    )
    add_entity(
        fgs["T5"], lat=19.133, lng=72.915,
        name="IITB Nanofabrication Facility — Mumbai",
        tier="T5",
        tooltip="IIT Bombay Nanofab — academic clean room + CEN node",
        what_is_it="IIT Bombay's in-house nanofabrication cleanroom. One of the six CEN nanoelectronics centers under MeitY.",
        role="Research-scale tape-outs, PhD training, industry partnerships. Where many Indian semiconductor PhDs are trained.",
        why_matters="Academic feeder to the fabs and OSATs now coming online.",
        key_facts="Partner in INUP-i2i nanoelectronics program.",
        confidence="High",
    )
    add_entity(
        fgs["T5"], lat=28.545, lng=77.192,
        name="IIT Delhi — CEN Nanoelectronics node",
        tier="T5",
        tooltip="IIT Delhi CEN — nanoelectronics research",
        what_is_it="IIT Delhi's Centre of Excellence in Nanoelectronics (added to the program in 2011). Fabrication + device research for CMOS, MEMS, compound semiconductors.",
        role="Research-grade capability in Delhi NCR; talent feeder to Noida-area semiconductor companies.",
        why_matters="Part of INUP-i2i; industry-academia partnerships.",
        key_facts="Also IIT Guwahati CEN (added 2015) for the North-East.",
        confidence="High",
    )
    # ── Global design GCCs in India ──
    add_entity(
        fgs["T5"], lat=12.929, lng=77.637,
        name="Intel India Design Centers — Bangalore + Hyderabad",
        tier="T5",
        tooltip="Intel India — 13,000 engineers (design center since 1988)",
        what_is_it="Intel opened its India R&D center in 1988. Today design centers in Hyderabad and Bengaluru employ 13,000 engineers on AI-integrated data center processors and IoT chips.",
        role="One of Intel's largest design facilities outside the United States. Critical for their AI accelerator and networking SoC roadmap.",
        why_matters="The oldest and largest semiconductor multinational presence in India — older than ISM by 35 years.",
        key_facts="Hyderabad + Bangalore + other sites.",
        confidence="High",
    )
    add_entity(
        fgs["T5"], lat=12.977, lng=77.593,
        name="AMD India — Bangalore (largest global campus)",
        tier="T5",
        tooltip="AMD Bangalore — $400M 500k sq ft AMD's largest global campus",
        what_is_it="AMD's largest design campus globally (500,000 sq ft, opened November 2023). Focus: 3D stacking, AI chip technologies.",
        role="AMD's MI-series AI accelerators, Ryzen, EPYC — significant engineering done here.",
        why_matters="$400M capital invested. Signal that AMD is betting on India for flagship product development, not just verification.",
        key_facts="Hyderabad also has major AMD presence (~1,500 engineers).",
        confidence="High",
    )
    add_entity(
        fgs["T5"], lat=12.957, lng=77.702,
        name="Nvidia India — Bangalore/Hyderabad/Pune/Gurugram",
        tier="T5",
        tooltip="Nvidia India — 3,800+ employees across 4 cities",
        what_is_it="Nvidia's engineering development centers in Gurugram, Hyderabad, Pune, Bangalore. 3,800+ employees.",
        role="Deep learning frameworks, CUDA libraries, SoC engineering, automotive (DRIVE platform).",
        why_matters="Nvidia's AI accelerator roadmap has significant Indian engineering contribution.",
        key_facts="Hiring aggressively in 2026.",
        confidence="High",
    )
    add_entity(
        fgs["T5"], lat=28.607, lng=77.376,
        name="Arm India — Noida",
        tier="T5",
        tooltip="Arm Noida — CPU IP engineering",
        what_is_it="Arm's India operations centered in Noida. Design, verification, and physical-IP work for Cortex and Neoverse families.",
        role="Complements Arm Cambridge HQ; handles significant portion of IP qualification work for customers across Asia.",
        why_matters="If India wants to license Arm or work on competitive alternatives, Arm Noida talent pool is foundational.",
        key_facts="Co-located with HCLTech operations in Noida.",
        confidence="High",
    )
    add_entity(
        fgs["T5"], lat=17.446, lng=78.351,
        name="Qualcomm India — Hyderabad (flagship R&D)",
        tier="T5",
        tooltip="Qualcomm Hyderabad — one of Qualcomm's largest R&D centers globally",
        what_is_it="One of Qualcomm's largest R&D centers worldwide. 5G modem development, AI workloads, automotive SoCs, RF front-end.",
        role="Qualcomm Snapdragon SoCs (8 Gen series) have significant Indian engineering contribution.",
        why_matters="Major anchor of Hyderabad semiconductor ecosystem (along with AMD).",
        key_facts="Partners with Tata Electronics on Jagiroad automotive module supply.",
        confidence="High",
    )

    # ── Import dependency arrows (T1 imports) — visualize the gap ──
    # Show that everything upstream must come from outside India
    import_sources = [
        ((35.912, 136.167), (22.250, 72.500), "Shin-Etsu wafers (Japan) → Tata Dholera"),
        ((33.270, 129.874), (22.250, 72.500), "SUMCO wafers (Japan) → Tata Dholera"),
        ((48.165, 12.820), (22.250, 72.500), "Siltronic wafers (Germany) → Tata Dholera (potential)"),
        ((35.527, 139.716), (22.250, 72.500), "TOK/JSR photoresist (Japan) → Tata Dholera"),
        ((51.443, 5.478), (22.250, 72.500), "ASML lithography (Netherlands) → Tata Dholera"),
        ((37.353, -121.955), (22.250, 72.500), "Applied Materials (US) → Tata Dholera"),
        ((48.877, 2.305), (22.250, 72.500), "Air Liquide gases (France) → Tata Dholera"),
    ]
    for a, b, tip in import_sources:
        folium.plugins.AntPath(
            locations=[a, b], color="#dc2626", weight=2, opacity=0.5,
            dash_array=[8, 16], delay=3000, tooltip=f"IMPORT: {tip}",
        ).add_to(m)

    # Micron imports wafers too
    micron_wafer_import = [
        ((43.577, -116.558), (23.018, 72.320), "Micron wafers (Boise, USA) → Micron Sanand ATMP"),
    ]
    for a, b, tip in micron_wafer_import:
        folium.plugins.AntPath(
            locations=[a, b], color="#dc2626", weight=2, opacity=0.45,
            dash_array=[8, 16], delay=3000, tooltip=f"IMPORT: {tip}",
        ).add_to(m)

    # Downstream (customers served)
    downstream = [
        ((26.075, 92.160), (32.900, -117.241), "Qualcomm ← Tata Jagiroad (automotive modules)"),
    ]
    for a, b, tip in downstream:
        folium.plugins.AntPath(
            locations=[a, b], color=TIER_COLORS["T4"], weight=2, opacity=0.55,
            dash_array=[10, 20], delay=1500, tooltip=tip,
        ).add_to(m)

    # Add feature groups
    for fg in fgs.values():
        fg.add_to(m)

    folium.LayerControl(position="topright", collapsed=False).add_to(m)

    m.get_root().html.add_child(build_legend(
        title="India Semiconductor Ecosystem (2026)",
        subtitle="Red dashed lines = IMPORTS (what India depends on from abroad). Every wafer, every machine, every photoresist currently comes from outside.",
    ))

    # Stats box top-left
    m.get_root().html.add_child(folium.Element("""
    <div style="position:fixed;top:80px;left:20px;z-index:9999;max-width:260px;
      background:linear-gradient(145deg,#1e293b 0%,#0f172a 50%,#1e3a5f 100%);
      color:#fff;padding:16px 18px;border-radius:12px;
      box-shadow:0 8px 32px rgba(15,22,41,.35);
      font-family:-apple-system,BlinkMacSystemFont,sans-serif;
      border:1px solid rgba(255,255,255,.08)">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#60a5fa;margin-bottom:6px">ISM 2.0 · As of March 2026</div>
      <div style="font-size:22px;font-weight:800;color:#fff;line-height:1.1">10 units</div>
      <div style="font-size:12px;color:rgba(255,255,255,.7);margin-top:4px">approved · ₹1.60 lakh cr committed</div>
      <div style="margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,.1);font-size:12px;line-height:1.6;color:rgba(255,255,255,.75)">
        <strong style="color:#fff">2 operational</strong> (Micron, Kaynes)<br>
        <strong style="color:#fff">3 ramping</strong> (Tata Jagiroad, Tata Dholera, CG Semi)<br>
        <strong style="color:#fff">1 under construction</strong> (HCL-Foxconn Jewar)<br>
        <strong style="color:#dc2626">~100% import</strong> dependency upstream
      </div>
    </div>
    """))

    m.get_root().html.add_child(folium.Element("""
    <div style="position:fixed;bottom:20px;left:20px;z-index:9999;
      font:11px/1.4 -apple-system,BlinkMacSystemFont,sans-serif;color:#64748b;
      background:rgba(255,255,255,.92);padding:6px 10px;border-radius:6px;
      box-shadow:0 1px 4px rgba(0,0,0,.08)">
      Map: CartoDB · Data: ISM, Tata Electronics, Micron, PIB (2025-26)
    </div>
    """))

    return m


# ─────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────
def main():
    os.makedirs("maps", exist_ok=True)

    print("Building TSMC global supply chain map...")
    tsmc = build_tsmc_map()
    tsmc.save("maps/tsmc-supply-chain.html")
    print("  → maps/tsmc-supply-chain.html")

    print("Building India 2026 ecosystem map...")
    india = build_india_map()
    india.save("maps/india-semicon.html")
    print("  → maps/india-semicon.html")

    print("Done.")


if __name__ == "__main__":
    main()
