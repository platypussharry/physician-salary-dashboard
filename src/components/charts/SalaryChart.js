import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalaryChart = ({ data, formatCurrency, showHourly, setShowHourly }) => {
  const percentileMap = {
    'p10th': '10th percentile',
    'p25th': '25th percentile',
    'p50th': 'Median (50th percentile)',
    'p75th': '75th percentile',
    'p90th': '90th percentile'
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Convert annual salary to hourly (assuming 48 weeks, 40 hours per week)
  const convertToHourly = (annualSalary) => {
    return annualSalary / (48 * 40);
  };

  // Format the average value based on display mode
  const formatAverageValue = (value) => {
    if (showHourly) {
      const hourlyRate = convertToHourly(value);
      return `$${Math.round(hourlyRate)}/hr`;
    }
    return formatCurrency(value);
  };

  // Transform data based on display mode
  const transformedData = data.map(item => ({
    ...item,
    value: showHourly ? convertToHourly(item.value) : item.value,
    label: formatAverageValue(item.value)
  }));

  return (
    <div className="relative h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={transformedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          barSize={60}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => value.substring(1)}
          />
          <YAxis
            domain={[0, showHourly ? 'dataMax + 50' : 'dataMax + 100000']}
            tickFormatter={(value) => showHourly ? `$${Math.round(value)}/hr` : `$${value / 1000}K`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [formatAverageValue(showHourly ? value * 48 * 40 : value), 'Salary']}
            labelFormatter={(value) => percentileMap[value] || value}
          />
          <Bar
            dataKey="value"
            fill="#4f46e5"
            radius={[4, 4, 0, 0]}
            label={{
              position: 'top',
              formatter: (item) => item.label,
              fill: '#4B5563',
              fontSize: 12
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(SalaryChart); 