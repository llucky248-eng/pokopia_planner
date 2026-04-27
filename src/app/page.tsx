import Link from "next/link";
import pkg from "../../package.json";

const FEATURES = [
  { ic: "🗺️", t: "368 × 368 grid", s: "Tile-perfect." },
  { ic: "🖌️", t: "Click or drag", s: "Paint anywhere." },
  { ic: "🧽", t: "Drag to erase", s: "No undo dance." },
  { ic: "📥", t: "Import maps", s: "Trace from real life." },
  { ic: "📏", t: "Measure tool", s: "To the half-tile." },
  { ic: "🔗", t: "Share as link", s: "No sign-in." },
];

export default function HomePage() {
  return (
    <div
      className="relative overflow-hidden flex-1 flex flex-col"
      style={{ background: "linear-gradient(180deg, #d8eafa 0%, #eaf4fd 50%, #fdf6e8 100%)" }}
    >
      {/* Cloud field */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <CloudShape left="4%" top="12%" size={120} opacity={0.85} />
        <CloudShape left="80%" top="8%" size={150} opacity={0.85} />
        <CloudShape left="14%" top="78%" size={170} opacity={0.7} />
        <CloudShape left="86%" top="68%" size={130} opacity={0.7} />
        <CloudShape left="60%" top="86%" size={100} opacity={0.8} />
        <StarShape left="22%" top="22%" small={false} />
        <StarShape left="74%" top="26%" small={false} />
        <StarShape left="42%" top="14%" small />
        <StarShape left="90%" top="44%" small />
        <StarShape left="10%" top="50%" small />
      </div>

      {/* Hero */}
      <section className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-8 sm:px-14 pt-10 pb-6 items-center">
        {/* Left: copy */}
        <div>
          <div
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-5 bg-white text-[#152033]"
            style={{ border: "2px solid #152033", boxShadow: "0 2px 0 rgba(20,32,51,0.15)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z" fill="#ff7d5a" />
            </svg>
            A pixel-perfect island planner
          </div>

          <h1 className="text-5xl lg:text-[64px] font-bold leading-[1.02] tracking-[-0.03em] text-[#152033] m-0">
            Plan your<br />
            <span
              className="italic font-medium text-[#3f86d9]"
              style={{ fontFamily: "var(--font-newsreader, Georgia, serif)" }}
            >
              cloud island
            </span>
            <svg
              width="120" height="14" viewBox="0 0 120 14"
              className="block" style={{ marginTop: -4 }} aria-hidden
            >
              <path
                d="M2 8 Q10 2 18 8 T34 8 T50 8 T66 8 T82 8 T98 8 T118 8"
                fill="none" stroke="#ff7d5a" strokeWidth="3" strokeLinecap="round"
              />
            </svg>
            ,<br />tile&nbsp;by&nbsp;tile.
          </h1>

          <p className="mt-5 text-[17px] leading-relaxed text-[#3a4a66] max-w-[480px]">
            Drop a real-world map onto a 368&nbsp;×&nbsp;368 grid, paint
            buildings, paths and trees, then share the whole plan with one
            cute little link.
          </p>

          <div className="flex flex-wrap gap-3 mt-7">
            <Link
              href="/planner"
              className="inline-flex items-center gap-2.5 text-white text-[15px] font-bold px-5 py-3 rounded-[14px] transition-transform hover:-translate-y-px"
              style={{ background: "#ff7d5a", border: "2px solid #152033", boxShadow: "0 4px 0 rgba(20,32,51,0.25)" }}
            >
              <span className="text-lg">🗺️</span>
              Open Island Planner
            </Link>
            <Link
              href="/planner?import=1"
              className="inline-flex items-center gap-2.5 bg-white text-[#152033] text-[15px] font-bold px-5 py-3 rounded-[14px] transition-transform hover:-translate-y-px"
              style={{ border: "2px solid #152033", boxShadow: "0 4px 0 rgba(20,32,51,0.18)" }}
            >
              <span className="text-lg">📥</span>
              Import a map
            </Link>
          </div>

        </div>

        {/* Right: floating island scene */}
        <div className="hidden lg:block relative">
          <div className="relative">
            <FloatingIsland />

            {/* Floating sticker: version */}
            <div
              className="absolute text-[11px] font-bold px-2.5 py-1 rounded-full text-[#152033]"
              style={{
                fontFamily: "var(--font-geist-mono, monospace)",
                background: "#ffd27a",
                border: "2px solid #152033",
                top: "8%", right: "6%",
                transform: "rotate(8deg)",
                boxShadow: "0 2px 0 rgba(20,32,51,0.2)",
              }}
            >
              v{pkg.version} ✨
            </div>

            {/* Floating sticker: item name */}
            <div
              className="absolute text-white text-[11px] font-semibold flex gap-1.5 items-center px-2.5 py-1 rounded-lg"
              style={{
                fontFamily: "var(--font-geist-mono, monospace)",
                left: "14%", bottom: "28%",
                background: "#152033",
                border: "2px solid #152033",
                boxShadow: "0 2px 6px rgba(20,32,51,0.25)",
              }}
            >
              <span>Wooden steps</span>
              <span className="opacity-60">1×1</span>
            </div>

            {/* Floating sticker: coords */}
            <div
              className="absolute flex gap-2 bg-white px-2.5 py-1 rounded-full text-[10px] font-semibold text-[#152033]"
              style={{
                fontFamily: "var(--font-geist-mono, monospace)",
                right: "12%", bottom: "22%",
                border: "2px solid #152033",
                boxShadow: "0 2px 0 rgba(20,32,51,0.15)",
              }}
            >
              <span>x:184</span>
              <span>y:212</span>
              <span className="text-[#3f86d9]">240%</span>
            </div>

            {/* Heart doodle */}
            <svg
              width="26" height="24" viewBox="0 0 24 22" aria-hidden
              className="absolute"
              style={{ left: "8%", top: "42%", transform: "rotate(-15deg)" }}
            >
              <path
                d="M12 21 C12 21 2 14 2 7 A5 5 0 0112 7 A5 5 0 0122 7 C22 14 12 21 12 21 Z"
                fill="#ffb1c1" stroke="#152033" strokeWidth="1.6" strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Features rail */}
      <section
        className="relative z-10 mx-8 sm:mx-14 mb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 bg-white rounded-[18px]"
        style={{
          border: "2px solid #152033",
          boxShadow: "0 4px 0 rgba(20,32,51,0.12)",
          padding: "14px 18px",
        }}
      >
        {FEATURES.map(({ ic, t, s }, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 px-3 py-1"
            style={{ borderRight: i < FEATURES.length - 1 ? "1px dashed rgba(20,32,51,0.18)" : "none" }}
          >
            <span
              className="text-lg w-9 h-9 flex items-center justify-center rounded-[10px] flex-shrink-0"
              style={{ background: "#fff3e0", border: "1.5px solid #152033" }}
            >
              {ic}
            </span>
            <div>
              <div className="text-[13px] font-bold text-[#152033] leading-tight">{t}</div>
              <div className="text-[11.5px] text-[#6b7a92] mt-0.5">{s}</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function CloudShape({ left, top, size, opacity }: { left: string; top: string; size: number; opacity: number }) {
  return (
    <svg
      viewBox="0 0 200 110"
      width={size}
      style={{ position: "absolute", left, top, opacity, filter: "drop-shadow(0 4px 0 rgba(63,134,217,0.05))" }}
      aria-hidden
    >
      <path
        d="M30 80 Q8 78 14 58 Q0 44 22 36 Q24 16 48 22 Q60 4 82 16 Q102 0 122 18 Q150 8 162 32 Q190 32 190 58 Q204 72 188 84 Q178 96 154 90 L42 90 Q22 94 30 80 Z"
        fill="white" stroke="#bcd9f0" strokeWidth="2.5" strokeLinejoin="round"
      />
    </svg>
  );
}

function StarShape({ left, top, small }: { left: string; top: string; small: boolean }) {
  const size = small ? 14 : 20;
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      style={{ position: "absolute", left, top, opacity: 0.7 }}
      aria-hidden
    >
      <path d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z" fill="#7CB8F2" />
    </svg>
  );
}

function FloatingIsland() {
  return (
    <svg viewBox="0 0 560 520" style={{ width: "100%", height: "auto", display: "block" }} aria-hidden>
      <defs>
        <pattern id="fi-grid16" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(63,134,217,0.08)" strokeWidth="0.5" />
        </pattern>
        <pattern id="fi-grid8" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(63,134,217,0.05)" strokeWidth="0.4" />
        </pattern>
        <linearGradient id="fi-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#d8eafa" />
          <stop offset="1" stopColor="#eaf4fd" />
        </linearGradient>
        <linearGradient id="fi-cliff" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#c4a06a" />
          <stop offset="1" stopColor="#9a7a48" />
        </linearGradient>
        <linearGradient id="fi-grass" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#b0dc90" />
          <stop offset="1" stopColor="#7ac060" />
        </linearGradient>
        <linearGradient id="fi-sand" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f4d898" />
          <stop offset="1" stopColor="#e0c070" />
        </linearGradient>
        <linearGradient id="fi-water" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#a8d8f8" />
          <stop offset="1" stopColor="#78b8e8" />
        </linearGradient>
        <filter id="fi-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="rgba(20,40,80,0.14)" />
        </filter>
      </defs>

      {/* Sky background */}
      <rect width="560" height="520" fill="url(#fi-sky)" />

      {/* Island group with shadow */}
      <g filter="url(#fi-shadow)">
        {/* Cliff / rock base */}
        <path
          d="M110 370 Q130 410 200 430 Q280 450 360 430 Q430 410 450 370 Q470 330 450 305 L110 305 Q90 330 110 370 Z"
          fill="url(#fi-cliff)" stroke="#8a6030" strokeWidth="1.2"
        />

        {/* Sandy beach layer */}
        <path
          d="M125 308 Q200 290 280 285 Q360 290 435 308 Q440 280 420 262 L140 262 Q120 280 125 308 Z"
          fill="url(#fi-sand)" stroke="#c8a050" strokeWidth="1"
        />

        {/* Main grass area */}
        <path
          d="M145 265 Q210 238 280 232 Q350 238 415 260 Q430 230 408 206 Q370 185 280 180 Q190 185 152 206 Q130 230 145 265 Z"
          fill="url(#fi-grass)" stroke="#5a9040" strokeWidth="1"
        />

        {/* Cliff face detail */}
        <path d="M130 320 Q200 310 280 307 Q360 310 430 320" stroke="#a07840" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M120 345 Q200 335 280 332 Q360 335 440 345" stroke="#a07840" strokeWidth="1" fill="none" opacity="0.3" />

        {/* Grid overlay on grass */}
        <clipPath id="fi-grass-clip">
          <path d="M145 265 Q210 238 280 232 Q350 238 415 260 Q430 230 408 206 Q370 185 280 180 Q190 185 152 206 Q130 230 145 265 Z" />
        </clipPath>
        <rect x="145" y="180" width="285" height="90" fill="url(#fi-grid16)" clipPath="url(#fi-grass-clip)" />
        <rect x="145" y="180" width="285" height="90" fill="url(#fi-grid8)" clipPath="url(#fi-grass-clip)" />

        {/* River */}
        <path
          d="M236 232 Q230 265 234 300 Q236 320 240 350"
          stroke="url(#fi-water)" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.85"
        />
        <path
          d="M236 232 Q230 265 234 300 Q236 320 240 350"
          stroke="#a8d8f8" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.4"
        />

        {/* Path / road */}
        <path
          d="M168 275 Q210 262 258 258 Q300 257 340 265 Q378 276 408 295"
          stroke="#d4a860" strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray="5 7"
        />

        {/* Buildings */}
        {/* House 1 - white walls, blue roof */}
        <rect x="256" y="230" width="24" height="22" fill="white" stroke="#152033" strokeWidth="1.2" rx="1.5" />
        <polygon points="254,230 280,230 267,218" fill="#6aabdf" stroke="#152033" strokeWidth="1.2" strokeLinejoin="round" />
        <rect x="263" y="238" width="7" height="8" fill="#c8e4f8" stroke="#152033" strokeWidth="0.8" rx="0.5" />

        {/* House 2 - cream walls, coral roof */}
        <rect x="292" y="235" width="22" height="20" fill="#fff8ec" stroke="#152033" strokeWidth="1.2" rx="1.5" />
        <polygon points="290,235 314,235 302,224" fill="#ff8a6b" stroke="#152033" strokeWidth="1.2" strokeLinejoin="round" />
        <rect x="298" y="243" width="6" height="8" fill="#ffd6c8" stroke="#152033" strokeWidth="0.8" rx="0.5" />

        {/* House 3 - white walls, golden roof, larger */}
        <rect x="330" y="222" width="30" height="26" fill="white" stroke="#152033" strokeWidth="1.2" rx="1.5" />
        <polygon points="328,222 360,222 344,208" fill="#ffd27a" stroke="#152033" strokeWidth="1.2" strokeLinejoin="round" />
        <rect x="337" y="232" width="7" height="10" fill="#ffedb8" stroke="#152033" strokeWidth="0.8" rx="0.5" />
        <rect x="349" y="232" width="7" height="10" fill="#c8e4f8" stroke="#152033" strokeWidth="0.8" rx="0.5" />

        {/* House 4 - small, green roof */}
        <rect x="174" y="248" width="18" height="18" fill="white" stroke="#152033" strokeWidth="1.2" rx="1.5" />
        <polygon points="172,248 192,248 182,237" fill="#7ac060" stroke="#152033" strokeWidth="1.2" strokeLinejoin="round" />

        {/* House 5 - pink roof */}
        <rect x="278" y="265" width="20" height="18" fill="#fff8ec" stroke="#152033" strokeWidth="1.2" rx="1.5" />
        <polygon points="276,265 298,265 287,254" fill="#ffb1c1" stroke="#152033" strokeWidth="1.2" strokeLinejoin="round" />

        {/* Trees (pom-pom style) */}
        {[
          [152, 240], [168, 225], [192, 235],
          [212, 220], [362, 220], [382, 232],
          [350, 240], [398, 248], [155, 265],
          [415, 235], [220, 250], [195, 260],
          [388, 265], [170, 280], [360, 275],
          [200, 270], [410, 258], [228, 260],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy + 3} r="7" fill="rgba(0,40,20,0.12)" />
            <circle cx={cx} cy={cy} r="7" fill="#5aac46" stroke="#3a7a2e" strokeWidth="1" />
            <circle cx={cx} cy={cy} r="4" fill="#70c458" />
          </g>
        ))}

        {/* Selection rectangle: PLAZA */}
        <rect x="247" y="215" width="118" height="82" fill="rgba(255,125,90,0.08)" stroke="#ff7d5a" strokeWidth="1.8" strokeDasharray="4 4" rx="2" />
        <rect x="247" y="207" width="78" height="13" fill="#ff7d5a" rx="2" />
        <text x="252" y="217" fill="white" fontSize="8" fontWeight="700" fontFamily="monospace" letterSpacing="0.5">PLAZA · 8×6 tiles</text>
      </g>

      {/* Floating island shadow */}
      <ellipse cx="280" cy="430" rx="200" ry="18" fill="rgba(20,40,80,0.07)" />

      {/* Mascot cloud (top-left, peeking) */}
      <g transform="translate(42, 58) scale(0.72)">
        <defs>
          <linearGradient id="fi-cloud-mascot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b8d8f4" />
            <stop offset="1" stopColor="#7cb8e8" />
          </linearGradient>
        </defs>
        <path
          d="M40 116 Q12 114 20 84 Q4 64 28 54 Q32 26 60 32 Q74 8 102 22 Q132 4 152 28 Q186 28 186 66 Q200 84 184 104 Q174 124 146 120 L52 120 Q34 124 40 116 Z"
          fill="url(#fi-cloud-mascot)" stroke="#7898c0" strokeWidth="3" strokeLinejoin="round"
        />
        <circle cx="78" cy="72" r="5" fill="#152033" />
        <circle cx="118" cy="72" r="5" fill="#152033" />
        <circle cx="80" cy="70" r="1.6" fill="white" />
        <circle cx="120" cy="70" r="1.6" fill="white" />
        <path d="M86 90 Q98 98 110 90" stroke="#152033" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <ellipse cx="60" cy="86" rx="5" ry="3" fill="#ffb1c1" opacity="0.75" />
        <ellipse cx="138" cy="86" rx="5" ry="3" fill="#ffb1c1" opacity="0.75" />
      </g>

      {/* Small decorative cloud (top-right) */}
      <g transform="translate(430, 32) scale(0.45)">
        <path
          d="M30 80 Q8 78 14 58 Q0 44 22 36 Q24 16 48 22 Q60 4 82 16 Q102 0 122 18 Q150 8 162 32 Q190 32 190 58 Q204 72 188 84 Q178 96 154 90 L42 90 Q22 94 30 80 Z"
          fill="white" stroke="#bcd9f0" strokeWidth="3" strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
