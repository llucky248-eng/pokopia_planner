import Link from "next/link";
import Card from "@/components/ui/Card";

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      {/* Hero */}
      <div className="mb-16">
        <h1 className="text-5xl font-extrabold text-sky-deep mb-4 animate-float">
          ☁️ Pokopia Planner
        </h1>
        <p className="text-xl text-text-secondary max-w-xl mx-auto">
          Design your dream cloud island. Place buildings, create habitats,
          and track your progress — all in one place.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        <Link href="/planner" className="group">
          <Card className="hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 text-left h-full">
            <div className="text-4xl mb-3">🗺️</div>
            <h2 className="text-xl font-bold text-sky-deep mb-2">Island Planner</h2>
            <p className="text-text-secondary text-sm">
              Drag and drop buildings, habitats, and terrain onto a grid.
              Share your layout with friends!
            </p>
            <div className="mt-4 text-sky-deep font-semibold text-sm group-hover:translate-x-1 transition-transform">
              Start planning &rarr;
            </div>
          </Card>
        </Link>

        <Link href="/checklist" className="group">
          <Card className="hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 text-left h-full">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-xl font-bold text-sky-deep mb-2">Progress Tracker</h2>
            <p className="text-text-secondary text-sm">
              Track buildings, materials, habitats, Cloud Island goals,
              and Pokemon to befriend.
            </p>
            <div className="mt-4 text-sky-deep font-semibold text-sm group-hover:translate-x-1 transition-transform">
              Track progress &rarr;
            </div>
          </Card>
        </Link>

        <Link href="/guide" className="group">
          <Card className="hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 text-left h-full">
            <div className="text-4xl mb-3">📖</div>
            <h2 className="text-xl font-bold text-sky-deep mb-2">Pokopia Guide</h2>
            <p className="text-text-secondary text-sm">
              Cloud Island tips, building mechanics, materials &amp; crafting,
              habitats, and beginner strategies.
            </p>
            <div className="mt-4 text-sky-deep font-semibold text-sm group-hover:translate-x-1 transition-transform">
              Read guide &rarr;
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
