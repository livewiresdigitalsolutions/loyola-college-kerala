// app/sys-ops/components/charts/AcademicChart.tsx
"use client";

interface AcademicChartProps {
  data: Array<{ percentage_range: string; count: number }>;
}

export default function AcademicChart({ data }: AcademicChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-700">{item.percentage_range}</span>
            <span className="font-bold text-gray-900">{item.count}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(item.count / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <p className="text-center text-gray-500 py-8">No data available</p>
      )}
    </div>
  );
}
