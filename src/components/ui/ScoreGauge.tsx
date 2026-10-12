import React from 'react';

interface ScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, size = 'md', showLabel = true }) => {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  let color = '#22c55e'; // Green
  let labelText = 'Strong Compatibility';
  let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (clampedScore < 50) {
    color = '#ef4444'; // Red
    labelText = 'Significant Changes Recommended';
    badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (clampedScore < 70) {
    color = '#f59e0b'; // Amber
    labelText = 'Needs Attention';
    badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (clampedScore < 85) {
    color = '#3b82f6'; // Blue
    labelText = 'Good Foundation';
    badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
  }

  const dimensions = {
    sm: { width: 90, stroke: 7, fontSize: 'text-xl', radius: 36 },
    md: { width: 140, stroke: 10, fontSize: 'text-3xl', radius: 56 },
    lg: { width: 180, stroke: 14, fontSize: 'text-4xl', radius: 72 },
  }[size];

  const circumference = 2 * Math.PI * dimensions.radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: dimensions.width, height: dimensions.width }}>
        <svg className="transform -rotate-90" width={dimensions.width} height={dimensions.width}>
          {/* Background Track */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.width / 2}
            r={dimensions.radius}
            stroke="#e2e8f0"
            strokeWidth={dimensions.stroke}
            fill="transparent"
          />
          {/* Active Meter */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.width / 2}
            r={dimensions.radius}
            stroke={color}
            strokeWidth={dimensions.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`font-extrabold tracking-tight text-slate-900 ${dimensions.fontSize}`}>
            {clampedScore}
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400 -mt-0.5 tracking-wider">
            / 100
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="mt-2 text-center">
          <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
            {labelText}
          </span>
        </div>
      )}
    </div>
  );
};
