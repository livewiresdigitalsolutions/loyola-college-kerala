// app/sys-ops/components/TopCourses.tsx
"use client";

interface TopCoursesProps {
  data: Array<{ course_name: string; degree_name: string; count: number }>;
}

export default function TopCourses({ data }: TopCoursesProps) {
  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {data.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-gray-100 hover:to-gray-150 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 bg-[#342D87] text-white rounded-lg text-sm font-bold">
              #{index + 1}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{item.course_name}</p>
              <p className="text-sm text-gray-600">{item.degree_name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#342D87]">{item.count}</p>
            <p className="text-xs text-gray-600">applications</p>
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <p className="text-center text-gray-500 py-8">No course data available</p>
      )}
    </div>
  );
}
