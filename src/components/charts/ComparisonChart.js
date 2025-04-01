import React from 'react';

const ComparisonChart = ({ data, formatCurrency }) => {
  return (
    <>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Comparison by Employment Type</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item) => (
          <div key={item.type} className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-base sm:text-lg font-semibold text-indigo-900">{item.type}</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">{formatCurrency(item.avgComp)}</div>
            <div className="text-sm text-gray-500 mt-1">{item.submissions} submissions</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default React.memo(ComparisonChart); 