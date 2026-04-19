// ─────────────────────────────────────────────
// SECTIONS 3 — NETWORKING + SCHEMES + PLAN
// ─────────────────────────────────────────────

function SectionNetworking() {
  const [tab, setTab] = useState('founders');
  const [q, setQ] = useState('');
  return (
    <Section id="s5" num="05" label="Networking & People" title="Who to Reach, Where to Go" sub="Realistic contacts — mid-level founders, community builders, accessible professionals. Not CEOs." alt>
      <div style={{display:'flex',gap:'.35rem',marginBottom:'1rem',flexWrap:'wrap'}}>
        {['founders','events','communities','ground'].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{
              padding:'.5rem .9rem',borderRadius:'9px',
              border:`1px solid ${tab===t?'transparent':'var(--border)'}`,
              background:tab===t?'var(--accent)':'transparent',
              color:tab===t?'#fff':'var(--text-2)',
              fontSize:'.78rem',fontWeight:600,cursor:'pointer',fontFamily:'var(--sans)',
              textTransform:'capitalize',transition:'all .15s'
            }}>
            {t}
          </button>
        ))}
      </div>
      {tab==='founders' && (
        <PCard kicker="Founders · Mid-level, accessible" badge={`${NETWORK_FOUNDERS.length} PEOPLE`} variant="data" tone="accent" title="Who to" dim="DM first" body="Not CEOs. The people running programs, shipping products, and answering DMs within a week.">
          <div className="search-bar" style={{marginTop:'1.25rem'}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            <input placeholder="Search founders, companies…" value={q} onChange={(e)=>setQ(e.target.value)}/>
          </div>
          <table className="dt" style={{boxShadow:'none',marginTop:'1rem'}}>
            <thead><tr><th>Person</th><th>Company</th><th>Focus</th><th>Why reach out</th><th>How</th></tr></thead>
            <tbody>
              {NETWORK_FOUNDERS.filter(f=>!q||JSON.stringify(f).toLowerCase().includes(q.toLowerCase())).map((f,i)=>(
                <tr key={i}>
                  <td className="nm">{f.person} <span style={{fontSize:'.65rem',opacity:.5,marginLeft:'.3rem'}}>{f.tier}</span></td>
                  <td>{f.company}</td>
                  <td style={{maxWidth:240}}>{f.focus}</td>
                  <td style={{maxWidth:220}}>{f.why}</td>
                  <td className="mono" style={{fontSize:'.75rem'}}>{f.how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </PCard>
      )}
      {tab==='events' && (
        <PCard kicker="Events · Where decisions happen" badge={`${EVENTS.length} EVENTS`} variant="data" tone="warn" title="Where to" dim="show up in person">
          <table className="dt" style={{boxShadow:'none',marginTop:'1rem'}}>
            <thead><tr><th>Event</th><th>Dates</th><th>Location</th><th>Why attend</th><th>Status</th></tr></thead>
            <tbody>
              {EVENTS.map((e,i)=>(
                <tr key={i}>
                  <td className="nm">{e.name}</td>
                  <td className="mono" style={{fontSize:'.76rem'}}>{e.dates}</td>
                  <td>{e.where}</td>
                  <td>{e.why}</td>
                  <td><span className={`b ${e.statusClass}`}>{e.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </PCard>
      )}
      {tab==='communities' && (
        <div className="g2">
          <PCard kicker="Online presence" badge="DIGITAL" variant="data" tone="violet" title="Online" dim="Communities">
            <div style={{marginTop:'1rem',display:'flex',flexDirection:'column',gap:'.6rem'}}>
              {COMMUNITIES.map((c,i)=>(
                <div key={i} style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'1rem',padding:'.8rem 1rem',borderRadius:10,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)'}}>
                  <div><div style={{fontFamily:'var(--serif)',color:'#fff',fontSize:'.95rem'}}>{c.name}</div><div style={{fontSize:'.78rem',color:'rgba(255,255,255,.6)',marginTop:'.2rem'}}>{c.detail}</div></div>
                  <span className="b b-a">{c.tag}</span>
                </div>
              ))}
            </div>
          </PCard>
          <PCard kicker="Posting cadence" badge="WEEKLY" variant="data" tone="accent" title="LinkedIn" dim="Strategy">
            <div style={{marginTop:'1rem',fontSize:'.85rem',color:'rgba(255,255,255,.75)',lineHeight:1.7}}>
              <p style={{marginBottom:'.6rem'}}><strong style={{color:'#fff'}}>Follow:</strong> ISM · IESA · SEMI · VSD · Silicon Sandbox · IDTA</p>
              <p style={{marginBottom:'.6rem'}}><strong style={{color:'#fff'}}>Connect:</strong> All founders above + ESSCI team + Gujarat electronics deans + GIDC Sanand</p>
              <p style={{marginBottom:'.6rem'}}><strong style={{color:'#fff'}}>Post weekly:</strong> AI + semiconductor intersection. Event takeaways. #SemiconIndia #MakeInIndia</p>
              <p style={{marginBottom:'.6rem'}}><strong style={{color:'#fff'}}>Engage:</strong> Comment on ISM/IESA posts within first hour.</p>
              <p style={{margin:0}}><strong style={{color:'#fff'}}>Groups:</strong> "Semiconductor Professionals India" (15K+) · "VLSI Design & Verification" (50K+)</p>
            </div>
          </PCard>
        </div>
      )}
      {tab==='ground' && (
        <PCard kicker="Ground network · Gujarat" badge={`${GROUND.length} NODES`} variant="data" tone="lead" title="On-the-ground" dim="Network">
          <div style={{marginTop:'1rem',display:'flex',flexDirection:'column',gap:'.6rem'}}>
            {GROUND.map((g,i)=>(
              <div key={i} style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'1rem',padding:'.8rem 1rem',borderRadius:10,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)'}}>
                <div><div style={{fontFamily:'var(--serif)',color:'#fff',fontSize:'.95rem'}}>{g.name}</div><div style={{fontSize:'.78rem',color:'rgba(255,255,255,.6)',marginTop:'.2rem'}}>{g.detail}</div></div>
                <span className="b b-a">{g.tag}</span>
              </div>
            ))}
          </div>
        </PCard>
      )}
    </Section>
  );
}

function SectionSchemes() {
  const [filter, setFilter] = useState('all');
  const tags = ['all','Central','Gujarat','Karnataka','US'];
  const rows = SCHEMES.filter(s=>filter==='all'||s.tag===filter);
  return (
    <Section id="s6" num="06" label="Govt Schemes & Numbers" title="Money on the Table" sub="₹8,000Cr+ of incentives across central and state. Filter by jurisdiction.">
      <div style={{display:'flex',gap:'.35rem',marginBottom:'.85rem',flexWrap:'wrap'}}>
        {tags.map(t=>(
          <button key={t} onClick={()=>setFilter(t)}
            style={{padding:'.4rem .8rem',borderRadius:'8px',border:`1px solid ${filter===t?'transparent':'var(--border)'}`,
              background:filter===t?'var(--accent)':'transparent',color:filter===t?'#fff':'var(--text-2)',
              fontSize:'.75rem',fontWeight:600,cursor:'pointer',fontFamily:'var(--sans)',textTransform:'capitalize'}}>
            {t}
          </button>
        ))}
      </div>
      <PCard kicker={`Programs · ${filter==='all'?'All jurisdictions':filter}`} badge={`${rows.length} / ${SCHEMES.length}`} variant="data" tone="lead" title="Money on" dim="the table" body="ISM 2.0 has been running for years. Most founders still don't know what they qualify for. Here's every active program with amounts and eligibility.">
        <table className="dt" style={{boxShadow:'none',marginTop:'1rem'}}>
          <thead><tr><th>Scheme</th><th>What you get</th><th>Amount</th><th>Eligibility</th><th>Tag</th></tr></thead>
          <tbody>
            {rows.map((s,i)=>(
              <tr key={i}>
                <td className="nm">{s.name}</td>
                <td>{s.get}</td>
                <td className="mono" style={{color:'#86efac',fontWeight:600}}>{s.amt}</td>
                <td>{s.who}</td>
                <td><span className="b b-a">{s.tag}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </PCard>
    </Section>
  );
}

function SectionPlan() {
  const [hover, setHover] = useState(null);
  return (
    <Section id="s7" num="07" label="The Plan" title="Month-by-Month" sub="A 24-month runway from learning to $150K+ MRR. Hover each phase for milestones." alt>
      <div className="g2">
        <PCard kicker="Timeline · 24 months" badge="4 PHASES" variant="data" tone="violet" title="The" dim="Runway" body="Each phase funds the next. Month 0 is right now — skills stacking, picking people to DM. Month 24 is your first enterprise contract.">
          <div className="tl" style={{marginTop:'1rem'}}>
            {TIMELINE.map((t,i)=>(
              <div key={i} className="ti" onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(null)}>
                <div className="ti-label">{t.label}</div>
                <div className="ti-title">{t.title}</div>
                <ul className="ti-tasks">
                  {t.tasks.map((task,j)=>(<li key={j}>{task}</li>))}
                </ul>
                {hover===i && (
                  <div className="ti-milestones">
                    {t.milestones.map((m,j)=>(<span key={j} className="ti-m">✓ {m}</span>))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{marginTop:'1.75rem',paddingTop:'1.5rem',borderTop:'1px solid rgba(255,255,255,.08)'}}>
            <div style={{fontFamily:'var(--mono)',fontSize:'.6rem',letterSpacing:'.14em',textTransform:'uppercase',color:'rgba(255,255,255,.45)',marginBottom:'1rem'}}>Revenue checkpoints · $0 → $150K MRR</div>
            <svg viewBox="0 0 400 240" width="100%" style={{color:'rgba(255,255,255,.85)',display:'block'}} fill="none" stroke="currentColor" strokeLinejoin="round" strokeLinecap="round">
              {/* iso grid floor */}
              <g opacity=".28" strokeWidth=".5">
                {Array.from({length:18}).map((_,i)=>(
                  <g key={i}>
                    <line x1={-60+i*28} y1="170" x2={140+i*28} y2="250" />
                    <line x1={-60+i*28} y1="250" x2={140+i*28} y2="170" />
                  </g>
                ))}
              </g>
              {/* iso platform */}
              <g transform="translate(30 150)" strokeWidth="1.2">
                <path d="M 0 40 L 170 0 L 340 40 L 170 80 Z" opacity=".55"/>
                <path d="M 0 40 L 0 52 L 170 92 L 170 80" opacity=".55"/>
                <path d="M 340 40 L 340 52 L 170 92" opacity=".55"/>
              </g>
              {/* rising bars (checkpoints as iso blocks) */}
              {[
                {x:60, h:8,  m:'M0',  v:'$0',   c:'Today'},
                {x:130,h:28, m:'M6',  v:'$2K',  c:'First $'},
                {x:200,h:58, m:'M12', v:'$10K', c:'Repeatable'},
                {x:270,h:92, m:'M18', v:'$50K', c:'Team hires'},
                {x:340,h:130,m:'M24', v:'$150K',c:'Enterprise'},
              ].map((p,i)=>{
                const base = 190 - (p.x-60)*.15; // iso y baseline on platform
                const top  = base - p.h;
                const w = 22;
                return (
                  <g key={i} strokeWidth="1.2">
                    {/* block: top face + front + side */}
                    <path d={`M ${p.x-w} ${top+10} L ${p.x} ${top} L ${p.x+w} ${top+10} L ${p.x} ${top+20} Z`}/>
                    <path d={`M ${p.x-w} ${top+10} L ${p.x-w} ${base+10} L ${p.x} ${base+20} L ${p.x} ${top+20}`}/>
                    <path d={`M ${p.x+w} ${top+10} L ${p.x+w} ${base+10} L ${p.x} ${base+20}`}/>
                    {/* hatch on top */}
                    <g opacity=".5" strokeWidth=".6">
                      {[.2,.4,.6,.8].map((t,j)=>(
                        <line key={j} x1={p.x-w+w*t} y1={top+10-10*t} x2={p.x+w*t} y2={top+20-10*t}/>
                      ))}
                    </g>
                    {/* label above */}
                    <text x={p.x} y={top-8} textAnchor="middle" fontFamily="Fraunces" fontSize="16" fontWeight="500" fill="currentColor" stroke="none" letterSpacing="-.3">{p.v}</text>
                    {/* month below */}
                    <text x={p.x} y={base+34} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8.5" fill="currentColor" opacity=".55" stroke="none" letterSpacing="1">{p.m}</text>
                    <text x={p.x} y={base+46} textAnchor="middle" fontFamily="Fraunces" fontSize="9" fontStyle="italic" fill="currentColor" opacity=".45" stroke="none">{p.c}</text>
                    {/* projection dashes for last 3 */}
                    {i>1 && (
                      <g opacity=".35" strokeDasharray="2 3" strokeWidth=".7">
                        <line x1={p.x} y1={top-20} x2={p.x} y2="20"/>
                      </g>
                    )}
                  </g>
                );
              })}
              {/* bracket for $150K */}
              <g strokeWidth=".8" opacity=".6">
                <line x1="362" y1="58" x2="362" y2="200"/>
                <line x1="358" y1="58" x2="366" y2="58"/>
                <line x1="358" y1="200" x2="366" y2="200"/>
                <text x="372" y="132" fontFamily="JetBrains Mono" fontSize="8" fill="currentColor" stroke="none" opacity=".7" letterSpacing="1">150×</text>
              </g>
            </svg>
          </div>
        </PCard>
        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          <PCard kicker="Revenue · MRR ($K)" badge="PROJECTION" variant="data" tone="lead" title="Revenue" dim="Projection">
            <div style={{marginTop:'.75rem'}}>
              <LineChart data={REVENUE_PROJECTION} />
            </div>
          </PCard>
          <PCard kicker="Unit economics · Target" badge="HEALTHY" variant="data" tone="accent" title="Unit" dim="Economics">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginTop:'1rem'}}>
              {[
                {k:'CAC',v:'$200',s:'–500'},
                {k:'LTV',v:'$3',s:'–15K'},
                {k:'LTV:CAC',v:'8',s:':1'},
                {k:'Margin',v:'65',s:'–80%'},
              ].map((u,i)=>(
                <div key={i} style={{padding:'.85rem 1rem',borderRadius:10,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)'}}>
                  <div style={{fontFamily:'var(--mono)',fontSize:'.62rem',letterSpacing:'.14em',textTransform:'uppercase',color:'rgba(255,255,255,.5)'}}>{u.k}</div>
                  <div style={{fontFamily:'var(--serif)',fontSize:'1.6rem',fontWeight:500,color:'#fff',marginTop:'.3rem',letterSpacing:'-.02em',lineHeight:1}}>
                    {u.v}<span style={{color:'rgba(255,255,255,.35)',fontWeight:400}}>{u.s}</span>
                  </div>
                </div>
              ))}
            </div>
          </PCard>
          <PCard kicker="Risk register · What could kill this" badge={`${RISKS.length} RISKS`} variant="data" tone="critical" title="Risks" dim="& mitigations">
            <div style={{marginTop:'1rem',display:'flex',flexDirection:'column',gap:'.8rem'}}>
              {RISKS.map((r,i)=>(
                <div key={i} style={{display:'flex',flexDirection:'column',gap:'.4rem',padding:'.8rem 1rem',borderRadius:10,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'.75rem'}}>
                    <div>
                      <div style={{fontFamily:'var(--serif)',color:'#fff',fontSize:'.95rem'}}>{r.name}</div>
                      <div style={{fontSize:'.78rem',color:'rgba(255,255,255,.6)',marginTop:'.2rem',lineHeight:1.5}}>{r.detail}</div>
                    </div>
                    <span className={`b ${r.tagClass}`}>{r.level}</span>
                  </div>
                  <div className="risk-bar" style={{'--w':`${r.w}%`,'--c':r.c}}></div>
                </div>
              ))}
            </div>
          </PCard>
        </div>
      </div>
    </Section>
  );
}

Object.assign(window, { SectionNetworking, SectionSchemes, SectionPlan });
