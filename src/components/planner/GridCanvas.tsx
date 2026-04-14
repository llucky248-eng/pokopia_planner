"use client";

import { GridState } from "@/types";
import { GRID_SIZE } from "@/lib/constants";
import GridCell from "./GridCell";

interface GridCanvasProps {
  grid: GridState;
  onRemove: (instanceId: string) => void;
}

export default function GridCanvas({ grid, onRemove }: GridCanvasProps) {
  const cells = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const placement = grid.placements.find((p) => p.row === row && p.col === col);
      cells.push(
        <GridCell key={`${row}-${col}`} row={row} col={col} placement={placement} onRemove={onRemove} />
      );
    }
  }

  return (
    <div className="bg-surface/80 backdrop-blur rounded-2xl shadow-lg p-3 overflow-auto">
      <div
        className="grid gap-0.5 mx-auto"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          maxWidth: "640px",
        }}
      >
        {cells}
      </div>
    </div>
  );
}
