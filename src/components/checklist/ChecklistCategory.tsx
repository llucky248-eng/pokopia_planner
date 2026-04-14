"use client";

import { useState } from "react";
import { ChecklistEntry } from "@/types";
import ChecklistItem from "./ChecklistItem";
import ProgressBar from "./ProgressBar";

interface ChecklistCategoryProps {
  category: string;
  entries: ChecklistEntry[];
  onToggle: (id: string) => void;
}

export default function ChecklistCategory({ category, entries, onToggle }: ChecklistCategoryProps) {
  const [expanded, setExpanded] = useState(true);
  const checked = entries.filter((e) => e.checked).length;

  return (
    <div className="bg-surface rounded-2xl shadow-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-cloud-soft transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className={`text-sm transition-transform ${expanded ? "rotate-90" : ""}`}>
            &#9654;
          </span>
          <h3 className="font-bold text-text-primary">{category}</h3>
        </div>
        <span className="text-xs font-semibold text-text-secondary">
          {checked}/{entries.length}
        </span>
      </button>
      {expanded && (
        <div className="px-4 pb-4">
          <div className="mb-3 px-1">
            <ProgressBar checked={checked} total={entries.length} />
          </div>
          <div className="flex flex-col">
            {entries.map((entry) => (
              <ChecklistItem key={entry.id} entry={entry} onToggle={onToggle} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
