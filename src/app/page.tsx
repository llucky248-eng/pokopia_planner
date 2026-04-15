"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Card from "@/components/ui/Card";
import ImportImageModal from "@/components/planner/ImportImageModal";
import { PlacedItem, GridState } from "@/types";
import { GRID_SIZE, LOCAL_STORAGE_GRID_KEY } from "@/lib/constants";

export default function HomePage() {
  const router = useRouter();
  const [isImportOpen, setIsImportOpen] = useState(false);

  const handleApplyImport = (placements: PlacedItem[]) => {
    const grid: GridState = { size: GRID_SIZE, placements };
    try {
      localStorage.setItem(LOCAL_STORAGE_GRID_KEY, JSON.stringify(grid));
    } catch {
      // localStorage full / unavailable — still navigate so user sees in-memory state.
    }
    router.push("/planner");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      {/* Hero */}
      <div className="mb-16">
        <h1 className="text-5xl font-extrabold text-sky-deep mb-4 animate-float">
          ☁️ Pokopia Planner
        </h1>
        <p className="text-xl text-text-secondary max-w-xl mx-auto">
          Design your dream cloud island. Place buildings, create habitats,
          or import a real-world map to start from.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
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

        <button
          type="button"
          onClick={() => setIsImportOpen(true)}
          className="group text-left"
        >
          <Card className="hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 text-left h-full">
            <div className="text-4xl mb-3">🛰️</div>
            <h2 className="text-xl font-bold text-sky-deep mb-2">Import Map</h2>
            <p className="text-text-secondary text-sm">
              Upload a real-world map or satellite image. Buildings become
              walls, roads become paths — ready to edit and share.
            </p>
            <div className="mt-4 text-sky-deep font-semibold text-sm group-hover:translate-x-1 transition-transform">
              Upload &amp; convert &rarr;
            </div>
          </Card>
        </button>
      </div>

      <ImportImageModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onApply={handleApplyImport}
      />
    </div>
  );
}
