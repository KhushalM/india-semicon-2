// ─────────────────────────────────────────────
// ICONS — 3D soft-shaded rendered glyphs
// Layered SVG with gradients + specular highlights
// ─────────────────────────────────────────────

function Icon3D({ name, size = 56, className = '' }) {
  const s = size;
  const common = { width: s, height: s, viewBox: '0 0 64 64', xmlns: 'http://www.w3.org/2000/svg' };

  const defs = (
    <defs>
      {/* Hues */}
      <linearGradient id="g3d-orange" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffbe8a"/>
        <stop offset="1" stopColor="#f97316"/>
      </linearGradient>
      <linearGradient id="g3d-orange-d" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ea580c"/>
        <stop offset="1" stopColor="#9a3412"/>
      </linearGradient>
      <linearGradient id="g3d-green" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#86efac"/>
        <stop offset="1" stopColor="#16a34a"/>
      </linearGradient>
      <linearGradient id="g3d-green-d" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#15803d"/>
        <stop offset="1" stopColor="#052e16"/>
      </linearGradient>
      <linearGradient id="g3d-blue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#93c5fd"/>
        <stop offset="1" stopColor="#2563eb"/>
      </linearGradient>
      <linearGradient id="g3d-blue-d" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1d4ed8"/>
        <stop offset="1" stopColor="#0b1e52"/>
      </linearGradient>
      <linearGradient id="g3d-purple" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d8b4fe"/>
        <stop offset="1" stopColor="#9333ea"/>
      </linearGradient>
      <linearGradient id="g3d-purple-d" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7e22ce"/>
        <stop offset="1" stopColor="#2e1065"/>
      </linearGradient>
      <linearGradient id="g3d-navy" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#334155"/>
        <stop offset="1" stopColor="#0f172a"/>
      </linearGradient>
      <linearGradient id="g3d-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fde68a"/>
        <stop offset="1" stopColor="#d97706"/>
      </linearGradient>
      <linearGradient id="g3d-gold-d" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#b45309"/>
        <stop offset="1" stopColor="#451a03"/>
      </linearGradient>
      <radialGradient id="g3d-highlight" cx=".3" cy=".2" r=".6">
        <stop offset="0" stopColor="rgba(255,255,255,.7)"/>
        <stop offset="1" stopColor="rgba(255,255,255,0)"/>
      </radialGradient>
      <filter id="g3d-shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="1.4" in="SourceAlpha"/>
        <feOffset dy="1.5"/>
        <feComponentTransfer><feFuncA type="linear" slope=".45"/></feComponentTransfer>
        <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
  );

  const glyphs = {

    // CHIP — semiconductor die on isometric base
    chip: (
      <g filter="url(#g3d-shadow)">
        {/* pins bottom */}
        {[0,1,2,3,4].map(i=>(
          <rect key={`pb${i}`} x={16+i*7} y={46} width="4" height="6" rx="1" fill="url(#g3d-navy)"/>
        ))}
        {[0,1,2,3,4].map(i=>(
          <rect key={`pt${i}`} x={16+i*7} y={12} width="4" height="6" rx="1" fill="url(#g3d-navy)"/>
        ))}
        {[0,1,2,3,4].map(i=>(
          <rect key={`pl${i}`} x={8} y={20+i*5.6} width="6" height="4" rx="1" fill="url(#g3d-navy)"/>
        ))}
        {[0,1,2,3,4].map(i=>(
          <rect key={`pr${i}`} x={50} y={20+i*5.6} width="6" height="4" rx="1" fill="url(#g3d-navy)"/>
        ))}
        {/* body */}
        <rect x="14" y="18" width="36" height="28" rx="3" fill="url(#g3d-navy)"/>
        <rect x="14" y="18" width="36" height="28" rx="3" fill="url(#g3d-highlight)" opacity=".6"/>
        {/* die */}
        <rect x="22" y="24" width="20" height="16" rx="1.5" fill="url(#g3d-blue)"/>
        <rect x="22" y="24" width="20" height="16" rx="1.5" fill="url(#g3d-highlight)" opacity=".5"/>
        {/* traces */}
        <g stroke="rgba(255,255,255,.45)" strokeWidth=".6" fill="none">
          <line x1="26" y1="28" x2="38" y2="28"/>
          <line x1="26" y1="32" x2="38" y2="32"/>
          <line x1="26" y1="36" x2="34" y2="36"/>
        </g>
        <circle cx="36" cy="36" r="1" fill="#fff"/>
      </g>
    ),

    // GRAD CAP — workforce / training
    grad: (
      <g filter="url(#g3d-shadow)">
        {/* base (head) */}
        <ellipse cx="32" cy="44" rx="14" ry="4" fill="url(#g3d-navy)" opacity=".8"/>
        {/* mortarboard top plate */}
        <path d="M 12 28 L 32 20 L 52 28 L 32 36 Z" fill="url(#g3d-navy)"/>
        <path d="M 12 28 L 32 20 L 52 28 L 32 36 Z" fill="url(#g3d-highlight)" opacity=".5"/>
        {/* cap body */}
        <path d="M 20 32 L 20 40 Q 20 44 32 44 Q 44 44 44 40 L 44 32 L 32 38 Z" fill="url(#g3d-blue-d)"/>
        <path d="M 20 32 L 20 36 Q 20 37 32 40 Q 44 37 44 36 L 44 32 L 32 38 Z" fill="url(#g3d-blue)" opacity=".7"/>
        {/* tassel */}
        <line x1="48" y1="28" x2="50" y2="42" stroke="#fbbf24" strokeWidth="1.2"/>
        <circle cx="50" cy="44" r="2.4" fill="url(#g3d-gold)"/>
        <circle cx="50" cy="44" r="2.4" fill="url(#g3d-highlight)" opacity=".5"/>
        {/* button */}
        <circle cx="32" cy="28" r="1.6" fill="url(#g3d-gold)"/>
      </g>
    ),

    // LINK — chain (supply chain)
    link: (
      <g filter="url(#g3d-shadow)">
        {/* left link */}
        <g transform="rotate(-30 24 32)">
          <rect x="12" y="24" width="24" height="16" rx="8" fill="url(#g3d-orange-d)"/>
          <rect x="15" y="27" width="18" height="10" rx="5" fill="none" stroke="url(#g3d-orange)" strokeWidth="3"/>
          <rect x="12" y="24" width="24" height="7" rx="8" fill="url(#g3d-highlight)" opacity=".45"/>
        </g>
        {/* right link */}
        <g transform="rotate(30 40 32)">
          <rect x="28" y="24" width="24" height="16" rx="8" fill="url(#g3d-green-d)"/>
          <rect x="31" y="27" width="18" height="10" rx="5" fill="none" stroke="url(#g3d-green)" strokeWidth="3"/>
          <rect x="28" y="24" width="24" height="7" rx="8" fill="url(#g3d-highlight)" opacity=".45"/>
        </g>
      </g>
    ),

    // SCAN — AI eye / inspection
    scan: (
      <g filter="url(#g3d-shadow)">
        {/* outer eye */}
        <path d="M 6 32 Q 32 14 58 32 Q 32 50 6 32 Z" fill="url(#g3d-purple-d)"/>
        <path d="M 10 32 Q 32 18 54 32 Q 32 46 10 32 Z" fill="url(#g3d-purple)"/>
        {/* iris */}
        <circle cx="32" cy="32" r="10" fill="url(#g3d-navy)"/>
        <circle cx="32" cy="32" r="7.5" fill="url(#g3d-blue)"/>
        <circle cx="32" cy="32" r="4" fill="#0b1e52"/>
        {/* highlight */}
        <circle cx="29" cy="29" r="1.8" fill="#fff"/>
        {/* scan brackets */}
        <g stroke="#fbbf24" strokeWidth="1.8" fill="none" strokeLinecap="round">
          <path d="M 10 20 L 10 16 L 14 16"/>
          <path d="M 54 20 L 54 16 L 50 16"/>
          <path d="M 10 44 L 10 48 L 14 48"/>
          <path d="M 54 44 L 54 48 L 50 48"/>
        </g>
      </g>
    ),

    // ROCKET — launch / plan
    rocket: (
      <g filter="url(#g3d-shadow)">
        {/* body */}
        <path d="M 32 6 Q 42 18 42 34 L 42 44 L 22 44 L 22 34 Q 22 18 32 6 Z" fill="url(#g3d-blue)"/>
        <path d="M 32 6 Q 38 18 38 34 L 38 44 L 22 44 L 22 34 Q 22 18 32 6 Z" fill="url(#g3d-highlight)" opacity=".5"/>
        {/* fins */}
        <path d="M 22 34 L 14 46 L 22 44 Z" fill="url(#g3d-orange-d)"/>
        <path d="M 42 34 L 50 46 L 42 44 Z" fill="url(#g3d-orange)"/>
        {/* window */}
        <circle cx="32" cy="26" r="4" fill="url(#g3d-navy)"/>
        <circle cx="32" cy="26" r="4" fill="url(#g3d-highlight)" opacity=".7"/>
        {/* flame */}
        <path d="M 26 44 Q 28 52 32 58 Q 36 52 38 44 Z" fill="url(#g3d-gold)"/>
        <path d="M 28 44 Q 30 50 32 54 Q 34 50 36 44 Z" fill="url(#g3d-orange)"/>
      </g>
    ),

    // CALENDAR / timeline
    calendar: (
      <g filter="url(#g3d-shadow)">
        {/* base */}
        <rect x="10" y="14" width="44" height="38" rx="4" fill="url(#g3d-navy)"/>
        {/* paper */}
        <rect x="12" y="22" width="40" height="28" rx="2" fill="#fff"/>
        <rect x="12" y="22" width="40" height="28" rx="2" fill="url(#g3d-highlight)" opacity=".35"/>
        {/* header band */}
        <rect x="10" y="14" width="44" height="10" rx="4" fill="url(#g3d-orange-d)"/>
        <rect x="10" y="14" width="44" height="5" rx="4" fill="url(#g3d-highlight)" opacity=".55"/>
        {/* rings */}
        <rect x="18" y="10" width="3" height="10" rx="1.5" fill="url(#g3d-navy)"/>
        <rect x="43" y="10" width="3" height="10" rx="1.5" fill="url(#g3d-navy)"/>
        {/* dots = schedule */}
        <g fill="#cbd5e1">
          <circle cx="18" cy="30" r="1.5"/><circle cx="24" cy="30" r="1.5"/><circle cx="30" cy="30" r="1.5"/><circle cx="36" cy="30" r="1.5"/><circle cx="42" cy="30" r="1.5"/><circle cx="48" cy="30" r="1.5"/>
          <circle cx="18" cy="38" r="1.5"/><circle cx="24" cy="38" r="1.5"/>
        </g>
        {/* highlighted current */}
        <circle cx="30" cy="38" r="3" fill="url(#g3d-green)"/>
        <g fill="#cbd5e1">
          <circle cx="36" cy="38" r="1.5"/><circle cx="42" cy="38" r="1.5"/><circle cx="48" cy="38" r="1.5"/>
          <circle cx="18" cy="45" r="1.5"/><circle cx="24" cy="45" r="1.5"/><circle cx="30" cy="45" r="1.5"/><circle cx="36" cy="45" r="1.5"/>
        </g>
      </g>
    ),

    // MONEY — stacked coins
    money: (
      <g filter="url(#g3d-shadow)">
        <ellipse cx="32" cy="48" rx="20" ry="6" fill="url(#g3d-gold-d)"/>
        <ellipse cx="32" cy="42" rx="20" ry="6" fill="url(#g3d-gold)"/>
        <ellipse cx="32" cy="42" rx="20" ry="6" fill="url(#g3d-highlight)" opacity=".4"/>
        <rect x="12" y="36" width="40" height="6" fill="url(#g3d-gold-d)"/>
        <ellipse cx="32" cy="36" rx="20" ry="6" fill="url(#g3d-gold)"/>
        <ellipse cx="32" cy="36" rx="20" ry="6" fill="url(#g3d-highlight)" opacity=".45"/>
        <rect x="12" y="30" width="40" height="6" fill="url(#g3d-gold-d)"/>
        <ellipse cx="32" cy="30" rx="20" ry="6" fill="url(#g3d-gold)"/>
        <ellipse cx="32" cy="30" rx="20" ry="6" fill="url(#g3d-highlight)" opacity=".5"/>
        <text x="32" y="33" textAnchor="middle" fontFamily="Inter" fontWeight="800" fontSize="7" fill="#7c2d12">₹</text>
      </g>
    ),

    // FLAG — opportunity / win
    flag: (
      <g filter="url(#g3d-shadow)">
        {/* pole */}
        <rect x="14" y="8" width="3.5" height="48" rx="1.5" fill="url(#g3d-navy)"/>
        <rect x="14" y="8" width="1.4" height="48" rx=".7" fill="url(#g3d-highlight)" opacity=".5"/>
        {/* flag — Indian tricolor */}
        <path d="M 17.5 10 L 50 14 Q 46 22 50 30 L 17.5 26 Z" fill="#FF9933"/>
        <path d="M 17.5 26 L 50 30 Q 46 38 50 46 L 17.5 42 Z" fill="#fff"/>
        <path d="M 17.5 42 L 50 46 Q 46 54 50 58 L 17.5 58 Z" fill="#138808" opacity=".95"/>
        <circle cx="34" cy="36" r="3" fill="none" stroke="#000080" strokeWidth=".8"/>
        <circle cx="34" cy="36" r="1" fill="#000080"/>
        {/* highlight strip */}
        <path d="M 17.5 10 L 50 14 Q 46 22 50 30 L 17.5 26 Z" fill="url(#g3d-highlight)" opacity=".45"/>
      </g>
    ),

    // HANDSHAKE — partnerships / networking
    handshake: (
      <g filter="url(#g3d-shadow)">
        {/* left arm */}
        <path d="M 6 32 L 18 26 L 28 32 L 28 40 L 18 42 L 6 38 Z" fill="url(#g3d-blue-d)"/>
        <path d="M 6 32 L 18 26 L 28 32 L 18 33 L 6 36 Z" fill="url(#g3d-blue)" opacity=".85"/>
        {/* right arm */}
        <path d="M 58 32 L 46 26 L 36 32 L 36 40 L 46 42 L 58 38 Z" fill="url(#g3d-orange-d)"/>
        <path d="M 58 32 L 46 26 L 36 32 L 46 33 L 58 36 Z" fill="url(#g3d-orange)" opacity=".85"/>
        {/* joining gem */}
        <circle cx="32" cy="34" r="5" fill="url(#g3d-gold)"/>
        <circle cx="32" cy="34" r="5" fill="url(#g3d-highlight)" opacity=".6"/>
        <circle cx="32" cy="34" r="2" fill="#fff" opacity=".6"/>
      </g>
    ),

    // TARGET — entry strategy
    target: (
      <g filter="url(#g3d-shadow)">
        <circle cx="32" cy="32" r="24" fill="url(#g3d-orange-d)"/>
        <circle cx="32" cy="32" r="24" fill="url(#g3d-highlight)" opacity=".35"/>
        <circle cx="32" cy="32" r="18" fill="#fff"/>
        <circle cx="32" cy="32" r="14" fill="url(#g3d-orange)"/>
        <circle cx="32" cy="32" r="9" fill="#fff"/>
        <circle cx="32" cy="32" r="5" fill="url(#g3d-orange-d)"/>
        {/* arrow */}
        <path d="M 44 20 L 50 14 L 52 18 L 48 22 Z" fill="url(#g3d-gold)"/>
        <path d="M 30 32 L 46 18" stroke="url(#g3d-navy)" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="30" cy="32" r="2" fill="#0f172a"/>
      </g>
    ),

    // LAB — pain / research
    lab: (
      <g filter="url(#g3d-shadow)">
        {/* flask */}
        <path d="M 26 10 L 26 22 L 14 46 Q 14 54 24 54 L 40 54 Q 50 54 50 46 L 38 22 L 38 10 Z" fill="url(#g3d-green-d)"/>
        <path d="M 26 10 L 26 22 L 14 46 Q 14 54 24 54 L 40 54 Q 50 54 50 46 L 38 22 L 38 10 Z" fill="url(#g3d-green)" opacity=".55"/>
        {/* liquid */}
        <path d="M 20 36 L 44 36 Q 48 46 48 48 Q 48 52 40 52 L 24 52 Q 16 52 16 48 Q 16 46 20 36 Z" fill="url(#g3d-purple)"/>
        {/* bubbles */}
        <circle cx="26" cy="42" r="1.5" fill="#fff" opacity=".8"/>
        <circle cx="34" cy="46" r="1.2" fill="#fff" opacity=".7"/>
        <circle cx="40" cy="40" r=".9" fill="#fff" opacity=".6"/>
        {/* stopper */}
        <rect x="24" y="6" width="16" height="6" rx="2" fill="url(#g3d-navy)"/>
      </g>
    ),

    // BOLT — quick start / momentum
    bolt: (
      <g filter="url(#g3d-shadow)">
        <path d="M 36 6 L 16 34 L 28 34 L 22 58 L 48 28 L 34 28 L 40 6 Z" fill="url(#g3d-gold-d)"/>
        <path d="M 36 6 L 16 34 L 28 34 L 22 58 L 48 28 L 34 28 L 40 6 Z" fill="url(#g3d-gold)" opacity=".85"/>
        <path d="M 36 6 L 16 34 L 28 34 L 26 46 L 44 28 L 34 28 L 38 10 Z" fill="url(#g3d-highlight)" opacity=".5"/>
      </g>
    ),
  };

  return (
    <svg {...common} className={`icon3d icon3d-${name} ${className}`}>
      {defs}
      {glyphs[name] || glyphs.chip}
    </svg>
  );
}

Object.assign(window, { Icon3D });
