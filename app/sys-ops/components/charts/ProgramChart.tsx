// app/sys-ops/components/charts/ProgramChart.tsx
"use client";

interface ProgramChartProps {
  data: Array<{ program_name: string; count: number }>;
}

export default function ProgramChart({ data }: ProgramChartProps) {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 py-8">No data available</p>;
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-700">{item.program_name}</span>
            <span className="font-bold text-gray-900">{item.count}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#342D87] to-[#4a3fb8] h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(item.count / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
