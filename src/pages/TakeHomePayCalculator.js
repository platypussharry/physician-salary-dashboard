import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '../supabaseClient'; // Make sure this import exists
import { STATES } from '../constants';

const TakeHomePayCalculator = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    grossSalary: '',
    state: '',
    filingStatus: 'single',
    retirementContribution: '',
    healthInsurance: '',
    otherDeductions: '',
    additionalIncome: '',
    bonuses: '',
    overtime: ''
  });

  const [results, setResults] = useState(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    // Parse all numeric inputs, defaulting to 0 if empty or invalid
    const grossSalary = parseFloat(formData.grossSalary.replace(/[^0-9.]/g, '')) || 0;
    const state = formData.state;
    const filingStatus = formData.filingStatus;
    const retirementContribution = parseFloat(formData.retirementContribution.replace(/[^0-9.]/g, '')) || 0;
    const healthInsurance = parseFloat(formData.healthInsurance.replace(/[^0-9.]/g, '')) || 0;
    const otherDeductions = parseFloat(formData.otherDeductions.replace(/[^0-9.]/g, '')) || 0;
    const additionalIncome = parseFloat(formData.additionalIncome.replace(/[^0-9.]/g, '')) || 0;
    const bonuses = parseFloat(formData.bonuses.replace(/[^0-9.]/g, '')) || 0;
    const overtime = parseFloat(formData.overtime.replace(/[^0-9.]/g, '')) || 0;

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
    const socialSecurityTax = Math.min(taxableIncome, 168600) * 0.062; // 2024 Social Security wage base
    const medicareTax = taxableIncome * 0.0145;
    const additionalMedicareTax = taxableIncome > 200000 ? (taxableIncome - 200000) * 0.009 : 0;
    const ficaTax = socialSecurityTax + medicareTax + additionalMedicareTax;

    // Calculate total taxes
    const totalTaxes = federalTax + stateTax + ficaTax;

    // Calculate take-home pay
    const takeHomePay = totalIncome - preTaxDeductions - totalTaxes;

    // Calculate effective tax rate
    const effectiveTaxRate = totalIncome > 0 ? ((totalTaxes / totalIncome) * 100).toFixed(1) : 0;

    setResults({
      totalIncome: Math.round(totalIncome),
      preTaxDeductions: Math.round(preTaxDeductions),
      taxableIncome: Math.round(taxableIncome),
      federalTax: Math.round(federalTax),
      stateTax: Math.round(stateTax),
      ficaTax: Math.round(ficaTax),
      totalTaxes: Math.round(totalTaxes),
      takeHomePay: Math.round(takeHomePay),
      effectiveTaxRate,
      monthlyTakeHome: Math.round(takeHomePay / 12),
      biweeklyTakeHome: Math.round(takeHomePay / 26)
    });
  };

  const formatInputCurrency = (value) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/[^0-9.]/g, '');
    if (!numericValue) return '';
    
    // Parse the number and format with commas and dollar sign
    const number = parseFloat(numericValue);
    if (isNaN(number)) return '';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(number);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'state' || name === 'filingStatus') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      // For currency inputs, only format if there's a value
      const formattedValue = value ? formatInputCurrency(value) : '';
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleEmailSubscribe = async () => {
    // Validate email
    const error = validateEmail(email);
    setEmailError(error);
    if (error) return;

    setIsSubmitting(true);
    try {
      const { data, error: supabaseError } = await supabase
        .from('email_submissions')
        .insert([
          {
            email,
            source: 'calculator',
            is_active: true
          }
        ]);

      if (supabaseError) {
        if (supabaseError.code === '23505') { // Unique constraint error code
          setEmailError('This email is already subscribed');
        } else {
          setEmailError('Failed to subscribe. Please try again.');
        }
        return;
      }

      // Success
      setEmail('');
      setEmailError('');
      alert('Thanks for subscribing!');
    } catch (err) {
      console.error('Subscription error:', err);
      setEmailError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Helmet>
        <title>Physician Take-Home Pay Calculator | SalaryDr</title>
        <meta name="description" content="Calculate your physician take-home pay after taxes and deductions. Free calculator for doctors to estimate net income, tax burden, and monthly/bi-weekly pay." />
        <meta name="keywords" content="physician salary calculator, doctor take home pay, medical income calculator, physician tax calculator, doctor salary after taxes" />
        <link rel="canonical" href="https://www.salarydr.com/calculator" />
        
        {/* Open Graph tags for social sharing */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="SalaryDr" />
        <meta property="og:title" content="Physician Take-Home Pay Calculator | SalaryDr" />
        <meta property="og:description" content="Calculate your physician take-home pay after taxes and deductions. Free calculator for doctors to estimate net income, tax burden, and monthly/bi-weekly pay." />
        <meta property="og:url" content="https://www.salarydr.com/calculator" />
        <meta property="og:image" content="https://www.salarydr.com/images/calculator-preview.jpg" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@salarydr" />
        <meta name="twitter:title" content="Physician Take-Home Pay Calculator | SalaryDr" />
        <meta name="twitter:description" content="Calculate your physician take-home pay after taxes and deductions. Free calculator for doctors to estimate net income, tax burden, and monthly/bi-weekly pay." />
        <meta name="twitter:image" content="https://www.salarydr.com/images/calculator-preview.jpg" />
        
        {/* Additional SEO meta tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="SalaryDr" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* JSON-LD structured data for rich snippets */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Physician Take-Home Pay Calculator",
              "description": "Calculate your physician take-home pay after taxes and deductions. Free calculator for doctors to estimate net income, tax burden, and monthly/bi-weekly pay.",
              "url": "https://www.salarydr.com/calculator",
              "applicationCategory": "FinanceApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "provider": {
                "@type": "Organization",
                "name": "SalaryDr",
                "url": "https://www.salarydr.com",
                "sameAs": [
                  "https://twitter.com/salarydr",
                  "https://www.instagram.com/salarydr_/",
                  "https://www.tiktok.com/@salarydr"
                ]
              }
            }
          `}
        </script>
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

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <header>
            <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-900">
              Physician Take-Home Pay Calculator
            </h1>
            <div className="prose prose-lg mx-auto text-center mb-12">
              <p className="text-xl text-gray-600">
                Calculate your estimated take-home pay after taxes and deductions. Our calculator considers federal taxes, state taxes, FICA, retirement contributions, and other deductions to give you an accurate estimate of your net income.
              </p>
              <p className="text-lg text-gray-600 mt-4">
                Perfect for physicians planning their finances, negotiating contracts, or comparing job offers across different states.
              </p>
            </div>
          </header>

          <article className="bg-white rounded-2xl shadow-xl p-8">
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
                          <span className="font-semibold text-gray-900">{results.effectiveTaxRate}%</span>
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
                    {/* Empty state */}
                  </div>
                )}
              </div>
            </div>
          </article>

          {/* Post-Calculation CTAs - Now below the form */}
          {results && (
            <div className="mt-12">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Email Subscription */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Stay Updated on Salary Trends
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Get monthly insights on physician compensation trends and negotiation tips delivered to your inbox.
                  </p>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError('');
                        }}
                        placeholder="Enter your email"
                        className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          emailError ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <button 
                        onClick={handleEmailSubscribe}
                        disabled={isSubmitting}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
                          isSubmitting 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:bg-blue-700'
                        }`}
                      >
                        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                      </button>
                    </div>
                    {emailError && (
                      <p className="text-red-500 text-sm">{emailError}</p>
                    )}
                  </div>
                </div>

                {/* View Salary Data CTA */}
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Compare With Other Physicians
                  </h3>
                  <p className="text-gray-600 mb-4">
                    View real salary submissions from physicians in your specialty and location to benchmark your compensation.
                  </p>
                  <Link 
                    to="/dashboard" 
                    className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    View Salary Data
                  </Link>
                </div>
              </div>

              {/* Additional CTAs */}
              <div className="mt-8 grid md:grid-cols-3 gap-4">
                <Link 
                  to="/submit-salary"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span className="text-gray-700">Submit Your Salary</span>
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </Link>

                <button 
                  onClick={() => {/* Add save/print logic */}}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span className="text-gray-700">Save Results</span>
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 01-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                </button>

                <a 
                  href="https://x.com/salarydr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span className="text-gray-700">Follow Us</span>
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </a>
              </div>

              {/* Share Results */}
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">Share this calculator with your colleagues</p>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=Calculate your physician take-home pay after taxes and deductions&url=https://www.salarydr.com/calculator`, '_blank')}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https://www.salarydr.com/calculator`, '_blank')}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText('https://www.salarydr.com/calculator');
                      alert('Link copied to clipboard!');
                    }}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    aria-label="Copy link"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* New SEO content section */}
          <section className="mt-16 prose prose-lg mx-auto">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              Understanding Your Physician Take-Home Pay
            </h2>
            <p>
              As a physician, understanding your take-home pay is crucial for financial planning and career decisions. Your net income is affected by various factors including:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Federal income tax brackets and rates</li>
              <li>State tax variations across different locations</li>
              <li>FICA taxes (Social Security and Medicare)</li>
              <li>Pre-tax deductions like retirement contributions and health insurance</li>
              <li>Additional income sources such as bonuses and overtime</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              How to Use This Calculator
            </h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Enter your gross annual salary</li>
              <li>Select your state of residence</li>
              <li>Choose your tax filing status</li>
              <li>Input any pre-tax deductions and additional income</li>
              <li>Click "Calculate Take-Home Pay" to see your results</li>
            </ol>

            <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Why Accurate Income Calculation Matters
            </h3>
            <p>
              Having a clear understanding of your take-home pay helps you:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Make informed decisions when comparing job offers</li>
              <li>Plan your monthly budget effectively</li>
              <li>Optimize your tax strategy and deductions</li>
              <li>Evaluate opportunities in different states</li>
              <li>Negotiate compensation packages with confidence</li>
            </ul>
          </section>

          {/* FAQ Section for SEO */}
          <section className="mt-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  How accurate is the take-home pay calculator?
                </h3>
                <p className="text-gray-600">
                  Our calculator provides estimates based on current tax rates and standard deductions. While it's highly accurate for basic calculations, individual circumstances may vary. We recommend consulting with a tax professional for precise planning.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  What tax rates are used in the calculations?
                </h3>
                <p className="text-gray-600">
                  We use 2024 federal tax brackets, current state tax rates, and updated FICA tax rates including Social Security (6.2% up to $168,600) and Medicare (1.45% plus 0.9% additional Medicare tax for high earners).
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  How often is the calculator updated?
                </h3>
                <p className="text-gray-600">
                  We update our calculator annually to reflect the latest tax brackets, deduction limits, and state tax rates. The current version includes all 2024 tax year updates.
                </p>
              </div>
            </div>
          </section>
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

export default TakeHomePayCalculator; 