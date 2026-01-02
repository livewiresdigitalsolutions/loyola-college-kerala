// app/sys-ops/components/charts/TimelineChart.tsx
"use client";

interface TimelineChartProps {
  data: Array<{ date: string; count: number }>;
}

export default function TimelineChart({ data }: TimelineChartProps) {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 py-8">No timeline data available</p>;
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px] h-64 flex items-end gap-2 px-4">
        {data.map((item, index) => {
          const height = (item.count / maxCount) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-xs font-semibold text-gray-700">{item.count}</div>
              <div
                className="w-full bg-gradient-to-t from-[#342D87] to-[#4a3fb8] rounded-t-lg transition-all duration-500 hover:from-[#4a3fb8] hover:to-[#5b4ec9] cursor-pointer"
                style={{ height: `${height}%`, minHeight: "4px" }}
                title={`${new Date(item.date).toLocaleDateString()}: ${item.count} applications`}
              />
              <div className="text-xs text-gray-600 whitespace-nowrap">
                {new Date(item.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
