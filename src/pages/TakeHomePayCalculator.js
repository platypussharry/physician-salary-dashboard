import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';

const TakeHomePayCalculator = () => {
  const [formData, setFormData] = useState({
    grossSalary: '',
    state: '',
    filingStatus: 'single',
    retirementContribution: '0',
    healthInsurance: '0',
    otherDeductions: '0',
    additionalIncome: '0',
    bonuses: '0',
    overtime: '0'
  });

  const [results, setResults] = useState(null);

  const stateTaxRates = {
    'California': { rate: 0.093, name: 'California' },
    'New York': { rate: 0.0882, name: 'New York' },
    'Texas': { rate: 0, name: 'Texas' },
    'Florida': { rate: 0, name: 'Florida' },
    'Illinois': { rate: 0.0495, name: 'Illinois' },
    'Pennsylvania': { rate: 0.0307, name: 'Pennsylvania' },
    'Ohio': { rate: 0.025, name: 'Ohio' },
    'Georgia': { rate: 0.055, name: 'Georgia' },
    'North Carolina': { rate: 0.0525, name: 'North Carolina' },
    'Michigan': { rate: 0.0425, name: 'Michigan' },
    'New Jersey': { rate: 0.0627, name: 'New Jersey' },
    'Virginia': { rate: 0.0575, name: 'Virginia' },
    'Washington': { rate: 0, name: 'Washington' },
    'Arizona': { rate: 0.025, name: 'Arizona' },
    'Massachusetts': { rate: 0.05, name: 'Massachusetts' },
    'Tennessee': { rate: 0, name: 'Tennessee' },
    'Indiana': { rate: 0.0323, name: 'Indiana' },
    'Missouri': { rate: 0.054, name: 'Missouri' },
    'Maryland': { rate: 0.0575, name: 'Maryland' },
    'Wisconsin': { rate: 0.0765, name: 'Wisconsin' },
    'Colorado': { rate: 0.044, name: 'Colorado' },
    'Minnesota': { rate: 0.0985, name: 'Minnesota' },
    'South Carolina': { rate: 0.07, name: 'South Carolina' },
    'Alabama': { rate: 0.05, name: 'Alabama' },
    'Louisiana': { rate: 0.06, name: 'Louisiana' },
    'Kentucky': { rate: 0.05, name: 'Kentucky' },
    'Oregon': { rate: 0.099, name: 'Oregon' },
    'Oklahoma': { rate: 0.05, name: 'Oklahoma' },
    'Connecticut': { rate: 0.0699, name: 'Connecticut' },
    'Utah': { rate: 0.0495, name: 'Utah' },
    'Iowa': { rate: 0.0898, name: 'Iowa' },
    'Nevada': { rate: 0, name: 'Nevada' },
    'Arkansas': { rate: 0.055, name: 'Arkansas' },
    'Mississippi': { rate: 0.05, name: 'Mississippi' },
    'Kansas': { rate: 0.057, name: 'Kansas' },
    'New Mexico': { rate: 0.049, name: 'New Mexico' },
    'Nebraska': { rate: 0.0684, name: 'Nebraska' },
    'West Virginia': { rate: 0.065, name: 'West Virginia' },
    'Idaho': { rate: 0.06, name: 'Idaho' },
    'Hawaii': { rate: 0.11, name: 'Hawaii' },
    'New Hampshire': { rate: 0, name: 'New Hampshire' },
    'Maine': { rate: 0.075, name: 'Maine' },
    'Montana': { rate: 0.069, name: 'Montana' },
    'Rhode Island': { rate: 0.0599, name: 'Rhode Island' },
    'Delaware': { rate: 0.066, name: 'Delaware' },
    'South Dakota': { rate: 0, name: 'South Dakota' },
    'North Dakota': { rate: 0.029, name: 'North Dakota' },
    'Alaska': { rate: 0, name: 'Alaska' },
    'Vermont': { rate: 0.0875, name: 'Vermont' },
    'Wyoming': { rate: 0, name: 'Wyoming' }
  };

  // Sort states alphabetically
  const sortedStates = Object.keys(stateTaxRates).sort();

  const calculateTaxes = (income, filingStatus) => {
    // 2024 Federal Tax Brackets
    const brackets = {
      single: [
        { rate: 0.10, threshold: 0 },
        { rate: 0.12, threshold: 11600 },
        { rate: 0.22, threshold: 47150 },
        { rate: 0.24, threshold: 100525 },
        { rate: 0.32, threshold: 191950 },
        { rate: 0.35, threshold: 243725 },
        { rate: 0.37, threshold: 609350 }
      ],
      married: [
        { rate: 0.10, threshold: 0 },
        { rate: 0.12, threshold: 23200 },
        { rate: 0.22, threshold: 94300 },
        { rate: 0.24, threshold: 201050 },
        { rate: 0.32, threshold: 383900 },
        { rate: 0.35, threshold: 487450 },
        { rate: 0.37, threshold: 731200 }
      ]
    };

    let tax = 0;
    const applicableBrackets = brackets[filingStatus];

    for (let i = 0; i < applicableBrackets.length; i++) {
      const bracket = applicableBrackets[i];
      const nextBracket = applicableBrackets[i + 1];
      
      if (income > bracket.threshold) {
        const taxableInThisBracket = nextBracket 
          ? Math.min(income - bracket.threshold, nextBracket.threshold - bracket.threshold)
          : income - bracket.threshold;
        tax += taxableInThisBracket * bracket.rate;
      }
    }

    return tax;
  };

  const calculateTakeHomePay = () => {
    const grossSalary = parseFloat(formData.grossSalary) || 0;
    const state = formData.state;
    const filingStatus = formData.filingStatus;
    const retirementContribution = parseFloat(formData.retirementContribution) || 0;
    const healthInsurance = parseFloat(formData.healthInsurance) || 0;
    const otherDeductions = parseFloat(formData.otherDeductions) || 0;
    const additionalIncome = parseFloat(formData.additionalIncome) || 0;
    const bonuses = parseFloat(formData.bonuses) || 0;
    const overtime = parseFloat(formData.overtime) || 0;

    // Calculate total income
    const totalIncome = grossSalary + additionalIncome + bonuses + overtime;

    // Calculate pre-tax deductions
    const preTaxDeductions = retirementContribution + healthInsurance + otherDeductions;

    // Calculate taxable income
    const taxableIncome = totalIncome - preTaxDeductions;

    // Calculate federal tax
    const federalTax = calculateTaxes(taxableIncome, filingStatus);

    // Calculate state tax
    const stateTaxRate = stateTaxRates[state]?.rate || 0;
    const stateTax = taxableIncome * stateTaxRate;

    // Calculate FICA (Social Security and Medicare)
    const socialSecurityTax = Math.min(taxableIncome, 168600) * 0.062;
    const medicareTax = taxableIncome * 0.0145;
    const additionalMedicareTax = taxableIncome > 200000 ? (taxableIncome - 200000) * 0.009 : 0;
    const ficaTax = socialSecurityTax + medicareTax + additionalMedicareTax;

    // Calculate total taxes
    const totalTaxes = federalTax + stateTax + ficaTax;

    // Calculate take-home pay
    const takeHomePay = totalIncome - preTaxDeductions - totalTaxes;

    // Calculate effective tax rate
    const effectiveTaxRate = (totalTaxes / totalIncome) * 100;

    setResults({
      totalIncome,
      preTaxDeductions,
      taxableIncome,
      federalTax,
      stateTax,
      ficaTax,
      totalTaxes,
      takeHomePay,
      effectiveTaxRate,
      monthlyTakeHome: takeHomePay / 12,
      biweeklyTakeHome: takeHomePay / 26
    });
  };

  const formatInputCurrency = (value) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/[^0-9.]/g, '');
    if (!numericValue) return '';
    
    // Format with commas and dollar sign
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(numericValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'state' || name === 'filingStatus') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: formatInputCurrency(value)
      }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="w-full p-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link 
            to="/" 
            className="text-[3.5rem] tracking-normal font-['Outfit']"
          >
            <span className="text-[#4169E1] font-[400]">salary</span>
            <span className="text-[#E94E4A] font-[500]">Dr</span>
          </Link>
          <div className="flex gap-8 items-center">
            <Link to="/dashboard" className="text-xl font-semibold text-[#2D3748]">
              Salary Data
            </Link>
            <Link to="/calculator" className="text-xl font-semibold text-[#2D3748]">
              Take Home Pay Calculator
            </Link>
            <Link to="/faqs" className="text-xl font-semibold text-[#2D3748]">
              FAQs
            </Link>
            <Link
              to="/submit-salary"
              className="text-xl font-semibold px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
            >
              Add a Salary
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-900">
            Physician Take-Home Pay Calculator
          </h1>
          <p className="text-xl text-gray-600 text-center mb-12">
            Calculate your estimated take-home pay after taxes and deductions
          </p>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Input Form */}
              <div className="space-y-6">
                {!results && (
                  <div className="bg-blue-50 rounded-lg p-4 text-gray-600 mb-6">
                    Enter your information and click "Calculate Take-Home Pay" to see your results
                  </div>
                )}

                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Gross Annual Salary
                    </label>
                    <div className="group relative inline-block">
                      <svg className="w-4 h-4 text-gray-500 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-sm rounded-lg p-2 left-6 top-0 w-64 z-10">
                        Your total annual salary before any deductions or taxes. Example: $250,000
                      </div>
                    </div>
                  </div>
                  <input
                    type="text"
                    name="grossSalary"
                    value={formData.grossSalary}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="$200,000"
                  />
                </div>

                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <div className="group relative inline-block">
                      <svg className="w-4 h-4 text-gray-500 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-sm rounded-lg p-2 left-6 top-0 w-64 z-10">
                        Select your state of residence for state tax calculations
                      </div>
                    </div>
                  </div>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a state</option>
                    {sortedStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Filing Status
                    </label>
                    <div className="group relative inline-block">
                      <svg className="w-4 h-4 text-gray-500 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-sm rounded-lg p-2 left-6 top-0 w-64 z-10">
                        Your tax filing status affects your tax brackets and deductions
                      </div>
                    </div>
                  </div>
                  <select
                    name="filingStatus"
                    value={formData.filingStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="single">Single</option>
                    <option value="married">Married Filing Jointly</option>
                  </select>
                </div>

                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Retirement Contributions
                    </label>
                    <div className="group relative inline-block">
                      <svg className="w-4 h-4 text-gray-500 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-sm rounded-lg p-2 left-6 top-0 w-64 z-10">
                        Annual contributions to 401(k), 403(b), or other retirement accounts. Example: $22,500
                      </div>
                    </div>
                  </div>
                  <input
                    type="text"
                    name="retirementContribution"
                    value={formData.retirementContribution}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="$0"
                  />
                </div>

                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Health Insurance Premiums
                    </label>
                    <div className="group relative inline-block">
                      <svg className="w-4 h-4 text-gray-500 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-sm rounded-lg p-2 left-6 top-0 w-64 z-10">
                        Annual cost of health insurance premiums. Example: $6,000
                      </div>
                    </div>
                  </div>
                  <input
                    type="text"
                    name="healthInsurance"
                    value={formData.healthInsurance}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="$0"
                  />
                </div>

                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Other Pre-tax Deductions
                    </label>
                    <div className="group relative inline-block">
                      <svg className="w-4 h-4 text-gray-500 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-sm rounded-lg p-2 left-6 top-0 w-64 z-10">
                        Other pre-tax deductions like HSA, FSA, or disability insurance. Example: $3,000
                      </div>
                    </div>
                  </div>
                  <input
                    type="text"
                    name="otherDeductions"
                    value={formData.otherDeductions}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="$0"
                  />
                </div>

                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Additional Income
                    </label>
                    <div className="group relative inline-block">
                      <svg className="w-4 h-4 text-gray-500 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-sm rounded-lg p-2 left-6 top-0 w-64 z-10">
                        Income from side gigs, consulting, or other sources. Example: $20,000
                      </div>
                    </div>
                  </div>
                  <input
                    type="text"
                    name="additionalIncome"
                    value={formData.additionalIncome}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="$0"
                  />
                </div>

                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Annual Bonuses
                    </label>
                    <div className="group relative inline-block">
                      <svg className="w-4 h-4 text-gray-500 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-sm rounded-lg p-2 left-6 top-0 w-64 z-10">
                        Expected annual bonus payments. Example: $30,000
                      </div>
                    </div>
                  </div>
                  <input
                    type="text"
                    name="bonuses"
                    value={formData.bonuses}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="$0"
                  />
                </div>

                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Overtime Pay
                    </label>
                    <div className="group relative inline-block">
                      <svg className="w-4 h-4 text-gray-500 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-sm rounded-lg p-2 left-6 top-0 w-64 z-10">
                        Expected annual overtime pay. Example: $15,000
                      </div>
                    </div>
                  </div>
                  <input
                    type="text"
                    name="overtime"
                    value={formData.overtime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="$0"
                  />
                </div>

                <button
                  onClick={calculateTakeHomePay}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
                >
                  Calculate Take-Home Pay
                </button>
              </div>

              {/* Results Display */}
              <div className="space-y-6">
                {results ? (
                  <div className="space-y-6">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-blue-900 mb-4">Your Take-Home Pay</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Annual Take-Home:</span>
                          <span className="text-2xl font-bold text-blue-900">{formatCurrency(results.takeHomePay)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Monthly Take-Home:</span>
                          <span className="text-xl font-semibold text-blue-900">{formatCurrency(results.monthlyTakeHome)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Bi-Weekly Take-Home:</span>
                          <span className="text-xl font-semibold text-blue-900">{formatCurrency(results.biweeklyTakeHome)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Tax Breakdown</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Federal Tax:</span>
                          <span className="font-semibold text-gray-900">{formatCurrency(results.federalTax)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">State Tax:</span>
                          <span className="font-semibold text-gray-900">{formatCurrency(results.stateTax)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">FICA Tax:</span>
                          <span className="font-semibold text-gray-900">{formatCurrency(results.ficaTax)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Taxes:</span>
                          <span className="font-semibold text-gray-900">{formatCurrency(results.totalTaxes)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Effective Tax Rate:</span>
                          <span className="font-semibold text-gray-900">{results.effectiveTaxRate.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-green-900 mb-4">Income Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Income:</span>
                          <span className="font-semibold text-green-900">{formatCurrency(results.totalIncome)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Pre-tax Deductions:</span>
                          <span className="font-semibold text-green-900">{formatCurrency(results.preTaxDeductions)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Taxable Income:</span>
                          <span className="font-semibold text-green-900">{formatCurrency(results.taxableIncome)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    {/* Removed the grey text */}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>This calculator provides estimates only. Actual take-home pay may vary based on additional factors not included in this calculation.</p>
            <p className="mt-2">For more accurate results, consult with a tax professional.</p>
          </div>
        </div>
      </div>

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

export default TakeHomePayCalculator; 