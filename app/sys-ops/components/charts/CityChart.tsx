// app/sys-ops/components/charts/CityChart.tsx
"use client";

interface CityChartProps {
  data: Array<{ city: string; state: string; count: number }>;
}

export default function CityChart({ data }: CityChartProps) {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 py-8">No data available</p>;
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {data.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-[#342D87] text-white rounded-full text-sm font-bold">
              {index + 1}
            </div>
            <div>
              <p className="font-medium text-gray-900">{item.city}</p>
              <p className="text-xs text-gray-600">{item.state}</p>
            </div>
          </div>
          <span className="text-lg font-bold text-[#342D87]">{item.count}</span>
        </div>
      ))}
    </div>
  );
}
