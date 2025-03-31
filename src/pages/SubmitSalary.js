import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import ReactGA from 'react-ga4';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';

const SalarySubmissionForm = () => {
  const [step, setStep] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    specialty: '',
    subspecialty: '',
    yearsOfExperience: 1,
    location: {
      city: '',
      state: '',
      region: ''
    },
    practiceType: '',
    totalCompensation: '',
    baseSalary: '',
    bonusIncentives: '',
    hoursWorkedPerWeek: '',
    callSchedule: '',
    satisfactionLevel: 3,
    wouldChooseAgain: '',
    email: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [specialtyOptions, setSpecialtyOptions] = useState([]);
  const [specialtySearch, setSpecialtySearch] = useState('');
  const [filteredSpecialties, setFilteredSpecialties] = useState([]);

  const [stateSearch, setStateSearch] = useState('');
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  const [errors, setErrors] = useState({
    baseSalary: '',
    bonusIncentives: '',
    hoursWorkedPerWeek: ''
  });

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

  // Track form start when component mounts
  useEffect(() => {
    ReactGA.event('form_start', {
      form_name: 'salary_submission',
      step: 1
    });
  }, []);

  const handleNext = (e) => {
    e.preventDefault();
    
    // If we're on step 2 (compensation details), validate before proceeding
    if (step === 2) {
      if (!validateSalaryFields()) {
        return; // Don't proceed if validation fails
      }
    }

    // If we're on step 3 (workload details), validate before proceeding
    if (step === 3) {
      if (!validateWorkloadFields()) {
        return; // Don't proceed if validation fails
      }
    }
    
    // Track successful step completion
    ReactGA.event('step_complete', {
      form_name: 'salary_submission',
      step_number: step
    });
    
    setStep(step + 1);
  };

  const handleBack = (e) => {
    e.preventDefault();
    // Track when users go back
    ReactGA.event('step_back', {
      form_name: 'salary_submission',
      from_step: step
    });
    setStep(step - 1);
  };

  const practiceOptions = [
    "Private Practice",
    "Academic",
    "Hospital Employed"
  ];

  // Add formatNumber helper function
  const formatNumber = (value) => {
    // Remove all non-digits
    const number = value.replace(/[^\d]/g, '');
    // Add commas for thousands
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Add parseNumber helper function
  const parseNumber = (value) => {
    // Remove all non-digits
    return value.replace(/[^\d]/g, '');
  };

  // Add validateSalaryFields function before handleSubmit
  const validateSalaryFields = () => {
    const newErrors = {};
    const baseSalaryNum = parseFloat(parseNumber(formData.baseSalary));
    const bonusNum = parseFloat(parseNumber(formData.bonusIncentives));

    // Validate base salary
    if (baseSalaryNum > 9999999) {
      newErrors.baseSalary = 'Base salary cannot exceed $9,999,999';
    }

    // Validate bonus
    if (formData.bonusIncentives && bonusNum !== 0 && bonusNum < 10000) {
      newErrors.bonusIncentives = 'Bonus must be either $0 or greater than $9,999';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add handleBonusChange function
  const handleBonusChange = (e) => {
    const formatted = formatNumber(e.target.value);
    setFormData({...formData, bonusIncentives: formatted});
    
    // Validate immediately when the bonus changes
    const bonusNum = parseFloat(parseNumber(formatted));
    if (formatted && bonusNum !== 0 && bonusNum < 10000) {
      setErrors({...errors, bonusIncentives: 'Bonus must be either $0 or greater than $9,999'});
    } else {
      setErrors({...errors, bonusIncentives: ''});
    }
  };

  // Add validateWorkloadFields function
  const validateWorkloadFields = () => {
    const newErrors = { ...errors };
    const hoursWorked = parseInt(formData.hoursWorkedPerWeek);

    if (hoursWorked < 12 || hoursWorked > 120) {
      newErrors.hoursWorkedPerWeek = 'Hours worked must be between 12 and 120 per week';
    } else {
      newErrors.hoursWorkedPerWeek = '';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).every(key => !newErrors[key]);
  };

  // Add handleHoursChange function
  const handleHoursChange = (e) => {
    const hours = parseInt(e.target.value);
    setFormData({ ...formData, hoursWorkedPerWeek: e.target.value });
    
    if (hours < 12 || hours > 120) {
      setErrors({ ...errors, hoursWorkedPerWeek: 'Hours worked must be between 12 and 120 per week' });
    } else {
      setErrors({ ...errors, hoursWorkedPerWeek: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Track submission attempt
    ReactGA.event('submit_attempt', {
      form_name: 'salary_submission'
    });

    try {
      // Calculate total compensation
      const baseNum = parseFloat(parseNumber(formData.baseSalary)) || 0;
      const bonusNum = parseFloat(parseNumber(formData.bonusIncentives)) || 0;
      const totalComp = baseNum + bonusNum;

      const { data, error } = await supabase
        .from('salary_submissions')
        .insert([
          {
            specialty: formData.specialty,
            subspecialty: formData.subspecialty || null,
            years_of_experience: formData.yearsOfExperience,
            city: formData.location.city,
            state: formData.location.state,
            region: formData.location.region,
            practice_type: formData.practiceType,
            total_compensation: totalComp,
            base_salary: baseNum,
            bonus_incentives: bonusNum,
            hours_worked_per_week: parseInt(formData.hoursWorkedPerWeek),
            call_schedule: formData.callSchedule,
            satisfaction_level: formData.satisfactionLevel,
            would_choose_again: formData.wouldChooseAgain === 'yes',
            email: formData.email || null
          }
        ]);

      if (error) {
        console.error('Error:', error);
        setSubmitStatus('error');
        // Track submission error
        ReactGA.event('submit_error', {
          form_name: 'salary_submission',
          error_type: error.message
        });
      } else {
        setSubmitStatus('success');
        // Track successful submission
        ReactGA.event('submit_success', {
          form_name: 'salary_submission',
          specialty: formData.specialty
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
      // Track submission error
      ReactGA.event('submit_error', {
        form_name: 'salary_submission',
        error_type: 'exception'
      });
    }

    setIsSubmitting(false);
  };

  const regionOptions = [
    "Northeast", "Southeast", "Midwest", "Southwest", "West", "Northwest"
  ];

  const stateOptions = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", 
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", 
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", 
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", 
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
    "New Hampshire", "New Jersey", "New Mexico", "New York", 
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", 
    "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", 
    "West Virginia", "Wisconsin", "Wyoming"
  ];

  // Updated specialty options with subspecialties
  const specialtyMapping = {
    "Anesthesiology": [
      "Cardiac", "Critical Care", "Pain Management", "Pediatric", "Regional"
    ],
    "Cardiology": [
      "Electrophysiology", "Heart Failure", "Interventional", "Non-invasive"
    ],
    "Surgery": [
      "Bariatric", "Cardiac", "Colorectal", "General", "Neurosurgery", "Orthopedic", 
      "Pediatric", "Plastic", "Thoracic", "Transplant", "Trauma", "Vascular"
    ],
    "Internal Medicine": [
      "Allergy & Immunology", "Endocrinology", "Gastroenterology", "Geriatrics",
      "Hematology/Oncology", "Infectious Disease", "Nephrology", "Pulmonology",
      "Rheumatology"
    ],
    "Pediatrics": [
      "Adolescent Medicine", "Cardiology", "Critical Care", "Emergency Medicine",
      "Endocrinology", "Gastroenterology", "Hematology/Oncology", "Neonatology",
      "Neurology", "Pulmonology"
    ],
    // Add more specialties and their subspecialties as needed
  };

  // Add fetchSpecialties function
  const fetchSpecialties = async () => {
    try {
      const { data: specialtyData, error: specialtyError } = await supabase
        .from('salary_submissions')
        .select('specialty, subspecialty')
        .limit(10000);

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

      // Convert Set to Array and sort
      const sortedSpecialties = Array.from(specialtySet).sort();
      setSpecialtyOptions(sortedSpecialties);
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  // Add useEffect to fetch specialties on component mount
  useEffect(() => {
    fetchSpecialties();
  }, []);

  // Update handleSpecialtySearch function
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

  // Update handleSpecialtySelect function
  const handleSpecialtySelect = (specialtyString) => {
    const [specialty, subspecialty] = specialtyString.split(' - ');
    setFormData({
      ...formData,
      specialty,
      subspecialty: subspecialty || ''
    });
    setSpecialtySearch(specialtyString);
    setShowSpecialtyDropdown(false);
  };

  // Filter states based on search
  const filteredStates = stateOptions.filter(state =>
    state.toLowerCase().includes(stateSearch.toLowerCase())
  );

  // Handle state selection
  const handleStateSelect = (state) => {
    setFormData({
      ...formData,
      location: { ...formData.location, state }
    });
    setStateSearch(state);
    setShowStateDropdown(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowSpecialtyDropdown(false);
        setShowStateDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-[2rem] tracking-normal font-['Outfit']">
                <span className="text-[#4169E1] font-[400]">salary</span>
                <span className="text-[#E94E4A] font-[500]">Dr</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/dashboard" className="text-lg lg:text-xl font-semibold text-[#2D3748] hover:text-blue-600 transition-colors">
                Salary Data
              </Link>
              <Link to="/calculator" className="text-lg lg:text-xl font-semibold text-[#2D3748] hover:text-blue-600 transition-colors">
                Take Home Pay Calculator
              </Link>
            </div>
            <div className="md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
              Salary Data
            </Link>
            <Link to="/calculator" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
              Take Home Pay Calculator
            </Link>
          </div>
        </div>
      </nav>

      {/* Rest of the form content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="flex flex-col items-center p-6 bg-white">
            <div className="text-3xl font-bold mb-4">
              <span className="text-blue-700">salary</span>
              <span className="text-red-500">Dr</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800">
              Join <span className="text-blue-700">2,318</span> doctors and help improve salary transparency! 🚀
            </h1>
            <div className="w-full bg-gray-100 rounded-lg p-4 my-4 flex items-center justify-center">
              <p className="text-gray-700">Your data is anonymous and secure. 
                <a href="/privacy-policy" className="text-blue-600 ml-1 hover:underline">Privacy Policy</a>
              </p>
              <span className="ml-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-md">SECURE</span>
            </div>
            <p className="text-gray-600 mb-4">Your contribution helps fellow physicians make informed career decisions</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full mb-1">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
            <p className="self-end text-gray-600 mb-4">Step {step} of 3</p>
          </div>

          <form onSubmit={step === 3 ? handleSubmit : handleNext} className="p-6 pt-0">
            {step === 1 && (
              <div className="space-y-6">
                <div className="dropdown-container relative">
                  <label className="block text-lg font-medium text-blue-700 mb-2">
                    Specialty Type (Required)
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={specialtySearch}
                    onChange={handleSpecialtySearch}
                    onClick={() => setShowSpecialtyDropdown(true)}
                    placeholder="Search for specialty or subspecialty..."
                    required
                  />
                  {showSpecialtyDropdown && filteredSpecialties.length > 0 && (
                    <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredSpecialties.map((specialty) => (
                        <li
                          key={specialty}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                          onClick={() => handleSpecialtySelect(specialty)}
                        >
                          {specialty}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <label className="block text-lg font-medium text-blue-700 mb-2">
                    Years of Experience (Required)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="1"
                      max="40"
                      className="w-full"
                      value={formData.yearsOfExperience}
                      onChange={(e) => setFormData({...formData, yearsOfExperience: e.target.value})}
                    />
                    <p className="text-gray-600">{formData.yearsOfExperience} {formData.yearsOfExperience === '1' ? 'year' : 'years'}</p>
                  </div>
                </div>
                
                <div className="dropdown-container relative">
                  <label className="block text-lg font-medium text-blue-700 mb-2">
                    State (Required)
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={stateSearch}
                    onChange={(e) => {
                      setStateSearch(e.target.value);
                      setShowStateDropdown(true);
                    }}
                    onClick={() => setShowStateDropdown(true)}
                    placeholder="Search for state..."
                    required
                  />
                  {showStateDropdown && filteredStates.length > 0 && (
                    <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredStates.map((state) => (
                        <li
                          key={state}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                          onClick={() => handleStateSelect(state)}
                        >
                          {state}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <div>
                  <label className="block text-lg font-medium text-blue-700 mb-2">
                    City (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.location.city}
                    onChange={(e) => setFormData({
                      ...formData, 
                      location: {...formData.location, city: e.target.value}
                    })}
                    placeholder="Enter your city"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                >
                  Next: Compensation Details →
                </button>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-medium text-blue-700 mb-2">
                    Practice Setting (Required)
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.practiceType}
                    onChange={(e) => setFormData({...formData, practiceType: e.target.value})}
                    required
                  >
                    <option value="">Select Practice Setting</option>
                    {practiceOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-lg font-medium text-blue-700 mb-2">
                    Base Salary (Annual) (Required)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="text"
                      className={`w-full p-3 pl-6 border ${errors.baseSalary ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      value={formData.baseSalary}
                      onChange={(e) => {
                        const formatted = formatNumber(e.target.value);
                        setFormData({...formData, baseSalary: formatted});
                        setErrors({...errors, baseSalary: ''});
                      }}
                      placeholder="Enter base salary"
                      required
                    />
                  </div>
                  {errors.baseSalary && (
                    <p className="mt-1 text-red-500 text-sm">{errors.baseSalary}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-lg font-medium text-blue-700 mb-2">
                    Bonus/Incentives/RVUs (Annual) (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="text"
                      className={`w-full p-3 pl-6 border ${errors.bonusIncentives ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      value={formData.bonusIncentives}
                      onChange={handleBonusChange}
                      placeholder="Enter bonus/incentives"
                    />
                  </div>
                  {errors.bonusIncentives && (
                    <p className="mt-1 text-red-500 text-sm">{errors.bonusIncentives}</p>
                  )}
                </div>
                
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full md:w-1/2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="w-full md:w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    Next: Workload & Contact →
                  </button>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-medium text-blue-700 mb-2">
                    Average Hours Worked Per Week (Required)
                  </label>
                  <input
                    type="number"
                    className={`w-full p-3 border ${errors.hoursWorkedPerWeek ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={formData.hoursWorkedPerWeek}
                    onChange={handleHoursChange}
                    placeholder="Hours"
                    min="12"
                    max="120"
                    required
                  />
                  {errors.hoursWorkedPerWeek && (
                    <p className="mt-1 text-red-500 text-sm">{errors.hoursWorkedPerWeek}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-lg font-medium text-blue-700 mb-2">
                    Job Satisfaction Level (Required)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    className="w-full mt-2"
                    value={formData.satisfactionLevel}
                    onChange={(e) => setFormData({...formData, satisfactionLevel: e.target.value})}
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <div className="text-center">
                      <div>1</div>
                      <div>Low</div>
                    </div>
                    <div className="text-center">2</div>
                    <div className="text-center">
                      <div>3</div>
                      <div>Average</div>
                    </div>
                    <div className="text-center">4</div>
                    <div className="text-center">
                      <div>5</div>
                      <div>High</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-lg font-medium text-blue-700 mb-2">
                    Would you choose this specialty again? (Required)
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.wouldChooseAgain}
                    onChange={(e) => setFormData({...formData, wouldChooseAgain: e.target.value})}
                    required
                  >
                    <option value="">Select an option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-lg font-medium text-blue-700 mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter your email"
                  />
                </div>
                
                <div className="flex flex-col space-y-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                  >
                    ← Back
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 text-center mt-4">
                  Want to delete your data later? Email <a href="mailto:thesalarydr@gmail.com" className="text-blue-600 hover:underline">thesalarydr@gmail.com</a>.
                </p>
              </div>
            )}
            
            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="p-4 bg-green-50 text-green-700 rounded-md mt-4">
                Thank you for your submission! Your data helps create transparency in physician compensation.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="p-4 bg-red-50 text-red-700 rounded-md mt-4">
                There was an error submitting your data. Please try again.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SalarySubmissionForm; 