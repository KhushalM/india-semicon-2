// ─────────────────────────────────────────────
// SECTIONS 4 — LESSONS + IDEAS + LEARNING + SOURCES
// ─────────────────────────────────────────────

function SectionLessons() {
  const TONES = ['accent','violet','warn','lead','critical'];
  return (
    <Section id="s8" num="08" label="Country Lessons" title="What Others Faced" sub="Every country overestimated money. Every country underestimated workforce and supply chain stickiness.">
      <div className="g2 stagger">
        {LESSONS.map((l,i)=>(
          <PCard
            key={i}
            kicker={`Case · ${l.sub}`}
            badge={l.country}
            variant="data"
            tone={TONES[i % TONES.length]}
            title={l.country}
            dim="— what it teaches"
            body={l.body}
            foot={`Takeaway — ${l.takeaway}`}
          />
        ))}
      </div>
      <PCard
        kicker="Pattern · Six problems, every time"
        badge="UNIVERSAL"
        variant="data"
        tone="lead"
        title="The 6 Problems"
        dim="Every Ecosystem Faces"
        body="Every country going through a semiconductor buildout — Taiwan, Korea, China, Malaysia, Vietnam — faced the same six. The pattern does not change."
        style={{marginTop:'1rem'}}
      >
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'.75rem',marginTop:'1rem'}}>
          {[
            ['01','Workforce','Always underestimated (2–5 years)'],
            ['02','Supply chain','Once qualified, sticky for decades'],
            ['03','Operational software','Invisible but essential'],
            ['04','Knowledge transfer','Institutional, not individual'],
            ['05','Quality infrastructure','Zero-defect culture'],
            ['06','Ecosystem coordination','Connecting all pieces'],
          ].map(([n,t,d],i)=>(
            <div key={i} style={{padding:'.9rem 1rem',borderRadius:10,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)'}}>
              <div style={{fontFamily:'var(--mono)',fontSize:'.65rem',color:'rgba(255,255,255,.4)',letterSpacing:'.12em'}}>{n}</div>
              <div style={{fontFamily:'var(--serif)',color:'#fff',fontSize:'1rem',margin:'.25rem 0 .3rem'}}>{t}</div>
              <div style={{fontSize:'.78rem',color:'rgba(255,255,255,.65)',lineHeight:1.5}}>{d}</div>
            </div>
          ))}
        </div>
      </PCard>
    </Section>
  );
}

function SectionIdeas() {
  const TONES = ['accent','violet','lead','warn','critical','accent','violet','lead','warn'];
  return (
    <Section id="s9" num="09" label="Innovation Ideas" title="What to Build" sub="AI engineering × semiconductor operations. The intelligence layer nobody is building." alt>
      <div className="g3 stagger">
        {IDEAS.map((d,i)=>(
          <PCard
            key={i}
            kicker={`Idea · ${String(i+1).padStart(2,'0')}`}
            badge={d.tag}
            variant="default"
            tone={TONES[i % TONES.length]}
            title={d.title.split(' ').slice(0,2).join(' ')}
            dim={d.title.split(' ').slice(2).join(' ')}
            body={d.body}
          />
        ))}
      </div>
      <PCard
        kicker="Method · How to find the right one"
        badge="GEMBA"
        variant="data"
        tone="accent"
        title="Go to the"
        dim="Actual Place"
        body="Gemba (現場) — Japanese for 'the actual place.' Toyota-born. The answer is not in a deck; it's on the floor. Run this five-step loop and the right idea will repeat itself."
        style={{marginTop:'1rem'}}
      >
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'.75rem',marginTop:'1rem'}}>
          {[
            ['01','Get physical access','Consult at facility, any role'],
            ['02','Shadow workers','Not executives — operators'],
            ['03','Ask three questions','What takes time? What info can\'t you find? Show me the forms.'],
            ['04','Count paper forms','Every one = potential software'],
            ['05','Run 20+ conversations','Same 3–4 pains will repeat'],
          ].map(([n,t,d],i)=>(
            <div key={i} style={{padding:'.9rem 1rem',borderRadius:10,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)'}}>
              <div style={{fontFamily:'var(--mono)',fontSize:'.65rem',color:'rgba(255,255,255,.4)',letterSpacing:'.12em'}}>{n}</div>
              <div style={{fontFamily:'var(--serif)',color:'#fff',fontSize:'1rem',margin:'.25rem 0 .3rem'}}>{t}</div>
              <div style={{fontSize:'.78rem',color:'rgba(255,255,255,.65)',lineHeight:1.5}}>{d}</div>
            </div>
          ))}
        </div>
      </PCard>
    </Section>
  );
}

function SectionLearning() {
  return (
    <Section id="s10" num="10" label="Learning Deep Dive" title="Technical + Business Curriculum" sub="Structured plan while employed. 8–10 hrs/week.">
      <div className="g2">
        <PCard kicker="Technical Track · 8–10 hrs/wk" badge="BUILD" variant="data" tone="accent" title="Technical" dim="Curriculum" body="Most of this you already know. The gap is semiconductor-specific vocabulary, process flow, and quality discipline. Skim fast, go deep on the 20% you'll actually use.">
          <div style={{marginTop:'1rem',display:'flex',flexDirection:'column',gap:'.55rem'}}>
            {LEARN_TECH.map((l,i)=>(
              <div key={i} style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'1rem',padding:'.75rem .95rem',borderRadius:9,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)'}}>
                <div>
                  <div style={{fontFamily:'var(--serif)',color:'#fff',fontSize:'.9rem'}}>{l.name}</div>
                  <div style={{fontSize:'.76rem',color:'rgba(255,255,255,.6)',marginTop:'.2rem',lineHeight:1.5}}>{l.detail}</div>
                </div>
                {l.tag && <span className="b b-a">{l.tag}</span>}
              </div>
            ))}
          </div>
        </PCard>
        <PCard kicker="Business Track · Same cadence" badge="OPERATE" variant="data" tone="violet" title="Business" dim="Curriculum" body="The parts of running a company nobody teaches in engineering school. Hire/fire, contracts, cash flow, compliance.">
          <div style={{marginTop:'1rem',display:'flex',flexDirection:'column',gap:'.55rem'}}>
            {LEARN_BIZ.map((l,i)=>(
              <div key={i} style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'1rem',padding:'.75rem .95rem',borderRadius:9,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)'}}>
                <div>
                  <div style={{fontFamily:'var(--serif)',color:'#fff',fontSize:'.9rem'}}>{l.name}</div>
                  <div style={{fontSize:'.76rem',color:'rgba(255,255,255,.6)',marginTop:'.2rem',lineHeight:1.5}}>{l.detail}</div>
                </div>
                {l.tag && <span className={`b ${l.tag==='Critical'?'b-ok':'b-a'}`}>{l.tag}</span>}
              </div>
            ))}
          </div>
          <div style={{marginTop:'1.25rem',paddingTop:'1rem',borderTop:'1px solid rgba(255,255,255,.08)'}}>
            <div style={{fontFamily:'var(--mono)',fontSize:'.62rem',color:'rgba(255,255,255,.4)',letterSpacing:'.14em',textTransform:'uppercase',marginBottom:'.6rem'}}>Resources · phone</div>
            <div style={{display:'flex',flexDirection:'column',gap:'.4rem'}}>
              {LEARN_MEDIA.map((l,i)=>(
                <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'.75rem',fontSize:'.8rem'}}>
                  <span style={{fontFamily:'var(--serif)',color:'#fff'}}>{l.name}</span>
                  <span style={{color:'rgba(255,255,255,.55)'}}>— {l.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </PCard>
      </div>
    </Section>
  );
}

function SectionSources() {
  return (
    <Section id="s11" num="11" label="Sources" title="21 Research Sources" sub="Vetted across policy, industry, and founder-level reportage." alt>
      <PCard kicker="References · Primary + secondary" badge={`${SOURCES.length} SOURCES`} variant="data" tone="default" title="The" dim="receipts">
        <div className="sources-grid" style={{marginTop:'1rem'}}>
          {SOURCES.map(s=>(
            <div key={s.n} className="src">
              <span className="src-n">{String(s.n).padStart(2,'0')}</span>
              <a href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a>
            </div>
          ))}
        </div>
      </PCard>
    </Section>
  );
}

Object.assign(window, { SectionLessons, SectionIdeas, SectionLearning, SectionSources });
