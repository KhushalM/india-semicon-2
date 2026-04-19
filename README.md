# India Semicon 2.0 — Business Research

Interactive research dashboard on India's semiconductor ecosystem, the $120B buildout through 2030, ancillary-layer business opportunities, and a deep supply-chain / bottleneck analysis.

## Live pages

- **Main dashboard:** https://khushalm.github.io/india-semicon-2/
- **Supply chain + bottleneck analysis:** https://khushalm.github.io/india-semicon-2/supply-chain.html

## What's inside

### Main dashboard (`index.html`)
- Self-contained bundled React SPA with interactive wafer, charts, maps, and research sections
- Covers market, competition, pain points, entry strategy, networking, govt schemes, month-by-month plan, country lessons, innovation ideas, learning plan, sources
- Also available: `India Semicon 2.0.html` (split-source, 51 KB, uses Babel Standalone), `India Semicon 2.0-print.html` (print), `India Semicon 2.0 - Standalone.html` (bundled)

### Supply chain analysis (`supply-chain.html`)
- First-principles taxonomy of the six tiers of semiconductor production (T0 raw materials → T5 design)
- **Interactive Folium map 1:** TSMC global supply chain end-to-end, with animated flows
- **Interactive Folium map 2:** India's 2026 live ecosystem with import-dependency arrows
- Long-form bottleneck analysis covering wafers, lithography, photoresist, rare gases, leading-edge nodes, EDA, IP, and talent

### Source files
- `components-*.jsx`, `sections-*.jsx`, `app.jsx` — React component source for the main dashboard
- `scripts/build_maps.py` — Python script that generates the two Folium maps
- `maps/tsmc-supply-chain.html`, `maps/india-semicon.html` — generated Folium outputs (embedded by supply-chain.html)
- `research/supply-chain-research-brief.md` — underlying research notes with inline source citations
- `assets/` — India map SVG, hero background, data bundles

## Regenerating the Folium maps

```bash
python3 -m venv .venv-maps
.venv-maps/bin/pip install folium
.venv-maps/bin/python scripts/build_maps.py
```

This regenerates `maps/tsmc-supply-chain.html` and `maps/india-semicon.html`. Edit entities, tier colors, or popup text in `scripts/build_maps.py`.

## Local development

Open `index.html` in a browser. For the supply-chain page, open `supply-chain.html` — it embeds the two map files via iframes.
