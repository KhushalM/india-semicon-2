// ─────────────────────────────────────────────
// SECTIONS 2 — COMPETITION + PAIN + STRATEGY
// ─────────────────────────────────────────────

function SectionCompetition() {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState({ key: 'severity', dir: 1 });
  const sevRank = { 'Gap': 0, 'Low': 1, 'Med': 2, 'High': 3 };
  const rows = useMemo(() => {
    let r = COMPETITION.filter(c => {
      if (!q.trim()) return true;
      const n = q.toLowerCase();
      return (c.name + c.body + c.who + c.stage).toLowerCase().includes(n);
    });
    r = [...r].sort((a, b) => {
      let av = a[sort.key], bv = b[sort.key];
      if (sort.key === 'severity') { av = sevRank[av] ?? 0; bv = sevRank[bv] ?? 0; }
      if (av < bv) return -sort.dir;
      if (av > bv) return sort.dir;
      return 0;
    });
    return r;
  }, [q, sort]);
  const toggle = (k) => setSort(s => s.key === k ? { key: k, dir: -s.dir } : { key: k, dir: 1 });
  const sortArrow = (k) => sort.key === k ? (sort.dir === 1 ? ' ↑' : ' ↓') : '';
  const gapCount = COMPETITION.filter(c => c.severity === 'Gap').length;
  return (
    <Section id="s2" num="02" label="Competition" title="The Whitespace" sub="Eight adjacent markets. Six have no Indian player. Sortable, searchable — find your wedge.">
      <PCard
        kicker="Whitespace map · sortable"
        badge={`${gapCount} GAPS`}
        tone="lead"
        variant="data"
        title="Where no"
        dim="Indian player exists"
        body="Click any column to sort. Severity 'Gap' = market has no native integrator. This is where you can build from scratch without competing against an entrenched incumbent."
      >
        <div className="search-bar" style={{marginTop:'1.25rem'}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <input placeholder="Search markets, competitors, descriptions…" value={q} onChange={(e) => setQ(e.target.value)} />
          <span className="count">{rows.length} / {COMPETITION.length}</span>
        </div>
        <table className="dt" style={{boxShadow:'none',marginTop:'1rem'}}>
          <thead>
            <tr>
              <th className={sort.key==='name'?'sorted':''} onClick={()=>toggle('name')}>Market{sortArrow('name')}</th>
              <th className={sort.key==='severity'?'sorted':''} onClick={()=>toggle('severity')}>Severity{sortArrow('severity')}</th>
              <th className={sort.key==='size'?'sorted':''} onClick={()=>toggle('size')}>Size{sortArrow('size')}</th>
              <th>Opportunity</th>
              <th className={sort.key==='who'?'sorted':''} onClick={()=>toggle('who')}>Who's there{sortArrow('who')}</th>
              <th className={sort.key==='stage'?'sorted':''} onClick={()=>toggle('stage')}>Stage{sortArrow('stage')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c, i) => (
              <tr key={i}>
                <td className="nm">{c.name}</td>
                <td><span className={`b ${c.class}`}>{c.severity}</span></td>
                <td className="mono">{c.size}</td>
                <td style={{maxWidth:360}}>{c.body}</td>
                <td>{c.who}</td>
                <td>{c.stage}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan="6" style={{textAlign:'center',padding:'2rem',color:'rgba(255,255,255,.4)'}}>No results</td></tr>}
          </tbody>
        </table>
      </PCard>
    </Section>
  );
}

function PainCard({ p, open, onToggle, idx }) {
  const sevToTone = { 'CRITICAL':'critical','HIGH':'warn','MED':'accent','LOW':'default' };
  const tone = sevToTone[p.severity] || 'default';
  return (
    <div className={`p-card p-pain p-tone-${tone} ${open ? 'p-open' : ''}`} style={{cursor:'default'}}>
      <span className="p-badge">{p.severity}</span>
      <div className="p-head">
        <div className="p-kicker">Pain · {String(idx+1).padStart(2,'0')}</div>
        <h3 className="p-title">{p.title}</h3>
        <div className="p-body" style={{color:'#fff'}}>{p.short}</div>
      </div>
      <div className="p-pain-body" style={{padding: '1.25rem 1.75rem 1.75rem'}}>
        <div style={{
          fontFamily:'var(--serif)',fontStyle:'italic',fontSize:'1rem',lineHeight:1.55,
          color:'rgba(255,255,255,.85)',padding:'1rem 1.1rem',borderLeft:'2px solid rgba(255,255,255,.2)',
          background:'rgba(255,255,255,.03)',borderRadius:'4px',
        }}>
          "{p.quote}"
          <cite style={{display:'block',marginTop:'.6rem',fontSize:'.72rem',color:'rgba(255,255,255,.5)',fontStyle:'normal',fontFamily:'var(--mono)',letterSpacing:'.08em'}}>— {p.cite}</cite>
        </div>
        <div style={{marginTop:'.9rem',fontSize:'.85rem',color:'rgba(255,255,255,.7)',lineHeight:1.6}}>{p.long}</div>
        {p.sources && p.sources.length > 0 && (
          <div style={{marginTop:'.9rem',display:'flex',flexWrap:'wrap',gap:'.5rem'}}>
            {p.sources.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                 style={{fontFamily:'var(--mono)',fontSize:'.68rem',padding:'.3rem .55rem',borderRadius:6,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.75)',textDecoration:'none',letterSpacing:'.04em'}}>
                {s.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionPain() {
  return (
    <Section id="s3" num="03" label="Pain Points" title="What Actually Hurts" sub="Direct quotes, full sources." alt>
      <div className="g2 stagger">
        {PAIN.map((p, i) => <PainCard key={i} p={p} idx={i} open={true} onToggle={() => {}} />)}
      </div>
    </Section>
  );
}

function SectionStrategy() {
  const ILLUS = [IllusAcademy, IllusSupply, IllusAI];
  const TONES = ['lead','accent','violet'];
  const LABELS = ['Workforce','Supply Chain','AI Quality'];
  return (
    <Section id="s4" num="04" label="Entry Strategy" title="The Compound Play" sub="Three layers, sequenced. Each feeds the next — workforce unlocks supplier trust, suppliers unlock AI deployment.">
      <div className="g3 stagger">
        {STRATEGY.map((s, i) => {
          const Illus = ILLUS[i] || IllusAcademy;
          const words = s.title.split(' ');
          return (
            <PCard
              key={i}
              kicker={`Act ${s.num} · ${LABELS[i]}`}
              badge={s.priority}
              tone={TONES[i]}
              variant="hero"
              title={words.slice(0,2).join(' ')}
              dim={words.slice(2).join(' ')}
              meta={[
                {k:'Pricing', v:<span style={{fontFamily:'var(--mono)',fontSize:'.78rem'}}>{s.pricing}</span>},
                {k:'Capex → Revenue', v:<span style={{fontFamily:'var(--mono)',fontSize:'.78rem'}}>{s.capex} → {s.revenueStart}</span>},
              ]}
              art={<Illus />}
              foot={s.notes}
            />
          );
        })}
      </div>
    </Section>
  );
}

Object.assign(window, { SectionCompetition, SectionPain, SectionStrategy });
