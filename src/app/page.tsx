import Link from "next/link";
import pkg from "../../package.json";
import { FEATURES } from "@/data/features";

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      {/* Hero */}
      <div className="mb-10">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-sky-deep/70 bg-sky-light/60 px-3 py-1 rounded-full mb-5">
          v{pkg.version}
        </span>
        <h1 className="text-5xl font-extrabold text-sky-deep mb-5 animate-float">
          ☁️ Pokopia Planner
        </h1>
        <p className="text-xl text-text-secondary max-w-xl mx-auto leading-relaxed">
          A pixel-perfect island planner for Pokopia. Lay out your cloud
          island, import a real-world map, measure buildings, then share
          your plan with a single link.
        </p>
      </div>

      {/* Primary + secondary CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
        <Link
          href="/planner"
          className="inline-flex items-center gap-3 bg-sky-deep hover:bg-sky-700 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
        >
          <span className="text-2xl">🗺️</span>
          Open Island Planner
        </Link>
        <Link
          href="/planner?import=1"
          className="inline-flex items-center gap-3 bg-surface hover:bg-cloud text-sky-deep font-bold text-lg px-8 py-4 rounded-2xl shadow-md hover:shadow-lg border border-sky-base/40 transition-all duration-200 hover:-translate-y-0.5"
        >
          <span className="text-2xl">📥</span>
          Import a Map
        </Link>
      </div>

      {/* Feature chips */}
      <div className="flex flex-wrap justify-center gap-3">
        {FEATURES.map(({ icon, label }) => (
          <span
            key={label}
            className="flex items-center gap-1.5 text-sm font-medium text-text-secondary bg-surface/70 border border-sky-base/30 px-3 py-1.5 rounded-full shadow-sm"
          >
            <span>{icon}</span>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
