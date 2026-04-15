import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-5xl font-extrabold text-sky-deep mb-4 animate-float">
          ☁️ Pokopia Planner
        </h1>
        <p className="text-xl text-text-secondary max-w-xl mx-auto">
          Design your dream cloud island. Place buildings, create habitats,
          and share your layout with friends.
        </p>
      </div>

      {/* Single CTA */}
      <Link
        href="/planner"
        className="inline-flex items-center gap-3 bg-sky-deep hover:bg-sky-700 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
      >
        <span className="text-2xl">🗺️</span>
        Open Island Planner
      </Link>
    </div>
  );
}
