// ─────────────────────────────────────────────
// CHARTS — custom SVG, interactive, Recharts-style
// ─────────────────────────────────────────────

// ── useChartTip: tooltip state ────────────────
function useChartTip() {
  const [tip, setTip] = useState(null);
  return { tip, setTip };
}

// ── Skeleton ──────────────────────────────────
function ChartSkeleton({ height = 260 }) {
  return <div className="chart-skeleton" style={{ height, position: 'relative' }} />;
}

// ── BarChart ──────────────────────────────────
function BarChart({ data, height = 260, formatY = (v) => `$${v}B`, yLabel, color = 'rgba(96,165,250,.7)' }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [hover, setHover] = useState(null);
  const pad = { t: 16, r: 12, b: 28, l: 42 };
  const w = 500, h = height;
  const iw = w - pad.l - pad.r, ih = h - pad.t - pad.b;
  const max = Math.ceil(Math.max(...data.map(d => d.y)) * 1.1 / 20) * 20;
  const bw = iw / data.length * 0.68;
  const bgap = iw / data.length * 0.32;
  const yTicks = 4;
  return (
    <div ref={ref} className="chart-wrap" style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} className="chart-axis">
        <g className="chart-grid">
          {Array.from({ length: yTicks + 1 }).map((_, i) => {
            const y = pad.t + (ih / yTicks) * i;
            const v = max - (max / yTicks) * i;
            return (
              <g key={i}>
                <line x1={pad.l} y1={y} x2={w - pad.r} y2={y} />
                <text x={pad.l - 8} y={y + 3} textAnchor="end">{formatY(v)}</text>
              </g>
            );
          })}
        </g>
        {data.map((d, i) => {
          const x = pad.l + (iw / data.length) * i + bgap / 2;
          const bh = inView ? (d.y / max) * ih : 0;
          const y = pad.t + ih - bh;
          const r = Math.min(bw / 2, 999);
          // Rounded-top only path (rx = bw/2 for pill top)
          const topR = Math.min(bw * 0.5, bh);
          const pathD = bh > 0
            ? `M ${x} ${y + topR} Q ${x} ${y} ${x + topR} ${y} L ${x + bw - topR} ${y} Q ${x + bw} ${y} ${x + bw} ${y + topR} L ${x + bw} ${y + bh} L ${x} ${y + bh} Z`
            : '';
          return (
            <g key={i}>
              <path d={pathD} className="bar"
                fill={hover === i ? `rgba(var(--accent-glow),.95)` : color}
                style={{ transition: 'd .9s cubic-bezier(.2,.7,.3,1), fill .15s', transitionDelay: `${i * 60}ms` }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
              <text x={x + bw / 2} y={h - 10} textAnchor="middle">{d.x}</text>
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div className="chart-tip" style={{ left: `${(pad.l + (iw / data.length) * hover + bgap / 2 + bw / 2) / w * 100}%`, top: 10, transform: 'translateX(-50%)' }}>
          <div className="tt-label">{data[hover].x}</div>
          <div className="tt-row"><span>Market</span><span>{formatY(data[hover].y)}</span></div>
        </div>
      )}
    </div>
  );
}

// ── DonutChart ────────────────────────────────
function DonutChart({ data, height = 260 }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [hover, setHover] = useState(null);
  const [hidden, setHidden] = useState(new Set());
  const visible = data.map((d, i) => ({ ...d, i })).filter(d => !hidden.has(d.i));
  const total = visible.reduce((a, b) => a + b.value, 0) || 1;
  const cx = 130, cy = 130, r = 108, rw = 28;
  let acc = 0;
  const arcs = visible.map((d, idx) => {
    const start = acc / total * Math.PI * 2 - Math.PI / 2;
    acc += d.value;
    const end = acc / total * Math.PI * 2 - Math.PI / 2;
    const large = end - start > Math.PI ? 1 : 0;
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end);
    const x3 = cx + (r - rw) * Math.cos(end),   y3 = cy + (r - rw) * Math.sin(end);
    const x4 = cx + (r - rw) * Math.cos(start), y4 = cy + (r - rw) * Math.sin(start);
    return {
      path: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r - rw} ${r - rw} 0 ${large} 0 ${x4} ${y4} Z`,
      color: d.color, label: d.label, value: d.value, i: d.i,
    };
  });
  return (
    <div ref={ref} style={{ display:'grid', gridTemplateColumns:'minmax(180px,220px) 1fr', gap:'1.25rem', alignItems:'center' }}>
      <svg viewBox="0 0 260 260" width="100%" style={{ maxWidth:220, opacity: inView ? 1 : 0, transition: 'opacity .5s' }}>
        {arcs.map((a, i) => (
          <path key={i} d={a.path} fill={a.color}
            opacity={hover !== null && hover !== a.i ? 0.35 : 1}
            onMouseEnter={() => setHover(a.i)}
            onMouseLeave={() => setHover(null)}
            style={{ transition: 'opacity .2s', cursor: 'pointer' }}
          />
        ))}
        <text x={cx} y={cy - 2} textAnchor="middle" fill="#fff" fontSize="34" fontWeight="500" fontFamily="Fraunces, serif" fontStyle="italic" style={{letterSpacing:'-.02em'}}>
          {hover !== null ? `${data[hover].value}%` : '100%'}
        </text>
        <text x={cx} y={cy + 22} textAnchor="middle" fill="rgba(255,255,255,.45)" fontSize="9" fontFamily="Geist Mono, monospace" style={{letterSpacing:'.18em'}}>
          {hover !== null ? data[hover].label.toUpperCase() : 'ECOSYSTEM'}
        </text>
      </svg>
      <div className="chart-legend" style={{ flexDirection:'column', alignItems:'stretch', gap:'.45rem' }}>
        {data.map((d, i) => (
          <div key={i} className={`chart-legend-item donut-leg ${hidden.has(i) ? 'off' : ''}`}
            onClick={() => {
              const n = new Set(hidden);
              n.has(i) ? n.delete(i) : n.add(i);
              setHidden(n);
            }}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <span className="dot" style={{ background: d.color }}></span>
            <span style={{flex:1}}>{d.label}</span>
            <span className="mono" style={{opacity:.75,fontSize:'.78rem'}}>{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── LineChart ─────────────────────────────────
function LineChart({ data, height = 200, formatY = (v) => `$${v}K`, color = '#4ade80' }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [hover, setHover] = useState(null);
  const pad = { t: 16, r: 14, b: 26, l: 46 };
  const w = 500, h = height;
  const iw = w - pad.l - pad.r, ih = h - pad.t - pad.b;
  const max = Math.ceil(Math.max(...data.map(d => d.y)) * 1.1 / 10) * 10;
  const xAt = (i) => pad.l + (iw / (data.length - 1)) * i;
  const yAt = (v) => pad.t + ih - (v / max) * ih;
  const points = data.map((d, i) => `${xAt(i)},${yAt(d.y)}`).join(' ');
  const area = `M ${xAt(0)},${yAt(0)} L ${data.map((d, i) => `${xAt(i)},${yAt(d.y)}`).join(' L ')} L ${xAt(data.length - 1)},${yAt(0)} Z`;
  const pathRef = useRef(null);
  const [pathLen, setPathLen] = useState(1000);
  useEffect(() => { if (pathRef.current) setPathLen(pathRef.current.getTotalLength()); }, []);
  return (
    <div ref={ref} className="chart-wrap" onMouseLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} className="chart-axis">
        <defs>
          <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity="0.25"/>
            <stop offset="1" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <g className="chart-grid">
          {[0, 1, 2, 3, 4].map(i => {
            const y = pad.t + (ih / 4) * i;
            const v = max - (max / 4) * i;
            return (<g key={i}>
              <line x1={pad.l} y1={y} x2={w - pad.r} y2={y} />
              <text x={pad.l - 8} y={y + 3} textAnchor="end">{formatY(v)}</text>
            </g>);
          })}
        </g>
        <path d={area} fill="url(#areaGrad)" opacity={inView ? 1 : 0} style={{ transition: 'opacity .8s .3s' }}/>
        <polyline ref={pathRef} points={points} fill="none" stroke={color} strokeWidth="2.2"
          strokeDasharray={pathLen} strokeDashoffset={inView ? 0 : pathLen}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.2,.7,.3,1)' }}
        />
        {data.map((d, i) => (
          <circle key={i} cx={xAt(i)} cy={yAt(d.y)} r={hover === i ? 6 : 3.5}
            fill={color} stroke="#0b1220" strokeWidth="2"
            style={{ transition: 'r .15s, opacity .8s', opacity: inView ? 1 : 0, transitionDelay: `${800 + i * 80}ms` }}
            onMouseEnter={() => setHover(i)}
          />
        ))}
        {data.map((d, i) => (
          <text key={i} x={xAt(i)} y={h - 8} textAnchor="middle">{d.x}</text>
        ))}
      </svg>
      {hover !== null && (
        <div className="chart-tip" style={{ left: `${xAt(hover) / w * 100}%`, top: `${(yAt(data[hover].y) / h * 100) - 20}%`, transform: 'translate(-50%,-100%)' }}>
          <div className="tt-label">{data[hover].x}</div>
          <div className="tt-row"><span>MRR</span><span>{formatY(data[hover].y)}</span></div>
        </div>
      )}
    </div>
  );
}

// ── StackedGapBar (filled vs gap) ─────────────
function StackedGapBar({ data, height = 260 }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [hover, setHover] = useState(null);
  const pad = { t: 20, r: 12, b: 28, l: 52 };
  const w = 500, h = height;
  const iw = w - pad.l - pad.r, ih = h - pad.t - pad.b;
  const max = Math.ceil(Math.max(...data.map(d => d.filled + (d.gap - d.filled))) * 1.1 / 100) * 100;
  const bw = iw / data.length * 0.65;
  const bgap = iw / data.length * 0.35;
  return (
    <div ref={ref} className="chart-wrap">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} className="chart-axis">
        <g className="chart-grid">
          {[0, 1, 2, 3, 4].map(i => {
            const y = pad.t + (ih / 4) * i;
            const v = max - (max / 4) * i;
            return (<g key={i}>
              <line x1={pad.l} y1={y} x2={w - pad.r} y2={y} />
              <text x={pad.l - 8} y={y + 3} textAnchor="end">{v}K</text>
            </g>);
          })}
        </g>
        {data.map((d, i) => {
          const x = pad.l + (iw / data.length) * i + bgap / 2;
          const totalH = inView ? (d.gap / max) * ih : 0;
          const filledH = inView ? (d.filled / max) * ih : 0;
          return (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={x} y={pad.t + ih - totalH} width={bw} height={totalH - filledH}
                fill="rgba(248,113,113,.5)" rx="2"
                style={{ transition: 'all 1s cubic-bezier(.2,.7,.3,1)', transitionDelay: `${i * 80}ms` }}
              />
              <rect x={x} y={pad.t + ih - filledH} width={bw} height={filledH}
                fill="rgba(74,222,128,.7)" rx="2"
                style={{ transition: 'all 1s cubic-bezier(.2,.7,.3,1)', transitionDelay: `${i * 80 + 100}ms` }}
              />
              <text x={x + bw / 2} y={h - 10} textAnchor="middle">{d.x}</text>
            </g>
          );
        })}
      </svg>
      <div className="chart-legend">
        <div className="chart-legend-item"><span className="dot" style={{background:'rgba(74,222,128,.7)'}}></span>Trained (cumulative, K)</div>
        <div className="chart-legend-item"><span className="dot" style={{background:'rgba(248,113,113,.5)'}}></span>Gap to demand</div>
      </div>
      {hover !== null && (
        <div className="chart-tip" style={{ left: `${(pad.l + (iw / data.length) * hover + bgap / 2 + bw / 2) / w * 100}%`, top: 10, transform: 'translateX(-50%)' }}>
          <div className="tt-label">{data[hover].x}</div>
          <div className="tt-row"><span>Trained</span><span>{data[hover].filled}K</span></div>
          <div className="tt-row"><span>Demand</span><span>{data[hover].gap}K</span></div>
          <div className="tt-row"><span>Shortfall</span><span style={{color:'#f87171'}}>{data[hover].gap - data[hover].filled}K</span></div>
        </div>
      )}
    </div>
  );
}

// ── RangeBar (segment sizes, low → high) ──────
function RangeBar({ data, height = 260 }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [hover, setHover] = useState(null);
  const pad = { t: 8, r: 18, b: 22, l: 110 };
  const w = 500, h = height;
  const iw = w - pad.l - pad.r, ih = h - pad.t - pad.b;
  const max = Math.ceil(Math.max(...data.map(d => d.high)));
  const rowH = ih / data.length;
  const barH = Math.min(rowH * 0.55, 22);
  return (
    <div ref={ref} className="chart-wrap">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} className="chart-axis" preserveAspectRatio="none" style={{height:'100%',minHeight:260}}>
        <g className="chart-grid">
          {[0, 2, 4, 6, 8].map(v => {
            const x = pad.l + (v / max) * iw;
            return (<g key={v}>
              <line x1={x} y1={pad.t} x2={x} y2={pad.t + ih} />
              <text x={x} y={h - 6} textAnchor="middle">${v}B</text>
            </g>);
          })}
        </g>
        {data.map((d, i) => {
          const yMid = pad.t + rowH * i + rowH / 2;
          const y = yMid - barH / 2;
          const x1 = pad.l + (d.low / max) * iw;
          const x2 = pad.l + (d.high / max) * iw;
          return (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <text x={pad.l - 10} y={yMid + 4} textAnchor="end" fontSize="11" fill={hover === i ? '#fff' : 'rgba(255,255,255,.72)'}>{d.x}</text>
              <rect x={pad.l} y={y} width={inView ? iw : 0} height={barH} fill="rgba(255,255,255,.04)" rx={barH/2}
                style={{ transition: 'width 1s', transitionDelay: `${i * 60}ms` }}/>
              <rect x={x1} y={y} width={inView ? x2 - x1 : 0} height={barH}
                fill={hover === i ? `rgba(var(--accent-glow),.9)` : `rgba(var(--accent-glow),.6)`}
                rx={barH/2}
                style={{ transition: 'width 1s cubic-bezier(.2,.7,.3,1), fill .15s', transitionDelay: `${i * 60 + 200}ms` }}/>
              <circle cx={inView ? x1 : pad.l} cy={yMid} r="4" fill="#fff"
                style={{ transition: 'cx 1s', transitionDelay: `${i * 60 + 200}ms` }}/>
              <circle cx={inView ? x2 : pad.l} cy={yMid} r="4" fill="#fff"
                style={{ transition: 'cx 1s', transitionDelay: `${i * 60 + 300}ms` }}/>
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div className="chart-tip" style={{ right: 10, top: 10 }}>
          <div className="tt-label">{data[hover].x}</div>
          <div className="tt-row"><span>2024</span><span>${data[hover].low}B</span></div>
          <div className="tt-row"><span>2030</span><span>${data[hover].high}B</span></div>
          <div className="tt-row"><span>Growth</span><span style={{color:'#4ade80'}}>{((data[hover].high / data[hover].low - 1) * 100).toFixed(0)}%</span></div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { BarChart, DonutChart, LineChart, StackedGapBar, RangeBar, ChartSkeleton });
