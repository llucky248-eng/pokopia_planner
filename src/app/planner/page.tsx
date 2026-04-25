"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useGridState } from "@/hooks/useGridState";
import { useShareableLink } from "@/hooks/useShareableLink";
import { getItemById } from "@/data/items";
import CanvasGrid from "@/components/planner/CanvasGrid";
import ItemPalette from "@/components/planner/ItemPalette";
import PlannerToolbar from "@/components/planner/PlannerToolbar";
import ShareModal from "@/components/planner/ShareModal";
import ImportImageModal from "@/components/planner/ImportImageModal";
import { GRID_SIZE } from "@/lib/constants";

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
  const { grid, placeItem, removeItem, clearAll, undo, loadGrid,
          beginPaintStroke, paintCellInStroke, endPaintStroke,
          beginEraseStroke, eraseCellInStroke, endEraseStroke } = useGridState();
  const { saveShare, loadFromUrl, loadFromSlug } = useShareableLink();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [toolMode, setToolMode] = useState<"place" | "erase" | "measure">("place");
  const [hoveredItemName, setHoveredItemName] = useState<string | null>(null);
  const [measureDimensions, setMeasureDimensions] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    if (loaded) return;
    let cancelled = false;
    const slug = searchParams.get("s");
    if (slug) {
      setLoaded(true);
      loadFromSlug(slug).then((g) => {
        if (!cancelled && g) loadGrid(g);
      });
    } else {
      const sharedGrid = loadFromUrl(searchParams);
      if (sharedGrid) loadGrid(sharedGrid);
      setLoaded(true);
    }
    return () => { cancelled = true; };
  }, [searchParams, loadFromUrl, loadFromSlug, loadGrid, loaded]);

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

  const handleToggleMeasure = () => {
    setToolMode((prev) => (prev === "measure" ? "place" : "measure"));
    setMeasureDimensions(null);
  };

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    setShareError(null);
    try {
      const url = await saveShare(grid);
      setShareUrl(url);
    } catch {
      setShareError("Couldn't create a share link. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  const handleHoverItem = useCallback((name: string | null) => {
    setHoveredItemName(name);
  }, []);

  const handleMeasure = useCallback((dims: { w: number; h: number } | null) => {
    setMeasureDimensions(dims);
  }, []);

  // Keyboard shortcuts: Ctrl/Cmd+Z → undo, Escape → cancel selection/erase.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Skip if focus is inside an input/select/textarea (e.g. the import modal).
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;

      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      } else if (e.key === "Escape") {
        setSelectedItemId(null);
        setToolMode("place");
        setMeasureDimensions(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo]);

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
            onImport={() => setIsImportOpen(true)}
            itemCount={grid.placements.length}
            selectedItemName={selectedItemName}
            hoveredItemName={hoveredItemName}
            measureDimensions={measureDimensions}
            toolMode={toolMode}
            onToggleErase={handleToggleErase}
            onToggleMeasure={handleToggleMeasure}
            isSharing={isSharing}
          />
          {shareError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-2">
              {shareError}
            </div>
          )}
          <CanvasGrid
            grid={grid}
            selectedItemId={toolMode === "place" ? selectedItemId : null}
            toolMode={toolMode}
            onPlace={placeItem}
            onRemove={removeItem}
            onHoverItem={handleHoverItem}
            onMeasure={handleMeasure}
            onBeginPaint={beginPaintStroke}
            onPaintCell={paintCellInStroke}
            onEndPaint={endPaintStroke}
            onBeginErase={beginEraseStroke}
            onEraseCell={eraseCellInStroke}
            onEndErase={endEraseStroke}
          />
        </div>
      </div>
      {shareUrl && <ShareModal url={shareUrl} onClose={() => setShareUrl(null)} />}
      <ImportImageModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onApply={(placements) => loadGrid({ size: GRID_SIZE, placements })}
      />
    </div>
  );
}
