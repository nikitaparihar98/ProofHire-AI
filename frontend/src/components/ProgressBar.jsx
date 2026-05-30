import React from 'react';

export default function ProgressBar({ score, max = 100, label = "Score", showLabel = true }) {
  const percentage = Math.min(100, Math.max(0, (score / max) * 100));
  
  let colorClass = "bg-emerald-500";
  if (percentage < 50) colorClass = "bg-rose-500";
  else if (percentage < 75) colorClass = "bg-amber-500";

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <span className="text-sm font-medium text-slate-900">{score}/{max}</span>
        </div>
      )}
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden w-full">
        <div 
          className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
