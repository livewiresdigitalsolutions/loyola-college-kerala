// app/sys-ops/components/charts/GenderChart.tsx
"use client";

interface GenderChartProps {
  data: Array<{ gender: string; count: number }>;
}

export default function GenderChart({ data }: GenderChartProps) {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 py-8">No data available</p>;
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);
  const colors: Record<string, string> = {
    Male: "#3b82f6",
    Female: "#ec4899",
    Other: "#8b5cf6",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.count / total) * 100;
              const previousPercentages = data
                .slice(0, index)
                .reduce((sum, d) => sum + (d.count / total) * 100, 0);
              
              const circumference = 2 * Math.PI * 70;
              const offset = circumference - (percentage / 100) * circumference;
              const rotation = (previousPercentages / 100) * circumference;

              return (
                <circle
                  key={index}
                  cx="96"
                  cy="96"
                  r="70"
                  fill="none"
                  stroke={colors[item.gender] || "#94a3b8"}
                  strokeWidth="24"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  transform={`rotate(${(rotation / circumference) * 360} 96 96)`}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{total}</p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: colors[item.gender] || "#94a3b8" }}
              />
              <span className="text-sm font-medium text-gray-700">{item.gender}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{item.count}</p>
              <p className="text-xs text-gray-600">
                {((item.count / total) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
