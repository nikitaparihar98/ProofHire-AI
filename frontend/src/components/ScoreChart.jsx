import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function ScoreChart({ score }) {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  let color = "#10b981"; // emerald-500
  if (score < 50) color = "#f43f5e"; // rose-500
  else if (score < 75) color = "#f59e0b"; // amber-500

  const COLORS = [color, '#f1f5f9']; // color and slate-100

  return (
<div className="relative w-32 h-32 min-w-[128px] min-h-[128px] flex items-center justify-center">      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={55}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-900 leading-none">{Math.round(score)}</span>
        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Score</span>
      </div>
    </div>
  );
}