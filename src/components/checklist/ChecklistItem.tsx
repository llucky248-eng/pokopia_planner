"use client";

import { ChecklistEntry } from "@/types";

interface ChecklistItemProps {
  entry: ChecklistEntry;
  onToggle: (id: string) => void;
}

export default function ChecklistItem({ entry, onToggle }: ChecklistItemProps) {
  return (
    <label className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-cloud-soft transition-colors cursor-pointer">
      <input
        type="checkbox"
        checked={entry.checked}
        onChange={() => onToggle(entry.id)}
        className="w-5 h-5 rounded-md accent-sky-deep cursor-pointer"
      />
      <span className={`text-sm ${entry.checked ? "line-through text-text-secondary" : "text-text-primary"}`}>
        {entry.label}
      </span>
    </label>
  );
}
