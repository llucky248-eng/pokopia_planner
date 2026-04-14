"use client";

interface ProgressBarProps {
  checked: number;
  total: number;
}

export default function ProgressBar({ checked, total }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((checked / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-3 bg-cloud-soft rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-base to-grass-base transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-text-secondary whitespace-nowrap">
        {checked}/{total}
      </span>
    </div>
  );
}
