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
        </div>
      </div>
    </nav>
  );
}

// ── Hero HUD overlay (NEXA-inspired) ──────────
// Interactive wafer: drag to spin, hover to tilt (3D), click a die to inspect
function InteractiveWafer() {
  const wrapRef = useRef(null);
  const [rot, setRot] = useState(0);              // Z-axis spin (around wafer center)
  const [orbit, setOrbit] = useState({x:30, y:0}); // X = pitch (tip forward/back), Y = yaw (spin around vertical)
  const [hover, setHover] = useState({x:0, y:0});  // subtle cursor-follow tilt on top
  const [pick, setPick] = useState(null);
  const dragRef = useRef({dragging:false, lastX:0, lastY:0, velocity:0, vx:0, vy:0, moved:0});
  const rotRef = useRef(rot);
  const orbitRef = useRef(orbit);
  rotRef.current = rot;
  orbitRef.current = orbit;

  // Inertia + idle drift
  useEffect(() => {
    let raf;
    const tick = () => {
      const d = dragRef.current;
      if (!d.dragging){
        // Z-axis inertia + slow continuous drift
        const nextRot = rotRef.current + d.velocity + 0.15;
        d.velocity *= 0.96;
        if (Math.abs(d.velocity) < 0.005) d.velocity = 0;
        setRot(nextRot);
        // Orbit inertia — decays and eases back toward base tilt
        const o = orbitRef.current;
        const nextY = o.y + d.vy;
        const nextX = o.x + d.vx;
        d.vx *= 0.94; d.vy *= 0.94;
        if (Math.abs(d.vx) < 0.01) d.vx = 0;
        if (Math.abs(d.vy) < 0.01) d.vy = 0;
        setOrbit({x:nextX, y:nextY});
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragRef.current = {dragging:true, lastX:e.clientX, lastY:e.clientY, velocity:0, vx:0, vy:0, moved:0};
  };
  const onPointerMove = (e) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // Subtle cursor-follow tilt (always on)
    const nx = ((e.clientX - r.left)/r.width - 0.5) * 2;
    const ny = ((e.clientY - r.top)/r.height - 0.5) * 2;
    setHover({x:Math.max(-1,Math.min(1,nx)), y:Math.max(-1,Math.min(1,ny))});

    const d = dragRef.current;
    if (d.dragging){
      const dx = e.clientX - d.lastX;
      const dy = e.clientY - d.lastY;
      // horizontal drag → yaw (rotate around vertical axis)
      // vertical drag   → pitch (tip forward/back)
      const yaw   = dx * 0.6;
      const pitch = -dy * 0.6;
      d.vx = pitch; d.vy = yaw;
      d.lastX = e.clientX; d.lastY = e.clientY;
      d.moved += Math.abs(dx) + Math.abs(dy);
      setOrbit(o => ({x:o.x + pitch, y:o.y + yaw}));
    }
  };
  const onPointerUp = () => { dragRef.current.dragging = false; };
  const onPointerLeave = () => {
    dragRef.current.dragging = false;
    setHover({x:0,y:0});
  };

  // 13x13 die grid. Compute list of dies within the wafer circle.
  const dies = useMemo(() => {
    const list = [];
    const DIE_TYPES = [
      {kind:'Logic · 7nm', c:'#2563eb', weight:3},
      {kind:'I/O · 28nm',  c:'#60a5fa', weight:2},
      {kind:'Memory',      c:'#7c3aed', weight:2},
      {kind:'Analog',      c:'#f59e0b', weight:2},
      {kind:'Defect',      c:'#ef4444', weight:1, defect:true},
    ];
    const pool = DIE_TYPES.flatMap(t => Array(t.weight).fill(t));
    let seed = 17;
    const rng = () => { seed = (seed * 9301 + 49297) % 233280; return seed/233280; };
    for (let r=0;r<13;r++){
      for (let c=0;c<13;c++){
        const x = 10 + c*6.5, y = 10 + r*6.5;
        const cx = x + 3.25, cy = y + 3.25;
        const d = Math.hypot(cx-50, cy-50);
        if (d > 43) continue;
        const t = pool[Math.floor(rng()*pool.length)];
        const yld = t.defect ? 0 : Math.round(88 + rng()*11);
        list.push({c:cx, r:cy, x, y, col:c, row:r, kind:t.kind, color:t.c, defect:!!t.defect, yield:yld});
      }
    }
    return list;
  }, []);

  const pickTimerRef = useRef(null);
  const justPickedRef = useRef(false);
  // Use pointerdown so it fires before drag/click-clear logic
  const onDieDown = (e, d) => {
    e.stopPropagation();
    setPick(d);
    justPickedRef.current = true;
    if (pickTimerRef.current) clearTimeout(pickTimerRef.current);
    pickTimerRef.current = setTimeout(() => setPick(null), 5000);
  };
  useEffect(() => () => { if (pickTimerRef.current) clearTimeout(pickTimerRef.current); }, []);

  // Compose transform: orbit (from drag) + subtle hover modulation
  // orbit.x = pitch (tip forward/back), orbit.y = yaw (spin around vertical)
  const tiltX = orbit.x + hover.y * -4;
  const tiltY = orbit.y + hover.x * 4;
  const sheenX = 30 + hover.x * 25;
  const sheenY = 30 + hover.y * 25;

  return (
    <div
      ref={wrapRef}
      className="hud-wafer interactive"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={onPointerLeave}
      onClick={() => {
        if (justPickedRef.current) { justPickedRef.current = false; return; }
        if (dragRef.current.moved < 2) {
          if (pickTimerRef.current) clearTimeout(pickTimerRef.current);
          setPick(null);
        }
      }}
      style={{
        perspective: '900px',
        cursor: dragRef.current.dragging ? 'grabbing' : 'grab'
      }}
    >
      <div
        className="hud-wafer-inner"
        style={{
          transform:`rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transition: 'transform .15s ease-out',
          width:'100%', height:'100%',
          transformStyle:'preserve-3d',
          position:'relative'
        }}
      >
        {/* thickness edge: a dark ring translated back on Z so the bottom rim shows through the perspective tilt */}
        <svg viewBox="0 0 100 100" style={{position:'absolute',inset:0,overflow:'visible',transform:'translateZ(-4px)',pointerEvents:'none'}}>
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(20,25,32,.55)" strokeWidth="1.2"/>
        </svg>
        <svg viewBox="0 0 100 100" style={{position:'absolute',inset:0,overflow:'visible',transform:'translateZ(-2px)',pointerEvents:'none'}}>
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(20,25,32,.35)" strokeWidth=".8"/>
        </svg>
        <svg viewBox="0 0 100 100" style={{overflow:'visible',position:'relative'}}>
          <defs>
            <clipPath id="waferClip">
              <circle cx="50" cy="50" r="46"/>
            </clipPath>
          </defs>

          {/* Rotating group contains everything that should spin with the wafer */}
          <g transform={`rotate(${rot} 50 50)`}>
            {/* invisible hit area painted FIRST so dies (painted after) receive events first */}
            <circle cx="50" cy="50" r="46" fill="rgba(255,255,255,.001)" style={{pointerEvents:'auto'}}/>
            <g clipPath="url(#waferClip)">
              {/* no fill — see-through body */}
              {/* subtle concentric polish rings */}
              <g fill="none" stroke="rgba(20,25,32,.08)" strokeWidth=".15">
                <circle cx="50" cy="50" r="38"/>
                <circle cx="50" cy="50" r="28"/>
                <circle cx="50" cy="50" r="18"/>
              </g>
              {/* die grid */}
              <g stroke="rgba(20,25,32,.35)" strokeWidth=".15" fill="none">
                {Array.from({length:13}).map((_,i)=>(
                  <line key={`dv${i}`} x1={10+i*6.5} y1="4" x2={10+i*6.5} y2="96"/>
                ))}
                {Array.from({length:13}).map((_,i)=>(
                  <line key={`dh${i}`} x1="4" y1={10+i*6.5} x2="96" y2={10+i*6.5}/>
                ))}
              </g>

              {/* clickable dies — mostly invisible; a sprinkle of translucent ones for texture */}
              <g>
                {dies.map((d, i) => {
                  const selected = pick && pick.col===d.col && pick.row===d.row;
                  // deterministic sprinkle: ~15% of cells get a faint fill
                  const sprinkle = ((d.col*7 + d.row*13) % 7) === 0;
                  let fill = 'transparent';
                  let opacity = 1;
                  if (selected) { fill = d.color; opacity = .85; }
                  else if (d.defect) { fill = '#64707e'; opacity = .35; }
                  else if (sprinkle) { fill = '#94a3b8'; opacity = .12; }
                  return (
                    <rect key={i}
                      x={d.x+0.2} y={d.y+0.2} width="6.1" height="6.1"
                      fill={fill}
                      opacity={opacity}
                      stroke={selected ? d.color : 'none'}
                      strokeWidth={selected ? .5 : 0}
                      style={{cursor:'pointer',pointerEvents:'auto'}}
                      onPointerDown={(e)=>onDieDown(e,d)}
                    />
                  );
                })}
              </g>

              {/* crosshair on picked */}
              {pick && (
                <g pointerEvents="none">
                  <rect x={pick.x-1} y={pick.y-1} width="8.5" height="8.5"
                    fill="none" stroke={pick.color} strokeWidth=".3" strokeDasharray=".6 .4"/>
                </g>
              )}
            </g>

            {/* orientation notch */}
            <path d="M 46.5 95.9 L 50 92.5 L 53.5 95.9 Z" fill="none" stroke="rgba(20,25,32,.45)" strokeWidth=".25" strokeLinejoin="round"/>

            {/* rim */}
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(20,25,32,.4)" strokeWidth=".5" pointerEvents="none"/>
          </g>

        </svg>
      </div>
      {/* Inspect card — rendered OUTSIDE the 3D-transformed inner so it stays upright regardless of wafer angle */}
      {pick && (
        <div className="wafer-card" style={{
          position:'absolute', top:'4%', right:'-2%',
          background:'rgba(255,255,255,.95)',
          border:'1px solid rgba(20,25,32,.18)',
          borderRadius:6,
          padding:'.55rem .7rem',
          minWidth:150,
          boxShadow:'0 4px 16px rgba(20,40,80,.12)',
          pointerEvents:'none',
          fontFamily:'var(--mono)'
        }}>
          <div style={{fontSize:'.58rem',letterSpacing:'.12em',color:'#1e3a5f',textTransform:'uppercase'}}>{`Die ${String(pick.col).padStart(2,'0')}·${String(pick.row).padStart(2,'0')}`}</div>
          <div style={{fontFamily:'var(--serif)',fontStyle:'italic',fontSize:'1rem',color:pick.color,marginTop:2}}>{pick.kind}</div>
          <div style={{fontSize:'.62rem',color:'rgba(30,58,95,.7)',marginTop:2}}>{pick.defect ? 'Status: REJECT' : `Yield ${pick.yield}%`}</div>
        </div>
      )}
      <div className="hud-wafer-hint">drag to spin · click a die</div>
    </div>
  );
}

function HeroHUD() {
  return (
    <div className="hud">
      <InteractiveWafer />
    </div>
  );
}

// ── Hero ──────────────────────────────────────
function Hero({ headline }) {
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
    <section className="hero" id="s0" data-hero="wafer">
      <div ref={ref} className="hero-bg"></div>
      <div className="hero-tint"></div>
      <div className="hero-fade"></div>
      <HeroHUD />
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
