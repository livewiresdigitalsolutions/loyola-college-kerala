// app/sys-ops/components/charts/GaugeChart.tsx
"use client";

interface GaugeChartProps {
  value: number;
  max?: number;
  label: string;
  color?: string;
}

export default function GaugeChart({ value, max = 100, label, color = "#342D87" }: GaugeChartProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-600">of {max}</p>
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-gray-700 text-center">{label}</p>
    </div>
  );
}
