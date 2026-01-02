// app/sys-ops/components/charts/CategoryChart.tsx
"use client";

interface CategoryChartProps {
  data: Array<{ category: string; count: number }>;
}

export default function CategoryChart({ data }: CategoryChartProps) {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 py-8">No data available</p>;
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index}>
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="font-medium text-gray-700">{item.category}</span>
            <span className="font-bold text-gray-900">{item.count}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${(item.count / maxCount) * 100}%`,
                backgroundColor: colors[index % colors.length],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
