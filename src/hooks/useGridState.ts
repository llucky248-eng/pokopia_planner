"use client";

import { useState, useCallback, useRef } from "react";
import { GridState, PlacedItem } from "@/types";
import { GRID_SIZE, MAX_UNDO_STACK, LOCAL_STORAGE_GRID_KEY } from "@/lib/constants";
import { useLocalStorage } from "./useLocalStorage";
import { getItemById, itemWidth, itemHeight } from "@/data/items";

/** Returns all cells (row+dr, col+dc) occupied by a placed item. */
function footprintCells(p: PlacedItem): Array<{ row: number; col: number }> {
  const catItem = getItemById(p.itemId);
  const sw = itemWidth(catItem!);
  const sh = itemHeight(catItem!);
  const cells: Array<{ row: number; col: number }> = [];
  for (let dr = 0; dr < sh; dr++) {
    for (let dc = 0; dc < sw; dc++) {
      cells.push({ row: p.row + dr, col: p.col + dc });
    }
  }
  return cells;
}

/** True if the candidate footprint (row,col,sw,sh) overlaps any existing placement. */
function isFootprintOccupied(
  placements: PlacedItem[],
  row: number,
  col: number,
  sw: number,
  sh: number,
  excludeInstanceId?: string,
): boolean {
  const candidateCells = new Set<string>();
  for (let dr = 0; dr < sh; dr++) {
    for (let dc = 0; dc < sw; dc++) {
      candidateCells.add(`${row + dr},${col + dc}`);
    }
  }
  for (const p of placements) {
    if (p.instanceId === excludeInstanceId) continue;
    for (const cell of footprintCells(p)) {
      if (candidateCells.has(`${cell.row},${cell.col}`)) return true;
    }
  }
  return false;
}

let nextId = 1;
function generateId(): string {
  return `item-${Date.now()}-${nextId++}`;
}

const EMPTY_GRID: GridState = { size: GRID_SIZE, placements: [] };

export function useGridState(initial?: GridState) {
  const [savedGrid, setSavedGrid] = useLocalStorage<GridState>(LOCAL_STORAGE_GRID_KEY, EMPTY_GRID);
  const [grid, setGrid] = useState<GridState>(initial ?? savedGrid);
  const undoStack = useRef<GridState[]>([]);
  const strokeSnapshotRef = useRef<GridState | null>(null);

  const pushUndo = useCallback((state: GridState) => {
    undoStack.current = [...undoStack.current.slice(-MAX_UNDO_STACK + 1), state];
  }, []);

  const update = useCallback((newGrid: GridState) => {
    setGrid(newGrid);
    setSavedGrid(newGrid);
  }, [setSavedGrid]);

  const placeItem = useCallback((itemId: string, row: number, col: number) => {
    setGrid((prev) => {
      const catItem = getItemById(itemId);
      const sw = itemWidth(catItem!);
      const sh = itemHeight(catItem!);
      if (isFootprintOccupied(prev.placements, row, col, sw, sh)) return prev;
      pushUndo(prev);
      const newPlacement: PlacedItem = { instanceId: generateId(), itemId, row, col };
      const newGrid = { ...prev, placements: [...prev.placements, newPlacement] };
      setSavedGrid(newGrid);
      return newGrid;
    });
  }, [pushUndo, setSavedGrid]);

  const moveItem = useCallback((instanceId: string, newRow: number, newCol: number) => {
    setGrid((prev) => {
      const moving = prev.placements.find((p) => p.instanceId === instanceId);
      if (!moving) return prev;
      const catItem = getItemById(moving.itemId);
      const sw = itemWidth(catItem!);
      const sh = itemHeight(catItem!);
      const occupied = isFootprintOccupied(prev.placements, newRow, newCol, sw, sh, instanceId);
      if (occupied) return prev;
      pushUndo(prev);
      const newGrid = {
        ...prev,
        placements: prev.placements.map((p) =>
          p.instanceId === instanceId ? { ...p, row: newRow, col: newCol } : p
        ),
      };
      setSavedGrid(newGrid);
      return newGrid;
    });
  }, [pushUndo, setSavedGrid]);

  const removeItem = useCallback((instanceId: string) => {
    setGrid((prev) => {
      pushUndo(prev);
      const newGrid = {
        ...prev,
        placements: prev.placements.filter((p) => p.instanceId !== instanceId),
      };
      setSavedGrid(newGrid);
      return newGrid;
    });
  }, [pushUndo, setSavedGrid]);

  const clearAll = useCallback(() => {
    setGrid((prev) => {
      pushUndo(prev);
      setSavedGrid(EMPTY_GRID);
      return EMPTY_GRID;
    });
  }, [pushUndo, setSavedGrid]);

  const undo = useCallback(() => {
    const prev = undoStack.current.pop();
    if (prev) {
      update(prev);
    }
  }, [update]);

  /** Capture pre-stroke snapshot before the first painted cell. */
  const beginPaintStroke = useCallback(() => {
    setGrid(prev => { strokeSnapshotRef.current = prev; return prev; });
  }, []);

  /** Place one cell during a paint stroke without pushing to undo. */
  const paintCellInStroke = useCallback((itemId: string, row: number, col: number) => {
    setGrid((prev) => {
      const catItem = getItemById(itemId);
      if (!catItem) return prev;
      const sw = itemWidth(catItem);
      const sh = itemHeight(catItem);
      if (isFootprintOccupied(prev.placements, row, col, sw, sh)) return prev;
      const newGrid = { ...prev, placements: [...prev.placements, { instanceId: generateId(), itemId, row, col }] };
      setSavedGrid(newGrid);
      return newGrid;
    });
  }, [setSavedGrid]);

  /** Push the pre-stroke snapshot onto the undo stack (call on mouseup). */
  const endPaintStroke = useCallback(() => {
    const snap = strokeSnapshotRef.current;
    if (snap) {
      undoStack.current = [...undoStack.current.slice(-MAX_UNDO_STACK + 1), snap];
      strokeSnapshotRef.current = null;
    }
  }, []);

  const loadGrid = useCallback((newGrid: GridState) => {
    setGrid((prev) => {
      pushUndo(prev);
      setSavedGrid(newGrid);
      return newGrid;
    });
  }, [pushUndo, setSavedGrid]);

  return { grid, placeItem, moveItem, removeItem, clearAll, undo, loadGrid, beginPaintStroke, paintCellInStroke, endPaintStroke };
}
