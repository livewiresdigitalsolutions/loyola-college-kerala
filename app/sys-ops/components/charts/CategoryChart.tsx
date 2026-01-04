// app/sys-ops/components/charts/CategoryChart.tsx
"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CategoryChartProps {
  data: Array<{ category: string; count: number }>;
}

export default function CategoryChart({ data }: CategoryChartProps) {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 py-8">No data available</p>;
  }

  // Color palette for different categories
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

  // Format data for Recharts
  const chartData = data.map((item, index) => ({
    ...item,
    color: colors[index % colors.length]
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{payload[0].payload.category}</p>
          <p className="text-sm text-gray-600">
            Count: <span className="font-bold text-[#342D87]">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={450}>
      <BarChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
        layout="horizontal"
        barSize={60}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="category"
          angle={-45}
          textAnchor="end"
          height={60}
          tick={{ fill: '#6b7280', fontSize: 11 }}
          tickLine={{ stroke: '#e5e7eb' }}
          axisLine={{ stroke: '#e5e7eb' }}
        />
        <YAxis
          tick={{ fill: '#6b7280', fontSize: 12 }}
          tickLine={{ stroke: '#e5e7eb' }}
          axisLine={{ stroke: '#e5e7eb' }}
          allowDecimals={false}
          label={{ 
            value: 'Number of Applications', 
            angle: -90, 
            position: 'insideLeft',
            style: { fill: '#374151', fontSize: 12, fontWeight: 600 }
          }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
        <Bar 
          dataKey="count" 
          name="Applications"
          radius={[8, 8, 0, 0]}
          animationDuration={1000}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
