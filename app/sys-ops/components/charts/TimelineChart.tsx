// app/sys-ops/components/charts/TimelineChart.tsx
"use client";

import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TimelineChartProps {
  data: Array<{ date: string; count: number }>;
}

type TimeRange = 'week' | '1month' | '3months' | '6months';

export default function TimelineChart({ data }: TimelineChartProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1month');

  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 py-8">No timeline data available</p>;
  }

  // Filter and prepare burnup chart data
  const chartData = useMemo(() => {
    const now = new Date();
    let startDate = new Date();

    switch (selectedRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case '1month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(now.getMonth() - 6);
        break;
    }

    // Filter data by date range and consolidate duplicates
    const dateMap = new Map<string, number>();
    
    data.forEach(item => {
      const itemDate = new Date(item.date);
      if (itemDate >= startDate && itemDate <= now) {
        const dateKey = item.date.split('T')[0]; // Normalize date format
        const currentCount = dateMap.get(dateKey) || 0;
        dateMap.set(dateKey, currentCount + item.count);
      }
    });

    // Convert map to sorted array
    const consolidatedData = Array.from(dateMap.entries())
      .map(([date, count]) => ({
        date,
        count,
        sortDate: new Date(date).getTime()
      }))
      .sort((a, b) => a.sortDate - b.sortDate);

    // Calculate cumulative (burnup) values
    let cumulative = 0;
    return consolidatedData.map((item) => {
      cumulative += item.count;
      return {
        date: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        daily: item.count,
        cumulative: cumulative,
        fullDate: item.date,
      };
    });
  }, [data, selectedRange]);

  const totalRegistrations = chartData.length > 0 ? chartData[chartData.length - 1]?.cumulative || 0 : 0;
  const averagePerDay = chartData.length > 0 ? (totalRegistrations / chartData.length).toFixed(1) : 0;
  const peakDay = Math.max(...chartData.map(d => d.daily), 0);

  return (
    <div className="w-full p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h3 className="font-bold text-xl text-gray-800 mb-4 md:mb-0">
          Registrations Chart
        </h3>
        
        {/* Time Range Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="time-range" className="text-sm font-medium text-gray-700">
            Time Range:
          </label>
          <select
            id="time-range"
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value as TimeRange)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none transition-all text-sm"
          >
            <option value="week">Last Week</option>
            <option value="1month">Last 1 Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
          </select>
        </div>
      </div>

      {/* Burnup Chart */}
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#342D87" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#342D87" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              tickLine={{ stroke: '#e5e7eb' }}
              axisLine={{ stroke: '#e5e7eb' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={{ stroke: '#e5e7eb' }}
              axisLine={{ stroke: '#e5e7eb' }}
              allowDecimals={false}
              label={{ value: 'Cumulative Total', angle: -90, position: 'insideLeft', style: { fill: '#342D87', fontSize: 12 } }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={{ stroke: '#e5e7eb' }}
              axisLine={{ stroke: '#e5e7eb' }}
              allowDecimals={false}
              label={{ value: 'Daily Count', angle: 90, position: 'insideRight', style: { fill: '#60a5fa', fontSize: 12 } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px'
              }}
              // Fix: Handle potentially undefined value and name parameters
              formatter={(value: number | string | undefined, name: string | undefined) => {
                // Guard against undefined values
                if (value === undefined) return ['0', name || 'Unknown'];
                
                if (name === 'cumulative') return [value, 'Total Registrations'];
                if (name === 'daily') return [value, 'Daily Registrations'];
                return [value, name || 'Unknown'];
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="line"
            />
            
            {/* Cumulative Line (Burnup) */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="cumulative"
              stroke="#342D87"
              strokeWidth={3}
              dot={{ fill: '#342D87', r: 4 }}
              activeDot={{ r: 6 }}
              name="Total Registrations"
              animationDuration={1000}
            />
            
            {/* Daily Count Line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="daily"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={{ fill: '#60a5fa', r: 3 }}
              activeDot={{ r: 5 }}
              name="Daily Registrations"
              strokeDasharray="5 5"
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[400px] flex items-center justify-center text-gray-500">
          No data available for the selected time range
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <p className="text-xs text-gray-500 mb-1">Total Registrations</p>
          <p className="text-2xl font-bold text-[#342D87]">{totalRegistrations}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <p className="text-xs text-gray-500 mb-1">Average per Day</p>
          <p className="text-2xl font-bold text-[#342D87]">{averagePerDay}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <p className="text-xs text-gray-500 mb-1">Peak Day</p>
          <p className="text-2xl font-bold text-[#342D87]">{peakDay}</p>
        </div>
      </div>
    </div>
  );
}
