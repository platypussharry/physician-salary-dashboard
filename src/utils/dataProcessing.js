import { calculateSalaryStats } from './salaryCalculations';

export const processSubmissionData = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return {
      aggregatedStats: {
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
      },
      salaryDistribution: [],
      comparisonData: [],
      recentSubmissions: []
    };
  }

  // Calculate aggregated statistics
  const aggregatedStats = calculateSalaryStats(data);

  // Calculate salary distribution
  const validSalaries = data
    .filter(item => item.totalCompensation && item.totalCompensation > 0)
    .map(item => item.totalCompensation)
    .sort((a, b) => a - b);

  const salaryDistribution = [];
  if (validSalaries.length > 0) {
    const p10 = validSalaries[Math.floor(validSalaries.length * 0.1)];
    const p25 = validSalaries[Math.floor(validSalaries.length * 0.25)];
    const p50 = validSalaries[Math.floor(validSalaries.length * 0.5)];
    const p75 = validSalaries[Math.floor(validSalaries.length * 0.75)];
    const p90 = validSalaries[Math.floor(validSalaries.length * 0.9)];

    salaryDistribution.push(
      { name: 'p10th', value: p10, label: '$' + Math.round(p10/1000) + 'K' },
      { name: 'p25th', value: p25, label: '$' + Math.round(p25/1000) + 'K' },
      { name: 'p50th', value: p50, label: '$' + Math.round(p50/1000) + 'K' },
      { name: 'p75th', value: p75, label: '$' + Math.round(p75/1000) + 'K' },
      { name: 'p90th', value: p90, label: '$' + Math.round(p90/1000) + 'K' }
    );
  }

  // Calculate comparison data by practice type
  const practiceTypes = ['Hospital Employed', 'Academic', 'Private Practice'];
  const comparisonData = practiceTypes.map(type => {
    const practiceData = data.filter(item => {
      const setting = (item.practiceType || '').toLowerCase();
      if (type === 'Hospital Employed') {
        return setting.includes('hospital') || setting.includes('employed');
      } else if (type === 'Academic') {
        return setting.includes('academic');
      } else if (type === 'Private Practice') {
        return setting.includes('private');
      }
      return false;
    });

    const validComps = practiceData
      .filter(item => item.totalCompensation && item.totalCompensation > 0)
      .map(item => item.totalCompensation);

    const avgComp = validComps.length > 0
      ? Math.round(validComps.reduce((sum, comp) => sum + comp, 0) / validComps.length)
      : 0;

    return {
      type,
      avgComp,
      submissions: practiceData.length
    };
  });

  // Process recent submissions
  const recentSubmissions = data
    .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
    .slice(0, 10)
    .map(item => ({
      id: item.id,
      specialty: item.specialty,
      subspecialty: item.subspecialty,
      location: item.location,
      employerType: item.practiceType,
      compensation: item.totalCompensation,
      bonusIncentives: item.bonusIncentives,
      wouldChooseAgain: item.wouldChooseAgain,
      satisfactionLevel: item.satisfactionLevel,
      yearsOfExperience: item.yearsOfExperience,
      workload: item.hoursWorkedPerWeek ? `${item.hoursWorkedPerWeek} hrs/week` : 'Not specified',
      submissionDate: item.submissionDate
    }));

  // Calculate satisfaction percentage from wouldChooseAgain
  const wouldChooseAgainCount = data.filter(item => item.wouldChooseAgain === true || item.wouldChooseAgain === 'yes').length;
  const satisfactionPercentage = Math.round((wouldChooseAgainCount / data.length) * 100);

  return {
    aggregatedStats: {
      ...aggregatedStats,
      satisfactionPercentage,
      updateDate: new Date().toLocaleDateString()
    },
    salaryDistribution,
    comparisonData,
    recentSubmissions
  };
}; 