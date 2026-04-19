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

    # ── T3 TSMC Fabs ──
    add_entity(
        fgs["T3"], lat=24.784, lng=120.996,
        name="TSMC Hsinchu — HQ + Fab 12/20",
        tier="T3",
        tooltip="TSMC Hsinchu — headquarters + N2 R&D + Fab 20",
        what_is_it="TSMC's corporate headquarters and oldest fab cluster. Home to the Fab 12 complex (16/10/7nm) and the new Fab 20 R&D center where N2 was developed.",
        role="Where TSMC's process technology is invented before it ramps at other sites. Fab 20 is adjacent to the new Global R&D Center.",
        why_matters="If Hsinchu is disrupted, TSMC's entire roadmap stalls.",
        key_facts="Founded 1987. First fab: Fab 1 in Hsinchu Science Park.",
        confidence="High",
    )
    add_entity(
        fgs["T3"], lat=23.014, lng=120.219,
        name="TSMC Tainan — Gigafabs 14/18 (3nm, 5nm, 7nm)",
        tier="T3",
        tooltip="TSMC Tainan — current high-volume 3nm / 5nm production",
        what_is_it="Two 'Gigafabs' in the Tainan Science Park. Fab 14 runs 7nm/5nm; Fab 18 is the 3nm (N3) and 2nm ramp site. Additional 2nm fabs planned in Tainan Special Zone A.",
        role="The workhorse of TSMC's bleeding-edge output. Apple, Nvidia, AMD chips are made here.",
        why_matters="The geographical center of mass of the world's most advanced chip production.",
        key_facts="Fab 18 alone is ~5x the size of a typical European fab.",
        confidence="High",
    )
    add_entity(
        fgs["T3"], lat=22.635, lng=120.302,
        name="TSMC Kaohsiung — Fab 22 (N2 = 2nm HVM)",
        tier="T3",
        tooltip="TSMC Kaohsiung Fab 22 — 2nm high-volume manufacturing (NEW 2026)",
        what_is_it="TSMC's newest Gigafab complex, purpose-built for the 2nm node. Five phases (P1-P5) planned; P1 is in high-volume manufacturing as of late 2025.",
        role="This is the fab that will produce 2nm chips for Apple, Nvidia, and every other leading-edge customer through ~2028.",
        why_matters="P1 HVM + P2 trial + P3 building = ~100,000 wafers/month target end-2026. **Capacity is fully sold out for 2026.**",
        key_facts="P1 entered HVM Q4 2025. All five phases operational by Q4 2027 (planned).",
        confidence="High", source="WCCFTech, TrendForce",
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

    # ── T3 front-end fabs ──
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
