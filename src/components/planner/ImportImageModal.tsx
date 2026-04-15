"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { ItemCategory, PlacedItem } from "@/types";
import { GRID_SIZE } from "@/lib/constants";
import { buildPalette } from "@/lib/imageImport/palette";
import { drawToGrid, loadImageFile, FitMode } from "@/lib/imageImport/downscale";
import { convertImageDataToPlacements, ConvertResult } from "@/lib/imageImport/convert";

interface ImportImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (placements: PlacedItem[]) => void;
}

type PaletteChoice = "all" | ItemCategory;

const OUTPUT_SIZES: { value: number; label: string }[] = [
  { value: 64, label: "64×64 (tiny)" },
  { value: 96, label: "96×96 (small)" },
  { value: 128, label: "128×128 (default)" },
  { value: 256, label: "256×256 (large)" },
  { value: GRID_SIZE, label: `${GRID_SIZE}×${GRID_SIZE} (full island)` },
];

const FIT_MODES: { value: FitMode; label: string }[] = [
  { value: "fit", label: "Fit" },
  { value: "fill", label: "Fill" },
  { value: "stretch", label: "Stretch" },
];

const PALETTE_CHOICES: { value: PaletteChoice; label: string }[] = [
  { value: "all", label: "All catalog" },
  { value: "buildings", label: "Buildings" },
  { value: "blocks", label: "Blocks" },
  { value: "nature", label: "Nature" },
  { value: "outdoor", label: "Outdoor" },
  { value: "furniture", label: "Furniture" },
  { value: "utilities", label: "Utilities" },
  { value: "materials", label: "Materials" },
  { value: "food", label: "Food" },
  { value: "misc", label: "Misc." },
  { value: "kits", label: "Kits" },
  { value: "key-items", label: "Key Items" },
  { value: "other", label: "Other" },
  { value: "lost-relics-l", label: "Relics (L)" },
  { value: "lost-relics-s", label: "Relics (S)" },
  { value: "fossils", label: "Fossils" },
];

const PREVIEW_CSS_SIZE = 256;

export default function ImportImageModal({ isOpen, onClose, onApply }: ImportImageModalProps) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [outputSize, setOutputSize] = useState<number>(128);
  const [fitMode, setFitMode] = useState<FitMode>("fit");
  const [categoryId, setCategoryId] = useState<PaletteChoice>("all");
  const [alphaThreshold, setAlphaThreshold] = useState<number>(128);
  const [debouncedAlpha, setDebouncedAlpha] = useState<number>(128);

  const [result, setResult] = useState<ConvertResult | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const palette = useMemo(() => buildPalette(categoryId), [categoryId]);

  // Debounce alpha threshold for smooth slider.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedAlpha(alphaThreshold), 150);
    return () => clearTimeout(t);
  }, [alphaThreshold]);

  // Reset state when modal closes.
  useEffect(() => {
    if (isOpen) return;
    if (thumbUrl) URL.revokeObjectURL(thumbUrl);
    setImg(null);
    setFileName("");
    setThumbUrl(null);
    setError(null);
    setResult(null);
    // Keep option selections for next open — convenient.
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Clean up thumb URL on unmount.
  useEffect(() => {
    return () => {
      if (thumbUrl) URL.revokeObjectURL(thumbUrl);
    };
  }, [thumbUrl]);

  // Recompute conversion when inputs change.
  useEffect(() => {
    if (!img) {
      setResult(null);
      return;
    }
    try {
      const imageData = drawToGrid(img, outputSize, fitMode);
      const res = convertImageDataToPlacements(imageData, {
        outputSize,
        fitMode,
        alphaThreshold: debouncedAlpha,
        palette,
      });
      setResult(res);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
      setResult(null);
    }
  }, [img, outputSize, fitMode, debouncedAlpha, palette]);

  // Paint the preview canvas whenever the result updates.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !result) return;
    canvas.width = PREVIEW_CSS_SIZE;
    canvas.height = PREVIEW_CSS_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw checkerboard background to show transparent pixels.
    const checker = 8;
    for (let yy = 0; yy < PREVIEW_CSS_SIZE; yy += checker) {
      for (let xx = 0; xx < PREVIEW_CSS_SIZE; xx += checker) {
        const odd = ((xx / checker) + (yy / checker)) & 1;
        ctx.fillStyle = odd ? "#f1f5f9" : "#e2e8f0";
        ctx.fillRect(xx, yy, checker, checker);
      }
    }

    const off = document.createElement("canvas");
    off.width = result.outputSize;
    off.height = result.outputSize;
    const offCtx = off.getContext("2d");
    if (!offCtx) return;
    const imageData = new ImageData(
      new Uint8ClampedArray(result.previewPixels),
      result.outputSize,
      result.outputSize,
    );
    offCtx.putImageData(imageData, 0, 0);

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(off, 0, 0, PREVIEW_CSS_SIZE, PREVIEW_CSS_SIZE);
  }, [result]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    if (thumbUrl) URL.revokeObjectURL(thumbUrl);
    const newThumbUrl = URL.createObjectURL(file);
    setThumbUrl(newThumbUrl);
    setFileName(file.name);
    try {
      const loaded = await loadImageFile(file);
      setImg(loaded);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load image");
      setImg(null);
    }
  };

  const handleApply = () => {
    if (!result) return;
    onApply(result.placements);
    onClose();
  };

  if (!isOpen) return null;

  const paletteEmpty = palette.length === 0;
  const placementCount = result?.placements.length ?? 0;
  const applyDisabled = !result || paletteEmpty;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl shadow-2xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-sky-deep mb-1">Import Image</h3>
        <p className="text-sm text-text-secondary mb-4">
          Upload a picture and convert it into a starting plan. You can edit and
          share the result afterwards.
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column: input & options */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-text-primary">Image file</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-full file:border-0 file:bg-sky-deep file:text-white file:cursor-pointer file:hover:bg-sky-700"
              />
              {fileName && (
                <span className="text-xs text-text-secondary truncate">{fileName}</span>
              )}
            </label>

            {thumbUrl && (
              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbUrl}
                  alt="Source preview"
                  className="max-h-48 max-w-full rounded-xl border border-gray-200 object-contain"
                />
              </div>
            )}

            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-text-primary">Output size</span>
              <select
                value={outputSize}
                onChange={(e) => setOutputSize(Number(e.target.value))}
                className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-cloud-soft text-text-primary"
              >
                {OUTPUT_SIZES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              {outputSize === GRID_SIZE && (
                <span className="text-xs text-orange-500">
                  Large outputs may exceed shareable URL length.
                </span>
              )}
            </label>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-text-primary">Fit mode</span>
              <div className="flex gap-2">
                {FIT_MODES.map((m) => (
                  <label key={m.value} className="flex items-center gap-1 text-sm">
                    <input
                      type="radio"
                      name="fitMode"
                      value={m.value}
                      checked={fitMode === m.value}
                      onChange={() => setFitMode(m.value)}
                    />
                    {m.label}
                  </label>
                ))}
              </div>
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-text-primary">Palette</span>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value as PaletteChoice)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-cloud-soft text-text-primary"
              >
                {PALETTE_CHOICES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <span className="text-xs text-text-secondary">
                {palette.length} color{palette.length !== 1 ? "s" : ""} available
                {paletteEmpty && " — no 1×1 items in this category"}
              </span>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-text-primary">
                Alpha threshold ({alphaThreshold})
              </span>
              <input
                type="range"
                min={0}
                max={255}
                value={alphaThreshold}
                onChange={(e) => setAlphaThreshold(Number(e.target.value))}
              />
              <span className="text-xs text-text-secondary">
                Pixels below this alpha are skipped (leave empty).
              </span>
            </label>
          </div>

          {/* Right column: result preview */}
          <div className="flex-1 flex flex-col gap-2 items-center md:items-start min-w-0">
            <span className="text-xs font-semibold text-text-primary self-start">Preview</span>
            <canvas
              ref={canvasRef}
              width={PREVIEW_CSS_SIZE}
              height={PREVIEW_CSS_SIZE}
              style={{ imageRendering: "pixelated", width: PREVIEW_CSS_SIZE, height: PREVIEW_CSS_SIZE }}
              className="rounded-xl border border-gray-200 bg-cloud-soft"
            />
            <div className="text-xs text-text-secondary">
              {result
                ? `${placementCount} item${placementCount !== 1 ? "s" : ""} · centered on ${GRID_SIZE}×${GRID_SIZE}`
                : "Upload an image to preview"}
            </div>
            {error && <div className="text-xs text-red-500">{error}</div>}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleApply} disabled={applyDisabled}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
