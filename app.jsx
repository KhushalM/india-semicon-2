// ─────────────────────────────────────────────
// APP — orchestrator
// ─────────────────────────────────────────────

function App() {
  const [active, setActive] = useState('s0');
  const [theme, setTheme] = useState(() => localStorage.getItem('is-theme') || 'light');
  const [tweaks, setTweaks] = useState(() => {
    const saved = localStorage.getItem('is-tweaks');
    return { ...window.TWEAKS, ...(saved ? JSON.parse(saved) : {}) };
  });
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [kbarOpen, setKbarOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  // Apply theme & tweaks to :root
  useEffect(() => {
    const r = document.documentElement;
    r.dataset.theme = theme;
    r.dataset.accent = tweaks.accentColor;
    r.dataset.card = tweaks.cardStyle;
    r.dataset.density = tweaks.density;
    localStorage.setItem('is-theme', theme);
    localStorage.setItem('is-tweaks', JSON.stringify(tweaks));
  }, [theme, tweaks]);

  // Scrollspy + progress bar
  useEffect(() => {
    const ids = SECTIONS.map(s => s.id);
    const onScroll = () => {
      const y = window.scrollY + 120;
      let cur = 's0';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      }
      setActive(cur);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = Math.min(100, Math.max(0, (window.scrollY / h) * 100));
      const pb = document.getElementById('progressBar');
      if (pb) pb.style.width = pct + '%';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cmd-K
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setKbarOpen(o => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Deep link on load
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && SECTIONS.some(s => s.id === hash)) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'auto', block: 'start' });
      }, 120);
    }
  }, []);

  // Tweaks ↔ toolbar
  useEffect(() => {
    const handler = (e) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === '__activate_edit_mode') setTweaksOpen(true);
      else if (e.data.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const onJump = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
    history.replaceState(null, '', '#' + id);
  }, []);

  const onToggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const onShare = () => {
    const url = location.origin + location.pathname + '#' + active;
    navigator.clipboard?.writeText(url).then(() => {
      setToast({ show: true, msg: `Copied link to ${active.toUpperCase()} section` });
      setTimeout(() => setToast(t => ({ ...t, show: false })), 2200);
    });
  };

  const onTweakChange = (key, val) => {
    const next = { ...tweaks, [key]: val };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: val } }, '*');
  };

  return (
    <>
      <Nav active={active} onJump={onJump} onToggleTheme={onToggleTheme} theme={theme}
           onOpenKbar={() => setKbarOpen(true)} onShare={onShare} />
      <Hero headline={tweaks.headline} />
      <HeroStats statStyle={tweaks.statStyle} />
      <SectionOverview />
      <SectionMarket />
      <SectionCompetition />
      <SectionPain />
      <SectionStrategy />
      <SectionNetworking />
      <SectionSchemes />
      <SectionPlan />
      <SectionLessons />
      <SectionIdeas />
      <SectionLearning />
      <SectionSources />
      <footer className="footer">
        <div className="container footer-inner">
          <div style={{display:'flex',alignItems:'center',gap:'.85rem'}}>
            <span className="footer-update"><span className="dot"></span>Last updated · April 2026</span>
            <span>21 vetted sources · Deep 3-phase analysis</span>
          </div>
          <div style={{display:'flex',gap:'.85rem',alignItems:'center',color:'var(--text-3)'}}>
            <span>Press <kbd>⌘</kbd><kbd>K</kbd> to search</span>
          </div>
        </div>
      </footer>
      <Kbar open={kbarOpen} onClose={() => setKbarOpen(false)} onJump={onJump} />
      <TweaksPanel open={tweaksOpen} tweaks={tweaks} onChange={onTweakChange} onClose={() => setTweaksOpen(false)} />
      <Toast msg={toast.msg} show={toast.show} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
