export default function CloudDecor() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {/* Large cloud top-left */}
      <svg className="absolute top-16 -left-8 w-48 h-24 text-white/40 animate-float-slow" viewBox="0 0 200 100" fill="currentColor">
        <ellipse cx="60" cy="60" rx="55" ry="30" />
        <ellipse cx="100" cy="45" rx="45" ry="35" />
        <ellipse cx="145" cy="55" rx="50" ry="28" />
      </svg>

      {/* Small cloud top-right */}
      <svg className="absolute top-32 right-12 w-32 h-16 text-white/30 animate-float" viewBox="0 0 200 100" fill="currentColor">
        <ellipse cx="70" cy="55" rx="50" ry="25" />
        <ellipse cx="120" cy="48" rx="40" ry="30" />
        <ellipse cx="155" cy="55" rx="35" ry="22" />
      </svg>

      {/* Medium cloud middle-right */}
      <svg className="absolute top-[50%] right-0 w-40 h-20 text-white/20 animate-float-delay" viewBox="0 0 200 100" fill="currentColor">
        <ellipse cx="55" cy="58" rx="48" ry="26" />
        <ellipse cx="105" cy="46" rx="42" ry="32" />
        <ellipse cx="148" cy="56" rx="44" ry="24" />
      </svg>

      {/* Bottom-left cloud */}
      <svg className="absolute bottom-24 left-16 w-36 h-18 text-white/25 animate-float-slow" viewBox="0 0 200 100" fill="currentColor">
        <ellipse cx="65" cy="56" rx="50" ry="28" />
        <ellipse cx="110" cy="44" rx="38" ry="30" />
        <ellipse cx="150" cy="54" rx="42" ry="24" />
      </svg>
    </div>
  );
}
