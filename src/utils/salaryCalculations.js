export const calculateSalaryStats = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return {
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
      avgRVU: 0,
      avgRVUCount: 0
    };
  }

  const validSalaries = data.filter(item => 
    item.totalCompensation && 
    typeof item.totalCompensation === 'number' && 
    item.totalCompensation > 0
  );

  const totalSalary = validSalaries.reduce((sum, item) => sum + item.totalCompensation, 0);
  const averageSalary = validSalaries.length > 0 ? Math.round(totalSalary / validSalaries.length) : 0;

  const baseSalaries = data.filter(item => item.baseSalary && item.baseSalary > 0);
  const averageBase = baseSalaries.length > 0 
    ? Math.round(baseSalaries.reduce((sum, item) => sum + item.baseSalary, 0) / baseSalaries.length)
    : 0;

  const bonuses = data.filter(item => item.bonusIncentives && item.bonusIncentives > 0);
  const averageBonus = bonuses.length > 0
    ? Math.round(bonuses.reduce((sum, item) => sum + item.bonusIncentives, 0) / bonuses.length)
    : 0;

  const workloadData = data.filter(item => item.hoursWorkedPerWeek && item.hoursWorkedPerWeek > 0);
  const averageWorkload = workloadData.length > 0
    ? Math.round(workloadData.reduce((sum, item) => sum + item.hoursWorkedPerWeek, 0) / workloadData.length)
    : 0;

  const satisfactionData = data.filter(item => typeof item.satisfactionLevel === 'number' && item.satisfactionLevel >= 0);
  const averageSatisfaction = satisfactionData.length > 0
    ? Math.round(satisfactionData.reduce((sum, item) => sum + item.satisfactionLevel, 0) / satisfactionData.length)
    : 0;

  const rvuData = data.filter(item => item.actualRVU && item.actualRVU > 0);
  const averageRVU = rvuData.length > 0
    ? Math.round(rvuData.reduce((sum, item) => sum + item.actualRVU, 0) / rvuData.length)
    : 0;

  return {
    averageSalary,
    totalSubmissions: data.length,
    base: averageBase,
    bonuses: averageBonus,
    bonusesPercentage: Math.round((bonuses.length / data.length) * 100),
    otherIncome: 0, // Can be implemented if needed
    otherIncomePercentage: 0, // Can be implemented if needed
    workload: averageWorkload,
    satisfaction: averageSatisfaction,
    satisfactionPercentage: Math.round((satisfactionData.length / data.length) * 100),
    avgRVU: averageRVU,
    avgRVUCount: rvuData.length
  };
}; 