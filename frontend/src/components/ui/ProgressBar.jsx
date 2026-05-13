import React from 'react';

const ProgressBar = ({ score, max = 100, label }) => {
  const percentage = Math.min(Math.max((score / max) * 100, 0), 100);

  // Determine color based on score
  let colorClass = "bg-green-500";
  if (percentage < 50) colorClass = "bg-red-500";
  else if (percentage < 75) colorClass = "bg-yellow-500";

  return (
    <div className="w-full mb-4">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-medium text-gray-700">{score}/{max}</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${colorClass} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
