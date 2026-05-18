import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function StrengthWeaknessSection({ strengths = [], weaknesses = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-emerald-100 shadow-sm p-5 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <h3 className="font-semibold text-emerald-900">Key Strengths</h3>
        </div>
        {strengths.length > 0 ? (
          <ul className="space-y-3">
            {strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                <span className="leading-relaxed">{strength}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500 italic">No specific strengths identified.</p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-rose-100 shadow-sm p-5 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-4">
          <XCircle className="w-5 h-5 text-rose-500" />
          <h3 className="font-semibold text-rose-900">Areas for Improvement</h3>
        </div>
        {weaknesses.length > 0 ? (
          <ul className="space-y-3">
            {weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0"></span>
                <span className="leading-relaxed">{weakness}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500 italic">No significant weaknesses identified.</p>
        )}
      </div>
    </div>
  );
}
