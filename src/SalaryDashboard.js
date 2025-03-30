import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from './supabaseClient';
import { PRACTICE_TYPES, REGIONS } from './types';

// Helper function to parse currency values
const parseCurrency = (value) => {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  // Remove all non-numeric characters except decimal point
  const numericValue = value.toString().replace(/[^0-9.]/g, '');
  // Convert to float and return, defaulting to 0 if invalid
  return parseFloat(numericValue) || 0;
};

// Add state to region mapping
const STATE_TO_REGION = {
  // Northeast
  'Connecticut': 'Northeast',
  'Maine': 'Northeast',
  'Massachusetts': 'Northeast',
  'New Hampshire': 'Northeast',
  'Rhode Island': 'Northeast',
  'Vermont': 'Northeast',
  'New Jersey': 'Northeast',
  'New York': 'Northeast',
  'Pennsylvania': 'Northeast',
  
  // Midwest
  'Illinois': 'Midwest',
  'Indiana': 'Midwest',
  'Michigan': 'Midwest',
  'Ohio': 'Midwest',
  'Wisconsin': 'Midwest',
  'Iowa': 'Midwest',
  'Kansas': 'Midwest',
  'Minnesota': 'Midwest',
  'Missouri': 'Midwest',
  'Nebraska': 'Midwest',
  'North Dakota': 'Midwest',
  'South Dakota': 'Midwest',
  
  // South
  'Delaware': 'South',
  'Florida': 'South',
  'Georgia': 'South',
  'Maryland': 'South',
  'North Carolina': 'South',
  'South Carolina': 'South',
  'Virginia': 'South',
  'West Virginia': 'South',
  'Alabama': 'South',
  'Kentucky': 'South',
  'Mississippi': 'South',
  'Tennessee': 'South',
  'Arkansas': 'South',
  'Louisiana': 'South',
  'Oklahoma': 'South',
  'Texas': 'South',
  
  // West
  'Arizona': 'West',
  'Colorado': 'West',
  'Idaho': 'West',
  'Montana': 'West',
  'Nevada': 'West',
  'New Mexico': 'West',
  'Utah': 'West',
  'Wyoming': 'West',
  'Alaska': 'West',
  'California': 'West',
  'Hawaii': 'West',
  'Oregon': 'West',
  'Washington': 'West'
};

// Add calculateAverage helper function
const calculateAverage = (items) => {
  if (!items || items.length === 0) return 0;
  const validItems = items.filter(item => {
    const comp = typeof item.totalCompensation === 'string'
      ? parseFloat(item.totalCompensation.replace(/[$,]/g, ''))
      : parseFloat(item.totalCompensation);
    return !isNaN(comp) && comp > 0;
  });
  if (validItems.length === 0) return 0;
  const total = validItems.reduce((sum, item) => {
    const comp = typeof item.totalCompensation === 'string'
      ? parseFloat(item.totalCompensation.replace(/[$,]/g, ''))
      : parseFloat(item.totalCompensation);
    return sum + comp;
  }, 0);
  return Math.round(total / validItems.length);
};

const SalaryDrDashboard = () => {
  const [practiceType, setPracticeType] = useState('All Practice Types');
  const [locationFilter, setLocationFilter] = useState('All Regions');
  const [specialtyFilter, setSpecialtyFilter] = useState('All Physicians');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSpecialties, setFilteredSpecialties] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [openFAQIndex, setOpenFAQIndex] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [salaryData, setSalaryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comparisonType, setComparisonType] = useState('specialties');
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [careerStage, setCareerStage] = useState('all');
  const [userInput, setUserInput] = useState({
    compensation: '',
    yearsOfExperience: '',
    specialty: '',
    location: '',
    practiceSetting: ''
  });
  const [comparisonResult, setComparisonResult] = useState(null);
  const [costOfLivingData, setCostOfLivingData] = useState({
    'Northeast': 1.15,
    'West': 1.1,
    'South': 0.95,
    'Midwest': 0.9
  });
  const [aggregatedStats, setAggregatedStats] = useState({
    averageSalary: 0,
    totalSubmissions: 0,
    base: 0,
    bonuses: 0,
    bonusesPercentage: 0,
    otherIncome: 0,
    otherIncomePercentage: 0,
    workload: 0,
    satisfaction: 0,
    satisfactionPercentage: 0,
    updateDate: new Date().toLocaleDateString(),
    avgRVU: 0,
    avgRVUCount: 0
  });
  const [salaryDistribution, setSalaryDistribution] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [specialtyOptions, setSpecialtyOptions] = useState([]);
  const [specialtySearch, setSpecialtySearch] = useState('');
  const [subspecialtySearch, setSubspecialtySearch] = useState('');
  const [filteredSubspecialties, setFilteredSubspecialties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showReferModal, setShowReferModal] = useState(false);

  // Add formatTimeAgo function
  const formatTimeAgo = (date) => {
    if (!date) return 'Recently';
    
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)}w ago`;
    } else {
      return `${Math.floor(diffDays / 30)}mo ago`;
    }
  };

  // Move fetchSpecialties function here, before any useEffect hooks
  const fetchSpecialties = async () => {
    try {
      const { data: specialtyData, error: specialtyError } = await supabase
        .from('salary_submissions')
        .select('specialty, subspecialty')
        .limit(10000); // Set a high limit to ensure we get all records

      if (specialtyError) throw specialtyError;

      // Create a Set to store unique specialty combinations
      const specialtySet = new Set();
      
      specialtyData.forEach(item => {
        if (item.specialty) {
          if (item.subspecialty) {
            specialtySet.add(`${item.specialty} - ${item.subspecialty}`);
          } else {
            specialtySet.add(item.specialty);
          }
        }
      });

      // Convert Set to sorted array
      const sortedSpecialties = Array.from(specialtySet).sort();
      console.log('Total unique specialties found:', sortedSpecialties.length);
      setSpecialtyOptions(sortedSpecialties);
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  // Add useEffect for data fetching with debouncing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchData();
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [selectedSpecialties, practiceType, locationFilter, currentPage]);

  // Add useEffect to fetch specialties on component mount
  useEffect(() => {
    fetchSpecialties();
  }, []);

  // Add useEffect for initial data load
  useEffect(() => {
    fetchData();
  }, [locationFilter, specialtyFilter, practiceType, currentPage]);

  const processData = (items) => {
    if (!items || items.length === 0) {
      return;
    }

    console.log('Processing data for items:', items.length);

    // Filter items based on current filters
    const filteredItems = items.filter(item => {
      if (specialtyFilter !== 'All Physicians') {
        // Check if the specialty filter includes a subspecialty
        if (specialtyFilter.includes(' - ')) {
          const [specialty, subspecialty] = specialtyFilter.split(' - ');
          return item.specialty?.toLowerCase() === specialty.toLowerCase() && 
                 item.subspecialty?.toLowerCase() === subspecialty.toLowerCase();
        } else {
          return item.specialty?.toLowerCase() === specialtyFilter.toLowerCase();
        }
      }
      if (locationFilter !== 'All Regions') {
        const itemState = item.state;
        const itemRegion = item.geographicLocation;
        return itemRegion === locationFilter || STATE_TO_REGION[itemState] === locationFilter;
      }
      if (practiceType !== 'All Practice Types') {
        const practiceSetting = (item.practice_setting || '').toLowerCase().trim();
        if (practiceType === 'Hospital Employed') {
          return practiceSetting.includes('hospital') || 
                 practiceSetting.includes('employed') || 
                 practiceSetting === 'hospital employed' || 
                 practiceSetting === 'hospital-employed';
        } else if (practiceType === 'Academic') {
          return practiceSetting.includes('academic');
        } else if (practiceType === 'Private Practice') {
          return practiceSetting.includes('private');
        }
      }
      return true;
    });

    console.log('Filtered items:', filteredItems.length);

    const validCompItems = filteredItems.filter(item => {
      return item.totalCompensation > 0;
    });

    console.log('Valid compensation items:', validCompItems.length);

    let avgTotalComp = 0;
    if (validCompItems.length > 0) {
      const totalComp = validCompItems.reduce((sum, item) => {
        return sum + item.totalCompensation;
      }, 0);

      avgTotalComp = Math.round(totalComp / validCompItems.length);
    }

    // Count physicians who would choose their specialty again
    const wouldChooseAgainCount = filteredItems.filter(item => item.wouldChooseAgain === true).length;
    console.log('Would choose again count:', wouldChooseAgainCount, 'out of', filteredItems.length);
    const calculatedSatisfactionPercentage = filteredItems.length > 0 ? Math.round((wouldChooseAgainCount / filteredItems.length) * 100) : 0;

    let totalBase = 0;
    let totalBonuses = 0;
    let totalOther = 0;
    let baseCount = 0;
    let bonusCount = 0;
    let otherCount = 0;
    let workloadTotal = 0;
    let workloadCount = 0;

    filteredItems.forEach(item => {
      const baseSalary = item.baseSalary;
      if (!isNaN(baseSalary) && baseSalary > 0) {
        totalBase += baseSalary;
        baseCount++;
      }

      const bonus = item.bonusIncentives;
      if (!isNaN(bonus) && bonus > 0) {
        totalBonuses += bonus;
        bonusCount++;
      }

      const totalComp = item.totalCompensation;
      if (!isNaN(totalComp) && totalComp > 0 && !isNaN(baseSalary) && !isNaN(bonus)) {
        const otherIncome = totalComp - baseSalary - bonus;
        if (otherIncome > 0) {
          totalOther += otherIncome;
          otherCount++;
        }
      }

      const hours = Number(item.hoursWorkedPerWeek || 0);
      if (!isNaN(hours) && hours > 0) {
        workloadTotal += hours;
        workloadCount++;
      }
    });

    const compensationValues = validCompItems
      .map(item => item.totalCompensation)
      .filter(val => !isNaN(val) && val > 0)
      .sort((a, b) => a - b);

    const percentiles = [];
    if (compensationValues.length > 0) {
      const getPercentileValue = (percentile) => {
        const index = Math.floor(compensationValues.length * percentile / 100);
        return compensationValues[Math.min(index, compensationValues.length - 1)];
      };

      percentiles.push(
        { name: 'p10th', value: getPercentileValue(10), label: `$${Math.round(getPercentileValue(10) / 1000)}K` },
        { name: 'p25th', value: getPercentileValue(25), label: `$${Math.round(getPercentileValue(25) / 1000)}K` },
        { name: 'p50th', value: getPercentileValue(50), label: `$${Math.round(getPercentileValue(50) / 1000)}K` },
        { name: 'p75th', value: getPercentileValue(75), label: `$${Math.round(getPercentileValue(75) / 1000)}K` },
        { name: 'p90th', value: getPercentileValue(90), label: `$${Math.round(getPercentileValue(90) / 1000)}K` }
      );
    }

    setSalaryDistribution(percentiles);

    // Update how we categorize items for comparison data
    const academicItems = validCompItems.filter(item => {
      const practiceSetting = (item.practice_setting || '').toLowerCase().trim();
      return practiceSetting.includes('academic');
    });

    const hospitalItems = validCompItems.filter(item => {
      const practiceSetting = (item.practice_setting || '').toLowerCase().trim();
      return practiceSetting.includes('hospital') || 
             practiceSetting.includes('employed') || 
             practiceSetting === 'hospital employed' || 
             practiceSetting === 'hospital-employed';
    });

    const privateItems = validCompItems.filter(item => {
      const practiceSetting = (item.practice_setting || '').toLowerCase().trim();
      return practiceSetting.includes('private');
    });

    // Remove the uncategorized items logic since we're being more inclusive with our filters
    const comparisonData = [
      {
        type: 'Academic',
        avgComp: calculateAverage(academicItems),
        submissions: academicItems.length
      },
      {
        type: 'Hospital Employed',
        avgComp: calculateAverage(hospitalItems),
        submissions: hospitalItems.length
      },
      {
        type: 'Private Practice',
        avgComp: calculateAverage(privateItems),
        submissions: privateItems.length
      }
    ];

    setComparisonData(comparisonData);

    let sortedItems = [...filteredItems];
    const itemsWithDates = sortedItems.filter(item => item.submissionDate);

    // First filter by practice type if a specific type is selected
    const practiceTypeFiltered = activeTab === 'overview' 
      ? itemsWithDates 
      : itemsWithDates.filter(submission => {
          const employerType = submission.employerType?.toLowerCase() || '';
          switch (activeTab) {
            case 'academic':
              return employerType === 'academic';
            case 'hospital':
              return employerType === 'hospital-employed';
            case 'private':
              return employerType === 'private practice';
            default:
              return true;
          }
        });

    // If we have less than 3 submissions after filtering, get more from older dates
    if (practiceTypeFiltered.length < 3) {
      const olderSubmissions = filteredItems.filter(item => {
        const employerType = item.employerType?.toLowerCase() || '';
        switch (activeTab) {
          case 'academic':
            return employerType === 'academic';
          case 'hospital':
            return employerType === 'hospital-employed';
          case 'private':
            return employerType === 'private practice';
          default:
            return true;
        }
      });
      sortedItems = olderSubmissions;
    } else {
      sortedItems = practiceTypeFiltered;
    }

    // Sort by date and take up to 10 items
    sortedItems = sortedItems.sort((a, b) => {
      const dateA = new Date(a.submissionDate || '2000-01-01');
      const dateB = new Date(b.submissionDate || '2000-01-01');
      return dateB - dateA;
    }).slice(0, 10);

    const recentSubmissions = sortedItems.map(item => {
      if (!item) return null;  // Skip if item is undefined
      
      const totalComp = typeof item.totalCompensation === 'string'
        ? Number(item.totalCompensation.replace(/[^0-9.-]+/g, ''))
        : Number(item.totalCompensation || 0);

      const bonusIncentives = typeof item.bonusIncentives === 'string'
        ? Number(item.bonusIncentives.replace(/[^0-9.-]+/g, ''))
        : Number(item.bonusIncentives || 0);

      let timeAgo = 'Recently';
      if (item.submissionDate) {
        const now = new Date();
        const past = new Date(item.submissionDate);
        const diffMs = now - past;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays < 1) {
          timeAgo = 'Today';
        } else if (diffDays === 1) {
          timeAgo = 'Yesterday';
        } else if (diffDays < 7) {
          timeAgo = `${diffDays}d ago`;
        } else if (diffDays < 30) {
          timeAgo = `${Math.floor(diffDays / 7)}w ago`;
        } else {
          timeAgo = `${Math.floor(diffDays / 30)}mo ago`;
        }
      }

      // Generate a unique ID if none exists
      const uniqueId = item.id || `temp-${Math.random().toString(36).substr(2, 9)}`;

      return {
        id: uniqueId,
        timeAgo,
        specialty: item.specialty || 'General',
        subspecialty: item.subspecialty || '',
        yearsOfExperience: item.yearsOfExperience || 0,
        location: item.location || 'United States',
        employer: item.employer || '',
        employerType: item.practiceType || 'Unknown',
        workload: `${item.hoursWorkedPerWeek || 40} hrs/week`,
        pto: item.paidTimeOff || '4 wks',
        compensation: totalComp,
        productivity: item.productivityModel || 'Salary',
        submissionDate: item.submissionDate || '',
        satisfaction: item.satisfactionLevel || 0,
        bonusIncentives: bonusIncentives,
        wouldChooseAgain: item.wouldChooseAgain || false
      };
    }).filter(Boolean); // Remove any null entries

    setRecentSubmissions(recentSubmissions);

    const rvuValues = items
      .map(item => Number(item.rvuValue || 0))
      .filter(val => !isNaN(val) && val > 0);
    
    const rvuCount = items
      .map(item => Number(item.rvuCount || 0))
      .filter(val => !isNaN(val) && val > 0);

    const avgRVU = rvuValues.length > 0
      ? rvuValues.reduce((sum, val) => sum + val, 0) / rvuValues.length
      : 0;

    const avgRVUCount = rvuCount.length > 0
      ? rvuCount.reduce((sum, val) => sum + val, 0) / rvuCount.length
      : 0;

    setAggregatedStats({
      averageSalary: avgTotalComp,
      totalSubmissions: validCompItems.length,
      base: baseCount > 0 ? Math.round(totalBase / baseCount) : 0,
      bonuses: bonusCount > 0 ? Math.round(totalBonuses / bonusCount) : 0,
      bonusesPercentage: items.length > 0 ? Math.round((bonusCount / items.length) * 100) : 0,
      otherIncome: otherCount > 0 ? Math.round(totalOther / otherCount) : 0,
      otherIncomePercentage: items.length > 0 ? Math.round((otherCount / items.length) * 100) : 0,
      workload: workloadCount > 0 ? Math.round(workloadTotal / workloadCount * 10) / 10 : 0,
      satisfaction: calculatedSatisfactionPercentage,
      satisfactionPercentage: calculatedSatisfactionPercentage,
      updateDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      avgRVU: Math.round(avgRVU * 100) / 100 || 0,
      avgRVUCount: Math.round(avgRVUCount) || 0
    });
  };

  useEffect(() => {
    fetchData();
  }, [locationFilter, specialtyFilter, practiceType, currentPage]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // First, let's get the total count
      const { count: totalCount } = await supabase
        .from('salary_submissions')
        .select('*', { count: 'exact', head: true });

      console.log('Total records in database:', totalCount);

      // Function to build the base query with filters
      const buildBaseQuery = () => {
        let query = supabase
          .from('salary_submissions')
          .select('*');

        if (specialtyFilter && specialtyFilter !== 'All Physicians') {
          if (specialtyFilter.includes(' - ')) {
            const [specialty, subspecialty] = specialtyFilter.split(' - ');
            query = query
              .eq('specialty', specialty)
              .eq('subspecialty', subspecialty);
          } else {
            query = query.eq('specialty', specialtyFilter);
          }
        }
        
        if (practiceType && practiceType !== 'All Practice Types') {
          if (practiceType === 'Hospital Employed') {
            query = query.or('practice_setting.ilike.%hospital%,practice_setting.ilike.%employed%,practice_setting.eq.Hospital Employed,practice_setting.eq.Hospital-Employed');
          } else if (practiceType === 'Academic') {
            query = query.ilike('practice_setting', '%academic%');
          } else if (practiceType === 'Private Practice') {
            query = query.ilike('practice_setting', '%private%');
          }
        }
        
        if (locationFilter && locationFilter !== 'All Regions') {
          const statesInRegion = Object.entries(STATE_TO_REGION)
            .filter(([_, region]) => region === locationFilter)
            .map(([state, _]) => state);
          
          query = query.or(`geographic_location.eq.${locationFilter},state.in.(${statesInRegion.join(',')})`);
        }

        return query.order('created_date', { ascending: false });
      };

      // Fetch data in chunks
      let allData = [];
      let start = 0;
      const chunkSize = 1000;
      let hasMore = true;

      while (hasMore) {
        console.log(`Fetching records ${start} to ${start + chunkSize - 1}...`);
        const query = buildBaseQuery().range(start, start + chunkSize - 1);
        const { data: chunk, error: chunkError } = await query;

        if (chunkError) {
          console.error('Error fetching chunk:', chunkError);
          throw chunkError;
        }

        if (!chunk || chunk.length === 0) {
          hasMore = false;
        } else {
          allData = [...allData, ...chunk];
          start += chunkSize;
          
          // If we've fetched all records according to the count, stop
          if (allData.length >= totalCount) {
            hasMore = false;
          }
        }

        console.log(`Fetched ${chunk?.length || 0} records in this chunk. Total records so far: ${allData.length}`);
      }

      console.log('All chunks fetched. Total records:', allData.length);

      // Transform the data
      const transformedData = allData
        .filter(item => item && typeof item === 'object') // Ensure item exists and is an object
        .map(item => {
          // Log raw values for debugging
          console.log('Raw data from DB:', {
            id: item.id,
            satisfaction_level: item.satisfaction_level,
            raw_type: typeof item.satisfaction_level
          });

          const normalizedPracticeSetting = (() => {
            const setting = (item.practice_setting || '').toLowerCase().trim();
            if (setting.includes('academic')) return 'Academic';
            if (setting.includes('hospital') || setting.includes('employed')) return 'Hospital Employed';
            if (setting.includes('private')) return 'Private Practice';
            return 'Unknown';
          })();

          // Generate a unique ID if none exists
          const uniqueId = item.id || `temp-${Math.random().toString(36).substr(2, 9)}`;

          // Create transformed item
          return {
            id: uniqueId,
            salary: parseCurrency(item.total_compensation) || parseCurrency(item.base_salary) || 0,
            specialty: item.specialty || 'General',
            subspecialty: item.subspecialty || '',
            practiceType: normalizedPracticeSetting,
            location: (() => {
              if (item.city && item.state) return `${item.city}, ${item.state}`;
              if (item.state) return item.state;
              if (item.geographic_location) return item.geographic_location;
              return 'Location Not Specified';
            })(),
            employerType: normalizedPracticeSetting,
            bonusIncentives: parseCurrency(item.bonus_incentives) || 0,
            wouldChooseAgain: item.choosespecialty === true,
            submissionDate: item.created_date || new Date().toISOString(),
            yearsOfExperience: Number(item.years_of_experience) || 0,
            hoursWorkedPerWeek: Number(item.hours_worked) || 40,
            paidTimeOff: item.benefits || '4 wks',
            productivityModel: item.rvu_bonus_structure || 'Salary',
            satisfactionLevel: parseInt(item.satisfaction_level, 10) || 0,
            totalCompensation: parseCurrency(item.total_compensation) || 0,
            city: item.city || '',
            state: item.state || '',
            callSchedule: item.call_schedule || '',
            rvuTarget: Number(item.rvu_target) || 0,
            rvuRate: Number(item.rvu_rate) || 0,
            actualRVU: Number(item.actual_rvu_production) || 0,
            productionBonus: parseCurrency(item.production_bonus) || 0,
            negotiationStatus: item.negotiation_status || '',
            baseSalary: parseCurrency(item.base_salary) || 0,
            geographicLocation: item.geographic_location || 'Unknown',
            practice_setting: item.practice_setting || 'Unknown'
          };
        });

      console.log('Data transformation complete. Transformed records:', transformedData.length);

      // Update state
      setSalaryData(transformedData);
      
      // Process recent submissions - take most recent 10
      const recentSubmissions = transformedData
        .slice(0, 10)
        .map(item => ({
          id: item.id,
          timeAgo: formatTimeAgo(new Date(item.submissionDate)),
          specialty: item.specialty,
          subspecialty: item.subspecialty || '',
          location: item.location,
          employerType: item.practiceType,
          compensation: item.totalCompensation,
          bonusIncentives: item.bonusIncentives,
          wouldChooseAgain: item.wouldChooseAgain,
          satisfactionLevel: item.satisfactionLevel, // Ensure this is included
          yearsOfExperience: item.yearsOfExperience,
          workload: item.hoursWorkedPerWeek ? `${item.hoursWorkedPerWeek} hrs/week` : 'Not specified',
          submissionDate: item.submissionDate
        }));

      setRecentSubmissions(recentSubmissions);
      processData(transformedData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Add loading and error states to the UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-700">Loading salary data...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-lg mx-auto">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error loading data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="text-sm text-gray-500 mb-4">
            Please check your connection and try again. If the problem persists, contact support.
          </div>
          <button 
            onClick={() => {
              setError(null);
              setIsLoading(false);
              fetchData();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
    
      const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0
        }).format(value);
      };
    
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric'
        });
      };
    
      const formatPostedDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric'
        });
      };
    
      const toggleFAQ = (index) => {
        setOpenFAQIndex(openFAQIndex === index ? null : index);
      };
    
      const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
      };
    
    // Update the handleSearchChange function
      const handleSearchChange = (e) => {
      const query = e.target.value;
      setSearchQuery(query);
    
        if (query.length > 0) {
          const filtered = specialtyOptions.filter(specialty =>
          specialty.toLowerCase().includes(query.toLowerCase())
          );
          setFilteredSpecialties(filtered);
        } else {
          setFilteredSpecialties([]);
        }
      };
    
    // Update the handleSpecialtySelect function
      const handleSpecialtySelect = (specialty) => {
      setSearchQuery(specialty);
      setFilteredSpecialties([]);
      setSpecialtyFilter(specialty); // Store the full specialty string including subspecialty
      };
    
      const handleSearchSubmit = () => {
        if (!searchQuery.trim()) {
          // If search query is empty, reset to show all physicians
          setSpecialtyFilter('All Physicians');
          setFilteredSpecialties([]);
          setSearchQuery('');
          return;
        }

        if (searchQuery && !specialtyFilter.includes(searchQuery)) {
          const exactMatch = specialtyOptions.find(
            s => s.toLowerCase() === searchQuery.toLowerCase()
          );
          
          if (exactMatch) {
            handleSpecialtySelect(exactMatch);
          } else {
            const partialMatches = specialtyOptions.filter(
              s => s.toLowerCase().includes(searchQuery.toLowerCase())
            );
            
            if (partialMatches.length > 0) {
              handleSpecialtySelect(partialMatches[0]);
            }
          }
        }
      };
    
      const handleViewAllSalaries = () => {
        console.log('Navigate to full salary list with current filters');
      };

    const calculateUserSalaryGrade = (userComp, avgComp, percentile) => {
      const ratio = userComp / avgComp;
      if (ratio >= 1.2) return { grade: 'A+', color: 'text-green-600' };
      if (ratio >= 1.1) return { grade: 'A', color: 'text-green-500' };
      if (ratio >= 1.0) return { grade: 'B+', color: 'text-blue-600' };
      if (ratio >= 0.9) return { grade: 'B', color: 'text-blue-500' };
      if (ratio >= 0.8) return { grade: 'C+', color: 'text-yellow-600' };
      if (ratio >= 0.7) return { grade: 'C', color: 'text-yellow-500' };
      return { grade: 'D', color: 'text-red-500' };
    };

    const analyzeUserSalary = () => {
      if (!userInput.compensation || !userInput.specialty) {
        setComparisonResult({
          error: 'Please enter both compensation and specialty.'
        });
        return;
      }

      // Parse user compensation (remove $ and commas)
      const userComp = parseFloat(userInput.compensation.replace(/[$,]/g, ''));
      if (isNaN(userComp) || userComp <= 0) {
        setComparisonResult({
          error: 'Please enter a valid compensation amount.'
        });
        return;
      }

      const userYears = parseInt(userInput.yearsOfExperience) || 0;
      const userLocation = userInput.location || 'All Regions';
      const userPractice = userInput.practiceSetting || 'All Practice Types';

      // Extract primary specialty and subspecialty if present
      const [primarySpecialty, subspecialty] = userInput.specialty.includes(' - ') 
        ? userInput.specialty.split(' - ')
        : [userInput.specialty, null];

      // Filter data based on user inputs with exact specialty/subspecialty match
      const relevantData = salaryData.filter(item => {
        // Check for exact specialty match (with or without subspecialty)
        const specialtyMatch = subspecialty
          ? item.specialty?.toLowerCase() === primarySpecialty.toLowerCase() && 
            item.subspecialty?.toLowerCase() === subspecialty.toLowerCase()
          : item.specialty?.toLowerCase() === primarySpecialty.toLowerCase();

        // Check location and practice type
        const locationMatch = userLocation === 'All Regions' || item.geographicLocation === userLocation;
        const practiceMatch = userPractice === 'All Practice Types' || 
          (userPractice === 'Hospital Employed' && 
            ['hospital employed', 'hospital-employed', 'hospital'].includes(item.practiceSetting?.toLowerCase())) ||
          (userPractice === 'Academic' && 
            item.practiceSetting?.toLowerCase() === 'academic') ||
          (userPractice === 'Private Practice' && 
            ['private practice', 'private'].includes(item.practiceSetting?.toLowerCase()));
        
        return specialtyMatch && locationMatch && practiceMatch;
      });

      // If not enough data with exact match, try with primary specialty only
      if (relevantData.length < 3 && subspecialty) {
        const primarySpecialtyData = salaryData.filter(item => {
          const matchesPrimarySpecialty = item.specialty?.toLowerCase() === primarySpecialty.toLowerCase();
          const locationMatch = userLocation === 'All Regions' || item.geographicLocation === userLocation;
          const practiceMatch = userPractice === 'All Practice Types' || 
            (userPractice === 'Hospital Employed' && 
              ['hospital employed', 'hospital-employed', 'hospital'].includes(item.practiceSetting?.toLowerCase())) ||
            (userPractice === 'Academic' && 
              item.practiceSetting?.toLowerCase() === 'academic') ||
            (userPractice === 'Private Practice' && 
              ['private practice', 'private'].includes(item.practiceSetting?.toLowerCase()));
          
          return matchesPrimarySpecialty && locationMatch && practiceMatch;
        });

        if (primarySpecialtyData.length >= 3) {
          setComparisonResult({
            error: 'Limited data for your subspecialty. Showing comparison based on ' + primarySpecialty + '.'
          });
          analyzeWithData(primarySpecialtyData, userComp, userYears);
          return;
        }
      }

      // If still not enough data, try with just the specialty and no other filters
      if (relevantData.length < 3) {
        const specialtyOnlyData = salaryData.filter(item => 
          item.specialty?.toLowerCase() === primarySpecialty.toLowerCase()
        );

        if (specialtyOnlyData.length >= 3) {
          setComparisonResult({
            error: 'Limited data with your exact filters. Showing comparison based on specialty only.'
          });
          analyzeWithData(specialtyOnlyData, userComp, userYears);
          return;
        }

        setComparisonResult({
          error: 'Not enough data available for comparison. Try a different specialty.'
        });
        return;
      }

      // Continue with analysis using the data we have
      analyzeWithData(relevantData, userComp, userYears);
    };

    const analyzeWithData = (relevantData, userComp, userYears) => {
      // Determine career stage first
      let careerStage = 'Mid Career';
      if (userYears < 5) careerStage = 'Early Career';
      else if (userYears >= 15) careerStage = 'Late Career';

      // Calculate stage-specific data
      const stageData = relevantData.filter(item => {
        const years = parseInt(item.yearsOfExperience) || 0;
        if (careerStage === 'Early Career') return years < 5;
        if (careerStage === 'Mid Career') return years >= 5 && years < 15;
        return years >= 15;
      });

      // Filter valid compensation data
      const comps = relevantData
        .map(item => {
          const comp = typeof item.totalCompensation === 'string'
            ? parseFloat(item.totalCompensation.replace(/[$,]/g, ''))
            : parseFloat(item.totalCompensation);
          return !isNaN(comp) && comp > 0 ? comp : null;
        })
        .filter(Boolean);

      const stageComps = stageData
        .map(item => {
          const comp = typeof item.totalCompensation === 'string'
            ? parseFloat(item.totalCompensation.replace(/[$,]/g, ''))
            : parseFloat(item.totalCompensation);
          return !isNaN(comp) && comp > 0 ? comp : null;
        })
        .filter(Boolean);

      const avgComp = Math.round(comps.reduce((a, b) => a + b, 0) / comps.length);
      const sortedComps = [...comps].sort((a, b) => a - b);
      const calculatedPercentile = Math.round((sortedComps.filter(comp => comp <= userComp).length / sortedComps.length) * 100);
      const userPercentile = calculatedPercentile < 10 ? "Bottom" : calculatedPercentile;

      // Use stage-specific average if we have enough data, otherwise use overall average
      const stageAvgComp = stageComps.length >= 3
        ? Math.round(stageComps.reduce((sum, comp) => sum + comp, 0) / stageComps.length)
        : avgComp;

      // Calculate grade
      const ratio = userComp / stageAvgComp;
      let grade, gradeColor, feedback;

      if (ratio >= 1.2) {
        grade = 'A+';
        gradeColor = 'text-green-600';
        feedback = 'Your compensation is significantly above market rate. You may be in a high-demand area or have unique qualifications.';
      } else if (ratio >= 1.1) {
        grade = 'A';
        gradeColor = 'text-green-500';
        feedback = 'Your compensation is well above market rate. This is an excellent position to be in.';
      } else if (ratio >= 1.0) {
        grade = 'B+';
        gradeColor = 'text-blue-600';
        feedback = 'Your compensation is above market rate. You are being compensated fairly.';
      } else if (ratio >= 0.9) {
        grade = 'B';
        gradeColor = 'text-blue-500';
        feedback = 'Your compensation is slightly below market rate but within a reasonable range.';
      } else if (ratio >= 0.8) {
        grade = 'C+';
        gradeColor = 'text-yellow-600';
        feedback = 'Your compensation is below market rate. Consider discussing a raise with your employer.';
      } else if (ratio >= 0.7) {
        grade = 'C';
        gradeColor = 'text-yellow-500';
        feedback = 'Your compensation is significantly below market rate. Consider exploring other opportunities.';
      } else {
        grade = 'D';
        gradeColor = 'text-red-500';
        feedback = 'Your compensation is well below market rate. We strongly recommend evaluating other opportunities.';
      }

      setComparisonResult({
        userComp,
        avgComp: stageAvgComp,
        percentile: userPercentile,
        grade,
        gradeColor,
        feedback,
        careerStage,
        totalComparisons: comps.length,
        stageComparisons: stageComps.length,
        comparisonText: stageComps.length >= 3 
          ? `${stageComps.length} ${careerStage}`
          : `${comps.length}`
      });
    };

    const formatInputCurrency = (value) => {
      // Remove all non-numeric characters
      const numericValue = value.replace(/[^0-9]/g, '');
      // Convert to number and format
      const number = parseInt(numericValue, 10);
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(number);
    };

    const handleCompensationChange = (e) => {
      const formattedValue = formatInputCurrency(e.target.value);
      setUserInput({ ...userInput, compensation: formattedValue });
    };

    // Add this function to handle specialty search
    const handleSpecialtySearch = (e) => {
      const query = e.target.value.toLowerCase();
      setSpecialtySearch(query);
      
      if (query.length > 0) {
        const filtered = specialtyOptions
          .filter(specialty => specialty.toLowerCase().includes(query));
        setFilteredSpecialties(filtered);
      } else {
        setFilteredSpecialties([]);
      }
    };

    // Add this function to handle subspecialty search
    const handleSubspecialtySearch = (e) => {
      const query = e.target.value.toLowerCase();
      setSubspecialtySearch(query);
      
      if (query.length > 0 && userInput.specialty) {
        const filtered = specialtyOptions
          .filter(spec => spec.startsWith(userInput.specialty))
          .map(spec => spec.includes(' - ') ? spec.split(' - ')[1] : '')
          .filter(Boolean)
          .filter(subspecialty => subspecialty.toLowerCase().includes(query));
        setFilteredSubspecialties(filtered);
      } else {
        setFilteredSubspecialties([]);
      }
    };

    const handleReferClick = (e) => {
      e.preventDefault();
      setShowReferModal(true);
    };

    const handleCopyLink = () => {
      navigator.clipboard.writeText("https://www.salarydr.com")
        .then(() => {
          alert("Link copied to clipboard!");
          setShowReferModal(false);
        })
        .catch(() => {
          alert("Failed to copy link. Please try again.");
        });
    };

    const handleEmailShare = () => {
      window.location.href = "mailto:?subject=Check%20out%20SalaryDr%20-%20Physician%20Salary%20Transparency&body=I%20thought%20you%20might%20be%20interested%20in%20this%20physician%20salary%20transparency%20tool%3A%20https%3A%2F%2Fwww.salarydr.com";
      setShowReferModal(false);
    };

    const handleTwitterShare = () => {
      window.open(`https://twitter.com/intent/tweet?text=Check%20out%20SalaryDr%20for%20physician%20salary%20transparency%3A%20https%3A%2F%2Fwww.salarydr.com`, '_blank');
      setShowReferModal(false);
    };

    const handleLinkedInShare = () => {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fwww.salarydr.com`, '_blank');
      setShowReferModal(false);
    };

    const ReferModal = () => {
      if (!showReferModal) return null;

      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Share SalaryDr</h3>
              <button
                onClick={() => setShowReferModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Link
              </button>

              <button
                onClick={handleEmailShare}
                className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
              >
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Share via Email
              </button>

              <button
                onClick={handleTwitterShare}
                className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
                Share on X
              </button>

              <button
                onClick={handleLinkedInShare}
                className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                Share on LinkedIn
              </button>
            </div>
          </div>
        </div>
      );
    };

    if (isLoading) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-blue-50">
            <div className="text-center">
              <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-700">Loading salary data...</p>
            </div>
          </div>
        );
      }
    
      return (
        <div className="bg-blue-50 min-h-screen p-4">
          {/* Header with Logo */}
          <header className="max-w-7xl mx-auto mb-6">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Physician Salary Explorer</h1>
              <Link 
                to="/" 
                className="inline-block text-[2rem] tracking-normal font-['Outfit']"
              >
                <span className="text-[#4169E1] font-[400]">salary</span>
                <span className="text-[#E94E4A] font-[500]">Dr</span>
              </Link>
            </div>
            <p className="text-gray-600 mt-2">Explore real physician salary data by specialty, location, and practice type. Updated daily with anonymous submissions from verified physicians.</p>
          </header>
    
          <div className="max-w-7xl mx-auto mb-6 bg-blue-100 border border-blue-200 rounded-lg p-4 flex items-center">
            <div className="text-blue-700 mr-3">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
              </svg>
            </div>
            <p className="text-blue-800">
              Trusted by our community of 5,365+ followers on X - <a href="https://x.com/salarydr" className="text-blue-600 hover:text-blue-700 font-medium">Follow us @salarydr</a> for salary insights and career tips.
            </p>
          </div>
    
          <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[200px] relative">
                <input
                  type="text"
                className="w-full bg-white border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search specialties (e.g., General Surgery - Trauma)"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                />
                {filteredSpecialties.length > 0 && (
                <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                    {filteredSpecialties.map((specialty, index) => (
                      <li
                        key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-900"
                        onClick={() => handleSpecialtySelect(specialty)}
                      >
                        {specialty}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
    
              <div className="w-full md:w-auto">
                <select
                  className="w-full bg-white border border-gray-300 rounded-lg py-2 px-4"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option>All Regions</option>
                  <option>Northeast</option>
                  <option>Midwest</option>
                  <option>South</option>
                  <option>West</option>
                </select>
              </div>
    
              <div className="w-full md:w-auto">
                <select
                  className="w-full bg-white border border-gray-300 rounded-lg py-2 px-4"
                  value={practiceType}
                  onChange={(e) => setPracticeType(e.target.value)}
                >
                  <option>All Practice Types</option>
                  <option>Hospital Employed</option>
                  <option>Academic</option>
                  <option>Private Practice</option>
                </select>
              </div>
    
              <button 
                className="bg-indigo-900 text-white py-2 px-4 rounded-lg"
                onClick={handleSearchSubmit}
              >
                Search
              </button>
            </div>
          </div>
    
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-900 text-left mb-1">
                  {specialtyFilter === 'All Physicians' ? 'Physician Salary' : `${specialtyFilter} Salary`} in {locationFilter}
                  {practiceType !== 'All Practice Types' && ` (${practiceType})`}
                </h2>
              <div className="flex flex-col">
                <div className="flex items-start">
                  <span className="text-5xl font-bold text-gray-900">{formatCurrency(aggregatedStats.averageSalary)}</span>
                  <span className="ml-3 text-sm text-gray-600 mt-2">Avg Total Comp ({aggregatedStats.totalSubmissions.toLocaleString()} Salaries)</span>
                </div>
                <div className="text-sm text-gray-500 text-left mt-1">Updated {aggregatedStats.updateDate}</div>
              </div>
              </div>
    
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salaryDistribution}
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
                      labelFormatter={(value) => {
                        const percentileMap = {
                          'p10th': '10th percentile',
                          'p25th': '25th percentile',
                          'p50th': 'Median (50th percentile)',
                          'p75th': '75th percentile',
                          'p90th': '90th percentile'
                        };
                        return percentileMap[value] || value;
                      }}
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
              <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Comparison by Employment Type</h2>
            <div className="grid grid-cols-3 gap-4">
              {comparisonData.map((item) => (
                <div key={item.type} className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-lg font-semibold text-indigo-900">{item.type}</div>
                  <div className="text-2xl font-bold text-gray-900">{formatCurrency(item.avgComp)}</div>
                  <div className="text-sm text-gray-500">{item.submissions} submissions</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Submissions</h2>
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm font-medium ${activeTab === 'overview' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setActiveTab('overview')}
                >
                  All
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm font-medium ${activeTab === 'academic' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setActiveTab('academic')}
                >
                  Academic
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm font-medium ${activeTab === 'hospital' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setActiveTab('hospital')}
                >
                  Hospital
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm font-medium ${activeTab === 'private' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setActiveTab('private')}
                >
                  Private
                </button>
              </div>
            </div>

            <div className="overflow-x-auto bg-blue-50 rounded-lg">
              <table className="min-w-full">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-indigo-900 uppercase">Posted</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-indigo-900 uppercase">Specialty</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-indigo-900 uppercase">Location</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-indigo-900 uppercase">Practice Type</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-indigo-900 uppercase">Total Comp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-200">
                  {recentSubmissions
                    .filter(submission => {
                      if (activeTab === 'overview') return true;
                    
                    const employerType = submission.employerType?.toLowerCase() || '';
                    switch (activeTab) {
                      case 'academic':
                        return employerType === 'academic';
                      case 'hospital':
                        return employerType === 'hospital-employed';
                      case 'private':
                        return employerType === 'private practice';
                      default:
                      return true;
                    }
                    })
                    .map((submission) => (
                      <React.Fragment key={submission.id}>
                        <tr
                          className="hover:bg-blue-100 cursor-pointer"
                          onClick={() => toggleRow(submission.id)}
                        >
                          <td className="px-6 py-4 text-center">
                            <div className="text-sm text-gray-900">{formatPostedDate(submission.submissionDate)}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{submission.specialty}</div>
                            <div className="text-xs text-gray-500">{submission.subspecialty}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{submission.location}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                              {submission.employerType}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{submission.yearsOfExperience} years experience</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm font-bold text-indigo-600">{formatCurrency(submission.compensation)}</div>
                          </td>
                        </tr>
                        {expandedRow === submission.id && (
                          <tr className="bg-blue-100">
                            <td colSpan="5" className="px-6 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Satisfaction Score:</p>
                                  <p className="text-sm text-gray-900">
                                    {typeof submission.satisfactionLevel === 'number' 
                                      ? `${submission.satisfactionLevel.toFixed(1)}/5.0`
                                      : '0.0/5.0'
                                    }
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Bonus/Incentives:</p>
                                  <p className="text-sm text-gray-900">{formatCurrency(submission.bonusIncentives)}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Would Choose Again:</p>
                                  <p className="text-sm text-gray-900">
                                    {submission.wouldChooseAgain === true ? 'Yes' : 'No'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Hours Worked:</p>
                                  <p className="text-sm text-gray-900">{submission.workload}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Practice Type:</p>
                                  <p className="text-sm text-gray-900">{submission.employerType}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-right">
              <button 
                className="text-sm text-indigo-600 font-medium flex items-center ml-auto"
                onClick={handleViewAllSalaries}
              >
                View all {aggregatedStats.totalSubmissions.toLocaleString()} salaries
                <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              <span style={{ color: '#2B67CC' }}>Salary</span>
              <span style={{ color: '#E94F37' }}>Dr</span> Insights
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start min-w-0 flex-1 mr-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-base font-medium text-gray-700">Base</div>
                </div>
                <div className="flex items-center flex-shrink-0">
                  <div className="text-xl font-bold text-gray-900">${aggregatedStats.base.toLocaleString()}</div>
                </div>
              </div>

              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start min-w-0 flex-1 mr-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-base font-medium text-gray-700 leading-tight">Bonuses/RVU/<br/>Incentive</div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <div className="text-xl font-bold text-gray-900">${aggregatedStats.bonuses.toLocaleString()}</div>
                  <div className="text-sm text-gray-500 whitespace-nowrap">({aggregatedStats.bonusesPercentage}% received)</div>
                </div>
              </div>

              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start min-w-0 flex-1 mr-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-base font-medium text-gray-700 leading-tight">Total<br/>Compensation</div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <div className="text-xl font-bold text-gray-900">${aggregatedStats.averageSalary.toLocaleString()}</div>
                </div>
              </div>

              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start min-w-0 flex-1 mr-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="text-base font-medium text-gray-700">Workload</div>
                </div>
                <div className="flex items-center flex-shrink-0">
                  <div className="text-xl font-bold text-gray-900 whitespace-nowrap">~{aggregatedStats.workload} hrs/week</div>
                </div>
              </div>

              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start min-w-0 flex-1 mr-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="text-base font-medium text-gray-700 leading-tight">Would Choose<br/>Specialty Again</div>
                </div>
                <div className="flex items-center flex-shrink-0">
                  <div className="text-xl font-bold text-gray-900">{aggregatedStats.satisfactionPercentage}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    <div className="max-w-7xl mx-auto mt-12 bg-green-50 rounded-lg p-4 flex items-center gap-3">
      <div className="shrink-0">
        <svg className="h-6 w-6 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-lg text-green-800">Help other physicians make informed career decisions - <a href="#" onClick={handleReferClick} className="text-green-700 hover:text-green-800 underline">refer a colleague</a> to continue growing the community.</p>
      </div>
      <ReferModal />
    </div>

    <div className="max-w-7xl mx-auto mt-6">
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 rounded-lg shadow-lg p-8 text-white">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Know Your Worth. Stay Anonymous.</h2>
          <p className="mb-8 text-lg max-w-3xl mx-auto">Join thousands of physicians who have contributed salary data to help the community make informed career decisions.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/submit-salary'}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
            >
              Submit Your Salary
            </button>
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto mt-12">
      <div className="flex items-center justify-center gap-3 mb-8">
        <h2 className="text-3xl font-bold text-center">Salary Comparison Tool</h2>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          BETA
        </span>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Form */}
            <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Enter Your Details</h3>
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Compensation</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="$200,000"
                value={userInput.compensation}
                onChange={handleCompensationChange}
                />
              </div>
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter years of experience"
                value={userInput.yearsOfExperience}
                onChange={(e) => setUserInput({ ...userInput, yearsOfExperience: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Search specialty or subspecialty..."
                  value={specialtySearch}
                  onChange={handleSpecialtySearch}
                />
                {filteredSpecialties.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto">
                    {filteredSpecialties.map((specialty, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setUserInput({ ...userInput, specialty });
                          setSpecialtySearch(specialty);
                          setFilteredSpecialties([]);
                        }}
                      >
                        {specialty}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={userInput.location}
                onChange={(e) => setUserInput({ ...userInput, location: e.target.value })}
              >
                <option value="">All Regions</option>
                <option value="Northeast">Northeast</option>
                <option value="Midwest">Midwest</option>
                <option value="South">South</option>
                <option value="West">West</option>
                </select>
              </div>
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Practice Setting</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={userInput.practiceSetting}
                onChange={(e) => setUserInput({ ...userInput, practiceSetting: e.target.value })}
              >
                <option value="">All Practice Types</option>
                <option value="Hospital Employed">Hospital Employed</option>
                <option value="Academic">Academic</option>
                <option value="Private Practice">Private Practice</option>
                </select>
              </div>
            <button
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              onClick={analyzeUserSalary}
            >
              Analyze My Salary
              </button>
          </div>

          {/* Results Display */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Analysis</h3>
            {comparisonResult ? (
              comparisonResult.error ? (
                <div className="text-red-600">{comparisonResult.error}</div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Your Compensation:</span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(comparisonResult.userComp)}
                    </span>
              </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Market Average:</span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(comparisonResult.avgComp)}
                    </span>
              </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Percentile:</span>
                    <span className="text-xl font-bold text-gray-900">
                      {typeof comparisonResult.percentile === 'number' ? `${comparisonResult.percentile}th` : comparisonResult.percentile}
                    </span>
            </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Grade:</span>
                    <span className={`text-2xl font-bold ${comparisonResult.gradeColor}`}>
                      {comparisonResult.grade}
                    </span>
            </div>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{comparisonResult.feedback}</p>
          </div>
                  <div className="text-sm text-gray-500">
                    Based on {comparisonResult.comparisonText} {comparisonResult.stageComparisons >= 3 ? "physicians" : "total physicians"} in your specialty
                    {userInput.location && ` in ${userInput.location}`}
                    {userInput.practiceSetting && ` working in ${userInput.practiceSetting}`}
        </div>
                  <div className="mt-6 text-center">
                    <a
                      href="https://www.salarydr.com/submit-salary"
                      className="inline-block bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Help Others By Submitting Your Salary
                    </a>
      </div>
            </div>
              )
            ) : (
              <div className="text-gray-500">
                Enter your details and click "Analyze My Salary" to see how your compensation compares to market rates.
            </div>
            )}
            </div>
            </div>
          </div>
        </div>

    <div className="max-w-7xl mx-auto mt-12">
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
        <div className="bg-white shadow-md rounded-lg">
          <button
            className="w-full px-6 py-4 text-left focus:outline-none"
            onClick={() => toggleFAQ(0)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-indigo-900">Why is salary transparency so important for doctors?</h3>
              <svg
                className={`w-6 h-6 transform ${openFAQIndex === 0 ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          {openFAQIndex === 0 && (
            <div className="px-6 pb-4 text-left">
              <p className="text-gray-600">Salary transparency is crucial for physicians because it helps level the playing field in contract negotiations and ensures fair compensation across different practice settings. With the rising costs of medical education and increasing administrative burdens, doctors need reliable salary data to make informed career decisions and advocate for equitable compensation that reflects their expertise, training, and dedication to patient care.</p>
            </div>
          )}
            </div>

        <div className="bg-white shadow-md rounded-lg">
          <button
            className="w-full px-6 py-4 text-left focus:outline-none"
            onClick={() => toggleFAQ(1)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-indigo-900">How is this salary data collected?</h3>
              <svg
                className={`w-6 h-6 transform ${openFAQIndex === 1 ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            </button>
          {openFAQIndex === 1 && (
            <div className="px-6 pb-4 text-left">
              <p className="text-gray-600">Our salary data is collected through anonymous submissions from verified physicians across the United States. Each submission is reviewed for accuracy and completeness before being added to our database.</p>
          </div>
          )}
      </div>

        <div className="bg-white shadow-md rounded-lg">
          <button
            className="w-full px-6 py-4 text-left focus:outline-none"
            onClick={() => toggleFAQ(2)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-indigo-900">Is my salary information kept confidential?</h3>
              <svg
                className={`w-6 h-6 transform ${openFAQIndex === 2 ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
          </button>
          {openFAQIndex === 2 && (
            <div className="px-6 pb-4 text-left">
              <p className="text-gray-600">Yes, all salary submissions are completely anonymous. We never collect or store any personally identifiable information with salary submissions.</p>
            </div>
          )}
      </div>

        <div className="bg-white shadow-md rounded-lg">
          <button
            className="w-full px-6 py-4 text-left focus:outline-none"
            onClick={() => toggleFAQ(3)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-indigo-900">How often is the data updated?</h3>
              <svg
                className={`w-6 h-6 transform ${openFAQIndex === 3 ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
              </button>
          {openFAQIndex === 3 && (
            <div className="px-6 pb-4 text-left">
              <p className="text-gray-600">Our salary database is updated in real-time as new submissions are received and verified. The statistics and averages are recalculated daily.</p>
            </div>
          )}
          </div>

        <div className="bg-white shadow-md rounded-lg">
          <button
            className="w-full px-6 py-4 text-left focus:outline-none"
            onClick={() => toggleFAQ(4)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-indigo-900">How can I use this data in contract negotiations?</h3>
              <svg
                className={`w-6 h-6 transform ${openFAQIndex === 4 ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
        </div>
          </button>
          {openFAQIndex === 4 && (
            <div className="px-6 pb-4 text-left">
              <p className="text-gray-600">Our detailed salary breakdowns by specialty, location, and practice type can serve as valuable benchmarks during contract negotiations. Use the percentile data to understand your market value and negotiate fair compensation.</p>
            </div>
          )}
      </div>
      
        <div className="bg-white shadow-md rounded-lg">
                <button
            className="w-full px-6 py-4 text-left focus:outline-none"
            onClick={() => toggleFAQ(5)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-indigo-900">Want to get in touch?</h3>
              <svg
                className={`w-6 h-6 transform ${openFAQIndex === 5 ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
            </div>
                </button>
          {openFAQIndex === 5 && (
            <div className="px-6 pb-4 text-left">
              <p className="text-gray-600">You can reach us at <a href="mailto:thesalarydr@gmail.com" className="text-indigo-600 hover:text-indigo-800">thesalarydr@gmail.com</a></p>
                </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryDrDashboard;