// app/sys-ops/components/charts/ProgramChart.tsx
"use client";

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';

interface ProgramChartProps {
  data: Array<{ program_name: string; count: number }>;
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export default function ProgramChart({ data }: ProgramChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 py-8">No data available</p>;
  }

  const COLORS = [
    '#342D87',
    '#4a3fb8',
    '#5b52c9',
    '#3b82f6',
    '#60a5fa',
    '#93c5fd',
    '#1e40af',
    '#6366f1',
  ];

  const chartData = data.map((item) => ({
    name: item.program_name,
    value: item.count,
  }));

  const totalRegistrations = data.reduce((sum, item) => sum + item.count, 0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="flex flex-col w-full bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100">
      {/* Pie Chart and Legend Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center ">
        {/* Left: Pie Chart - Takes 2 columns (2/3) */}
        <div className="lg:col-span-2 flex justify-center">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                outerRadius={140}
                fill="#8884d8"
                dataKey="value"
                animationDuration={800}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                activeIndex={activeIndex !== null ? activeIndex : undefined}
                activeShape={renderActiveShape}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    style={{ 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value} registrations`, 'Count']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Legend - Takes 1 column (1/3) */}
        <div className="lg:col-span-1 space-y-3 p-2">
          {chartData.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="font-medium text-gray-700 text-sm">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: Total Count */}
      <div className="mt-2 pt-2 border-t border-gray-200 text-center">
        <p className="text-xl text-gray-600 mb-1">Total Registrations :
          <span className="text-xl font-bold text-[#342D87]"> {totalRegistrations}</span>
        </p>
      </div>
    </div>
  );
}
