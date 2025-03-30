import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import { supabase } from '../supabaseClient';
import { PRACTICE_TYPES, REGIONS } from '../types';

const AllSalaries = () => {
  const [salaries, setSalaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialty: '',
    region: '',
    practiceType: '',
    minSalary: '',
    maxSalary: '',
    yearsOfExperience: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'submitted_at',
    direction: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchSalaries();
  }, [filters, sortConfig, currentPage]);

  const fetchSalaries = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('salary_submissions')
        .select('*');

      // Apply filters
      if (filters.specialty) {
        query = query.eq('specialty', filters.specialty);
      }
      if (filters.region) {
        query = query.eq('region', filters.region);
      }
      if (filters.practiceType) {
        query = query.eq('practice_type', filters.practiceType);
      }
      if (filters.minSalary) {
        query = query.gte('total_compensation', parseFloat(filters.minSalary));
      }
      if (filters.maxSalary) {
        query = query.lte('total_compensation', parseFloat(filters.maxSalary));
      }
      if (filters.yearsOfExperience) {
        query = query.eq('years_of_experience', parseInt(filters.yearsOfExperience));
      }

      // Apply sorting
      query = query.order(sortConfig.key, { ascending: sortConfig.direction === 'asc' });

      // Apply pagination
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;
      query = query.range(start, end);

      const { data, error, count } = await query;

      if (error) throw error;

      setSalaries(data || []);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching salaries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Helmet>
        <title>All Physician Salaries | SalaryDr</title>
        <meta name="description" content="Browse comprehensive physician salary data across specialties, locations, and practice types. View detailed salary information and trends." />
        <meta name="keywords" content="physician salaries, doctor compensation, medical salaries, healthcare compensation, physician pay" />
        <link rel="canonical" href="https://www.salarydr.com/all-salaries" />
      </Helmet>

      {/* Navigation */}
      <nav className="w-full p-4 sm:p-6" role="navigation" aria-label="Main navigation">
        <div className="container mx-auto flex justify-between items-center">
          <Link 
            to="/" 
            className="text-[2.5rem] sm:text-[3.5rem] tracking-normal font-['Outfit']"
          >
            <span className="text-[#4169E1] font-[400]">salary</span>
            <span className="text-[#E94E4A] font-[500]">Dr</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-4 lg:gap-8 items-center">
            <Link to="/dashboard" className="text-lg lg:text-xl font-semibold text-[#2D3748] whitespace-nowrap hover:text-blue-600 transition-colors">
              Salary Data
            </Link>
            <Link to="/calculator" className="text-lg lg:text-xl font-semibold text-[#2D3748] whitespace-nowrap hover:text-blue-600 transition-colors">
              Take Home Pay Calculator
            </Link>
            <Link
              to="/submit-salary"
              className="text-lg lg:text-xl font-semibold px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
            >
              Add a Salary
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">All Physician Salaries</h1>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
              <select
                value={filters.specialty}
                onChange={(e) => handleFilterChange('specialty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Specialties</option>
                {Array.from(new Set(salaries.map(s => s.specialty))).sort().map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <select
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Regions</option>
                {REGIONS.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Practice Type</label>
              <select
                value={filters.practiceType}
                onChange={(e) => handleFilterChange('practiceType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Practice Types</option>
                {PRACTICE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary</label>
              <input
                type="number"
                value={filters.minSalary}
                onChange={(e) => handleFilterChange('minSalary', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="$200,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary</label>
              <input
                type="number"
                value={filters.maxSalary}
                onChange={(e) => handleFilterChange('maxSalary', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="$500,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <select
                value={filters.yearsOfExperience}
                onChange={(e) => handleFilterChange('yearsOfExperience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Experience Levels</option>
                {Array.from(new Set(salaries.map(s => s.years_of_experience))).sort((a, b) => a - b).map(years => (
                  <option key={years} value={years}>{years} years</option>
                ))}
              </select>
            </div>
          </div>

          {/* Salary Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('specialty')}
                  >
                    Specialty {sortConfig.key === 'specialty' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('total_compensation')}
                  >
                    Total Compensation {sortConfig.key === 'total_compensation' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('region')}
                  >
                    Region {sortConfig.key === 'region' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('practice_type')}
                  >
                    Practice Type {sortConfig.key === 'practice_type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('years_of_experience')}
                  >
                    Experience {sortConfig.key === 'years_of_experience' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('submitted_at')}
                  >
                    Submitted {sortConfig.key === 'submitted_at' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">Loading...</td>
                  </tr>
                ) : salaries.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">No salaries found matching your filters</td>
                  </tr>
                ) : (
                  salaries.map((salary) => (
                    <tr key={salary.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {salary.specialty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(salary.total_compensation)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {salary.region}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {salary.practice_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {salary.years_of_experience} years
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(salary.submitted_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllSalaries; 