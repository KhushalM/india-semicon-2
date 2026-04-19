// ─────────────────────────────────────────────
// ISOMETRIC LINE-ART ILLUSTRATIONS
// Monochrome, thin stroke, sits on grid — for hero cards.
// Usage: <IsoIllus name="wafer" /> — fills container; width auto.
// ─────────────────────────────────────────────

// Shared grid backdrop: faint isometric grid + ground plane
function IsoGrid() {
  // isometric grid lines
  const lines = [];
  // Two family of lines: 30° and 150° (isometric axes)
  // Instead draw a parallelogram grid
  const range = 14;
  for (let i = -range; i <= range; i++) {
    // line along +30°
    lines.push(
      <line key={`a${i}`} x1={-300} y1={i * 22} x2={300} y2={i * 22 + 173}
        stroke="currentColor" strokeWidth=".6" opacity=".18" />
    );
    // line along -30°
    lines.push(
      <line key={`b${i}`} x1={-300} y1={-i * 22} x2={300} y2={-i * 22 - 173}
        stroke="currentColor" strokeWidth=".6" opacity=".18" />
    );
  }
  return <g className="iso-grid" transform="translate(200 220)" clipPath="url(#iso-clip)">{lines}</g>;
}

// Isometric projection helper: (x,y,z) in world → (sx,sy) in screen
// Standard iso: sx = (x - y) * cos(30°), sy = (x + y) * sin(30°) - z
const K = Math.cos(Math.PI / 6);   // ≈ .866
const S = Math.sin(Math.PI / 6);   // = .5
const iso = (x, y, z = 0) => [(x - y) * K, (x + y) * S - z];

// Draw an isometric box (footprint w×d, height h) at base (bx,by)
function IsoBox({ x = 0, y = 0, w = 60, d = 60, h = 20, stroke = 'currentColor', fill = 'none', opacity = 1 }) {
  const p = (X, Y, Z) => { const [a, b] = iso(X + x, Y + y, Z); return `${a},${b}`; };
  // top face
  const top = `M ${p(0, 0, h)} L ${p(w, 0, h)} L ${p(w, d, h)} L ${p(0, d, h)} Z`;
  // right face
  const right = `M ${p(w, 0, h)} L ${p(w, 0, 0)} L ${p(w, d, 0)} L ${p(w, d, h)} Z`;
  // front face
  const front = `M ${p(0, d, h)} L ${p(0, d, 0)} L ${p(w, d, 0)} L ${p(w, d, h)} Z`;
  return (
    <g stroke={stroke} fill={fill} strokeWidth="1.2" strokeLinejoin="round" opacity={opacity}>
      <path d={top} />
      <path d={right} />
      <path d={front} />
    </g>
  );
}

// ─────────────────────────────────────────────
// Illustration: WAFER + PROBE (for Workforce Academy — inspection / learning)
// A round wafer on a stage with a hovering magnifier
// ─────────────────────────────────────────────
function IllusAcademy() {
  return (
    <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none"
      stroke="currentColor" strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <clipPath id="iso-clip-1"><rect x="-300" y="-300" width="800" height="800" /></clipPath>
      </defs>
      {/* Grid */}
      <g opacity=".5">
        {Array.from({ length: 30 }).map((_, i) => (
          <g key={i}>
            <line x1={-100 + i * 22} y1="140" x2={160 + i * 22} y2="290" strokeWidth=".5" opacity=".25" />
            <line x1={-100 + i * 22} y1="290" x2={160 + i * 22} y2="140" strokeWidth=".5" opacity=".25" />
          </g>
        ))}
      </g>
      {/* Wafer stage base (flat hex/parallelogram) */}
      <g transform="translate(140 170)">
        {/* base slab */}
        <path d="M 0 40 L 110 0 L 220 40 L 110 80 Z" strokeWidth="1.4" />
        <path d="M 0 40 L 0 52 L 110 92 L 110 80" strokeWidth="1.4" />
        <path d="M 220 40 L 220 52 L 110 92" strokeWidth="1.4" />
        {/* Wafer disc on top — ellipse */}
        <ellipse cx="110" cy="40" rx="70" ry="26" strokeWidth="1.4" />
        <ellipse cx="110" cy="40" rx="54" ry="20" strokeWidth=".8" opacity=".55" />
        {/* die grid on wafer */}
        <g opacity=".75" strokeWidth=".7">
          {[-2, -1, 0, 1, 2].map(i => (
            <line key={'dv' + i} x1={110 + i * 18} y1={40 - Math.sqrt(Math.max(0, 1 - (i * 18 / 70) ** 2)) * 24}
              x2={110 + i * 18} y2={40 + Math.sqrt(Math.max(0, 1 - (i * 18 / 70) ** 2)) * 24} />
          ))}
          {[-1, 0, 1].map(i => (
            <line key={'dh' + i} x1={110 - Math.sqrt(Math.max(0, 1 - (i * 8 / 24) ** 2)) * 60}
              y1={40 + i * 8} x2={110 + Math.sqrt(Math.max(0, 1 - (i * 8 / 24) ** 2)) * 60} y2={40 + i * 8} />
          ))}
          {/* one highlighted die */}
          <rect x="118" y="36" width="14" height="8" fill="currentColor" opacity=".85" />
        </g>
        {/* notch */}
        <path d="M 182 40 l 4 2 l -4 2" strokeWidth="1" />
      </g>
      {/* Magnifier hovering above */}
      <g transform="translate(210 60)" strokeWidth="1.5">
        {/* loupe */}
        <circle cx="0" cy="0" r="34" />
        <circle cx="0" cy="0" r="28" opacity=".4" strokeWidth=".8" />
        {/* handle */}
        <line x1="24" y1="24" x2="56" y2="66" strokeWidth="3" />
        <line x1="56" y1="66" x2="72" y2="82" strokeWidth="5" />
        {/* lens reflection */}
        <path d="M -18 -14 Q -8 -26 6 -22" opacity=".5" strokeWidth="1" />
      </g>
      {/* Dotted projection lines from magnifier to wafer */}
      <g strokeDasharray="2 3" opacity=".5" strokeWidth=".8">
        <line x1="180" y1="90" x2="180" y2="200" />
        <line x1="240" y1="90" x2="260" y2="200" />
      </g>
      {/* tiny measurement bracket */}
      <g strokeWidth=".8" opacity=".7" fontFamily="JetBrains Mono" fontSize="9" fill="currentColor" stroke="none">
        <text x="286" y="136" opacity=".6">300mm</text>
      </g>
      <g strokeWidth=".8" opacity=".55">
        <line x1="280" y1="140" x2="280" y2="164" />
        <line x1="276" y1="140" x2="284" y2="140" />
        <line x1="276" y1="164" x2="284" y2="164" />
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────
// Illustration: SUPPLY CHAIN — connected nodes / cubes on an iso platform
// ─────────────────────────────────────────────
function IllusSupply() {
  return (
    <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none"
      stroke="currentColor" strokeLinejoin="round" strokeLinecap="round">
      {/* iso ground grid */}
      <g opacity=".45" strokeWidth=".5">
        {Array.from({ length: 18 }).map((_, i) => (
          <g key={i}>
            <line x1={-40 + i * 26} y1="160" x2={140 + i * 26} y2="260" opacity=".25" />
            <line x1={-40 + i * 26} y1="260" x2={140 + i * 26} y2="160" opacity=".25" />
          </g>
        ))}
      </g>
      {/* Main platform — big hex */}
      <g strokeWidth="1.3">
        <path d="M 80 190 L 200 135 L 320 190 L 200 245 Z" />
        <path d="M 80 190 L 80 200 L 200 255 L 200 245" />
        <path d="M 320 190 L 320 200 L 200 255" />
      </g>
      {/* Central hub box */}
      <g transform="translate(178 130)" strokeWidth="1.3">
        {/* cube */}
        <path d="M 0 30 L 22 20 L 44 30 L 22 40 Z" />
        <path d="M 0 30 L 0 48 L 22 58 L 22 40" />
        <path d="M 44 30 L 44 48 L 22 58" />
        <circle cx="22" cy="29" r="3" fill="currentColor" />
      </g>
      {/* 3 Satellite boxes */}
      {[
        { x: 92, y: 174 },
        { x: 280, y: 174 },
        { x: 186, y: 222 },
      ].map((s, i) => (
        <g key={i} transform={`translate(${s.x} ${s.y})`} strokeWidth="1.1">
          <path d="M 0 14 L 18 6 L 36 14 L 18 22 Z" />
          <path d="M 0 14 L 0 28 L 18 36 L 18 22" />
          <path d="M 36 14 L 36 28 L 18 36" />
        </g>
      ))}
      {/* Connector arcs — dashed */}
      <g strokeWidth="1" strokeDasharray="3 3" opacity=".85">
        <path d="M 200 150 Q 150 158 118 178" />
        <path d="M 222 150 Q 272 158 298 178" />
        <path d="M 200 170 Q 200 196 202 222" />
      </g>
      {/* Arrow heads */}
      <g strokeWidth="1" fill="currentColor">
        <path d="M 110 180 l 8 -2 l -2 6 z" stroke="none" />
        <path d="M 296 176 l -8 2 l 2 -6 z" stroke="none" />
        <path d="M 204 224 l 2 -7 l 5 5 z" stroke="none" />
      </g>
      {/* Tiny lot tags */}
      <g fontFamily="JetBrains Mono" fontSize="7" fill="currentColor" stroke="none" opacity=".55">
        <text x="84" y="168">LOT-01</text>
        <text x="272" y="168">LOT-02</text>
        <text x="178" y="216">LOT-03</text>
      </g>
      {/* Coordinate axis marker */}
      <g transform="translate(340 240)" strokeWidth=".9" opacity=".55">
        <line x1="0" y1="0" x2="12" y2="-7" />
        <line x1="0" y1="0" x2="-12" y2="-7" />
        <line x1="0" y1="0" x2="0" y2="-14" />
        <text x="14" y="-6" fontFamily="JetBrains Mono" fontSize="7" fill="currentColor" stroke="none">x</text>
        <text x="-20" y="-6" fontFamily="JetBrains Mono" fontSize="7" fill="currentColor" stroke="none">y</text>
        <text x="2" y="-16" fontFamily="JetBrains Mono" fontSize="7" fill="currentColor" stroke="none">z</text>
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────
// Illustration: AI QUALITY — chip + scanning beams / neural mesh above
// ─────────────────────────────────────────────
function IllusAI() {
  return (
    <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none"
      stroke="currentColor" strokeLinejoin="round" strokeLinecap="round">
      {/* iso grid floor */}
      <g opacity=".45" strokeWidth=".5">
        {Array.from({ length: 18 }).map((_, i) => (
          <g key={i}>
            <line x1={-40 + i * 26} y1="170" x2={140 + i * 26} y2="270" opacity=".25" />
            <line x1={-40 + i * 26} y1="270" x2={140 + i * 26} y2="170" opacity=".25" />
          </g>
        ))}
      </g>
      {/* Isometric PCB board */}
      <g transform="translate(120 150)" strokeWidth="1.3">
        <path d="M 0 60 L 90 20 L 180 60 L 90 100 Z" />
        <path d="M 0 60 L 0 74 L 90 114 L 90 100" />
        <path d="M 180 60 L 180 74 L 90 114" />
        {/* chips on board */}
        <g strokeWidth="1.1">
          <path d="M 50 55 L 74 43 L 86 49 L 62 61 Z" />
          <path d="M 50 55 L 50 62 L 62 68 L 62 61" />
          <path d="M 86 49 L 86 56 L 62 68" />
          {/* big chip */}
          <path d="M 96 55 L 128 39 L 150 50 L 118 66 Z" />
          <path d="M 96 55 L 96 66 L 118 77 L 118 66" />
          <path d="M 150 50 L 150 61 L 118 77" />
          {/* pins on big chip */}
          {[0, 1, 2, 3].map(i => (
            <line key={i}
              x1={98 + i * 8} y1={63 + i * 1} x2={98 + i * 8} y2={70 + i * 1}
              strokeWidth=".7" />
          ))}
          {/* capacitor cylinders */}
          <ellipse cx="112" cy="80" rx="5" ry="2.5" strokeWidth=".8" />
          <path d="M 107 80 L 107 86 M 117 80 L 117 86" strokeWidth=".8" />
          <ellipse cx="112" cy="86" rx="5" ry="2.5" strokeWidth=".8" />
        </g>
        {/* trace lines on PCB */}
        <g opacity=".5" strokeWidth=".6">
          <line x1="20" y1="68" x2="60" y2="48" />
          <line x1="155" y1="64" x2="120" y2="82" />
        </g>
      </g>
      {/* Scanning beam — triangular projection from above */}
      <g opacity=".6" strokeWidth=".9" strokeDasharray="3 3">
        <line x1="210" y1="30" x2="165" y2="180" />
        <line x1="210" y1="30" x2="255" y2="180" />
      </g>
      {/* Neural mesh nodes up top */}
      <g transform="translate(185 30)" strokeWidth="1.1">
        {[
          [0, 0], [25, -6], [50, 0], [-15, 14], [40, 18], [20, 22],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.5" fill="currentColor" opacity=".9" stroke="none" />
        ))}
        {/* edges */}
        <g opacity=".5">
          <line x1="0" y1="0" x2="25" y2="-6" />
          <line x1="25" y1="-6" x2="50" y2="0" />
          <line x1="0" y1="0" x2="-15" y2="14" />
          <line x1="25" y1="-6" x2="20" y2="22" />
          <line x1="50" y1="0" x2="40" y2="18" />
          <line x1="-15" y1="14" x2="20" y2="22" />
          <line x1="20" y1="22" x2="40" y2="18" />
        </g>
      </g>
      {/* DETECT marker on big chip */}
      <g transform="translate(235 195)" strokeWidth=".9">
        <circle cx="0" cy="0" r="10" />
        <circle cx="0" cy="0" r="3" fill="currentColor" stroke="none" />
        <line x1="0" y1="-14" x2="0" y2="-20" />
        <text x="6" y="-16" fontFamily="JetBrains Mono" fontSize="7" fill="currentColor" stroke="none" opacity=".7">DEFECT</text>
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────
// Illustration: FAB CORRIDOR — landscape with two fab blocks
// ─────────────────────────────────────────────
function IllusCorridor() {
  return (
    <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none"
      stroke="currentColor" strokeLinejoin="round" strokeLinecap="round">
      {/* grid floor */}
      <g opacity=".45" strokeWidth=".5">
        {Array.from({ length: 18 }).map((_, i) => (
          <g key={i}>
            <line x1={-40 + i * 26} y1="180" x2={140 + i * 26} y2="280" opacity=".25" />
            <line x1={-40 + i * 26} y1="280" x2={140 + i * 26} y2="180" opacity=".25" />
          </g>
        ))}
      </g>
      {/* Two factory volumes */}
      <g strokeWidth="1.3">
        {/* Fab A */}
        <path d="M 60 200 L 130 162 L 170 182 L 100 220 Z" />
        <path d="M 60 200 L 60 232 L 100 252 L 100 220" />
        <path d="M 170 182 L 170 214 L 100 252" />
        {/* roof sawtooth */}
        <path d="M 70 196 L 80 188 L 90 192 M 90 192 L 100 184 L 110 188 M 110 188 L 120 180 L 130 184"
          strokeWidth=".9" opacity=".7" />
        {/* door */}
        <path d="M 85 232 L 85 244 L 95 240 L 95 228 Z" strokeWidth=".9" />
        {/* chimney */}
        <path d="M 140 168 L 140 148 L 150 144 L 150 164 Z" strokeWidth=".9" />
        {/* vapor */}
        <path d="M 144 140 q 4 -6 -2 -10" strokeWidth=".8" opacity=".6" />
        <path d="M 148 135 q 4 -6 -2 -10" strokeWidth=".8" opacity=".6" />

        {/* Fab B */}
        <path d="M 200 210 L 284 168 L 336 194 L 252 236 Z" />
        <path d="M 200 210 L 200 240 L 252 266 L 252 236" />
        <path d="M 336 194 L 336 224 L 252 266" />
        {/* stripes */}
        <g opacity=".45" strokeWidth=".7">
          <line x1="210" y1="218" x2="262" y2="244" />
          <line x1="220" y1="224" x2="272" y2="250" />
          <line x1="230" y1="230" x2="282" y2="256" />
        </g>
        {/* tower */}
        <path d="M 296 180 L 296 132 L 308 126 L 308 174" strokeWidth="1.1" />
        <circle cx="302" cy="128" r="3" fill="currentColor" stroke="none" opacity=".9" />
      </g>
      {/* Connection road between fabs */}
      <g strokeWidth="1" strokeDasharray="4 3" opacity=".65">
        <path d="M 150 218 L 220 230" />
      </g>
      {/* GJ tag */}
      <g fontFamily="JetBrains Mono" fontSize="10" fill="currentColor" stroke="none" opacity=".7">
        <text x="28" y="268" letterSpacing="2">GJ</text>
      </g>
      {/* tiny compass */}
      <g transform="translate(350 70)" strokeWidth="1">
        <circle cx="0" cy="0" r="14" opacity=".5" />
        <path d="M 0 -11 L 3 0 L 0 11 L -3 0 Z" fill="currentColor" stroke="none" opacity=".8" />
        <text x="-3" y="-16" fontFamily="JetBrains Mono" fontSize="7" fill="currentColor" stroke="none">N</text>
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────
// Illustration: TALENT — stack of hard-hat figures (simple iso people)
// ─────────────────────────────────────────────
function IllusTalent() {
  return (
    <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none"
      stroke="currentColor" strokeLinejoin="round" strokeLinecap="round">
      {/* grid floor */}
      <g opacity=".45" strokeWidth=".5">
        {Array.from({ length: 18 }).map((_, i) => (
          <g key={i}>
            <line x1={-40 + i * 26} y1="180" x2={140 + i * 26} y2="280" opacity=".25" />
            <line x1={-40 + i * 26} y1="280" x2={140 + i * 26} y2="180" opacity=".25" />
          </g>
        ))}
      </g>
      {/* classroom podium */}
      <g transform="translate(90 160)" strokeWidth="1.3">
        <path d="M 0 60 L 70 26 L 220 60 L 150 94 Z" />
        <path d="M 0 60 L 0 74 L 150 108 L 150 94" />
        <path d="M 220 60 L 220 74 L 150 108" />
      </g>
      {/* Chart / board */}
      <g transform="translate(90 100)" strokeWidth="1.2">
        <path d="M 0 20 L 100 -20 L 150 -6 L 50 34 Z" strokeWidth=".9" opacity=".7" />
        {/* bars on chart */}
        <g opacity=".85" strokeWidth=".8">
          <line x1="20" y1="20" x2="30" y2="16" />
          <line x1="40" y1="12" x2="50" y2="8" />
          <line x1="60" y1="4" x2="72" y2="-2" />
          <line x1="82" y1="-8" x2="96" y2="-14" />
        </g>
      </g>
      {/* 4 workers (simple stick) */}
      {[
        { x: 140, y: 200, c: 1 },
        { x: 180, y: 210, c: 1 },
        { x: 224, y: 202, c: .7 },
        { x: 262, y: 214, c: .7 },
      ].map((w, i) => (
        <g key={i} transform={`translate(${w.x} ${w.y})`} strokeWidth="1.1" opacity={w.c}>
          {/* hardhat (arc) */}
          <path d="M -6 -20 q 6 -8 12 0 z" fill="currentColor" stroke="none" />
          <line x1="-6" y1="-20" x2="6" y2="-20" />
          {/* head */}
          <circle cx="0" cy="-14" r="4" />
          {/* body */}
          <path d="M 0 -10 L 0 8" />
          <path d="M -6 -2 L 6 -2" />
          <path d="M 0 8 L -5 22 M 0 8 L 5 22" />
        </g>
      ))}
      {/* "350K" big numeric */}
      <g fontFamily="JetBrains Mono" fontSize="11" fill="currentColor" stroke="none" opacity=".55">
        <text x="290" y="250" letterSpacing="2">NEED 350K</text>
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────
// Illustration: CAPITAL / MONEY — stacked coin cylinders
// ─────────────────────────────────────────────
function IllusCapital() {
  return (
    <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none"
      stroke="currentColor" strokeLinejoin="round" strokeLinecap="round">
      <g opacity=".45" strokeWidth=".5">
        {Array.from({ length: 18 }).map((_, i) => (
          <g key={i}>
            <line x1={-40 + i * 26} y1="180" x2={140 + i * 26} y2="280" opacity=".25" />
            <line x1={-40 + i * 26} y1="280" x2={140 + i * 26} y2="180" opacity=".25" />
          </g>
        ))}
      </g>
      {/* Three coin stacks */}
      {[{ x: 110, h: 3 }, { x: 200, h: 5 }, { x: 290, h: 2 }].map((s, i) => (
        <g key={i} transform={`translate(${s.x} 240)`} strokeWidth="1.2">
          {Array.from({ length: s.h }).map((_, j) => (
            <g key={j} transform={`translate(0 ${-j * 16})`}>
              <ellipse cx="0" cy="0" rx="36" ry="12" />
              <path d="M -36 0 L -36 8 A 36 12 0 0 0 36 8 L 36 0" />
              {j === s.h - 1 && <ellipse cx="0" cy="-1" rx="26" ry="8" strokeWidth=".7" opacity=".55" />}
            </g>
          ))}
          {/* symbol on top */}
          <text x="-5" y="-1 + 0" dy={-s.h * 16 + 3} fontFamily="JetBrains Mono" fontSize="12" fontWeight="700"
            fill="currentColor" stroke="none" opacity=".75">₹</text>
        </g>
      ))}
      {/* brackets */}
      <g fontFamily="JetBrains Mono" fontSize="9" fill="currentColor" stroke="none" opacity=".55">
        <text x="88" y="264">₹8,000Cr</text>
      </g>
    </svg>
  );
}

Object.assign(window, {
  IllusAcademy, IllusSupply, IllusAI, IllusCorridor, IllusTalent, IllusCapital,
});
