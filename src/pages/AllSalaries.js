import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import { supabase } from '../supabaseClient';

const PRACTICE_TYPES = ["Hospital Employed", "Private Practice", "Academic"];

const EXPERIENCE_RANGES = [
  { label: "0-5 years", min: 0, max: 5 },
  { label: "6-10 years", min: 6, max: 10 },
  { label: "11-15 years", min: 11, max: 15 },
  { label: "16-20 years", min: 16, max: 20 },
  { label: "21-25 years", min: 21, max: 25 },
  { label: "26+ years", min: 26, max: null }
];

const AllSalaries = () => {
  const [salaries, setSalaries] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [filters, setFilters] = useState({
    specialty: '',
    practiceType: '',
    minSalary: '',
    maxSalary: '',
    yearsOfExperience: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'submission_date',
    direction: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchSalaries();
  }, [filters, sortConfig, currentPage]);

  // Fetch unique specialties on component mount
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const { data, error } = await supabase
          .from('salary_submissions')
          .select('specialty')
          .not('specialty', 'is', null);
        
        if (error) throw error;
        
        // Get unique specialties
        const uniqueSpecialties = [...new Set(data.map(item => item.specialty))].sort();
        setSpecialties(uniqueSpecialties);
      } catch (error) {
        console.error('Error fetching specialties:', error);
      }
    };
    
    fetchSpecialties();
  }, []);

  const fetchSalaries = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('salary_submissions')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.specialty) {
        query = query.eq('specialty', filters.specialty);
      }
      if (filters.practiceType) {
        query = query.eq('practice_setting', filters.practiceType);
      }
      if (filters.minSalary) {
        query = query.gte('total_compensation', parseFloat(filters.minSalary));
      }
      if (filters.maxSalary) {
        query = query.lte('total_compensation', parseFloat(filters.maxSalary));
      }
      if (filters.yearsOfExperience) {
        const range = EXPERIENCE_RANGES.find(r => r.label === filters.yearsOfExperience);
        if (range) {
          query = query.gte('years_of_experience', range.min);
          if (range.max) {
            query = query.lte('years_of_experience', range.max);
          }
        }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleRowClick = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const formatInputCurrency = (value) => {
    if (!value) return '';
    // Remove all non-numeric characters
    const numericValue = value.toString().replace(/[^0-9]/g, '');
    // Format with commas
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleSalaryInput = (key, value) => {
    // Remove any non-numeric characters for the actual filter value
    const numericValue = value.replace(/[^0-9]/g, '');
    handleFilterChange(key, numericValue);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Helmet>
        <title>All Physician Salaries | SalaryDr</title>
        <meta name="description" content="Browse comprehensive physician salary data across specialties, locations, and practice types. View detailed compensation information for doctors in hospital, private practice, and academic settings." />
        <meta name="keywords" content="physician salaries, doctor compensation, medical salaries, healthcare compensation, physician pay, doctor salary data, medical compensation data" />
        <link rel="canonical" href="https://www.salarydr.com/all-salaries" />
        <meta property="og:title" content="All Physician Salaries | SalaryDr" />
        <meta property="og:description" content="Browse comprehensive physician salary data across specialties, locations, and practice types. View detailed compensation information for doctors." />
        <meta property="og:url" content="https://www.salarydr.com/all-salaries" />
        <meta name="twitter:title" content="All Physician Salaries | SalaryDr" />
        <meta name="twitter:description" content="Browse comprehensive physician salary data across specialties, locations, and practice types." />
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/dashboard" 
                className="text-lg font-semibold text-[#2D3748] hover:text-blue-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Salary Data
              </Link>
              <Link 
                to="/calculator" 
                className="text-lg font-semibold text-[#2D3748] hover:text-blue-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Take Home Pay Calculator
              </Link>
              <Link
                to="/submit-salary"
                className="text-lg font-semibold px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Add a Salary
              </Link>
            </div>
          </div>
        )}
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
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <select
                value={filters.yearsOfExperience}
                onChange={(e) => handleFilterChange('yearsOfExperience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Experience Levels</option>
                {EXPERIENCE_RANGES.map(range => (
                  <option key={range.label} value={range.label}>{range.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  value={formatInputCurrency(filters.minSalary)}
                  onChange={(e) => handleSalaryInput('minSalary', e.target.value)}
                  className="w-full px-3 py-2 pl-7 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="200,000"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  value={formatInputCurrency(filters.maxSalary)}
                  onChange={(e) => handleSalaryInput('maxSalary', e.target.value)}
                  className="w-full px-3 py-2 pl-7 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="500,000"
                />
              </div>
            </div>
          </div>

          {/* Reset Filters Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => {
                setFilters({
                  specialty: '',
                  practiceType: '',
                  minSalary: '',
                  maxSalary: '',
                  yearsOfExperience: ''
                });
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Filters
            </button>
          </div>

          {/* Salary Table */}
          <div>
            {/* Mobile View */}
            <div className="md:hidden">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-2">Loading...</span>
                </div>
              ) : salaries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No salaries found matching your filters
                </div>
              ) : (
                <div className="space-y-4">
                  {salaries.map((salary) => (
                    <div 
                      key={salary.id}
                      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 ${
                        expandedRowId === salary.id ? 'ring-2 ring-blue-500' : 'hover:border-blue-300'
                      }`}
                      onClick={() => handleRowClick(salary.id)}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="text-lg font-semibold text-gray-900">{salary.specialty}</div>
                            {salary.subspecialty && (
                              <div className="text-sm text-gray-600">{salary.subspecialty}</div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">{formatCurrency(salary.total_compensation)}</div>
                            {salary.bonus_incentives > 0 && (
                              <div className="text-xs text-gray-500">
                                Includes {formatCurrency(salary.bonus_incentives)} bonus
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div>
                            <div className="text-gray-500">Location</div>
                            <div className="font-medium">{salary.geographic_location}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Practice Type</div>
                            <div className="font-medium">{salary.practice_setting}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Experience</div>
                            <div className="font-medium">{salary.years_of_experience} years</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-center text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            {expandedRowId === salary.id ? (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                                Show less
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                Tap for details
                              </>
                            )}
                          </span>
                        </div>

                        {expandedRowId === salary.id && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-6 text-sm">
                              <div>
                                <div className="text-gray-500 mb-1">Hours/Week</div>
                                <div className="font-medium text-gray-900">{salary.hours_worked} hours</div>
                              </div>
                              <div>
                                <div className="text-gray-500 mb-1">Satisfaction</div>
                                <div className="font-medium text-gray-900">
                                  <div className="flex items-center">
                                    <span className="mr-1">{salary.satisfaction_level}/5</span>
                                    {[...Array(5)].map((_, i) => (
                                      <svg
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < salary.satisfaction_level ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-500 mb-1">Choose Again?</div>
                                <div className="font-medium text-gray-900">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    salary.choosespecialty 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {salary.choosespecialty ? 'Yes' : 'No'}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-500 mb-1">Submitted</div>
                                <div className="font-medium text-gray-900">{formatDate(salary.submission_date)}</div>
                              </div>
                              {salary.base_salary > 0 && (
                                <div className="col-span-2">
                                  <div className="text-gray-500 mb-1">Compensation Breakdown</div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <div className="text-sm text-gray-600">Base Salary</div>
                                      <div className="font-medium text-gray-900">{formatCurrency(salary.base_salary)}</div>
                                    </div>
                                    {salary.bonus_incentives > 0 && (
                                      <div>
                                        <div className="text-sm text-gray-600">Bonus/RVU</div>
                                        <div className="font-medium text-gray-900">{formatCurrency(salary.bonus_incentives)}</div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
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
                      onClick={() => handleSort('geographic_location')}
                    >
                      Location {sortConfig.key === 'geographic_location' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('practice_setting')}
                    >
                      Practice Type {sortConfig.key === 'practice_setting' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('years_of_experience')}
                    >
                      Experience {sortConfig.key === 'years_of_experience' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                          <span className="ml-2">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : salaries.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No salaries found matching your filters
                      </td>
                    </tr>
                  ) : (
                    salaries.map((salary) => (
                      <React.Fragment key={salary.id}>
                        <tr 
                          onClick={() => handleRowClick(salary.id)} 
                          className="hover:bg-gray-50 cursor-pointer"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{salary.specialty}</div>
                            {salary.subspecialty && (
                              <div className="text-sm text-gray-500">{salary.subspecialty}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{formatCurrency(salary.total_compensation)}</div>
                            {salary.bonus_incentives > 0 && (
                              <div className="text-xs text-gray-500">
                                Includes {formatCurrency(salary.bonus_incentives)} bonus
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{salary.geographic_location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{salary.practice_setting}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{salary.years_of_experience} years</div>
                          </td>
                        </tr>
                        {expandedRowId === salary.id && (
                          <tr className="bg-blue-50">
                            <td colSpan="5" className="px-6 py-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                  <div className="text-sm font-medium text-gray-500">Hours Worked/Week</div>
                                  <div className="text-sm text-gray-900">{salary.hours_worked} hours</div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-500">Satisfaction Score</div>
                                  <div className="text-sm text-gray-900">{salary.satisfaction_level}/5</div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-500">Choose Specialty Again?</div>
                                  <div className="text-sm text-gray-900">
                                    {salary.would_choose_specialty_again ? 'Yes' : 'No'}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-500">Submitted</div>
                                  <div className="text-sm text-gray-900">{formatDate(salary.submission_date)}</div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Updated Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-center">
                  <nav className="relative z-0 inline-flex gap-2" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 rounded-full bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    {/* Show first page */}
                    {currentPage > 3 && (
                      <>
                        <button
                          onClick={() => setCurrentPage(1)}
                          className="relative inline-flex items-center px-4 py-2 rounded-full bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          1
                        </button>
                        {currentPage > 4 && (
                          <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                            ...
                          </span>
                        )}
                      </>
                    )}
                    
                    {/* Show pages around current page */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      if (pageNum > 0 && pageNum <= totalPages) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              currentPage === pageNum
                                ? 'z-10 bg-blue-600 text-white border border-blue-600'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      return null;
                    })}
                    
                    {/* Show last page */}
                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && (
                          <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                            ...
                          </span>
                        )}
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className="relative inline-flex items-center px-4 py-2 rounded-full bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-4 py-2 rounded-full bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-500 text-center">
                Showing page {currentPage} of {totalPages}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-50 py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-16">
            {/* Legal Links */}
            <div className="space-y-2">
              <Link to="/privacy-policy" className="block text-[#2D3748] hover:text-blue-600 text-lg">
                Privacy Policy
              </Link>
              <Link to="/terms" className="block text-[#2D3748] hover:text-blue-600 text-lg">
                Terms and Conditions
              </Link>
              <a 
                href="mailto:thesalarydr@gmail.com"
                className="block text-[#2D3748] hover:text-blue-600 text-lg"
              >
                Contact Us
              </a>
            </div>
            
            {/* Social Links */}
            <div className="space-y-2">
              <a 
                href="https://www.instagram.com/salarydr_/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-[#2D3748] hover:text-blue-600 text-lg"
              >
                Instagram
              </a>
              <a 
                href="https://x.com/salarydr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-[#2D3748] hover:text-blue-600 text-lg"
              >
                X/Twitter
              </a>
              <a 
                href="https://www.tiktok.com/@salarydr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-[#2D3748] hover:text-blue-600 text-lg"
              >
                TikTok
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 mt-8 border-t border-gray-200">
            <p className="text-[#2D3748] text-lg">© 2025 All Rights Reserved by salaryDr.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AllSalaries; 