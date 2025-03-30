import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const SalarySubmissionForm = () => {
  const [step, setStep] = useState(1);
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

  const [specialtySearch, setSpecialtySearch] = useState('');
  const [subspecialtySearch, setSubspecialtySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);
  const [showSubspecialtyDropdown, setShowSubspecialtyDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  const [errors, setErrors] = useState({
    baseSalary: '',
    bonusIncentives: ''
  });

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
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
    if (baseSalaryNum > 10000000) {
      newErrors.baseSalary = 'Base salary cannot exceed $10,000,000';
    }

    // Validate bonus
    if (formData.bonusIncentives && bonusNum !== 0 && bonusNum < 10000) {
      newErrors.bonusIncentives = 'Bonus must be either $0 or greater than $9,999';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate fields before submitting
    if (!validateSalaryFields()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Parse the numbers before submitting
      const baseSalary = parseFloat(parseNumber(formData.baseSalary));
      const bonusIncentives = parseFloat(parseNumber(formData.bonusIncentives));
      const totalComp = formData.totalCompensation || (baseSalary + bonusIncentives);

      const { data, error } = await supabase
        .from('salary_submissions')
        .insert([{
          specialty: formData.specialty,
          subspecialty: formData.subspecialty,
          years_of_experience: parseInt(formData.yearsOfExperience),
          city: formData.location.city,
          state: formData.location.state,
          geographic_location: formData.location.region,
          practice_setting: formData.practiceType,
          total_compensation: totalComp,
          base_salary: baseSalary,
          bonus_incentives: bonusIncentives,
          hours_worked: parseInt(formData.hoursWorkedPerWeek),
          call_schedule: formData.callSchedule,
          satisfaction_level: parseInt(formData.satisfactionLevel),
          choosespecialty: formData.wouldChooseAgain === 'yes',
          email: formData.email,
          created_date: new Date().toISOString()
        }]);

      if (error) throw error;
      
      setSubmitStatus('success');
      // Reset form data
      setFormData({
        specialty: '',
        subspecialty: '',
        yearsOfExperience: 1,
        location: { city: '', state: '', region: '' },
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
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error submitting salary:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const specialtyOptions = [
    "Anesthesiology", "Cardiology", "Dermatology", "Emergency Medicine", 
    "Family Medicine", "Gastroenterology", "Internal Medicine", "Neurology", 
    "Obstetrics & Gynecology", "Oncology", "Ophthalmology", "Orthopedic Surgery",
    "Pathology", "Pediatrics", "Psychiatry", "Radiology", "Surgery", "Urology"
  ];

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

  // Filter specialties based on search
  const filteredSpecialties = specialtyOptions.filter(specialty =>
    specialty.toLowerCase().includes(specialtySearch.toLowerCase())
  );

  // Filter subspecialties based on selected specialty and search
  const filteredSubspecialties = formData.specialty
    ? (specialtyMapping[formData.specialty] || []).filter(subspecialty =>
        subspecialty.toLowerCase().includes(subspecialtySearch.toLowerCase())
      )
    : [];

  // Filter states based on search
  const filteredStates = stateOptions.filter(state =>
    state.toLowerCase().includes(stateSearch.toLowerCase())
  );

  // Handle specialty selection
  const handleSpecialtySelect = (specialty) => {
    setFormData({
      ...formData,
      specialty,
      subspecialty: '' // Reset subspecialty when specialty changes
    });
    setSpecialtySearch(specialty);
    setShowSpecialtyDropdown(false);
  };

  // Handle subspecialty selection
  const handleSubspecialtySelect = (subspecialty) => {
    setFormData({
      ...formData,
      subspecialty
    });
    setSubspecialtySearch(subspecialty);
    setShowSubspecialtyDropdown(false);
  };

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
        setShowSubspecialtyDropdown(false);
        setShowStateDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-center p-6 bg-white">
        <div className="text-3xl font-bold mb-4">
          <span className="text-blue-700">salary</span>
          <span className="text-red-500">Dr</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800">
          Join <span className="text-blue-700">2,318</span> doctors and unlock your free salary report today! 🚀
        </h1>
        <div className="w-full bg-gray-100 rounded-lg p-4 my-4 flex items-center justify-center">
          <p className="text-gray-700">Your data is anonymous and secure. 
            <a href="/privacy-policy" className="text-blue-600 ml-1 hover:underline">Privacy Policy</a>
          </p>
          <span className="ml-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-md">SECURE</span>
        </div>
        <p className="text-gray-600 mb-4">See your custom report after submitting!</p>
        
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
                onChange={(e) => {
                  setSpecialtySearch(e.target.value);
                  setShowSpecialtyDropdown(true);
                }}
                onClick={() => setShowSpecialtyDropdown(true)}
                placeholder="Search for specialty..."
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

            {formData.specialty && specialtyMapping[formData.specialty] && (
              <div className="dropdown-container relative">
                <label className="block text-lg font-medium text-blue-700 mb-2">
                  Subspecialty (Optional)
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={subspecialtySearch}
                  onChange={(e) => {
                    setSubspecialtySearch(e.target.value);
                    setShowSubspecialtyDropdown(true);
                  }}
                  onClick={() => setShowSubspecialtyDropdown(true)}
                  placeholder="Search for subspecialty..."
                />
                {showSubspecialtyDropdown && filteredSubspecialties.length > 0 && (
                  <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredSubspecialties.map((subspecialty) => (
                      <li
                        key={subspecialty}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                        onClick={() => handleSubspecialtySelect(subspecialty)}
                      >
                        {subspecialty}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

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
                  onChange={(e) => {
                    const formatted = formatNumber(e.target.value);
                    setFormData({...formData, bonusIncentives: formatted});
                    setErrors({...errors, bonusIncentives: ''});
                  }}
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.hoursWorkedPerWeek}
                onChange={(e) => setFormData({...formData, hoursWorkedPerWeek: e.target.value})}
                placeholder="Hours"
                required
              />
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
                placeholder="Enter email for your report"
              />
            </div>
            
            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit and Get Your Report!'}
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
              Enter your email to receive your free salary report (optional, unsubscribe anytime). 
              Want to delete your data later? Email <a href="mailto:thesalarydr@gmail.com" className="text-blue-600 hover:underline">thesalarydr@gmail.com</a>.
            </p>
          </div>
        )}
        
        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="p-4 bg-green-50 text-green-700 rounded-md mt-4">
            Thank you for your submission! Your data helps create transparency in physician compensation.
            Your personalized report is being generated and will be available shortly.
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md mt-4">
            There was an error submitting your data. Please try again.
          </div>
        )}
      </form>
    </div>
  );
};

export default SalarySubmissionForm; 