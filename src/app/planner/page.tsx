"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGridState } from "@/hooks/useGridState";
import { useShareableLink } from "@/hooks/useShareableLink";
import { getItemById } from "@/data/items";
import CanvasGrid from "@/components/planner/CanvasGrid";
import ItemPalette from "@/components/planner/ItemPalette";
import PlannerToolbar from "@/components/planner/PlannerToolbar";
import ShareModal from "@/components/planner/ShareModal";

export default function PlannerPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-text-secondary">
          Loading planner...
        </div>
      }
    >
      <PlannerContent />
    </Suspense>
  );
}

function PlannerContent() {
  const searchParams = useSearchParams();
  const { grid, placeItem, removeItem, clearAll, undo, loadGrid } = useGridState();
  const { generateLink, loadFromUrl } = useShareableLink();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [toolMode, setToolMode] = useState<"place" | "erase">("place");

  useEffect(() => {
    if (loaded) return;
    const sharedGrid = loadFromUrl(searchParams);
    if (sharedGrid) {
      loadGrid(sharedGrid);
    }
    setLoaded(true);
  }, [searchParams, loadFromUrl, loadGrid, loaded]);

  const handleSelectItem = (itemId: string) => {
    setSelectedItemId((prev) => (prev === itemId ? null : itemId));
    setToolMode("place");
  };

  const handleToggleErase = () => {
    setToolMode((prev) => {
      const next = prev === "erase" ? "place" : "erase";
      if (next === "erase") setSelectedItemId(null);
      return next;
    });
  };

  const handleShare = () => {
    const url = generateLink(grid);
    setShareUrl(url);
  };

  const selectedItem = selectedItemId ? getItemById(selectedItemId) : null;
  const selectedItemName = selectedItem ? `${selectedItem.emoji} ${selectedItem.name}` : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-sky-deep">Island Planner</h1>
        <p className="text-sm text-text-secondary">
          Plan your 368×368 cloud island. Scroll to zoom, drag to pan, right-click to remove items.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <ItemPalette
          selectedItemId={selectedItemId}
          onSelectItem={handleSelectItem}
        />
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <PlannerToolbar
            onUndo={undo}
            onClear={clearAll}
            onShare={handleShare}
            itemCount={grid.placements.length}
            selectedItemName={selectedItemName}
            toolMode={toolMode}
            onToggleErase={handleToggleErase}
          />
          <CanvasGrid
            grid={grid}
            selectedItemId={toolMode === "place" ? selectedItemId : null}
            toolMode={toolMode}
            onPlace={placeItem}
            onRemove={removeItem}
          />
        </div>
      </div>
      {shareUrl && <ShareModal url={shareUrl} onClose={() => setShareUrl(null)} />}
    </div>
  );
}
