/**
 * Helper functions for tax calculations
 */

/**
 * Get income value from either direct input or legacy range selection
 * @param {string|number} incomeInput - Income input value
 * @returns {number} - Numeric income value
 */
export function getIncomeFromRange(incomeInput) {
  // If incomeInput is a number or a string that can be converted to a number, return it directly
  if (incomeInput && !isNaN(Number(incomeInput))) {
    return Number(incomeInput);
  }

  // Legacy support for dropdown ranges
  const incomeMap = {
    'under15000': 12000,
    '15000to25000': 20000,
    '25000to35000': 30000,
    '35000to50000': 42500,
    '50000to100000': 75000,
    '100000to150000': 125000,
    'over150000': 175000
  };

  return incomeMap[incomeInput] || 30000; // Default to £30,000 if not found
}

/**
 * Get monthly spend value from range selection
 * @param {string} spendRange - Spend range value
 * @returns {number} - Numeric monthly spend value
 */
export function getMonthlySpendFromRange(spendRange) {
  const spendMap = {
    'under10': 5,
    '10to30': 20,
    '30to50': 40,
    '50to100': 75,
    'over100': 125,
    'under50': 25,
    '50to100': 75,
    '100to150': 125,
    '150to200': 175,
    '200to300': 250,
    'over300': 350,
    'under100': 75,
    '100to200': 150,
    '200to300': 250,
    '300to500': 400,
    'over500': 600
  };

  return spendMap[spendRange] || 0;
}
