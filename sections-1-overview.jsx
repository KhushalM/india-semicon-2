// ─────────────────────────────────────────────
// SECTIONS 1 — OVERVIEW (TL;DR) + MARKET
// ─────────────────────────────────────────────

function SectionOverview() {
  return (
    <section className="section" id="s0-tldr">
      <div className="container">
        <div style={{display:'grid',gridTemplateColumns:'1.3fr 1fr',gap:'1.25rem',marginTop:'2.5rem'}} className="tldr-wrap">
          <Reveal>
            <PCard
              kicker="TL;DR · The Thesis"
              badge="OPPORTUNITY"
              tone="accent"
              variant="hero"
              title="Everyone chases the"
              dim="fab itself"
              body={<>
                <p style={{margin:0,fontFamily:'var(--serif)',fontSize:'1.25rem',lineHeight:1.4,color:'rgba(255,255,255,.9)',fontWeight:400}}>
                  India is building $18.2B of fabs in Gujarat. The opportunity is the <em style={{color:'#93c5fd',fontStyle:'italic'}}>ecosystem around it</em> — workforce, supply chain, AI quality — and it's wide open.
                </p>
                <p style={{marginTop:'1rem',marginBottom:0,fontSize:'.85rem',lineHeight:1.65,color:'rgba(255,255,255,.6)'}}>
                  ISM 2.0 allocated ₹8,000Cr to ancillary programs. Fabs need ~350K trained workers, 100+ certified local suppliers, and zero-defect AI inspection. None of these have an integrator today.
                </p>
              </>}
              meta={[
                {k:'Entry Capital', v:'$20–80K'},
                {k:'First Revenue', v:'Month 3–4'},
                {k:'Geography', v:'Gujarat'},
                {k:'Gap', v:'No integrator'},
              ]}
              foot="Anchor on workforce first. Everything else compounds."
            />
          </Reveal>
          <Reveal delay={100}>
            <PCard
              kicker="Strategy · Three Acts"
              badge="PLAYBOOK"
              tone="lead"
              variant="hero"
              title="The 3-Act"
              dim="Compound"
              body="Each layer funds and informs the next. Workforce trains you on the customers. Supply chain earns their trust. AI scales what you learned."
            >
              <div style={{display:'flex',flexDirection:'column',gap:'.85rem',marginTop:'1.25rem'}}>
                {STRATEGY.map((s,i)=>(
                  <div key={i} style={{
                    display:'grid',gridTemplateColumns:'auto 1fr auto',gap:'.9rem',alignItems:'start',
                    padding:'.9rem 1rem',borderRadius:10,
                    background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)'
                  }}>
                    <div style={{fontFamily:'var(--mono)',fontSize:'.7rem',color:'rgba(255,255,255,.4)',paddingTop:'.15rem'}}>
                      {String(i+1).padStart(2,'0')}
                    </div>
                    <div style={{minWidth:0}}>
                      <div style={{fontFamily:'var(--serif)',fontSize:'1.05rem',fontWeight:500,color:'#fff',marginBottom:'.25rem'}}>{s.title}</div>
                      <div style={{fontSize:'.8rem',color:'rgba(255,255,255,.65)',lineHeight:1.5}}>
                        {s.body} <span style={{color:'#86efac'}}>· Revenue {s.revenueStart}</span>
                      </div>
                    </div>
                    <span className={`b ${s.class}`}>{s.priority}</span>
                  </div>
                ))}
              </div>
            </PCard>
          </Reveal>
        </div>
      </div>
      <style>{`@media(max-width:900px){.tldr-wrap{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

function SectionMarket() {
  return (
    <Section id="s1" num="01" label="Market" title="The $120B Buildout" sub="18% CAGR, Gujarat epicenter. ISM 2.0 explicitly targets the ancillary ecosystem — where the first-movers win 10-year contracts." alt>
      <div className="g2" style={{marginBottom:'1rem'}}>
        <PCard
          kicker="Market Size · 2022 → 2030"
          badge="$120B"
          variant="data"
          title="India Semi"
          dim="Market ($B)"
          tone="accent"
        >
          <BarChart data={MARKET_GROWTH} />
        </PCard>
        <PCard
          kicker="Where the value lives"
          badge="% OF VALUE"
          variant="data"
          title="Ecosystem"
          dim="Mix"
        >
          <DonutChart data={ECOSYSTEM_MIX} />
        </PCard>
      </div>
      <div className="g2" style={{marginBottom:'1rem'}}>
        <PCard
          kicker="Segment Growth · 2024 → 2030"
          badge="$B"
          variant="data"
          title="Segment"
          dim="Size"
        >
          <RangeBar data={SEGMENT_SIZE} />
          <div style={{marginTop:'1.25rem',paddingTop:'1rem',borderTop:'1px solid rgba(255,255,255,.08)',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'.9rem'}}>
            {[
              {k:'BIGGEST MOVER',v:'Chemicals',s:'+195%'},
              {k:'LARGEST BY 2030',v:'Equipment',s:'$7.8B'},
              {k:'TOTAL GROWTH',v:'2.3×',s:'6 yrs'},
            ].map((u,i)=>(
              <div key={i} style={{padding:'.7rem .85rem',borderRadius:10,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)'}}>
                <div style={{fontFamily:'var(--mono)',fontSize:'.58rem',letterSpacing:'.12em',color:'rgba(255,255,255,.5)',textTransform:'uppercase',marginBottom:'.25rem'}}>{u.k}</div>
                <div style={{fontFamily:'var(--serif)',fontSize:'1.1rem',color:'#fff',fontWeight:500,letterSpacing:'-.015em',lineHeight:1.1}}>{u.v}</div>
                <div style={{fontFamily:'var(--mono)',fontSize:'.72rem',color:'rgb(var(--accent-glow))',marginTop:'.2rem',letterSpacing:'.04em'}}>{u.s}</div>
              </div>
            ))}
          </div>
          <svg viewBox="0 0 400 180" width="100%" style={{marginTop:'1.25rem',color:'rgba(255,255,255,.85)',display:'block'}} fill="none" stroke="currentColor" strokeLinejoin="round" strokeLinecap="round">
            {/* iso grid floor */}
            <g opacity=".25" strokeWidth=".5">
              {Array.from({length:16}).map((_,i)=>(
                <g key={i}>
                  <line x1={-40+i*28} y1="120" x2={160+i*28} y2="200" />
                  <line x1={-40+i*28} y1="200" x2={160+i*28} y2="120" />
                </g>
              ))}
            </g>
            {/* iso platform */}
            <g transform="translate(30 105)" strokeWidth="1.2">
              <path d="M 0 35 L 170 0 L 340 35 L 170 70 Z" opacity=".5"/>
              <path d="M 0 35 L 0 46 L 170 81 L 170 70" opacity=".5"/>
              <path d="M 340 35 L 340 46 L 170 81" opacity=".5"/>
            </g>
            {/* trajectory arrow climbing the iso platform */}
            <g strokeWidth="1.4">
              <path d="M 55 135 Q 160 120 220 80 T 360 20" />
              {/* dots along */}
              {[{x:55,y:135},{x:145,y:115},{x:220,y:80},{x:295,y:50},{x:360,y:20}].map((p,i)=>(
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="3" fill="currentColor" stroke="none"/>
                  <circle cx={p.x} cy={p.y} r="7" strokeWidth=".7" opacity=".4"/>
                </g>
              ))}
              {/* arrowhead */}
              <path d="M 360 20 L 352 14 M 360 20 L 356 28" strokeWidth="1.2"/>
            </g>
            {/* year labels */}
            <g fill="currentColor" stroke="none" fontFamily="JetBrains Mono" fontSize="9" opacity=".55" letterSpacing="1">
              <text x="45" y="160" textAnchor="middle">2024</text>
              <text x="360" y="160" textAnchor="middle">2030</text>
            </g>
            {/* bracket showing 2.3× on right */}
            <g strokeWidth=".8" opacity=".6">
              <line x1="380" y1="20" x2="380" y2="135"/>
              <line x1="376" y1="20" x2="384" y2="20"/>
              <line x1="376" y1="135" x2="384" y2="135"/>
            </g>
            <text x="380" y="84" fontFamily="JetBrains Mono" fontSize="9" fill="currentColor" stroke="none" opacity=".75" textAnchor="start" dx="6" letterSpacing="1">2.3×</text>
            {/* label: TAM trajectory */}
            <text x="55" y="22" fontFamily="JetBrains Mono" fontSize="8" fill="currentColor" stroke="none" opacity=".5" letterSpacing="1.5">TAM · $103B → $230B+</text>
          </svg>
        </PCard>
        <PCard
          kicker="Gujarat Cluster · Interactive"
          badge="YOUR BACKYARD"
          tone="warn"
          variant="data"
          title="Where to"
          dim="Show Up"
        >
          <IndiaMap />
        </PCard>
      </div>
      <div className="g3 stagger" style={{marginBottom:'1rem'}}>
        <PCard
          kicker="Geography"
          badge="CRITICAL"
          tone="critical"
          variant="hero"
          title="Gujarat"
          dim="Corridor"
          meta={[
            {k:'Who', v:'Dholera ($11B Tata) + Sanand (Micron, Kaynes, CG Power). INOX Air ₹500Cr gas facility live.'}
          ]}
          art={<IllusCorridor />}
        />
        <PCard
          kicker="Workforce"
          badge="CRITICAL"
          tone="critical"
          variant="hero"
          title="350K"
          dim="Talent Gap"
          meta={[
            {k:'Status', v:'C2S: 43K trained of 85K target. ESSCI has cleanroom QPs, few partners. 1M jobs needed by 2027.'}
          ]}
          art={<IllusTalent />}
        />
        <PCard
          kicker="Capital"
          badge="HIGH"
          tone="warn"
          variant="hero"
          title="ISM 2.0"
          dim="Ancillary"
          meta={[
            {k:'Program', v:'₹8,000Cr modified program. Materials $2.44B → $4.92B by 2030. PLI 15–25% for MSMEs.'}
          ]}
          art={<IllusCapital />}
        />
      </div>
      <PCard
        kicker="Facilities · Ranked by committed capital"
        badge="4 SITES · ~$17B"
        variant="data"
        title="Gujarat"
        dim="Facilities — who's actually building"
        body="Ordered by when they need you. The first two are shipping, the last two are hiring right now."
      >
        <div className="fac-list" style={{marginTop:'1.25rem'}}>
          {GUJARAT_FACILITIES.map((f,i)=>{
            const pct = Math.min(100, f.investNum / 11000 * 100);
            const tier = i === 0 ? 'lead' : i === 1 ? 'live' : 'mid';
            return (
              <div key={i} className={`fac-row fac-${tier}`}>
                <div className="fac-rank mono">{String(i+1).padStart(2,'0')}</div>
                <div className="fac-main">
                  <div className="fac-head">
                    <div className="fac-name">{f.name}</div>
                    <span className={`b ${f.statusClass}`}>{f.status}</span>
                  </div>
                  <div className="fac-note">{f.note}</div>
                  <div className="fac-bar"><span style={{width:`${pct}%`}}></span></div>
                </div>
                <div className="fac-stats">
                  <div><div className="fac-k">Capital</div><div className="fac-v mono">{f.invest}</div></div>
                  <div><div className="fac-k">Type</div><div className="fac-v">{f.type}</div></div>
                  <div><div className="fac-k">Jobs</div><div className="fac-v mono">{f.jobs}</div></div>
                </div>
              </div>
            );
          })}
        </div>
      </PCard>
    </Section>
  );
}

Object.assign(window, { SectionOverview, SectionMarket });
