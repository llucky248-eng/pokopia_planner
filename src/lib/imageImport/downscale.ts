export type FitMode = "stretch" | "fit" | "fill";

/** Loads an image file via an object URL. Resolves with a decoded HTMLImageElement. */
export async function loadImageFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

/**
 * Downscales an image onto an outputSize × outputSize offscreen canvas and
 * returns its ImageData. Uses browser bilinear scaling.
 */
export function drawToGrid(
  img: HTMLImageElement,
  outputSize: number,
  fitMode: FitMode,
): ImageData {
  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  ctx.clearRect(0, 0, outputSize, outputSize);

  const sw = img.naturalWidth || img.width;
  const sh = img.naturalHeight || img.height;

  if (fitMode === "stretch") {
    ctx.drawImage(img, 0, 0, outputSize, outputSize);
  } else if (fitMode === "fit") {
    // Letterbox: scale down to fit entirely; transparent bars remain.
    const scale = Math.min(outputSize / sw, outputSize / sh);
    const dw = sw * scale;
    const dh = sh * scale;
    const dx = (outputSize - dw) / 2;
    const dy = (outputSize - dh) / 2;
    ctx.drawImage(img, 0, 0, sw, sh, dx, dy, dw, dh);
  } else {
    // fill: center-crop source to match aspect 1:1.
    const srcAspect = sw / sh;
    let sx = 0;
    let sy = 0;
    let sCropW = sw;
    let sCropH = sh;
    if (srcAspect > 1) {
      // Wider than tall — crop horizontally.
      sCropW = sh;
      sx = (sw - sCropW) / 2;
    } else if (srcAspect < 1) {
      sCropH = sw;
      sy = (sh - sCropH) / 2;
    }
    ctx.drawImage(img, sx, sy, sCropW, sCropH, 0, 0, outputSize, outputSize);
  }

  return ctx.getImageData(0, 0, outputSize, outputSize);
}
