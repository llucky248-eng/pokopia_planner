"use client";

import { useState, useCallback, useRef } from "react";
import { GridState, PlacedItem } from "@/types";
import { GRID_SIZE, MAX_UNDO_STACK, LOCAL_STORAGE_GRID_KEY } from "@/lib/constants";
import { useLocalStorage } from "./useLocalStorage";

let nextId = 1;
function generateId(): string {
  return `item-${Date.now()}-${nextId++}`;
}

const EMPTY_GRID: GridState = { size: GRID_SIZE, placements: [] };

export function useGridState(initial?: GridState) {
  const [savedGrid, setSavedGrid] = useLocalStorage<GridState>(LOCAL_STORAGE_GRID_KEY, EMPTY_GRID);
  const [grid, setGrid] = useState<GridState>(initial ?? savedGrid);
  const undoStack = useRef<GridState[]>([]);

  const pushUndo = useCallback((state: GridState) => {
    undoStack.current = [...undoStack.current.slice(-MAX_UNDO_STACK + 1), state];
  }, []);

  const update = useCallback((newGrid: GridState) => {
    setGrid(newGrid);
    setSavedGrid(newGrid);
  }, [setSavedGrid]);

  const placeItem = useCallback((itemId: string, row: number, col: number) => {
    setGrid((prev) => {
      const occupied = prev.placements.some((p) => p.row === row && p.col === col);
      if (occupied) return prev;
      pushUndo(prev);
      const newPlacement: PlacedItem = { instanceId: generateId(), itemId, row, col };
      const newGrid = { ...prev, placements: [...prev.placements, newPlacement] };
      setSavedGrid(newGrid);
      return newGrid;
    });
  }, [pushUndo, setSavedGrid]);

  const moveItem = useCallback((instanceId: string, newRow: number, newCol: number) => {
    setGrid((prev) => {
      const occupied = prev.placements.some(
        (p) => p.row === newRow && p.col === newCol && p.instanceId !== instanceId
      );
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

  const loadGrid = useCallback((newGrid: GridState) => {
    setGrid((prev) => {
      pushUndo(prev);
      setSavedGrid(newGrid);
      return newGrid;
    });
  }, [pushUndo, setSavedGrid]);

  return { grid, placeItem, moveItem, removeItem, clearAll, undo, loadGrid };
}
