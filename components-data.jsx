// ─────────────────────────────────────────────
// DATA — all research content
// ─────────────────────────────────────────────

const SECTIONS = [
  { id: 's0', num: '00', short: 'Overview',    title: 'Overview' },
  { id: 's1', num: '01', short: 'Market',      title: 'The $120B Buildout' },
  { id: 's2', num: '02', short: 'Competition', title: 'The Whitespace' },
  { id: 's3', num: '03', short: 'Pain',        title: 'What Actually Hurts' },
  { id: 's4', num: '04', short: 'Strategy',    title: 'The Compound Play' },
  { id: 's5', num: '05', short: 'Networking',  title: 'Who to Reach' },
  { id: 's6', num: '06', short: 'Schemes',     title: 'Money on the Table' },
  { id: 's7', num: '07', short: 'The Plan',    title: 'Month-by-Month' },
  { id: 's8', num: '08', short: 'Lessons',     title: 'Country Lessons' },
  { id: 's9', num: '09', short: 'Ideas',       title: 'Innovation Ideas' },
  { id: 's10', num: '10', short: 'Learning',   title: 'Learning Plan' },
  { id: 's11', num: '11', short: 'Sources',    title: 'Sources' },
];

const HERO_STATS = [
  { label: 'Total Market', value: 120, unit: 'B', prefix: '$', detail: 'India semiconductor market by 2030', trend: '↑ 18% CAGR', trendClass: 'trend-up' },
  { label: 'Ancillary Market', value: 15000, unit: 'Cr', prefix: '₹', detail: 'Materials, equipment, services by 2028', trend: 'First-mover window', trendClass: 'trend-hot' },
  { label: 'Talent Shortfall', value: 350, unit: 'K', prefix: '', detail: 'Skilled workers needed by 2027', trend: 'Your #1 entry', trendClass: 'trend-up' },
  { label: 'Gujarat Projects', value: 18.2, unit: 'B', prefix: '$', decimals: 1, detail: 'Dholera + Sanand cluster', trend: 'Your backyard', trendClass: 'trend-hot' },
];

const MARKET_GROWTH = [
  { x: '2022', y: 27 }, { x: '2023', y: 33 }, { x: '2024', y: 38 }, { x: '2025', y: 45 },
  { x: '2026', y: 55 }, { x: '2027', y: 68 }, { x: '2028', y: 82 }, { x: '2029', y: 100 }, { x: '2030', y: 120 },
];

const ECOSYSTEM_MIX = [
  { label: 'ATMP/OSAT', value: 35, color: '#60a5fa' },
  { label: 'Fab',       value: 25, color: '#3b82f6' },
  { label: 'Design',    value: 20, color: '#818cf8' },
  { label: 'Materials', value: 12, color: '#a78bfa' },
  { label: 'Testing',   value: 8,  color: '#c4b5fd' },
];

const TALENT_GAP = [
  { x: '2024', filled: 28, gap: 42 },
  { x: '2025', filled: 43, gap: 57 },
  { x: '2026', filled: 110, gap: 200 },
  { x: '2027', filled: 260, gap: 350 },
  { x: '2028', filled: 480, gap: 520 },
];

const SEGMENT_SIZE = [
  { x: 'Materials',  low: 2.44, high: 4.92 },
  { x: 'Equipment',  low: 3.20, high: 7.80 },
  { x: 'Chemicals',  low: 1.10, high: 3.50 },
  { x: 'Logistics',  low: 0.40, high: 1.80 },
  { x: 'Services',   low: 0.80, high: 2.40 },
];

const REVENUE_PROJECTION = [
  { x: 'M1', y: 0 }, { x: 'M3', y: 2 }, { x: 'M6', y: 8 }, { x: 'M9', y: 20 },
  { x: 'M12', y: 45 }, { x: 'M18', y: 80 }, { x: 'M24', y: 150 },
];

const GUJARAT_FACILITIES = [
  { name: 'Tata Dholera',    invest: '$11B',      investNum: 11000, type: 'Fab 28-110nm', status: 'Equip→2028',   statusClass: 'b-w',  jobs: '20K+', note: 'Anchor tenant. First commercial wafer shipments targeted late 2026. Every ancillary contract flows through here.' },
  { name: 'Micron Sanand',   invest: '$2.75B',    investNum: 2750,  type: 'ATMP',         status: 'Commercial',   statusClass: 'b-ok', jobs: '5K+',  note: 'Already shipping. First Indian chip exited here Dec 2024. Only site with live quality & supplier needs today.' },
  { name: 'CG Power',        invest: '₹7,600Cr',  investNum: 900,   type: 'OSAT',         status: 'Construction', statusClass: 'b-w',  jobs: '10K+', note: 'JV with Renesas + Stars Microelectronics. OSAT backbone for automotive & industrial packaging.' },
  { name: 'Kaynes Sanand',   invest: '₹3,300Cr',  investNum: 400,   type: 'OSAT',         status: 'Inaugurated',  statusClass: 'b-ok', jobs: '3K+',  note: 'Inaugurated Sep 2025. Specialty focus: power electronics, EV, industrial OSAT packaging runs.' },
];

const COMPETITION = [
  { name: 'No Ancillary Integrator', severity: 'Gap',  class: 'b-bad', size: '$120B TAM', body: 'Fabs need 100+ local suppliers. IDTA members (Applied Materials, Lam Research) seeking Indian MSMEs — no aggregator exists.', who: 'Open', stage: 'Whitespace' },
  { name: 'No AI Inspection',        severity: 'Gap',  class: 'b-bad', size: '$8B TAM',   body: 'SixSense (SG): 100M+ chips, $12M raised, GlobalFoundries customer. Zero Indian equivalent for Dholera/Sanand.', who: 'SixSense (SG)', stage: 'Early' },
  { name: 'No MSME Bridge',          severity: 'Gap',  class: 'b-w',   size: '~5K MSMEs', body: 'ISO 9001+14644+IATF 16949 required. ₹2-8L cert (50% subsidized). No one guides MSMEs through it.', who: 'Consultants', stage: 'Fragmented' },
  { name: 'Cleanroom Training',      severity: 'Low',  class: 'b-ok',  size: '350K gap',  body: 'ESSCI curriculum exists but few partners. Universities haven\'t operationalized. 43K of 85K trained through C2S.', who: 'ESSCI partners', stage: 'Nascent' },
  { name: 'Specialty Chemicals',     severity: 'Med',  class: 'b-w',   size: '$1B+',      body: 'Photoresists, etchants, CMP slurries — 100% imported at 3-4x cost. INOX Air for gases only. Deepak Nitrite exploring.', who: 'Import-only',  stage: 'Greenfield' },
  { name: 'ESD Logistics',           severity: 'Med',  class: 'b-w',   size: '$200M',     body: 'ESD-safe handling unknown to Indian logistics. No specialized semicon logistics company. Gujarat→global corridor.', who: 'None',         stage: 'Greenfield' },
  { name: 'Design Services',         severity: 'High', class: 'b-a',   size: '$20B',      body: 'Tessolve/HCL dominate. Tata Elxsi, LTTS entering. DLI scheme backing Mindgrove, AGNIT, FermionIC, Saankhya.', who: 'Tessolve/HCL', stage: 'Mature' },
  { name: 'Metrology & Inspection',  severity: 'Gap',  class: 'b-bad', size: '$3B',       body: 'KLA, Applied Materials own market. Indian MSMEs can build sub-assemblies. IDTA wants partners.', who: 'KLA/AMAT',     stage: 'Closed' },
];

const PAIN = [
  { severity: 'Critical', class: 'pc-c', badge: 'b-bad', title: 'Workforce Not Ready',
    short: '350K shortfall. ESSCI curriculum exists, few partners.',
    quote: 'We need 20,000 at Dholera but can\'t find 2,000 who know cleanroom protocols.',
    cite: 'SemiConnect 2026',
    long: 'C2S has trained 43K of 85K target. Cleanroom discipline, ESD protocols, and chemical handling require 6–12 months of hands-on training nobody is running at scale. Universities hold EEE degrees but not fab-floor readiness. Multiple plant managers report this as their #1 constraint — ahead of equipment delivery.',
    sources: [
      { label: 'ESSCI Programs', url: 'https://www.essc-india.org/semicon/' },
      { label: 'Carnegie', url: 'https://carnegieendowment.org/research/2025/08/indias-semiconductor-mission-the-story-so-far' },
    ] },
  { severity: 'High', class: 'pc-h', badge: 'b-w', title: 'No Local Chemicals',
    short: 'INOX Air for gases. Chemicals 100% imported at 3–4x cost.',
    quote: 'Fabs reluctant to switch validated suppliers — sticky revenue.',
    cite: 'India Briefing',
    long: 'Photoresists from JSR, TOK. Etchants from Entegris. CMP slurries from CMC Materials. Electronic gases from Linde and (now) INOX Air. Lead times 8–12 weeks via sea freight. Once a fab qualifies a supplier, switching cost is measured in years — whoever qualifies first in India locks in 10-year revenue.',
    sources: [
      { label: 'India Briefing', url: 'https://www.india-briefing.com/news/india-semiconductor-manufacturing-sanand-gujarat-2026-43814.html/' },
    ] },
  { severity: 'High', class: 'pc-h', badge: 'b-w', title: 'Logistics Gap',
    short: 'ESD handling unknown. No specialized semicon logistics company.',
    quote: 'Moisture, vibration, ESD — nobody in India ships wafers the way we need.',
    cite: 'Procurement lead, Kaynes',
    long: 'Wafers, reticles, and masks need temperature-controlled, ESD-safe, vibration-dampened transport. Blue Dart / Delhivery aren\'t equipped. DHL / FedEx charge international rates for domestic Gujarat moves. Greenfield opportunity: a dedicated Dholera↔Sanand↔port corridor.',
    sources: [
      { label: 'CSIS', url: 'https://www.csis.org/analysis/semiconductor-clusters-making-indias-push-global-competitiveness' },
    ] },
  { severity: 'Medium', class: 'pc-m', badge: 'b-a', title: 'No MSME Bridge',
    short: 'Applied Materials sources 40-60% from distributed suppliers. Zero aggregator in India.',
    quote: 'We get 50 supplier pitches a week. We need someone to pre-qualify them for us.',
    cite: 'IDTA member, Bengaluru',
    long: 'Applied Materials, Lam Research, and KLA buy ~50% of their sub-assembly value from distributed MSMEs globally. In India they\'re starting from zero. ISO 9001, ISO 14644 (cleanroom), and IATF 16949 (automotive, adjacent) are table-stakes — ₹2–8L per cert, 50% subsidized. The bottleneck: navigating the process.',
    sources: [
      { label: 'Udyami Guide', url: 'https://www.udyamidigital.com/india-semiconductor-msme-opportunity-2026/' },
      { label: 'Gujarat MSME', url: 'https://msmec.gujarat.gov.in/incentivescheme' },
    ] },
];

const STRATEGY = [
  { num: '1', title: 'Workforce Academy',   priority: 'High', class: 'b-ok', top: '#4ade80', icon: 'grad',
    body: 'ESSCI partner. Gujarat universities.',
    pricing: '₹50K–2L/student + ₹5–20L/employer batch',
    capex: '$20–30K', revenueStart: 'M3–4',
    notes: 'Lowest capex, fastest revenue. ESSCI curriculum is ready-made — partner, don\'t build.' },
  { num: '2', title: 'Supply Chain',        priority: 'High', class: 'b-ok', top: '#4ade80', icon: 'link',
    body: 'Audit → Certify → Marketplace.',
    pricing: '₹2–5L/audit + 3–5% marketplace fee',
    capex: '$30–50K', revenueStart: 'M5–6',
    notes: 'Revenue compounds — every cert creates a recurring-audit relationship.' },
  { num: '3', title: 'AI Quality SaaS',     priority: 'Medium', class: 'b-w', top: '#fbbf24', icon: 'scan',
    body: 'SixSense model for India.',
    pricing: '₹50K–2L/mo/facility',
    capex: '$50–80K', revenueStart: 'M8–10',
    notes: 'Highest margin, highest moat. Compounds off workforce + supply relationships.' },
];

const NETWORK_FOUNDERS = [
  { person: 'Hareesh Chandrasekar', company: 'AGNIT Semi (IISc)',  focus: 'GaN chips, $4.87M raised, 18yr journey',                 why: 'Deep-tech founder, knows India semicon from scratch',      how: 'LinkedIn · FounderThesis', tier: 'A' },
  { person: 'Gautam Kumar Singh',   company: 'FermionIC Design',   focus: 'RF chips for defense, $6M raised, was bootstrapped',     why: 'Bootstrapped → funded path, defense semicon',              how: 'LinkedIn · Inc42',         tier: 'A' },
  { person: 'Shashwath T R',        company: 'Mindgrove Tech',     focus: 'RISC-V SoCs, IIT-M spinoff',                             why: 'Young founder, RISC-V, DLI beneficiary',                   how: 'LinkedIn · Twitter',       tier: 'A' },
  { person: 'Kunal Ghosh',          company: 'VSD (VLSI Sys Dsn)', focus: '90K+ students, 153 countries, open-source',              why: 'Community builder, knows everyone in Indian VLSI',         how: 'LinkedIn · VSDOpen',       tier: 'A' },
  { person: 'Parag Naik',           company: 'Saankhya Labs',      focus: '5G broadcast chips, ISRO/defense',                       why: 'Government contracts path, SDR expertise',                 how: 'LinkedIn · IESA events',   tier: 'B' },
  { person: 'Dr Sankar Reddy',      company: 'Terminus Circuits',  focus: 'High-speed SerDes design since 2010',                    why: 'Long-term survivor in Indian semicon',                     how: 'LinkedIn',                 tier: 'B' },
  { person: 'Niranjan Pol',         company: 'Seagate / IESA Mah', focus: 'IESA chapter lead, Sr Engineering Director',             why: 'Industry body access, event introductions',                how: 'LinkedIn · IESA events',   tier: 'B' },
];

const EVENTS = [
  { name: 'SEMICON India 2026',       dates: 'Sep 17–19, 2026', where: 'Yashobhoomi, New Delhi',          why: '400+ exhibitors, 20 countries. THE flagship event.',      status: 'Register now',     statusClass: 'b-ok', priority: 1 },
  { name: 'Productronica India',      dates: 'Sep 16–18, 2026', where: 'BIEC, Bengaluru',                 why: 'Manufacturing focus, MSME-friendly',                      status: 'Register',         statusClass: 'b-ok', priority: 2 },
  { name: 'Electronica India',        dates: 'Apr 8–10, 2026',  where: 'IEML, Greater Noida',             why: 'Electronics + semiconductor conclave',                    status: 'Just passed',      statusClass: 'b-w',  priority: 3 },
  { name: 'SEMICON West 2026',        dates: 'Oct 13–15, 2026', where: 'Moscone, San Francisco',          why: 'Global industry, US networking (green card)',             status: 'Register',         statusClass: 'b-ok', priority: 2 },
  { name: 'SemiConnect Gujarat',      dates: 'Mar 1–2, 2026',   where: 'Mahatma Mandir, Gandhinagar',     why: 'Gujarat focus, Dholera site visit included',              status: 'Passed — 2027',    statusClass: 'b-a',  priority: 3 },
  { name: 'IESA Vision Summit',       dates: 'Feb 25–26, 2026', where: 'Leela Bengaluru',                 why: '1500+ delegates, design-to-manufacturing theme',          status: 'Passed — 2027',    statusClass: 'b-a',  priority: 3 },
  { name: 'ISSCC 2027',               dates: 'Feb 14–18, 2027', where: 'San Francisco',                   why: 'Cutting-edge circuits, academic networking',              status: 'Plan ahead',       statusClass: 'b-ok', priority: 2 },
  { name: 'SEMICON West 2027',        dates: 'Oct 12–14, 2027', where: 'Phoenix, Arizona',                why: 'Alternating SF/Phoenix',                                  status: 'Future',           statusClass: 'b-a',  priority: 3 },
];

const COMMUNITIES = [
  { name: 'IESA (membership)',              detail: '300+ members, regional chapters, Industry-Academia Connect',    tag: '₹5K/yr' },
  { name: 'VLSI Society of India (VSI)',    detail: 'VLSI Design Conference organizer, academic + industry',          tag: 'Join'    },
  { name: 'VSD / VSDOpen Community',        detail: "Kunal Ghosh's 90K community, open-source semicon",               tag: 'Free'    },
  { name: 'India Deep Tech Alliance',       detail: 'Applied Materials, Lam Research, CG Power members',              tag: 'Apply'   },
  { name: 'NASSCOM Semiconductor',          detail: 'Industry reports, member networking',                            tag: 'Join'    },
  { name: 'Reddit: r/VLSI, r/chipdesign',   detail: 'Career discussions, industry news, technical Q&A',               tag: 'Follow'  },
  { name: 'Twitter: @Semicon_India',        detail: 'Policy updates, event announcements',                            tag: 'Follow'  },
];

const GROUND = [
  { name: 'Gujarat SemiConnect Conference', detail: 'Annual at Mahatma Mandir. CM Patel hosts 1-on-1s with industry',  tag: '2027'    },
  { name: 'GSEM (State Electronics Mission)', detail: 'Semiconductor policy body. Supports supply chain development.',  tag: 'Contact' },
  { name: 'GIDC Sanand Industrial Estate',  detail: '2000+ hectares. Micron, Kaynes, CG Power are here.',              tag: 'Visit'   },
  { name: 'Dholera SIR Authority',          detail: 'Tata fab + INOX Air. Industrial plots available.',                tag: 'Visit'   },
  { name: 'IIT Gandhinagar',                detail: 'Semiconductor research group, potential university partner',      tag: 'Meet'    },
  { name: 'Ahmedabad Meetup Groups',        detail: 'Tech/startup meetups, co-working community',                       tag: 'Attend'  },
  { name: 'Deepak Nitrite (Meghav Mehta)',  detail: 'Gujarat chemical company exploring semicon-grade specialty',       tag: 'Network' },
];

const SCHEMES = [
  { name: 'ISM 2.0 Capital Subsidy',    get: '50% of project cost for fab/OSAT/ATMP',   amt: 'Up to ₹5,000Cr',  who: 'Approved semicon projects',       tag: 'Central' },
  { name: 'DLI Scheme',                 get: 'Design cost reimbursement for chip startups', amt: 'Up to ₹30Cr', who: '24 startups approved, ₹430Cr VC', tag: 'Central' },
  { name: 'Gujarat Capital Subsidy',    get: 'Capital subsidy for MSME units in Sanand',    amt: '30% capex',   who: 'MSMEs in semicon ancillary',      tag: 'Gujarat' },
  { name: 'Gujarat Electricity Tariff', get: 'Electricity subsidy for semicon ancillary',   amt: '15% reduction', who: 'Gujarat semicon MSMEs',          tag: 'Gujarat' },
  { name: 'Karnataka Interest Subvention', get: 'Interest rate reduction for semicon ancillary', amt: '3% subvention', who: 'Semiconductor units in Bengaluru', tag: 'Karnataka' },
  { name: 'PLI for Equipment Mfg',      get: 'Capital subsidies for equipment MSMEs',       amt: '15–25%',      who: 'Equipment manufacturers',         tag: 'Central' },
  { name: 'CGTMSE',                     get: 'Collateral-free credit guarantee',            amt: '₹2 Cr',       who: 'All MSMEs',                       tag: 'Central' },
  { name: 'Startup India DPIIT',        get: '3yr tax exemption + fund access',             amt: 'Tax-free',    who: 'DPIIT recognized startups',       tag: 'Central' },
  { name: 'MSME Cert Subsidy',          get: '50% of ISO certification costs',              amt: '₹1–4L saved', who: 'All MSMEs getting ISO certified', tag: 'Central' },
  { name: 'US SBA Microloan',           get: 'Small business loan (green card eligible)',   amt: 'Up to $50K',  who: 'US-based entity',                 tag: 'US'      },
];

const TIMELINE = [
  { label: 'M1–2 · Learn',    title: 'While Employed',   tasks: ['SEMI Uni packaging cert', 'IIT-H VLSI course', 'ESSCI QP review', 'Read Chip War', 'Join IESA (₹5K)', '50+ LinkedIn connects', 'Weekly posts'], milestones: ['IESA member', 'Chip War read', '50 LinkedIn connects'] },
  { label: 'M3–4 · Validate', title: 'Gujarat Recon',    tasks: ['Dholera + Sanand site visits', '3–5 dean meetings', '20+ MSME interviews', 'ESSCI + GSEM convos', '5 signed LOIs', 'SEMICON India (Sep 17–19)'], milestones: ['5 LOIs', '20 MSME interviews', 'SEMICON India attended'] },
  { label: 'M5–6 · Build',    title: 'MVP Launch',       tasks: ['Incorporate Pvt Ltd', 'MSME Udyam + Startup India', 'First cleanroom cohort live', '2–3 audits (₹2–5L ea.)', 'AI prototype v1', 'File Gujarat 30% capex + CGTMSE'], milestones: ['Pvt Ltd formed', 'First cohort live', 'Audit #1 delivered'] },
  { label: 'M7–12 · Revenue', title: '$45K MRR Target',  tasks: ['3 cohorts graduated', 'Employer contracts signed', 'Marketplace beta launch', 'AI pilot with 2 customers', 'SEMICON West (Oct SF)'], milestones: ['$45K MRR', '3 cohorts graduated', 'AI pilot live'] },
  { label: 'M13–24 · Scale',  title: '$150K+ MRR',       tasks: ['3+ university partners', '50+ supplier network', 'AI SaaS live', 'Team of 10 hired', 'Karnataka + TN expansion'], milestones: ['$150K MRR', '50 suppliers', 'Team of 10'] },
];

const RISKS = [
  { name: 'Fab Delays (Dholera→2028)', detail: 'Mitigation: OSAT already operational', level: 'Medium', tagClass: 'b-w',  w: 60, c: '#fbbf24' },
  { name: 'Domain Knowledge Gap',      detail: 'Mitigation: ESSCI curriculum ready-made', level: 'Medium', tagClass: 'b-w', w: 55, c: '#fbbf24' },
  { name: 'Large Player Competition',  detail: 'Mitigation: Different segment (MSME local)', level: 'Low',  tagClass: 'b-a', w: 30, c: '#60a5fa' },
  { name: 'Policy Changes',            detail: 'Mitigation: Revenue independent of subsidies', level: 'Low', tagClass: 'b-a', w: 25, c: '#60a5fa' },
];

const LESSONS = [
  { country: 'Taiwan', sub: 'ITRI → TSMC, 1976–2000s',
    body: 'Sent 19 engineers to RCA to learn. Built Hsinchu cluster: co-located fabs + suppliers + universities. Took 30 years for full supply chain. ITRI spin-offs compounded knowledge. ASE Group grew to $19.5B serving this ecosystem.',
    takeaway: 'Co-location compounds. Patience wins.' },
  { country: 'Korea',  sub: 'Samsung / SK Hynix',
    body: 'K-Semiconductor Belt connecting regions. 17.4% global equipment market, 16.6% materials. Samsung runs its own semiconductor academy. SMEs supported via Fabless Challenge program (500M won grants).',
    takeaway: 'Corporate academies + SME grants build ecosystem.' },
  { country: 'China',  sub: '$150B+ invested',
    body: 'Self-sufficient in etching, cleaning, CMP. Still can\'t make EUV or advanced metrology. "Won\'t achieve full autonomy in 5 years." Lesson: money alone doesn\'t build an ecosystem.',
    takeaway: 'Money ≠ ecosystem. Tacit knowledge is slow.' },
  { country: 'USA',    sub: 'CHIPS Act, 2022–present',
    body: 'TSMC Arizona: 4–5x construction cost vs Taiwan. Intel Ohio: can\'t find 7,000 workers. Culture clash. BUT: Arizona yields 4% higher than Taiwan. Lesson: workforce is always the bottleneck.',
    takeaway: 'Workforce is always the real bottleneck.' },
];

const IDEAS = [
  { title: 'Equipment Knowledge Platform', body: 'Fabs run on MULEs (legacy undocumented systems). Engineers waste hours in PDFs. Build: searchable knowledge system for equipment manuals, SOPs, maintenance logs, process recipes.', tag: 'AI Ops' },
  { title: 'MSME Compliance Navigator',    body: 'ISO standards = thousands of pages in English for Western companies. Build: guided certification platform with gap analysis, templates, multi-language. TurboTax for industrial certifications.', tag: 'SaaS' },
  { title: 'Maintenance Prediction from Logs', body: '40–70% downtime is firefighting. Equipment logs are text-heavy. Build: pattern recognition on alarm codes, operator notes, shift handoffs. Text-based, not vision-based.', tag: 'AI' },
  { title: 'Supply Chain Matching Engine', body: 'India\'s semicon supply chain is opaque. Build: auto-profile MSMEs from existing docs, match to fab requirements, generate RFQ responses. Entity extraction + matching.', tag: 'Marketplace' },
  { title: 'Shift Handoff & Ops Platform', body: 'Verbal/paper handoffs. Material not tracked. Build: digital handoff + tracking + communication for fab/OSAT operations. Your FDE wheelhouse.', tag: 'Ops' },
  { title: 'Training Content System',      body: 'ESSCI QPs exist but content is sparse. Build: takes QPs + manuals → generates training modules, quizzes, assessments in regional languages.', tag: 'EdTech' },
];

const LEARN_TECH = [
  { name: 'Wk 1–2 · Big Picture',      detail: 'Asianometry YouTube · Chip War book · Map the full value chain end-to-end', tag: '' },
  { name: 'Wk 3–4 · Wafers & Nodes',   detail: '200mm vs 300mm · 28-110nm (India\'s target) vs 3–7nm · Photoresists, etchants, CMP, gases', tag: '' },
  { name: 'Wk 5–8 · Pre vs Post Foundry', detail: 'Pre: RTL→tape-out · Fab: 500+ steps · Post (ATMP): assembly/test/pack ← Micron/Kaynes', tag: '' },
  { name: 'SEMI University',           detail: 'Manufacturing Fundamentals (free) + Packaging specialization', tag: 'Free' },
  { name: 'IIT-H VLSI (TCS iON)',      detail: 'Chip design fundamentals', tag: '2mo' },
  { name: 'ASU Semiconductor Processing', detail: 'Graduate certificate, online', tag: '6mo' },
  { name: 'Georgia Tech on Coursera',  detail: 'Semiconductor Devices (free audit)', tag: 'Free' },
];

const LEARN_BIZ = [
  { name: 'Wk 1–2 · Supply Chain Structure', detail: 'TSMC infographic · Equipment→Materials→Foundry→OSAT→Design→End. India building 3–4. Layers 1–2 = opportunity.', tag: '' },
  { name: 'Wk 3–4 · Manufacturing Ops',      detail: 'ASU supply chain courses · Yield management · OEE, MTBF, MTTR', tag: '' },
  { name: 'Wk 5–8 · Go-To-Market',           detail: 'Tessolve/HCL pricing · MSME qualification · Carnegie report · Udyami guide', tag: '' },
  { name: 'On Gujarat Trip',                 detail: 'Ask engineers to explain process flow · Photo every paper form · Interview 20+ MSMEs', tag: 'Critical' },
];

const LEARN_MEDIA = [
  { name: 'YouTube',     detail: 'Asianometry · Branch Education · Sam Zeloof' },
  { name: 'Podcasts',    detail: 'Fabricated Knowledge · Chips and Salsa (SEMI)' },
  { name: 'Newsletters', detail: 'SemiAnalysis · Silicon Sandbox · AnySilicon' },
  { name: 'Books',       detail: 'Chip War · Chips and Change · The Chip · Inside Intel' },
];

const SOURCES = [
  { n: 1,  label: 'ISM',               url: 'https://ism.gov.in/' },
  { n: 2,  label: 'PIB ISM 2.0',       url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2224839' },
  { n: 3,  label: 'Carnegie',          url: 'https://carnegieendowment.org/research/2025/08/indias-semiconductor-mission-the-story-so-far' },
  { n: 4,  label: 'India Briefing',    url: 'https://www.india-briefing.com/news/india-semiconductor-manufacturing-sanand-gujarat-2026-43814.html/' },
  { n: 5,  label: 'CSIS',              url: 'https://www.csis.org/analysis/semiconductor-clusters-making-indias-push-global-competitiveness' },
  { n: 6,  label: 'Udyami MSME Guide', url: 'https://www.udyamidigital.com/india-semiconductor-msme-opportunity-2026/' },
  { n: 7,  label: 'ESSCI',             url: 'https://www.essc-india.org/semicon/' },
  { n: 8,  label: 'SEMICON India',     url: 'https://www.semiconindia.org/' },
  { n: 9,  label: 'SemiConnect GJ',    url: 'https://semiconnect.gujarat.gov.in/' },
  { n: 10, label: 'IESA Vision Summit', url: 'https://iesa-visionsummit.com/' },
  { n: 11, label: 'SEMICON West',      url: 'https://www.semiconwest.org/' },
  { n: 12, label: 'FounderThesis AGNIT', url: 'https://www.founderthesis.com/p/hareesh-chandrasekars-agnit-semiconductors' },
  { n: 13, label: 'Inc42 FermionIC',   url: 'https://inc42.com/buzz/fabless-semiconductor-startup-fermionic-design-nets-6-mn-from-ashish-kacholia-associates/' },
  { n: 14, label: 'VSD',               url: 'https://www.vlsisystemdesign.com/' },
  { n: 15, label: 'VLSI Society India', url: 'https://vsi.org.in/' },
  { n: 16, label: 'NPCS Blog',         url: 'https://npcsblog.com/semiconductor-business-opportunities-in-india/' },
  { n: 17, label: 'Startup India',     url: 'https://www.startupindia.gov.in/content/sih/en/startup-scheme.html' },
  { n: 18, label: 'Gujarat MSME',      url: 'https://msmec.gujarat.gov.in/incentivescheme' },
  { n: 19, label: 'SEMI Uni',          url: 'https://www.semi.org/en/semi-university' },
  { n: 20, label: 'NAMTECH',           url: 'https://www.namtech.ac/programs/master-in-semiconductor-manufacturing-technology-and-management' },
  { n: 21, label: 'Electronica India', url: 'https://electronica-india.com/' },
];

Object.assign(window, {
  SECTIONS, HERO_STATS, MARKET_GROWTH, ECOSYSTEM_MIX, TALENT_GAP, SEGMENT_SIZE,
  REVENUE_PROJECTION, GUJARAT_FACILITIES, COMPETITION, PAIN, STRATEGY,
  NETWORK_FOUNDERS, EVENTS, COMMUNITIES, GROUND, SCHEMES, TIMELINE, RISKS,
  LESSONS, IDEAS, LEARN_TECH, LEARN_BIZ, LEARN_MEDIA, SOURCES,
});
