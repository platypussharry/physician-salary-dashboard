import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalaryDashboard = () => {
  const [specialtyFilter, setSpecialtyFilter] = useState('All Physicians');
  const [locationFilter, setLocationFilter] = useState('United States');
  
  // Sample data
  const salaryDistribution = [
    { percentile: '5th percentile', value: 215000, label: '$215K' },
    { percentile: '25th percentile', value: 301000, label: '$301K' },
    { percentile: 'Median (50th)', value: 400000, label: '$400K' },
    { percentile: '75th percentile', value: 535000, label: '$535K' },
    { percentile: '95th percentile', value: 800000, label: '$800K' },
  ];
  
  const recentSubmissions = [
    {
      id: 1,
      timeAgo: '1h',
      specialty: 'Orthopedic Surgery',
      subspecialty: 'Joint Replacement',
      hoursPerWeek: 40,
      experience: '0-2 YOE',
      fte: '1.0 FTE',
      location: 'Metro Area - California',
      practiceType: 'Hospital-Employed',
      satisfaction: 4.2,
      benefits: '3 benefits',
      call: 'No Call',
      compensation: 585000,
      salary: '$530K',
      bonus: '$55K'
    },
    {
      id: 2,
      timeAgo: '1h',
      specialty: 'Dermatology',
      subspecialty: 'Medical',
      hoursPerWeek: 36,
      experience: '3-5 YOE',
      fte: '0.9 FTE',
      location: 'Metro Area - Florida', 
      practiceType: 'Private Practice',
      satisfaction: 3.8,
      benefits: '2 benefits',
      call: 'No Call',
      compensation: 475000,
      salary: '$380K',
      bonus: '$95K'
    },
    {
      id: 3,
      timeAgo: '2h',
      specialty: 'Cardiology',
      subspecialty: 'Interventional',
      hoursPerWeek: 48,
      experience: '7-10 YOE',
      fte: '1.0 FTE',
      location: 'Metro Area - Texas',
      practiceType: 'Hospital-Employed',
      satisfaction: 4.5,
      benefits: '4 benefits',
      call: '1:4 Call',
      compensation: 710000,
      salary: '$620K',
      bonus: '$90K'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
        <div className="bg-red-500 text-white p-4 mb-4">Test Tailwind Style</div>
      {/* Header with filters */}
      <header className="bg-white border-b border-gray-200 py-3 px-4 sticky top-0 z-10">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-2 w-full md:w-auto mb-3 md:mb-0">
            <div className="relative w-40">
              <select 
                className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option>United States</option>
                <option>California</option>
                <option>New York</option>
                <option>Texas</option>
                <option>Florida</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            
            <div className="relative flex-1 min-w-[200px]">
              <input 
                type="text" 
                placeholder="Search specialties" 
                className="border border-gray-300 rounded-md py-2 pl-9 pr-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative w-40">
              <select className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Practice Types</option>
                <option>Hospital-Employed</option>
                <option>Private Practice</option>
                <option>Academic</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            
            <button className="bg-teal-600 hover:bg-teal-700 text-white rounded-full p-2">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button className="bg-white border border-gray-300 hover:bg-gray-50 rounded-md py-2 px-4 flex items-center text-gray-700">
              <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              Share
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Summary statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6 col-span-1 lg:col-span-2">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-medium text-gray-800">Physician Salary in {locationFilter}</h2>
                <div className="flex items-center">
                  <span className="text-4xl font-bold text-gray-900">$444,903</span>
                  <span className="ml-3 text-sm text-gray-500">Avg Total Comp (3,854 Salaries)</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Updated Mar 14, 2025</div>
                <div className="inline-flex items-center px-2 py-1 rounded text-xs">
                  <span className="text-teal-600 font-semibold">3,854 submissions</span>
                </div>
              </div>
            </div>
            
            {/* Salary distribution chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salaryDistribution}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="percentile" axisLine={false} tickLine={false} />
                  <YAxis hide={true} domain={[0, 'dataMax + 100000']} />
                  <Tooltip 
                    formatter={(value) => [`${value.toLocaleString()}`, 'Salary']}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#8CD3C5" 
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
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-medium text-gray-800 mb-4">Inside the Averages</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Base</span>
                </div>
                <div className="flex justify-between pl-9">
                  <span className="text-xl font-bold">$399,075</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Bonuses</span>
                </div>
                <div className="flex justify-between pl-9">
                  <span className="text-xl font-bold">$29,542</span>
                  <span className="text-gray-500">(52% received bonuses)</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Other income</span>
                </div>
                <div className="flex justify-between pl-9">
                  <span className="text-xl font-bold">$16,286</span>
                  <span className="text-gray-500">(20% received other income)</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Workload</span>
                </div>
                <div className="flex justify-between pl-9">
                  <span className="text-xl font-bold">~44.5 hrs/week</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Satisfaction Rating</span>
                </div>
                <div className="flex justify-between pl-9">
                  <span className="text-xl font-bold">3.8/5.0</span>
                  <span className="text-gray-500">(82% would choose again)</span>
                </div>
              </div>
              
              <div className="pt-4">
                <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded">
                  Submit Your Salary
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Referral banner */}
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6 flex items-center">
          <div className="text-teal-700 mr-3">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-teal-800">
              Help other physicians make informed career decisions - <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">refer a colleague</a> to continue growing the community.
            </p>
          </div>
        </div>
        
        {/* Recent submissions table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap">
                Posted
              </button>
              <button className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap">
                Physician Details
              </button>
              <button className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap">
                Location & Practice
              </button>
              <button className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap">
                Experience & Hours
              </button>
              <button className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap">
                Satisfaction
              </button>
              <button className="px-6 py-4 text-sm font-medium border-b-2 border-teal-500 text-teal-600 whitespace-nowrap">
                Total Comp
              </button>
            </nav>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="divide-y divide-gray-200">
                {recentSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-16">
                      {submission.timeAgo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 mb-1">{submission.specialty} - {submission.subspecialty}</div>
                      <div className="text-xs text-gray-500">{submission.fte} · {submission.practiceType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 mb-1">{submission.location}</div>
                      <div className="text-xs text-gray-500">{submission.practiceType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 mb-1">{submission.experience}</div>
                      <div className="text-xs text-gray-500">{submission.hoursPerWeek} hrs/week · {submission.call}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 mb-1">{submission.satisfaction}/5.0</div>
                      <div className="text-xs text-gray-500">{submission.benefits}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-bold text-teal-600 mb-1">${submission.compensation.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Salary ({submission.salary}) + Bonus ({submission.bonus})</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              View all salary submissions →
            </button>
          </div>
        </div>
        
        {/* Footer CTA */}
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-teal-800 mb-2">Want more accurate salary data specific to your specialty?</h3>
          <p className="text-teal-600 mb-4">Join thousands of physicians contributing anonymous salary data to help the community</p>
          <button className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-md text-sm font-medium">
            Submit Your Salary Information
          </button>
        </div>
      </main>
    </div>
  );
};

export default SalaryDashboard;