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

          <div className="flex items-center gap-3 mt-7">
            <div className="flex">
              {(["🦊", "🐰", "🐧"] as const).map((animal, i) => (
                <span
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#152033] inline-flex items-center justify-center text-base"
                  style={{
                    marginLeft: i === 0 ? 0 : -8,
                    background: ["#ffd27a", "#ffb1c1", "#a8d8e8"][i],
                  }}
                >
                  {animal}
                </span>
              ))}
            </div>
            <span className="text-[13px] text-[#3a4a66]">
              <strong>2,400+ islanders</strong> are planning this week
            </span>
          </div>
        </div>

        {/* Right: preview card */}
        <div className="hidden lg:block relative">
          <div className="relative" style={{ transform: "rotate(1.5deg)" }}>
            {/* Version sticker */}
            <div
              className="absolute -top-3.5 -right-2.5 z-10 text-[12px] font-bold px-3 py-1 rounded-full text-[#152033]"
              style={{
                fontFamily: "var(--font-geist-mono, monospace)",
                background: "#ffd27a",
                border: "2px solid #152033",
                transform: "rotate(8deg)",
                boxShadow: "0 2px 0 rgba(20,32,51,0.2)",
              }}
            >
              v{pkg.version} ✨
            </div>

            {/* Card */}
            <div
              className="bg-white rounded-[18px] overflow-hidden"
              style={{
                border: "2.5px solid #152033",
                boxShadow: "0 10px 0 rgba(20,32,51,0.12), 0 20px 40px -10px rgba(20,40,80,0.18)",
              }}
            >
              {/* Card header */}
              <div
                className="flex items-center gap-2 px-3.5 py-2.5"
                style={{ borderBottom: "2px solid #152033", background: "#fdf6e8" }}
              >
                {["#ff8a8a", "#ffcb47", "#7dd58c"].map((bg) => (
                  <span
                    key={bg}
                    className="w-[11px] h-[11px] rounded-full inline-block"
                    style={{ background: bg, border: "1.5px solid #152033" }}
                  />
                ))}
                <span
                  className="flex-1 text-center text-[12px] text-[#152033] font-semibold"
                  style={{ fontFamily: "var(--font-geist-mono, monospace)" }}
                >
                  cliffside-orchard.pkp
                </span>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-[#152033] bg-white"
                  style={{ fontFamily: "var(--font-geist-mono, monospace)", border: "1.5px solid #152033" }}
                >
                  368×368
                </span>
              </div>

              {/* Canvas preview */}
              <div className="relative bg-[#cfe6fb]" style={{ aspectRatio: "8/5" }}>
                <MiniIslandSVG />

                {/* Tool palette */}
                <div
                  className="absolute left-3 top-3 flex flex-col gap-1 bg-white p-1.5 rounded-xl"
                  style={{ border: "2px solid #152033", boxShadow: "0 3px 0 rgba(20,32,51,0.18)" }}
                >
                  {(["🖌️", "🧽", "📏", "✋"] as const).map((em, i) => (
                    <div
                      key={i}
                      className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-sm"
                      style={i === 0 ? { background: "#fff3e0", border: "1.5px solid #152033" } : {}}
                    >
                      {em}
                    </div>
                  ))}
                </div>

                {/* Coord chip */}
                <div
                  className="absolute right-3 top-3 flex gap-2 bg-white px-2.5 py-1 rounded-full text-[10px] font-semibold text-[#152033]"
                  style={{
                    fontFamily: "var(--font-geist-mono, monospace)",
                    border: "2px solid #152033",
                    boxShadow: "0 2px 0 rgba(20,32,51,0.15)",
                  }}
                >
                  <span>x:184</span>
                  <span>y:212</span>
                  <span className="text-[#3f86d9]">240%</span>
                </div>

                {/* Tooltip */}
                <div
                  className="absolute text-white text-[11px] font-semibold flex gap-1.5 items-center px-2.5 py-1 rounded-lg"
                  style={{
                    fontFamily: "var(--font-geist-mono, monospace)",
                    left: "52%", top: "52%",
                    background: "#152033",
                    border: "2px solid #152033",
                  }}
                >
                  <span>Wooden steps</span>
                  <span className="opacity-60">1×1</span>
                </div>
              </div>
            </div>

            {/* Heart doodle */}
            <svg
              width="26" height="24" viewBox="0 0 24 22" aria-hidden
              className="absolute"
              style={{ left: -22, top: "40%", transform: "rotate(-15deg)" }}
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

function MiniIslandSVG() {
  return (
    <svg viewBox="0 0 480 300" style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <pattern id="mi-grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(63,134,217,0.10)" strokeWidth="0.6" />
        </pattern>
        <linearGradient id="mi-sea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#cfe6fb" /><stop offset="1" stopColor="#a6cdef" />
        </linearGradient>
        <linearGradient id="mi-grass" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#a8dc8f" /><stop offset="1" stopColor="#7ac06a" />
        </linearGradient>
        <linearGradient id="mi-sand" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fce6a8" /><stop offset="1" stopColor="#e9c878" />
        </linearGradient>
      </defs>
      <rect width="480" height="300" fill="url(#mi-sea)" />
      <rect width="480" height="300" fill="url(#mi-grid)" />
      <path d="M70 80 Q160 40 280 60 Q380 60 420 130 Q450 220 360 250 Q240 280 160 260 Q60 240 50 170 Q40 110 70 80 Z" fill="url(#mi-sand)" stroke="#d4b06a" strokeWidth="1.2" />
      <path d="M100 100 Q190 70 280 90 Q360 90 390 150 Q400 210 330 230 Q230 250 170 240 Q98 220 90 170 Q82 130 100 100 Z" fill="url(#mi-grass)" />
      <path d="M200 90 Q220 150 190 200 Q170 240 220 248" stroke="#8fc6ee" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M130 220 Q210 180 290 200 Q340 210 370 170" stroke="#d7a86e" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="2 4" />
      <g>
        <rect x="240" y="130" width="22" height="22" fill="#fff" stroke="#152033" strokeWidth="1.4" rx="2" />
        <rect x="270" y="138" width="18" height="18" fill="#ffd27a" stroke="#152033" strokeWidth="1.4" rx="2" />
        <rect x="296" y="120" width="26" height="20" fill="#ff8a6b" stroke="#152033" strokeWidth="1.4" rx="2" />
        <rect x="258" y="180" width="20" height="20" fill="#fff" stroke="#152033" strokeWidth="1.4" rx="2" />
      </g>
      {[[120, 150], [140, 130], [160, 165], [350, 170], [370, 200], [340, 220], [210, 130], [350, 130], [330, 150], [120, 200], [140, 220]].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy + 3} r="6" fill="rgba(0,40,20,0.18)" />
          <circle cx={cx} cy={cy} r="6" fill="#4a9c3a" stroke="#152033" strokeWidth="1.2" />
        </g>
      ))}
      <rect x="232" y="116" width="100" height="92" fill="rgba(255,125,90,0.10)" stroke="#ff7d5a" strokeWidth="1.6" strokeDasharray="3 3" rx="3" />
    </svg>
  );
}
