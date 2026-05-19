import React from 'react';

export default function ScoreBadge({ recommendation, score }) {
  let badgeColor = "bg-slate-100 text-slate-800 border-slate-200";
  let dotColor = "bg-slate-400";
  
  if (recommendation?.toLowerCase().includes("highly")) {
    badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
    dotColor = "bg-emerald-500";
  } else if (recommendation?.toLowerCase().includes("recommended") || score >= 75) {
    badgeColor = "bg-blue-50 text-blue-700 border-blue-200";
    dotColor = "bg-blue-500";
  } else if (recommendation?.toLowerCase().includes("not") || score < 50) {
    badgeColor = "bg-rose-50 text-rose-700 border-rose-200";
    dotColor = "bg-rose-500";
  } else {
    badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
    dotColor = "bg-amber-500";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      {recommendation || "Pending"}
    </span>
  );
}
