"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GridState, PlacedItem } from "@/types";
import {
  GRID_SIZE,
  BASE_CELL_SIZE,
  MIN_ZOOM,
  MAX_ZOOM,
  DEFAULT_ZOOM,
  MINIMAP_SIZE,
  ZOOM_SENSITIVITY,
} from "@/lib/constants";
import { getItemById, itemWidth, itemHeight } from "@/data/items";
import { tailwindToHex } from "@/lib/colors";

interface Camera {
  x: number; // world-space top-left X
  y: number; // world-space top-left Y
  zoom: number;
}

const WORLD_SIZE = GRID_SIZE * BASE_CELL_SIZE; // 1472 world units

export function useCanvasRenderer(
  grid: GridState,
  selectedItemId: string | null,
  toolMode: "place" | "erase" | "measure",
  onPlace: (itemId: string, row: number, col: number) => void,
  onRemove: (instanceId: string) => void,
  onBeginPaint: () => void,
  onPaintCell: (itemId: string, row: number, col: number) => void,
  onEndPaint: () => void,
  onBeginErase: () => void,
  onEraseCell: (instanceId: string) => void,
  onEndErase: () => void,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<Camera>({ x: 0, y: 0, zoom: DEFAULT_ZOOM });
  const dirtyRef = useRef(true);
  const rafRef = useRef<number>(0);
  const canvasSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const hoveredCellRef = useRef<{ row: number; col: number } | null>(null);
  const isPanningRef = useRef(false);
  const dragStartRef = useRef<
    | {
        mouseX: number;
        mouseY: number;
        camX: number;
        camY: number;
        cell: { row: number; col: number } | null;
        button: number;
      }
    | null
  >(null);
  const isMinimapDraggingRef = useRef(false);

  // Pixel threshold: mousemove beyond this is treated as a drag (pan) rather
  // than a click. Small enough to feel responsive, large enough to tolerate
  // the tiny involuntary movements common on Mac trackpads.
  const DRAG_THRESHOLD = 4;

  const [cursorStyle, setCursorStyle] = useState<string>("crosshair");
  const [hoveredItemName, setHoveredItemName] = useState<string | null>(null);

  // Measurement tool state
  // measureResultRef holds the committed rectangle (r1,c1)-(r2,c2) in grid cells.
  const measureResultRef = useRef<{ r1: number; c1: number; r2: number; c2: number } | null>(null);
  const [measureDimensions, setMeasureDimensions] = useState<{ w: number; h: number } | null>(null);

  // Spatial index: O(1) lookup by any cell a placement occupies.
  // Multi-cell items map every cell in their footprint to the same PlacedItem.
  const spatialIndex = useMemo(() => {
    const map = new Map<string, PlacedItem>();
    for (const p of grid.placements) {
      const catItem = getItemById(p.itemId);
      const sw = itemWidth(catItem!);
      const sh = itemHeight(catItem!);
      for (let dr = 0; dr < sh; dr++) {
        for (let dc = 0; dc < sw; dc++) {
          map.set(`${p.row + dr},${p.col + dc}`, p);
        }
      }
    }
    return map;
  }, [grid.placements]);
  const spatialIndexRef = useRef(spatialIndex);
  spatialIndexRef.current = spatialIndex;

  // Mirror latest placements into a ref so renderMainCanvas (stable callback) can read them.
  const placementsRef = useRef(grid.placements);
  placementsRef.current = grid.placements;

  // Store latest props in refs so event handlers always see fresh values
  const selectedItemIdRef = useRef(selectedItemId);
  selectedItemIdRef.current = selectedItemId;
  const toolModeRef = useRef(toolMode);
  toolModeRef.current = toolMode;
  const onPlaceRef = useRef(onPlace);
  onPlaceRef.current = onPlace;
  const onRemoveRef = useRef(onRemove);
  onRemoveRef.current = onRemove;
  const onBeginPaintRef = useRef(onBeginPaint);
  onBeginPaintRef.current = onBeginPaint;
  const onPaintCellRef = useRef(onPaintCell);
  onPaintCellRef.current = onPaintCell;
  const onEndPaintRef = useRef(onEndPaint);
  onEndPaintRef.current = onEndPaint;
  const onBeginEraseRef = useRef(onBeginErase);
  onBeginEraseRef.current = onBeginErase;
  const onEraseCellRef = useRef(onEraseCell);
  onEraseCellRef.current = onEraseCell;
  const onEndEraseRef = useRef(onEndErase);
  onEndEraseRef.current = onEndErase;

  // Paint stroke tracking
  const isPaintingRef = useRef(false);
  const paintedCellsRef = useRef(new Set<string>());

  // Erase stroke tracking
  const isErasingRef = useRef(false);
  const erasedInstancesRef = useRef(new Set<string>());

  const markDirty = useCallback(() => {
    dirtyRef.current = true;
  }, []);

  // Update cursor based on mode
  useEffect(() => {
    if (toolMode === "erase") {
      setCursorStyle("not-allowed");
    } else if (toolMode === "measure") {
      setCursorStyle("crosshair");
    } else if (selectedItemId) {
      setCursorStyle("crosshair");
    } else {
      setCursorStyle("grab");
    }
  }, [selectedItemId, toolMode]);

  // Clear committed measurement when leaving measure mode
  useEffect(() => {
    if (toolMode !== "measure") {
      measureResultRef.current = null;
      setMeasureDimensions(null);
      markDirty();
    }
  }, [toolMode, markDirty]);

  // Mark dirty on grid change
  useEffect(() => {
    markDirty();
  }, [grid, markDirty]);

  const clampCamera = useCallback(() => {
    const camera = cameraRef.current;
    const { w, h } = canvasSizeRef.current;
    const viewWorldW = w / camera.zoom;
    const viewWorldH = h / camera.zoom;
    // Allow some margin
    const maxX = Math.max(0, WORLD_SIZE - viewWorldW);
    const maxY = Math.max(0, WORLD_SIZE - viewWorldH);
    camera.x = Math.max(0, Math.min(maxX, camera.x));
    camera.y = Math.max(0, Math.min(maxY, camera.y));
  }, []);

  const screenToGrid = useCallback((mouseX: number, mouseY: number) => {
    const camera = cameraRef.current;
    const worldX = camera.x + mouseX / camera.zoom;
    const worldY = camera.y + mouseY / camera.zoom;
    const col = Math.floor(worldX / BASE_CELL_SIZE);
    const row = Math.floor(worldY / BASE_CELL_SIZE);
    if (col < 0 || col >= GRID_SIZE || row < 0 || row >= GRID_SIZE) return null;
    return { row, col };
  }, []);

  const renderMainCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h } = canvasSizeRef.current;
    const camera = cameraRef.current;

    // Clear (canvas is already dpr-scaled via setTransform-free approach; we use CSS pixels here)
    ctx.fillStyle = "#f0f9ff"; // cloud white
    ctx.fillRect(0, 0, w, h);

    const cellPx = BASE_CELL_SIZE * camera.zoom;

    // Compute visible cell range
    const startCol = Math.max(0, Math.floor(camera.x / BASE_CELL_SIZE));
    const startRow = Math.max(0, Math.floor(camera.y / BASE_CELL_SIZE));
    const endCol = Math.min(GRID_SIZE - 1, Math.ceil((camera.x + w / camera.zoom) / BASE_CELL_SIZE));
    const endRow = Math.min(GRID_SIZE - 1, Math.ceil((camera.y + h / camera.zoom) / BASE_CELL_SIZE));

    // Draw grid lines if cells are big enough
    if (cellPx >= 6) {
      ctx.strokeStyle = "rgba(125, 211, 252, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let col = startCol; col <= endCol + 1; col++) {
        const x = (col * BASE_CELL_SIZE - camera.x) * camera.zoom;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let row = startRow; row <= endRow + 1; row++) {
        const y = (row * BASE_CELL_SIZE - camera.y) * camera.zoom;
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();
    }

    // Draw world boundary
    const bx = -camera.x * camera.zoom;
    const by = -camera.y * camera.zoom;
    const bw = WORLD_SIZE * camera.zoom;
    ctx.strokeStyle = "#0369a1";
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bw);

    // Draw placed items — iterate placements, not cells, to support multi-cell footprints.
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    const drawn = new Set<string>();
    for (const placement of placementsRef.current) {
      if (drawn.has(placement.instanceId)) continue;
      const catItem = getItemById(placement.itemId);
      if (!catItem) continue;
      const sw = itemWidth(catItem);
      const sh = itemHeight(catItem);
      // Skip if footprint is entirely outside the visible range
      if (placement.col + sw <= startCol || placement.col > endCol ||
          placement.row + sh <= startRow || placement.row > endRow) continue;
      drawn.add(placement.instanceId);
      const screenX = (placement.col * BASE_CELL_SIZE - camera.x) * camera.zoom;
      const screenY = (placement.row * BASE_CELL_SIZE - camera.y) * camera.zoom;
      const footW = cellPx * sw;
      const footH = cellPx * sh;
      ctx.fillStyle = tailwindToHex(catItem.color);
      ctx.fillRect(screenX, screenY, footW, footH);
      // Border around the footprint
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 1;
      ctx.strokeRect(screenX, screenY, footW, footH);
      if (cellPx >= 6) {
        const fontSize = Math.floor(Math.min(footW, footH) * 0.55);
        ctx.font = `${fontSize}px serif`;
        ctx.fillStyle = "#1f2937";
        ctx.fillText(catItem.emoji, screenX + footW / 2, screenY + footH / 2);
      }
    }

    // Hover highlight — show full footprint of the item being placed/erased.
    // In erase mode we look up the placed item under the cursor and highlight
    // its full footprint from its anchor cell.
    const hovered = hoveredCellRef.current;
    if (hovered) {
      const selId = selectedItemIdRef.current;
      const isErase = toolModeRef.current === "erase";

      let highlightRow = hovered.row;
      let highlightCol = hovered.col;
      let hw = 1;
      let hh = 1;

      if (isErase) {
        const p = spatialIndexRef.current.get(`${hovered.row},${hovered.col}`);
        if (p) {
          const catItem = getItemById(p.itemId);
          if (catItem) {
            hw = itemWidth(catItem);
            hh = itemHeight(catItem);
            highlightRow = p.row;
            highlightCol = p.col;
          }
        }
      } else {
        const selItem = selId ? getItemById(selId) : null;
        hw = selItem ? itemWidth(selItem) : 1;
        hh = selItem ? itemHeight(selItem) : 1;
      }

      const screenX = (highlightCol * BASE_CELL_SIZE - camera.x) * camera.zoom;
      const screenY = (highlightRow * BASE_CELL_SIZE - camera.y) * camera.zoom;
      const hoverW = cellPx * hw;
      const hoverH = cellPx * hh;
      ctx.fillStyle = isErase
        ? "rgba(239, 68, 68, 0.35)"
        : selId
          ? "rgba(14, 165, 233, 0.35)"
          : "rgba(125, 211, 252, 0.2)";
      ctx.fillRect(screenX, screenY, hoverW, hoverH);
      ctx.strokeStyle = isErase ? "#dc2626" : selId ? "#0284c7" : "#0ea5e9";
      ctx.lineWidth = 2;
      ctx.strokeRect(screenX + 1, screenY + 1, hoverW - 2, hoverH - 2);
    }

    // Measurement overlay — drawn on top of everything else.
    // Shows a live rectangle while dragging and the committed result after release.
    const isMeasureMode = toolModeRef.current === "measure";
    if (isMeasureMode) {
      let mr1: number | null = null, mc1: number | null = null;
      let mr2: number | null = null, mc2: number | null = null;

      const liveDrag = dragStartRef.current;
      if (liveDrag && liveDrag.cell && hoveredCellRef.current) {
        const s = liveDrag.cell;
        const en = hoveredCellRef.current;
        mr1 = Math.min(s.row, en.row);
        mc1 = Math.min(s.col, en.col);
        mr2 = Math.max(s.row, en.row);
        mc2 = Math.max(s.col, en.col);
      } else if (measureResultRef.current) {
        const m = measureResultRef.current;
        mr1 = m.r1; mc1 = m.c1; mr2 = m.r2; mc2 = m.c2;
      }

      if (mr1 !== null && mc1 !== null && mr2 !== null && mc2 !== null) {
        const mw = mc2 - mc1 + 1;
        const mh = mr2 - mr1 + 1;
        const sx = (mc1 * BASE_CELL_SIZE - camera.x) * camera.zoom;
        const sy = (mr1 * BASE_CELL_SIZE - camera.y) * camera.zoom;
        const sw = cellPx * mw;
        const sh = cellPx * mh;

        ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
        ctx.fillRect(sx, sy, sw, sh);
        ctx.strokeStyle = "#059669";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 3]);
        ctx.strokeRect(sx + 1, sy + 1, sw - 2, sh - 2);
        ctx.setLineDash([]);

        // Dimension label centred in the rectangle
        if (sw > 12 && sh > 12) {
          const label = `${mw} × ${mh}`;
          const fontSize = Math.max(10, Math.min(16, Math.min(sw, sh) * 0.3));
          ctx.font = `bold ${fontSize}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const lx = sx + sw / 2;
          const ly = sy + sh / 2;
          const tw = ctx.measureText(label).width;
          const pad = 4;
          ctx.fillStyle = "rgba(255,255,255,0.88)";
          ctx.fillRect(lx - tw / 2 - pad, ly - fontSize / 2 - pad, tw + pad * 2, fontSize + pad * 2);
          ctx.fillStyle = "#065f46";
          ctx.fillText(label, lx, ly);
        }
      }
    }
  }, []);

  const renderMinimap = useCallback(() => {
    const minimap = minimapRef.current;
    if (!minimap) return;
    const ctx = minimap.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#f0f9ff";
    ctx.fillRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);

    // Build ImageData at GRID_SIZE resolution (one pixel per cell).
    // Fill every cell of each item's footprint so multi-cell buildings appear
    // at their correct size rather than as a single dot.
    const imageData = ctx.createImageData(GRID_SIZE, GRID_SIZE);
    const data = imageData.data;
    for (const p of grid.placements) {
      const catItem = getItemById(p.itemId);
      if (!catItem) continue;
      const sw = itemWidth(catItem);
      const sh = itemHeight(catItem);
      const hex = tailwindToHex(catItem.color);
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      for (let dr = 0; dr < sh; dr++) {
        for (let dc = 0; dc < sw; dc++) {
          const row = p.row + dr;
          const col = p.col + dc;
          if (row >= GRID_SIZE || col >= GRID_SIZE) continue;
          const idx = (row * GRID_SIZE + col) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;
        }
      }
    }

    // Draw ImageData to offscreen canvas then scale to minimap
    const off = document.createElement("canvas");
    off.width = GRID_SIZE;
    off.height = GRID_SIZE;
    const offCtx = off.getContext("2d");
    if (offCtx) {
      offCtx.putImageData(imageData, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(off, 0, 0, MINIMAP_SIZE, MINIMAP_SIZE);
    }

    // Viewport rectangle
    const camera = cameraRef.current;
    const { w, h } = canvasSizeRef.current;
    const scale = MINIMAP_SIZE / WORLD_SIZE;
    const vx = camera.x * scale;
    const vy = camera.y * scale;
    const vw = (w / camera.zoom) * scale;
    const vh = (h / camera.zoom) * scale;
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 2;
    ctx.strokeRect(vx, vy, Math.min(vw, MINIMAP_SIZE - vx), Math.min(vh, MINIMAP_SIZE - vy));
    ctx.fillStyle = "rgba(14, 165, 233, 0.15)";
    ctx.fillRect(vx, vy, Math.min(vw, MINIMAP_SIZE - vx), Math.min(vh, MINIMAP_SIZE - vy));

    // Border
    ctx.strokeStyle = "#0369a1";
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, MINIMAP_SIZE - 1, MINIMAP_SIZE - 1);
  }, [grid.placements]);

  // Rebuild minimap when placements change
  useEffect(() => {
    markDirty();
  }, [grid.placements, markDirty]);

  // Main render loop
  useEffect(() => {
    const loop = () => {
      if (dirtyRef.current) {
        renderMainCanvas();
        renderMinimap();
        dirtyRef.current = false;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [renderMainCanvas, renderMinimap]);

  // Setup canvas size + HiDPI
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height || rect.width);
      if (size <= 0) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
      }
      canvasSizeRef.current = { w: size, h: size };
      clampCamera();
      markDirty();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    return () => observer.disconnect();
  }, [clampCamera, markDirty]);

  // Setup minimap HiDPI
  useEffect(() => {
    const minimap = minimapRef.current;
    if (!minimap) return;
    const dpr = window.devicePixelRatio || 1;
    minimap.width = MINIMAP_SIZE * dpr;
    minimap.height = MINIMAP_SIZE * dpr;
    minimap.style.width = `${MINIMAP_SIZE}px`;
    minimap.style.height = `${MINIMAP_SIZE}px`;
    const ctx = minimap.getContext("2d");
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    markDirty();
  }, [markDirty]);

  // Mouse wheel zoom (attached manually to get { passive: false })
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const camera = cameraRef.current;
      const worldX = camera.x + mouseX / camera.zoom;
      const worldY = camera.y + mouseY / camera.zoom;
      const delta = -e.deltaY * ZOOM_SENSITIVITY;
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, camera.zoom * (1 + delta)));
      camera.zoom = newZoom;
      camera.x = worldX - mouseX / newZoom;
      camera.y = worldY - mouseY / newZoom;
      clampCamera();
      markDirty();
    };

    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [clampCamera, markDirty]);

  // Helper: restore idle cursor based on current mode
  const restoreIdleCursor = useCallback(() => {
    const sel = selectedItemIdRef.current;
    const mode = toolModeRef.current;
    if (mode === "erase") setCursorStyle("not-allowed");
    else if (mode === "measure") setCursorStyle("crosshair");
    else if (sel) setCursorStyle("crosshair");
    else setCursorStyle("grab");
  }, []);

  // Global mousemove handler while dragging. Attached to window so the cursor
  // can leave the canvas (common on trackpads) without cancelling the pan.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onWindowMouseMove = (e: MouseEvent) => {
      // Paint stroke: continuously paint cells as the cursor moves.
      if (isPaintingRef.current) {
        const rect = canvas.getBoundingClientRect();
        const cell = screenToGrid(e.clientX - rect.left, e.clientY - rect.top);
        if (cell) {
          const key = `${cell.row},${cell.col}`;
          if (!paintedCellsRef.current.has(key)) {
            paintedCellsRef.current.add(key);
            onPaintCellRef.current(selectedItemIdRef.current!, cell.row, cell.col);
          }
          hoveredCellRef.current = cell;
          markDirty();
        }
        return;
      }

      // Erase stroke: continuously erase items as the cursor moves.
      if (isErasingRef.current) {
        const rect = canvas.getBoundingClientRect();
        const cell = screenToGrid(e.clientX - rect.left, e.clientY - rect.top);
        if (cell) {
          const placement = spatialIndexRef.current.get(`${cell.row},${cell.col}`);
          if (placement && !erasedInstancesRef.current.has(placement.instanceId)) {
            erasedInstancesRef.current.add(placement.instanceId);
            onEraseCellRef.current(placement.instanceId);
          }
          hoveredCellRef.current = cell;
          markDirty();
        }
        return;
      }

      const drag = dragStartRef.current;
      if (!drag) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // In measure mode: track the hovered cell as the live end-point;
      // never pan.
      if (toolModeRef.current === "measure") {
        const cell = screenToGrid(mouseX, mouseY);
        const prev = hoveredCellRef.current;
        if (prev?.row !== cell?.row || prev?.col !== cell?.col) {
          hoveredCellRef.current = cell;
          markDirty();
        }
        return;
      }

      const dx = mouseX - drag.mouseX;
      const dy = mouseY - drag.mouseY;

      // Promote to pan once we exceed the drag threshold
      if (!isPanningRef.current && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        isPanningRef.current = true;
        setCursorStyle("grabbing");
      }

      if (isPanningRef.current) {
        const camera = cameraRef.current;
        camera.x = drag.camX - dx / camera.zoom;
        camera.y = drag.camY - dy / camera.zoom;
        clampCamera();
        markDirty();
      }
    };

    const onWindowMouseUp = (e: MouseEvent) => {
      // Finalize paint stroke.
      if (isPaintingRef.current) {
        isPaintingRef.current = false;
        paintedCellsRef.current.clear();
        onEndPaintRef.current();
        restoreIdleCursor();
        return;
      }

      // Finalize erase stroke.
      if (isErasingRef.current) {
        isErasingRef.current = false;
        erasedInstancesRef.current.clear();
        onEndEraseRef.current();
        restoreIdleCursor();
        return;
      }

      const drag = dragStartRef.current;
      if (!drag) return;

      // Measure mode: commit the rectangle from drag.cell → hoveredCell.
      if (toolModeRef.current === "measure") {
        const start = drag.cell;
        const end = hoveredCellRef.current;
        if (start && end) {
          const r1 = Math.min(start.row, end.row);
          const c1 = Math.min(start.col, end.col);
          const r2 = Math.max(start.row, end.row);
          const c2 = Math.max(start.col, end.col);
          measureResultRef.current = { r1, c1, r2, c2 };
          setMeasureDimensions({ w: c2 - c1 + 1, h: r2 - r1 + 1 });
          markDirty();
        }
        dragStartRef.current = null;
        restoreIdleCursor();
        return;
      }

      const wasPanning = isPanningRef.current;
      dragStartRef.current = null;
      isPanningRef.current = false;
      restoreIdleCursor();

      // If we never exceeded the drag threshold, treat as a click
      if (!wasPanning && drag.button === 0) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        // Only fire click if mouseup happened over the canvas
        if (
          mouseX >= 0 &&
          mouseY >= 0 &&
          mouseX <= rect.width &&
          mouseY <= rect.height
        ) {
          const cell = screenToGrid(mouseX, mouseY);
          if (cell) {
            const sel = selectedItemIdRef.current;
            if (sel) {
              onPlaceRef.current(sel, cell.row, cell.col);
            }
          }
        }
      }
    };

    window.addEventListener("mousemove", onWindowMouseMove);
    window.addEventListener("mouseup", onWindowMouseUp);
    return () => {
      window.removeEventListener("mousemove", onWindowMouseMove);
      window.removeEventListener("mouseup", onWindowMouseUp);
    };
  }, [clampCamera, markDirty, restoreIdleCursor, screenToGrid]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Prevent browser default (text selection, image drag on Mac)
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const cell = screenToGrid(mouseX, mouseY);

    // Right click fires immediately (no drag semantics for remove)
    if (e.button === 2) {
      if (cell) {
        const placement = spatialIndexRef.current.get(`${cell.row},${cell.col}`);
        if (placement) onRemoveRef.current(placement.instanceId);
      }
      return;
    }

    // Paint mode: item selected + left click → begin stroke (owns this drag).
    if (e.button === 0 && toolModeRef.current === "place" && selectedItemIdRef.current) {
      isPaintingRef.current = true;
      paintedCellsRef.current = new Set();
      onBeginPaintRef.current();
      if (cell) {
        const key = `${cell.row},${cell.col}`;
        paintedCellsRef.current.add(key);
        onPaintCellRef.current(selectedItemIdRef.current, cell.row, cell.col);
      }
      return; // skip dragStartRef — paint mode owns this drag
    }

    // Erase mode: left click → begin erase stroke (owns this drag).
    if (e.button === 0 && toolModeRef.current === "erase") {
      isErasingRef.current = true;
      erasedInstancesRef.current = new Set();
      onBeginEraseRef.current();
      if (cell) {
        const placement = spatialIndexRef.current.get(`${cell.row},${cell.col}`);
        if (placement && !erasedInstancesRef.current.has(placement.instanceId)) {
          erasedInstancesRef.current.add(placement.instanceId);
          onEraseCellRef.current(placement.instanceId);
        }
      }
      return;
    }

    // Left click or middle click: record potential drag start. The window-level
    // handler decides whether this becomes a pan (moved > threshold) or a
    // click (mouseup without moving).
    if (e.button === 0 || e.button === 1) {
      const camera = cameraRef.current;
      dragStartRef.current = {
        mouseX,
        mouseY,
        camX: camera.x,
        camY: camera.y,
        cell,
        button: e.button,
      };
    }
  }, [screenToGrid]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    // When dragging, the window-level handler updates the camera. Here we just
    // track the hovered cell for the highlight overlay.
    if (dragStartRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const cell = screenToGrid(mouseX, mouseY);
    const prev = hoveredCellRef.current;
    if ((prev?.row !== cell?.row) || (prev?.col !== cell?.col)) {
      hoveredCellRef.current = cell;
      markDirty();
      // Expose the name of whatever placed item is under the cursor.
      if (cell) {
        const p = spatialIndexRef.current.get(`${cell.row},${cell.col}`);
        const catItem = p ? getItemById(p.itemId) : null;
        setHoveredItemName(catItem ? `${catItem.emoji} ${catItem.name}` : null);
      } else {
        setHoveredItemName(null);
      }
    }
  }, [markDirty, screenToGrid]);

  const handleMouseUp = useCallback(() => {
    // Handled by the window-level mouseup listener
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Don't cancel dragging here — the window listener keeps the pan alive.
    // Just clear the hover highlight and item name.
    if (!dragStartRef.current) {
      hoveredCellRef.current = null;
      setHoveredItemName(null);
      markDirty();
    }
  }, [markDirty]);

  const handleContextMenu = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
  }, []);

  // Minimap click/drag to jump viewport
  const jumpCameraToMinimap = useCallback((mouseX: number, mouseY: number) => {
    const camera = cameraRef.current;
    const { w, h } = canvasSizeRef.current;
    const scale = WORLD_SIZE / MINIMAP_SIZE;
    const worldX = mouseX * scale;
    const worldY = mouseY * scale;
    camera.x = worldX - w / camera.zoom / 2;
    camera.y = worldY - h / camera.zoom / 2;
    clampCamera();
    markDirty();
  }, [clampCamera, markDirty]);

  const handleMinimapMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    const minimap = minimapRef.current;
    if (!minimap) return;
    const rect = minimap.getBoundingClientRect();
    isMinimapDraggingRef.current = true;
    jumpCameraToMinimap(e.clientX - rect.left, e.clientY - rect.top);
  }, [jumpCameraToMinimap]);

  const handleMinimapMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isMinimapDraggingRef.current) return;
    const minimap = minimapRef.current;
    if (!minimap) return;
    const rect = minimap.getBoundingClientRect();
    jumpCameraToMinimap(e.clientX - rect.left, e.clientY - rect.top);
  }, [jumpCameraToMinimap]);

  const handleMinimapMouseUp = useCallback(() => {
    isMinimapDraggingRef.current = false;
  }, []);

  // Zoom controls
  const zoomBy = useCallback((factor: number) => {
    const camera = cameraRef.current;
    const { w, h } = canvasSizeRef.current;
    const centerWorldX = camera.x + w / camera.zoom / 2;
    const centerWorldY = camera.y + h / camera.zoom / 2;
    const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, camera.zoom * factor));
    camera.zoom = newZoom;
    camera.x = centerWorldX - w / newZoom / 2;
    camera.y = centerWorldY - h / newZoom / 2;
    clampCamera();
    markDirty();
  }, [clampCamera, markDirty]);

  const zoomIn = useCallback(() => zoomBy(1.5), [zoomBy]);
  const zoomOut = useCallback(() => zoomBy(1 / 1.5), [zoomBy]);

  const resetView = useCallback(() => {
    const camera = cameraRef.current;
    const { w, h } = canvasSizeRef.current;
    // Fit whole world
    camera.zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, w / WORLD_SIZE));
    camera.x = 0;
    camera.y = 0;
    clampCamera();
    // Re-center
    const viewWorldW = w / camera.zoom;
    const viewWorldH = h / camera.zoom;
    camera.x = Math.max(0, (WORLD_SIZE - viewWorldW) / 2);
    camera.y = Math.max(0, (WORLD_SIZE - viewWorldH) / 2);
    markDirty();
  }, [clampCamera, markDirty]);

  return {
    canvasRef,
    minimapRef,
    cursorStyle,
    hoveredItemName,
    measureDimensions,
    zoomIn,
    zoomOut,
    resetView,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleContextMenu,
    handleMinimapMouseDown,
    handleMinimapMouseMove,
    handleMinimapMouseUp,
  };
}
