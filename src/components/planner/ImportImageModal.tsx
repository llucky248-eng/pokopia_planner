"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { PlacedItem } from "@/types";
import { GRID_SIZE } from "@/lib/constants";
import { drawToGrid, loadImageFile, FitMode } from "@/lib/imageImport/downscale";
import { convertMapToPlacements, ConvertResult } from "@/lib/imageImport/convert";

interface ImportImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (placements: PlacedItem[]) => void;
}

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

const PREVIEW_CSS_SIZE = 256;

export default function ImportImageModal({ isOpen, onClose, onApply }: ImportImageModalProps) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [outputSize, setOutputSize] = useState<number>(128);
  const [fitMode, setFitMode] = useState<FitMode>("fit");

  // Road detection: max saturation % (0-50). Higher = more colors count as roads.
  const [roadSatMax, setRoadSatMax] = useState<number>(20);
  const [debouncedRoadSat, setDebouncedRoadSat] = useState<number>(20);

  // Nature detection: min saturation % to classify green/blue as nature (skipped).
  // Lower = more aggressive nature skipping (fewer walls placed).
  const [natureSatMin, setNatureSatMin] = useState<number>(18);
  const [debouncedNatureSat, setDebouncedNatureSat] = useState<number>(18);

  const [result, setResult] = useState<ConvertResult | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Debounce sliders.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedRoadSat(roadSatMax), 150);
    return () => clearTimeout(t);
  }, [roadSatMax]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedNatureSat(natureSatMin), 150);
    return () => clearTimeout(t);
  }, [natureSatMin]);

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
      const res = convertMapToPlacements(imageData, {
        outputSize,
        roadSatMax: debouncedRoadSat,
        roadBriMin: 30,
        roadBriMax: 85,
        natureSatMin: debouncedNatureSat,
      });
      setResult(res);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
      setResult(null);
    }
  }, [img, outputSize, fitMode, debouncedRoadSat, debouncedNatureSat]);

  // Paint the preview canvas whenever the result updates.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !result) return;
    canvas.width = PREVIEW_CSS_SIZE;
    canvas.height = PREVIEW_CSS_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Checkerboard background to show empty cells.
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

  const placementCount = result?.placements.length ?? 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl shadow-2xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-sky-deep mb-1">Import Map</h3>
        <p className="text-sm text-text-secondary mb-4">
          Upload a real-world map or satellite image. Buildings become filled
          walls; gray roads become paths; green/blue areas (parks, water) are
          left empty. Adjust the sliders to tune detection.
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column: input & options */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-text-primary">Map image</span>
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
                  alt="Source map"
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
              <span className="text-xs font-semibold text-text-primary">
                Road sensitivity — max color ({roadSatMax}%)
              </span>
              <input
                type="range"
                min={0}
                max={50}
                value={roadSatMax}
                onChange={(e) => setRoadSatMax(Number(e.target.value))}
              />
              <span className="text-xs text-text-secondary">
                Higher = more gray-ish pixels treated as roads.
              </span>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-text-primary">
                Nature tolerance — skip green/blue ({natureSatMin}%)
              </span>
              <input
                type="range"
                min={5}
                max={60}
                value={natureSatMin}
                onChange={(e) => setNatureSatMin(Number(e.target.value))}
              />
              <span className="text-xs text-text-secondary">
                Lower = skip more parks/water. Higher = fill more pixels as walls.
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
                : "Upload a map to preview"}
            </div>
            {result && (
              <div className="text-xs text-text-secondary flex gap-3">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-sm bg-gray-500" />
                  Walls (Iron wall)
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-sm bg-stone-400" />
                  Roads (Stone flooring)
                </span>
              </div>
            )}
            {error && <div className="text-xs text-red-500">{error}</div>}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleApply} disabled={!result}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
