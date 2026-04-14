"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { DragDropProvider } from "@dnd-kit/react";
import type { DragEndEvent } from "@dnd-kit/dom";
import { useGridState } from "@/hooks/useGridState";
import { useShareableLink } from "@/hooks/useShareableLink";
import GridCanvas from "@/components/planner/GridCanvas";
import ItemPalette from "@/components/planner/ItemPalette";
import PlannerToolbar from "@/components/planner/PlannerToolbar";
import ShareModal from "@/components/planner/ShareModal";

export default function PlannerPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-text-secondary">
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
  const { grid, placeItem, moveItem, removeItem, clearAll, undo, loadGrid } = useGridState();
  const { generateLink, loadFromUrl } = useShareableLink();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    const sharedGrid = loadFromUrl(searchParams);
    if (sharedGrid) {
      loadGrid(sharedGrid);
    }
    setLoaded(true);
  }, [searchParams, loadFromUrl, loadGrid, loaded]);

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return;
    const { source, target } = event.operation;
    if (!source || !target) return;

    const sourceData = source.data as Record<string, unknown> | undefined;
    const targetData = target.data as Record<string, unknown> | undefined;
    if (!sourceData || !targetData) return;

    if (targetData.type !== "cell") return;
    const row = targetData.row as number;
    const col = targetData.col as number;

    if (sourceData.type === "palette") {
      placeItem(sourceData.itemId as string, row, col);
    } else if (sourceData.type === "placed") {
      moveItem(sourceData.instanceId as string, row, col);
    }
  };

  const handleShare = () => {
    const url = generateLink(grid);
    setShareUrl(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-sky-deep mb-4">Island Planner</h1>
      <DragDropProvider onDragEnd={handleDragEnd}>
        <div className="flex flex-col lg:flex-row gap-4">
          <ItemPalette />
          <div className="flex-1 flex flex-col gap-4">
            <PlannerToolbar
              onUndo={undo}
              onClear={clearAll}
              onShare={handleShare}
              itemCount={grid.placements.length}
            />
            <GridCanvas grid={grid} onRemove={removeItem} />
          </div>
        </div>
      </DragDropProvider>
      {shareUrl && <ShareModal url={shareUrl} onClose={() => setShareUrl(null)} />}
    </div>
  );
}
