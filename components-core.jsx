// ─────────────────────────────────────────────
// CORE COMPONENTS — Nav, Hero, Stats, Tweaks, Kbar, Toast
// ─────────────────────────────────────────────
const { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } = React;

// ── Utility: animated counter ─────────────────
function useCountUp(target, { decimals = 0, duration = 1400, trigger = true } = {}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let raf, start;
    const from = 0, to = target;
    const step = (ts) => {
      if (!start) start = ts;
      const t = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(from + (to - from) * eased);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, trigger]);
  return decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString();
}

// ── Utility: in-view hook ─────────────────────
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setInView(true);
    }, { threshold: 0.15, ...options });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}

// ── Reveal wrapper ────────────────────────────
function Reveal({ children, delay = 0, as = 'div', ...rest }) {
  const [ref, inView] = useInView();
  const Tag = as;
  return (
    <Tag ref={ref} className={`reveal ${inView ? 'v' : ''} ${rest.className || ''}`}
         style={{ transitionDelay: `${delay}ms`, ...rest.style }}>
      {children}
    </Tag>
  );
}

// ── Portrait card (universal shell) ───────────
// Renders the dark-portrait aesthetic used by illus-cards everywhere.
// kicker: mono top label · badge: top-right pill · title + dim: serif headline
// meta: array of {k,v} rows · art: isometric illustration (optional)
// body: prose slot between title and meta · foot: italic footer line
function PCard({ kicker, badge, title, dim, meta, art, foot, body, children, className = '', style, tone = 'default', span = 1, variant = 'default', ...rest }) {
  const ref = useRef(null);
  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`);
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  const metaCols = meta && meta.length > 2 ? meta.length : 2;
  return (
    <div ref={ref} className={`p-card p-${variant} ${tone ? `p-tone-${tone}` : ''} ${className}`}
         style={{gridColumn: span > 1 ? `span ${span}` : undefined, ...style}}
         onMouseMove={onMove} {...rest}>
      {badge && <span className="p-badge">{badge}</span>}
      <div className="p-head">
        {kicker && <div className="p-kicker">{kicker}</div>}
        {title && <h3 className="p-title">{title}{dim && <> <span className="dim">{dim}</span></>}</h3>}
        {body && <div className="p-body">{body}</div>}
        {meta && meta.length > 0 && (
          <div className="p-meta" style={{gridTemplateColumns:`repeat(${Math.min(metaCols,4)},1fr)`}}>
            {meta.map((m, i) => (
              <div key={i}>
                <div className="p-meta-k">{m.k}</div>
                <div className="p-meta-v">{m.v}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {children && <div className="p-content">{children}</div>}
      {art && <div className="p-art">{art}</div>}
      {foot && <div className="p-foot">{foot}</div>}
    </div>
  );
}

// ── Card with cursor-follow glow ──────────────
function Card({ children, className = '', style, ...rest }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`);
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} className={`card ${className}`} style={style} onMouseMove={onMove} {...rest}>
      {children}
    </div>
  );
}

// ── Section scaffold ──────────────────────────
function Section({ id, num, label, title, sub, children, alt }) {
  return (
    <section id={id} className={`section ${alt ? 'section-alt' : ''}`} data-section={id}>
      <div className="container">
        <div className="section-head reveal-head">
          <div>
            <div className="section-label">{num} — {label}</div>
            <h2 className="section-title">{title}</h2>
          </div>
          {sub && <p className="section-sub">{sub}</p>}
        </div>
        <Reveal>{children}</Reveal>
      </div>
    </section>
  );
}

// ── Top Nav with scrollspy + overflow menu ────
function Nav({ active, onJump, onToggleTheme, theme, onOpenKbar, onToggleTweaks, onShare }) {
  const [overflowOpen, setOverflowOpen] = useState(false);
  const visibleLinks = SECTIONS.slice(0, 8);
  const overflowLinks = SECTIONS.slice(8);
  useEffect(() => {
    const close = (e) => { if (!e.target.closest('.nav-overflow-wrap')) setOverflowOpen(false); };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);
  return (
    <nav className="nav">
      <div className="nav-inner">
        <button className="nav-brand" onClick={() => onJump('s0')} style={{border:'none',background:'none',cursor:'pointer',color:'inherit',font:'inherit'}}>
          <span className="nav-brand-mark" aria-label="India Semicon 2.0 wafer mark">
            <svg viewBox="0 0 32 32" width="22" height="22">
              <defs>
                <linearGradient id="waferGradNav" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#FF9933"/>
                  <stop offset=".5" stopColor="#ffffff"/>
                  <stop offset="1" stopColor="#138808"/>
                </linearGradient>
              </defs>
              <circle cx="16" cy="16" r="14" fill="url(#waferGradNav)"/>
              <circle cx="16" cy="16" r="14" fill="none" stroke="rgba(0,0,0,.12)" strokeWidth="1"/>
              {/* notch */}
              <path d="M 16 2 L 14 5 L 18 5 Z" fill="var(--bg,#eaf0f7)" stroke="rgba(0,0,0,.1)" strokeWidth=".5"/>
              {/* die grid */}
              <g stroke="rgba(0,0,40,.22)" strokeWidth=".5" fill="none">
                <line x1="6" y1="16" x2="26" y2="16"/>
                <line x1="16" y1="6" x2="16" y2="26"/>
                <line x1="10" y1="10" x2="22" y2="10"/>
                <line x1="10" y1="22" x2="22" y2="22"/>
                <line x1="10" y1="10" x2="10" y2="22"/>
                <line x1="22" y1="10" x2="22" y2="22"/>
              </g>
              {/* Ashoka Chakra hint — small central wheel */}
              <circle cx="16" cy="16" r="2.3" fill="none" stroke="#0a3c7f" strokeWidth=".8"/>
              <circle cx="16" cy="16" r=".9" fill="#0a3c7f"/>
            </svg>
          </span>
          <span>India Semicon 2.0</span>
        </button>
        <div className="nav-links">
          {visibleLinks.map(s => (
            <button key={s.id}
              className={`nav-link ${active === s.id ? 'active' : ''}`}
              onClick={() => onJump(s.id)}>
              {s.short}
            </button>
          ))}
          {overflowLinks.length > 0 && (
            <div className="nav-overflow-wrap" style={{position:'relative'}}>
              <button
                className={`nav-link ${overflowLinks.some(s => s.id === active) ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setOverflowOpen(o => !o); }}>
                More <span style={{marginLeft:'.25rem',fontSize:'.7rem'}}>▾</span>
              </button>
              {overflowOpen && (
                <div className="nav-overflow">
                  {overflowLinks.map(s => (
                    <button key={s.id}
                      className={`nav-link ${active === s.id ? 'active' : ''}`}
                      onClick={() => { onJump(s.id); setOverflowOpen(false); }}>
                      {s.short}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="nav-actions">
          <button className="nav-btn" onClick={onOpenKbar} title="Search (⌘K)" aria-label="Search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
          <button className="nav-btn" onClick={onToggleTheme} title="Theme" aria-label="Theme">
            {theme === 'dark' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>
            )}
          </button>
          <button className="nav-btn" onClick={onShare} title="Share link to current section" aria-label="Share">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="m16 6-4-4-4 4"/><path d="M12 2v13"/></svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

// ── Hero HUD overlay (NEXA-inspired) ──────────
function HeroHUD() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => (t + 1) % 100), 1200);
    return () => clearInterval(id);
  }, []);
  // Fake live-ish values
  const coord = `22°26'N  72°52'E`;
  const uptime = `${String(Math.floor(tick / 6) + 12).padStart(2, '0')}:${String((tick * 7) % 60).padStart(2, '0')}:${String((tick * 13) % 60).padStart(2, '0')}`;
  const die = 320 + (tick % 7) * 3;

  return (
    <div className="hud">
      <div className="hud-grid"></div>
      <div className="hud-corner tl"></div>
      <div className="hud-corner tr"></div>
      <div className="hud-corner bl"></div>
      <div className="hud-corner br"></div>

      {/* Silicon wafer */}
      <div className="hud-wafer" aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <defs>
            <radialGradient id="waferG" cx="38%" cy="35%">
              <stop offset="0%" stopColor="rgba(255,255,255,.85)"/>
              <stop offset="30%" stopColor="rgba(220,232,248,.55)"/>
              <stop offset="65%" stopColor="rgba(170,200,232,.35)"/>
              <stop offset="100%" stopColor="rgba(90,130,180,.5)"/>
            </radialGradient>
            <radialGradient id="waferRim" cx="50%" cy="50%">
              <stop offset="92%" stopColor="rgba(30,58,95,0)"/>
              <stop offset="98%" stopColor="rgba(30,58,95,.25)"/>
              <stop offset="100%" stopColor="rgba(30,58,95,.55)"/>
            </radialGradient>
            <linearGradient id="waferSheen" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,.28)"/>
              <stop offset="30%" stopColor="rgba(255,200,220,.12)"/>
              <stop offset="55%" stopColor="rgba(180,220,255,.1)"/>
              <stop offset="80%" stopColor="rgba(220,200,255,.1)"/>
              <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
            </linearGradient>
            <clipPath id="waferClip">
              {/* circle with bottom notch */}
              <path d="M 50 4 a 46 46 0 1 1 -12.5 89.7 L 37 96 A 2 2 0 0 1 35 94 L 35 93 A 2 2 0 0 1 37 91 L 37.7 90.7 A 46 46 0 0 1 50 4 Z"/>
            </clipPath>
          </defs>

          {/* wafer body */}
          <g clipPath="url(#waferClip)">
            <circle cx="50" cy="50" r="46" fill="url(#waferG)"/>
            <rect x="0" y="0" width="100" height="100" fill="url(#waferSheen)" opacity=".7"/>

            {/* die grid (rectangular chips across the wafer) */}
            <g stroke="rgba(11,30,58,.22)" strokeWidth=".18" fill="none">
              {Array.from({ length: 13 }).map((_, i) => (
                <line key={`dv${i}`} x1={10 + i * 6.5} y1="4" x2={10 + i * 6.5} y2="96"/>
              ))}
              {Array.from({ length: 13 }).map((_, i) => (
                <line key={`dh${i}`} x1="4" y1={10 + i * 6.5} x2="96" y2={10 + i * 6.5}/>
              ))}
            </g>
            {/* subtle yield coloring on a few dies */}
            <g opacity=".35">
              <rect x="36.5" y="29.5" width="6.5" height="6.5" fill="#2563eb"/>
              <rect x="56.5" y="42.5" width="6.5" height="6.5" fill="#2563eb"/>
              <rect x="49.5" y="62.5" width="6.5" height="6.5" fill="#2563eb"/>
              <rect x="30" y="49.5" width="6.5" height="6.5" fill="#94a3b8"/>
              <rect x="62.5" y="62.5" width="6.5" height="6.5" fill="#94a3b8"/>
            </g>
          </g>

          {/* rim glow */}
          <circle cx="50" cy="50" r="46" fill="none" stroke="url(#waferRim)" strokeWidth="2"/>
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(11,30,58,.5)" strokeWidth=".3"/>

          {/* highlighted die (hot spot) */}
          <rect x="56.5" y="42.5" width="6.5" height="6.5" fill="none" stroke="#2563eb" strokeWidth=".35"/>
          <rect x="55.5" y="41.5" width="8.5" height="8.5" fill="none" stroke="#2563eb" strokeWidth=".2" strokeDasharray=".6 .4"/>

          {/* callout line to a chip */}
          <line x1="62" y1="44" x2="86" y2="28" stroke="rgba(11,30,58,.55)" strokeWidth=".2"/>
          <circle cx="62" cy="44" r=".6" fill="#2563eb"/>
          <text x="87" y="27" fontFamily="var(--mono)" fontSize="2.2" fill="#1e3a5f" letterSpacing=".1">DIE 04·17</text>
          <text x="87" y="30" fontFamily="var(--mono)" fontSize="1.8" fill="rgba(30,58,95,.55)">yield 94.2%</text>
        </svg>
      </div>

      {/* Big central readout (speedo-style number) */}
      <div className="hud-readout">
        <div className="rk">Fab Capacity · Q2</div>
        <div className="rv">{die}<span style={{fontSize:'.45em',opacity:.55,marginLeft:'.1em'}}>K/wk</span></div>
        <div className="ru">Wafer starts · Dholera +Sanand</div>
      </div>

      {/* Floating telemetry panels */}
      <div className="hud-panel p1">
        <div className="pk">Lat/Lon</div>
        <div className="pvs">{coord}</div>
      </div>
      <div className="hud-panel p2">
        <div className="pk">Status</div>
        <div className="pv">● Operational</div>
        <div className="pvs">uptime {uptime}</div>
      </div>
      <div className="hud-panel p3">
        <div className="pk">Yield Index</div>
        <div className="pv">94.{(tick * 3) % 10}%</div>
        <div className="pvs">last 24h · +0.3</div>
      </div>
    </div>
  );
}

// ── Hero ──────────────────────────────────────
function Hero({ headline, heroStyle = 'hud' }) {
  const ref = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (ref.current) ref.current.style.transform = `translateY(${y * 0.3}px) scale(${1 + y * 0.0002})`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <section className="hero" id="s0" data-hero={heroStyle}>
      <div ref={ref} className="hero-bg"></div>
      <div className="hero-tint"></div>
      <div className="hero-fade"></div>
      {heroStyle !== 'minimal' && <HeroHUD />}
      <div className="hero-inner">
        <div>
          <div className="hero-meta">
            <span className="hero-label-dot"></span>
            <span className="hero-label">Business Opportunity · April 2026</span>
          </div>
          <h1 className="hero-title">India Semicon <em>2.0</em></h1>
          <p className="hero-sub">
            An $18.2B buildout across Gujarat. Three entry points — workforce training,
            supply-chain qualification, AI quality — before the fabs come online.
          </p>
          <div className="hero-footline">
            <span>Deep 3-phase analysis</span>
            <span className="dot">·</span>
            <span>21 vetted sources</span>
            <span className="dot">·</span>
            <span>~18 min</span>
          </div>
        </div>
      </div>
      <div className="scroll-cue">
        Scroll
        <svg width="12" height="18" viewBox="0 0 12 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 1v14M1 10l5 5 5-5"/></svg>
      </div>
    </section>
  );
}

// ── StatCard with animated count ──────────────
function StatCard({ label, value, prefix = '', unit = '', decimals = 0, detail, trend, trendClass }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const display = useCountUp(value, { decimals, trigger: inView });
  return (
    <div ref={ref} className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {prefix}{display}<span className="dim">{unit}</span>
      </div>
      <div className="stat-detail">{detail}</div>
      <span className={`stat-trend ${trendClass}`}>{trend}</span>
    </div>
  );
}

// ── Hero stats strip ──────────────────────────
function HeroStats({ statStyle = 'pastel' }) {
  return (
    <div className="stats stagger" data-stat-style={statStyle}>
      {HERO_STATS.map((s, i) => <StatCard key={i} {...s} />)}
    </div>
  );
}

// ── Toast ─────────────────────────────────────
function Toast({ msg, show }) {
  return (
    <div className={`toast ${show ? 'show' : ''}`}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
      {msg}
    </div>
  );
}

// ── Command Palette ───────────────────────────
function Kbar({ open, onClose, onJump }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  const items = useMemo(() => {
    const base = SECTIONS.map(s => ({
      id: s.id, num: s.num, title: s.title, sub: s.short,
    }));
    const extras = [
      { id: 's7', num: '07', title: 'Revenue Projection', sub: '$45K MRR by M12, $150K+ by M24' },
      { id: 's1', num: '01', title: 'Gujarat Facilities', sub: 'Dholera · Sanand · Micron · Kaynes · CG Power' },
      { id: 's6', num: '06', title: 'ISM 2.0 Capital Subsidy', sub: 'Up to ₹5,000Cr · 50% of project cost' },
      { id: 's5', num: '05', title: 'SEMICON India 2026', sub: 'Sep 17–19, New Delhi' },
      { id: 's8', num: '08', title: 'Taiwan · ITRI → TSMC', sub: '30-year ecosystem playbook' },
      { id: 's9', num: '09', title: 'Equipment Knowledge Platform', sub: 'Innovation idea — AI Ops' },
    ];
    const all = [...base, ...extras];
    if (!q.trim()) return all;
    const needle = q.toLowerCase();
    return all.filter(it => (it.title + ' ' + it.sub).toLowerCase().includes(needle));
  }, [q]);
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
    else { setQ(''); setSel(0); }
  }, [open]);
  useEffect(() => { setSel(0); }, [q]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(s + 1, items.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(s - 1, 0)); }
      else if (e.key === 'Enter') {
        const it = items[sel];
        if (it) { onJump(it.id); onClose(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, items, sel, onClose, onJump]);
  if (!open) return null;
  return (
    <div className="kbar-overlay" onClick={onClose}>
      <div className="kbar" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="kbar-input"
          placeholder="Jump to section, search content…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="kbar-results">
          {items.length === 0 && <div className="kbar-empty">No matches</div>}
          {items.map((it, i) => (
            <div key={i} className={`kbar-item ${i === sel ? 'sel' : ''}`}
              onMouseEnter={() => setSel(i)}
              onClick={() => { onJump(it.id); onClose(); }}>
              <div className="kbar-item-num">{it.num}</div>
              <div className="kbar-item-body">
                <div className="kbar-item-title">{it.title}</div>
                <div className="kbar-item-sub">{it.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Tweaks Panel ──────────────────────────────
function TweaksPanel({ open, tweaks, onChange, onClose }) {
  if (!open) return null;
  const acc = [
    { id: 'blue', color: '#2563eb' },
    { id: 'emerald', color: '#059669' },
    { id: 'amber', color: '#d97706' },
    { id: 'violet', color: '#7c3aed' },
  ];
  return (
    <div className="tweaks-panel">
      <h4>
        Tweaks
        <button className="tweaks-close" onClick={onClose} aria-label="Close">×</button>
      </h4>
      <div className="tweaks-row">
        <div className="tweaks-row-label">Accent color</div>
        <div className="tweaks-opts">
          {acc.map(a => (
            <button key={a.id}
              className={`tweaks-swatch ${tweaks.accentColor === a.id ? 'active' : ''}`}
              style={{ background: a.color }}
              onClick={() => onChange('accentColor', a.id)}
              aria-label={a.id}
            />
          ))}
        </div>
      </div>
      <div className="tweaks-row">
        <div className="tweaks-row-label">Hero style</div>
        <div className="tweaks-opts">
          {['hud', 'wafer', 'minimal'].map(s => (
            <button key={s}
              className={`tweaks-opt ${tweaks.heroStyle === s ? 'active' : ''}`}
              onClick={() => onChange('heroStyle', s)}>{s}</button>
          ))}
        </div>
      </div>
      <div className="tweaks-row">
        <div className="tweaks-row-label">Stat cards</div>
        <div className="tweaks-opts">
          {['pastel', 'navy'].map(s => (
            <button key={s}
              className={`tweaks-opt ${tweaks.statStyle === s ? 'active' : ''}`}
              onClick={() => onChange('statStyle', s)}>{s}</button>
          ))}
        </div>
      </div>
      <div className="tweaks-row">
        <div className="tweaks-row-label">Card style</div>
        <div className="tweaks-opts">
          {['sapphire', 'matte', 'glass'].map(s => (
            <button key={s}
              className={`tweaks-opt ${tweaks.cardStyle === s ? 'active' : ''}`}
              onClick={() => onChange('cardStyle', s)}>{s}</button>
          ))}
        </div>
      </div>
      <div className="tweaks-row">
        <div className="tweaks-row-label">Density</div>
        <div className="tweaks-opts">
          {['comfortable', 'compact'].map(d => (
            <button key={d}
              className={`tweaks-opt ${tweaks.density === d ? 'active' : ''}`}
              onClick={() => onChange('density', d)}>{d}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  useCountUp, useInView, Reveal, Card, PCard, Section, Nav, Hero, HeroHUD, HeroStats, StatCard, Toast, Kbar, TweaksPanel,
});
