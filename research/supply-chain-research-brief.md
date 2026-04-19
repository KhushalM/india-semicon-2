# Supply Chain & India Ecosystem Research Brief

*Compiled April 2026 — source citations inline. Asterisk (*) marks unverified numbers.*

## Part 1 — TSMC Global Supply Chain (Concentration Map)

### Tier 0 — Raw Materials
- Quartzite (high-purity silica): ~90% from Spruce Pine, NC (Sibelco, The Quartz Corp)
- Neon (pre-2022): Ukraine 70%, Russia-adjacent supply; Iceblick (Odesa), Cryoin (Mariupol) were primary
- Krypton/xenon: Ukraine 40%, Russia ~30%, Japan/China balance
- Price impact of Ukraine war: xenon went $15/L (2020) → $100+/L (mid-2022)

### Tier 1 — Refined Inputs

**300mm silicon wafers (2025 market shares, top-5 = 89%):**
| Supplier | Share | Country | Key Site |
|----|---|---|---|
| Shin-Etsu Chemical | 27% | Japan | Takefu, Shirakawa |
| SUMCO | 24% | Japan | Imari |
| GlobalWafers | 17% | Taiwan | Hsinchu + Sherman TX (new) |
| Siltronic | 12% | Germany | Burghausen |
| SK Siltron | 9% | Korea | Gumi |

- Shin-Etsu added 200,000 wpm at Shirakawa + Takefu (JPY 150B / $1B), targeting 2-3nm nodes
- GlobalWafers Sherman TX Phase 1 at 300,000 wafers/year run rate

**Photoresist (Japan ~88-90% global; EUV resist ~75% Japanese):**
- Tokyo Ohka Kogyo (TOK) — Kawasaki
- JSR Corporation — Tokyo/Yokkaichi
- Shin-Etsu Chemical — also top-3 photoresist
- Fujifilm — Ashigara
- DuPont — Wilmington, DE (main non-Japanese player)

**Specialty chemicals & gases:**
- Merck EMD Electronics — Darmstadt (Germany)
- Air Liquide — Paris (France)
- Linde — Guildford (UK HQ / global)
- Taiyo Nippon Sanso — Tokyo (specialty gases)
- Air Liquide + Linde + Taiyo Nippon Sanso = ~80% specialty gas share

### Tier 2 — Equipment

**Top 5 front-end equipment makers = 65% of market:**
| Company | HQ | Specialty |
|---|---|---|
| Applied Materials | Santa Clara, CA | Deposition, CMP, implant |
| ASML | Veldhoven, NL | Lithography (EUV monopoly, 83% overall) |
| Lam Research | Fremont, CA | Etch, deposition |
| Tokyo Electron | Tokyo | Coat/develop, etch |
| KLA | Milpitas, CA | Metrology, inspection |

**ASML's EUV supply chain (critical single-point):**
- **Zeiss SMT** (Oberkochen, DE) — EUV optics, "most precise mirrors in the world"
- **Trumpf** (Ditzingen, DE) — 40 kW CO₂ laser (requires 1 MW power supply)
- **Cymer** (San Diego, CA) — light source, ASML-owned since 2013

**High-NA EUV (Twinscan EXE:5200B) deliveries 2025-2026:**
- Intel: first commercial install (14A development), ordered 2 total
- Samsung: 1 unit late 2025, 2nd unit 1H 2026 (mass production intent)
- TSMC: R&D tools only; decided NOT to use high-NA at 1.4nm; may adopt at sub-1nm

### Tier 3 — TSMC Fabs (Front-end Fabrication, 2026 Status)

| Location | Fab | Node | Status 2026 |
|---|---|---|---|
| Hsinchu, Taiwan | HQ + R&D + Fab 20 | N2 ramping | HVM volume on N2 from 4Q25 |
| Tainan, Taiwan | Gigafabs 14/18 | 3nm, 5nm, 7nm | Steady; new N2 fabs planned |
| Kaohsiung, Taiwan | Fab 22 | N2 (2nm) | **P1 HVM, P2 trial, P3 structural; 100k wpm by end-2026; all sold out** |
| Nanjing, China | - | 28nm, 16nm | Operational |
| Phoenix, Arizona | Fab 21 | 4nm (P1), 3nm (P2 tool-in Q3 2026) | P1 in production; P2 start 2027 |
| Kumamoto, Japan | JASM | 12/22/28nm | **Commercial ops since Dec 2024**; 2nd fab may shift to 4nm |
| Dresden, Germany | ESMC | 22/28nm | Fully operational 2029, 40k wpm |

### Tier 4 — OSAT (Back-end)

**2024 market shares (ASE = ~45% among top 10):**
| Company | Revenue (2024) | HQ |
|---|---|---|
| ASE Technology | $18.54B | Kaohsiung, TW (includes SPIL since 2018 merger) |
| Amkor | $6.32B | Tempe, AZ (fabs in Korea/Philippines/Vietnam) |
| JCET | $5.00B | Jiangyin, China |
| Powertech (PTI) | ~$3B | Hsinchu, TW |
| Tongfu (TFME) | ~$2.5B | Nantong, China |

OSAT market 2026: $51.1B, growing ~8.6% CAGR to $77.1B by 2031.

### Tier 5 — Design, EDA, IP (Customers)

**Top 15 TSMC customers by revenue (approximate):** Apple, Nvidia, AMD, Qualcomm, Broadcom, MediaTek, Sony, Marvell, Tesla, Intel (partial), Realtek, NXP, STMicro, Infineon, Analog Devices.

**EDA (top-3 = 85%+ share):**
| Vendor | Share 2024 | HQ |
|---|---|---|
| Synopsys | 46% (post-Ansys acquisition July 2025, $35B deal) | Sunnyvale, CA |
| Cadence | 35% | San Jose, CA |
| Siemens EDA (ex-Mentor) | 13% | Wilsonville, OR |

**IP:** Arm (Cambridge, UK) dominant in mobile/IoT; RISC-V ecosystem has hit **25% penetration as of January 2026** (Qualcomm + Meta leading). Arm is now expanding into complete chips (Arm AGI CPU on TSMC 3nm, H2 2026).

---

## Part 2 — India Semiconductor Ecosystem (2026 Live State)

**ISM 2.0 launched Feb 2026** with ₹1,000 cr FY26-27 budget. As of March 2026: **10 units approved, ₹1.60 lakh cr committed, 2 fabs + 8 OSAT/ATMP, 6 states.**

### Operational (commercial production begun)

**Micron ATMP — Sanand, Gujarat**
- Capex: $2.75B ($825M Micron + $1.93B government subsidies)
- Type: ATMP (assembly, test, marking, packaging) for DRAM + NAND
- Status: commercial production opened Feb 28, 2026 by PM Modi
- Output target: tens of millions of chips in 2026, hundreds of millions in 2027
- Cleanroom: 500,000 sq ft (one of world's largest single-floor cleanrooms)

**Kaynes Semicon — Sanand, Gujarat**
- Capex: ₹3,300 cr (~$400M)
- Type: OSAT (wire bond, flip-chip, SiP)
- Status: commercial production opened Mar 31, 2026 by PM Modi
- Target capacity: 6.3 million chips/day (~2.3 billion/year)
- Scale-up: 1.5M chips/day Q1 2026 → full capacity later

**Tata Semiconductor Assembly & Test — Jagiroad, Assam**
- Capex: ₹27,000 cr (~$3.6B)
- Type: OSAT (wire bond, flip-chip, SiP)
- Status: commissioning April 2026
- Target capacity: 48 million chips/day
- Anchor customer: Qualcomm (automotive modules — deal announced Feb 2026)
- Employment: 25,000 direct + indirect

### Ramping / Under construction

**Tata Electronics–PSMC Fab — Dholera, Gujarat**
- Capex: ₹91,000 cr (~$11B)
- Tech transfer: Powerchip Semiconductor Manufacturing Corporation (Taiwan)
- Nodes: 28, 40, 55, 90, 110 nm (analog + logic)
- Capacity: 50,000 wafers/month (at full ramp)
- Status: first commercial silicon by late 2026, tool-in milestones underway
- This is **India's first large-scale wafer fab** — the front-end of the value chain

**CG Semi — Sanand, Gujarat**
- Capex: ~₹7,600 cr (~$900M) (CG Power + Renesas Electronics + Stars Microelectronics Thailand)
- Type: OSAT
- Status: commercial production imminent (announced March 2026)

### Announced / construction starting

**HCL–Foxconn OSAT (India Chip Private Limited) — Jewar, UP**
- Capex: ₹3,706 cr (~$445M)
- JV: HCL 60% / Foxconn 40%
- Product: display driver chips (mobile, laptop, automotive, consumer)
- Capacity: 20,000 wafers/month input → 36 million chips/month output
- Status: groundbreaking Feb 2026, operational 2028
- Subsidy: 60-70% of capex from central + state

### Legacy / research

**SCL (Semi-Conductor Laboratory) — Mohali, Punjab**
- Legacy 180 nm process, research + strategic/ISRO chips
- Being modernized under ISM

### Design ecosystem

- **DLI scheme:** 24 chip design projects approved as of Jan 2026 — microprocessors, satcom, energy metering, surveillance, IoT
- India is ~20% of global chip design workforce (~125k engineers), but mostly doing back-end verification and implementation for MNC design centers (Qualcomm Bangalore, Intel Bangalore, Nvidia Bangalore, AMD Hyderabad, etc.)

---

## Part 3 — Bottleneck Inventory (Deep Dive Data)

### 1. Silicon Wafer Manufacturing
- India: ~100% import dependency in 2026
- Global oligopoly: Shin-Etsu + SUMCO = 51%; top-5 = 89%
- Announced: one Indian wafer project targeting June 2026 commercial ops (solar-grade context; semiconductor-grade wafer is harder)*
- Note: ISM 2.0 explicitly targets wafer manufacturing

### 2. Lithography Equipment
- EUV: ASML sole supplier globally; US export controls block China
- India: no domestic lithography maker; 100% imports from ASML, Canon, Nikon
- DUV/i-line for mature nodes: available, but no indigenous design or manufacturing
- Strategic implication: India's fabs are locked into Taiwanese/US/NL equipment supply

### 3. Photoresist & Advanced Chemicals
- Japan near-monopoly (88-90% EUV resist share)
- India: no domestic EUV-grade resist; some basic DUV resist R&D at academic level
- Dependency risk: any Japan export control replicating US semiconductor rules would be catastrophic

### 4. Specialty & Rare Gases
- Neon: pre-war Ukraine 70% share — exposed during 2022 invasion
- Helium: Qatar + Russia + Algeria + US = 90%
- India: some industrial gas capacity (Linde India) but near-zero specialty gas production
- India imports neon, xenon, krypton, helium 3, deuterium, specialty etch gases (NF3, SF6, etc.)

### 5. Leading-edge process nodes
- India's most advanced planned node is 28nm (Tata-PSMC Dholera)
- TSMC is at 2nm HVM; Samsung/Intel at 2-3nm
- Gap: 5+ technology generations behind
- Capex to enter leading-edge: $20B+ per fab at 3nm/2nm; requires EUV (ASML will sell but not to China; India is OK politically)
- Strategic question: is leading-edge even worth chasing, or should India specialize in mature nodes + packaging?

### 6. EDA Tools
- Synopsys + Cadence + Siemens = 85%+ of EDA revenue, all US-based
- India: large user base (all major design centers use these), no domestic alternative
- Dependency risk: US export controls on EDA have precedent (applied to Huawei)
- Open-source alternatives (OpenROAD, Magic) exist but not at production quality for advanced nodes

### 7. IP Cores
- Arm (UK, SoftBank-owned) — dominant in mobile/embedded
- RISC-V — open ISA, India has strong RISC-V activity (IIT Madras Shakti core, C-DAC Vega)
- India's RISC-V position is actually reasonable; could be a wedge

### 8. Talent pipeline
- Gap: 250-300k by 2027
- Produces 600k electronics grads/year but ~20% industry-ready
- Specialty shortages: process engineering, physical design, analog/RF, verification
- MOSart Labs, KeenSemi, VLSI Expert building programs
- Government: "1 million chip-ready engineers by 2030" target

### 9. Mask / reticle manufacturing
- For advanced nodes: Photronics, Toppan, DNP dominate; India near-zero
- For mature nodes: India could build domestic mask capacity

### 10. Semiconductor-grade water & utilities
- A modern fab uses 2-5 million gallons/day of ultrapure water
- Dholera has water availability; long-term sustainability is a question

### 11. ATMP substrates (organic + ceramic)
- Substrates used in advanced packaging come from Taiwan (Unimicron, Nanya), Japan (Ibiden, Shinko)
- India has zero domestic substrate capability at semiconductor grade
- This is a Tier-1-analog gap for the OSAT sector India is rapidly building

---

## Sources

### TSMC / Taiwan
- [TSMC 2nm volume production (Tom's Hardware)](https://www.tomshardware.com/tech-industry/semiconductors/tsmc-begins-quietly-volume-production-of-2nm-class-chips)
- [TSMC 2nm capacity sold out 2026 (WCCFTech)](https://wccftech.com/tsmc-two-2nm-plants-sold-out-for-2026/)
- [TSMC Arizona Fab 21 2027 start (Tom's Hardware)](https://www.tomshardware.com/tech-industry/semiconductors/tsmc-brings-its-most-advanced-chipmaking-node-to-the-us-yet)
- [JASM Kumamoto Wikipedia](https://en.wikipedia.org/wiki/Japan_Advanced_Semiconductor_Manufacturing)
- [TrendForce TSMC Arizona expansion](https://www.trendforce.com/news/2025/12/18/news-tsmc-reportedly-accelerates-arizona-2nd-fab-eyes-3q26-tool-install-2027-3nm-production/)
- [ASML EUV dominance TrendForce](https://www.trendforce.com/insights/asml-euv)
- [ASML supply chain Entropy Capital](https://entropycapital.substack.com/p/asmls-supply-chain-bill-of-materials)
- [High-NA EUV Samsung/Intel TrendForce](https://www.trendforce.com/news/2026/02/16/news-asmls-high-na-euv-for-2027-28-which-giants-are-betting-big-intel-samsung-sk-hynix-or-tsmc/)
- [ZEISS EUV joint project](https://www.zeiss.com/semiconductor-manufacturing-technology/smt-magazine/euv-lithography-as-an-european-joint-project.html)

### Materials
- [Silicon wafer market Mordor Intelligence](https://www.mordorintelligence.com/industry-reports/semiconductor-silicon-wafer-market)
- [Photoresist Japanese monopoly Fountyl](https://www.fountyltech.com/news/japanese-companies-monopolize-the-euv-photoresist-supply-market/)
- [Photoresist chemicals Fortune Business Insights](https://www.fortunebusinessinsights.com/photoresist-chemicals-market-115414)
- [Ukraine neon USITC briefing](https://www.usitc.gov/publications/332/executive_briefings/ebot_decarlo_goodman_ukraine_neon_and_semiconductors.pdf)
- [CSIS Russia Ukraine chip gases](https://www.csis.org/blogs/perspectives-innovation/russias-invasion-ukraine-impacts-gas-markets-critical-chip-production)
- [Helium shortage 2026](https://www.kunalganglani.com/blog/helium-shortage-semiconductor-supply-chain)

### Equipment
- [Semiconductor equipment Top 5 GlobeNewswire](https://www.globenewswire.com/news-release/2025/02/27/3034012/28124/en/Semiconductor-Manufacturing-Equipment-Industry-Research-2025.html)
- [Front-end equipment Mordor](https://www.mordorintelligence.com/industry-reports/global-semiconductor-front-end-equipment-market)

### EDA / IP
- [Synopsys Cadence Siemens EDA](https://www.embedded.com/taking-stock-of-the-eda-industry/)
- [RISC-V 25% market penetration](https://blog.adafruit.com/2026/01/07/risc-v-hits-25-market-penetration-thanks-to-meta-and-qualcomm)
- [Arm AGI CPU Omdia](https://omdia.tech.informa.com/blogs/2026/apr/arm-steps-deeper-into-silicon-implications-for-the-semiconductor-value-chain)

### OSAT
- [ASE Amkor JCET TrendForce](https://www.trendforce.com/presscenter/news/20250513-12577.html)
- [ASE OSAT ranking Mark Lapedus](https://marklapedus.substack.com/p/ase-amkor-top-osat-rankings-but-china)

### India
- [India Semiconductor Mission 2.0 (ISM)](https://ism.gov.in/)
- [ISM 2.0 PIB February 2026](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/feb/doc202627782201.pdf)
- [Tata Electronics Semiconductor Foundry](https://www.tataelectronics.com/semiconductor-foundry)
- [Tata Dholera 28nm PSMC (SemiWiki)](https://semiwiki.com/forum/threads/tata-groups-dholera-plant-may-roll-out-indias-1st-28nm-semiconductor-chip-by-2026.19830/)
- [Micron Sanand opening](https://investors.micron.com/news-releases/news-release-details/micron-celebrates-opening-indias-first-semiconductor-assembly)
- [Kaynes Semicon Sanand inauguration](https://www.communicationstoday.co.in/kaynes-semicon-sanand-osat-6-3-million-chips-day-ramp-up/)
- [Tata Jagiroad 48M chips/day](https://www.blackridgeresearch.com/news-releases/tata-group-plans-to-invest-usd-4-billion-to-construct-a-semiconductor-manufacturing-unit-in-assam-india)
- [Qualcomm-Tata automotive modules](https://www.business-standard.com/companies/news/qualcomm-tata-electronics-sign-deal-to-make-automotive-modules-in-assam-126022000300_1.html)
- [HCL-Foxconn Jewar groundbreaking](https://www.business-standard.com/technology/tech-news/pm-modi-hcl-foxconn-osat-jv-semiconductor-self-reliance-126022100896_1.html)
- [Cabinet HCL-Foxconn approval PIB](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2128604&reg=3&lang=2)
- [India talent shortage Business Standard](https://www.business-standard.com/industry/news/india-s-chip-industry-to-face-shortage-of-300-000-professionals-by-2027-124061100186_1.html)
- [India wafer market IndexBox](https://www.indexbox.io/store/india-silicon-wafers-200mm-300mm-prime-epitaxial-market-analysis-forecast-size-trends-and-insights/)
