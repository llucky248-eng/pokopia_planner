"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useGridState } from "@/hooks/useGridState";
import { useShareableLink } from "@/hooks/useShareableLink";
import { getItemById } from "@/data/items";
import CanvasGrid from "@/components/planner/CanvasGrid";
import ItemPalette from "@/components/planner/ItemPalette";
import PlannerToolbar from "@/components/planner/PlannerToolbar";
import PlannerAppBar from "@/components/planner/PlannerAppBar";
import ShareModal from "@/components/planner/ShareModal";
import ImportImageModal from "@/components/planner/ImportImageModal";
import { GRID_SIZE } from "@/lib/constants";
import { SHARE_SLUG_PARAM } from "@/lib/supabase";

const IMPORT_PARAM = "import";
const monoFont = "var(--font-geist-mono, 'JetBrains Mono', monospace)";

export default function PlannerPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center text-[#6b7a92] text-sm">
          Loading planner…
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
  const loadedRef = useRef(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [toolMode, setToolMode] = useState<"place" | "erase" | "measure">("place");
  const [hoveredItemName, setHoveredItemName] = useState<string | null>(null);
  const [measureDimensions, setMeasureDimensions] = useState<{ w: number; h: number } | null>(null);
  const [cursorPos, setCursorPos] = useState<{ row: number; col: number } | null>(null);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    if (searchParams.get(IMPORT_PARAM)) setIsImportOpen(true);
    const slug = searchParams.get(SHARE_SLUG_PARAM);
    if (slug) {
      loadFromSlug(slug).then((g) => { if (g) loadGrid(g); });
    } else {
      const sharedGrid = loadFromUrl(searchParams);
      if (sharedGrid) loadGrid(sharedGrid);
    }
  }, [searchParams, loadFromUrl, loadFromSlug, loadGrid]);

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

  const handleCursorMove = useCallback((cell: { row: number; col: number } | null) => {
    setCursorPos(cell);
  }, []);

  // Keyboard shortcuts: Ctrl/Cmd+Z → undo, Escape → cancel selection/erase.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;

      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      } else if (e.key === "Escape") {
        setSelectedItemId(null);
        setToolMode("place");
        setMeasureDimensions(null);
      } else if (e.key === "e" || e.key === "E") {
        handleToggleErase();
      } else if (e.key === "m" || e.key === "M") {
        handleToggleMeasure();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedItem = selectedItemId ? getItemById(selectedItemId) : null;
  const selectedItemName = selectedItem?.name ?? null;

  const toolLabel =
    toolMode === "erase" ? "erase" : toolMode === "measure" ? "measure" : "brush";

  const itemLabel = toolMode === "place" && selectedItemName
    ? selectedItemName
    : toolMode === "erase" && hoveredItemName
      ? hoveredItemName.replace(/^\S+\s/, "") // strip emoji
      : "—";

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <PlannerAppBar
        onShare={handleShare}
        onImport={() => setIsImportOpen(true)}
        isSharing={isSharing}
      />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#eef3f9] min-h-0">
        <ItemPalette
          selectedItemId={selectedItemId}
          onSelectItem={handleSelectItem}
        />
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <PlannerToolbar itemCount={grid.placements.length} />
          {shareError && (
            <div className="bg-red-50 border-b border-red-200 text-red-700 text-sm px-5 py-2 flex-shrink-0">
              {shareError}
            </div>
          )}
          <div className="flex-1 overflow-auto p-4 lg:p-5 min-h-0">
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
              onToggleErase={handleToggleErase}
              onToggleMeasure={handleToggleMeasure}
              onUndo={undo}
              onClear={clearAll}
              onCursorMove={handleCursorMove}
            />
          </div>

          {/* Status bar */}
          <div
            className="flex items-center justify-between px-4 h-[30px] bg-white flex-shrink-0"
            style={{
              borderTop: "1px solid rgba(20,40,80,0.08)",
              fontFamily: monoFont,
              fontSize: 11,
              color: "#6b7a92",
            }}
          >
            <div className="flex items-center gap-3">
              <span>
                <span className="text-[#a0aec0]">tool</span>
                {" "}
                <span className="text-[#152033] font-medium">{toolLabel}</span>
              </span>
              <span className="text-[#d0d8e4]">|</span>
              <span>
                <span className="text-[#a0aec0]">item</span>
                {" "}
                <span className="text-[#152033] font-medium">{itemLabel}</span>
              </span>
              {cursorPos && (
                <>
                  <span className="text-[#d0d8e4]">|</span>
                  <span>
                    <span className="text-[#a0aec0]">cursor</span>
                    {" "}
                    <span className="text-[#152033] font-medium">
                      {cursorPos.col},&nbsp;{cursorPos.row}
                    </span>
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"
                />
                Autosaved
              </span>
              <span className="text-[#d0d8e4]">|</span>
              <span
                className="inline-flex items-center gap-1 text-[10px] text-[#6b7a92] bg-[#f0f4fa] px-1.5 py-0.5 rounded cursor-pointer hover:bg-[#e4ecf7] transition-colors"
                title="Keyboard shortcuts"
              >
                <kbd className="text-[9px]">?</kbd> shortcuts
              </span>
            </div>
          </div>
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
