"use client";

import { useChecklist } from "@/hooks/useChecklist";
import { getChecklistCategories } from "@/data/checklist-data";
import ChecklistCategory from "@/components/checklist/ChecklistCategory";
import ProgressBar from "@/components/checklist/ProgressBar";
import Button from "@/components/ui/Button";

export default function ChecklistPage() {
  const { state, toggleItem, resetAll, overallProgress } = useChecklist();
  const categories = getChecklistCategories();
  const overall = overallProgress();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-sky-deep mb-2">Progress Tracker</h1>
      <p className="text-sm text-text-secondary mb-6">
        Track your island-building progress. Your checklist is saved automatically.
      </p>

      {/* Overall progress */}
      <div className="bg-surface rounded-2xl shadow-lg p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-text-primary">Overall Progress</h2>
          <span className="text-sm font-semibold text-sky-deep">
            {overall.total > 0 ? Math.round((overall.checked / overall.total) * 100) : 0}%
          </span>
        </div>
        <ProgressBar checked={overall.checked} total={overall.total} />
      </div>

      {/* Category sections */}
      <div className="flex flex-col gap-4 mb-6">
        {categories.map((category) => {
          const entries = state.entries.filter((e) => e.category === category);
          return (
            <ChecklistCategory
              key={category}
              category={category}
              entries={entries}
              onToggle={toggleItem}
            />
          );
        })}
      </div>

      {/* Reset */}
      <div className="text-center">
        <Button variant="danger" onClick={resetAll}>
          Reset All Progress
        </Button>
      </div>
    </div>
  );
}
