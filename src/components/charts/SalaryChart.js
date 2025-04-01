import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalaryChart = ({ data, formatCurrency }) => {
  const percentileMap = {
    'p10th': '10th percentile',
    'p25th': '25th percentile',
    'p50th': 'Median (50th percentile)',
    'p75th': '75th percentile',
    'p90th': '90th percentile'
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
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
          domain={[0, 'dataMax + 100000']}
          tickFormatter={(value) => `$${value / 1000}K`}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value) => [`${formatCurrency(value)}`, 'Salary']}
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
  );
};

export default React.memo(SalaryChart); 