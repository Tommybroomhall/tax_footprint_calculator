import { TAX_RATES } from './constants.js';

/**
 * Calculate National Insurance contributions based on income and employment status
 * @param {number} income - Annual income in pounds
 * @param {string} employmentStatus - Employment status ('employed', 'selfEmployed', 'both', etc.)
 * @returns {number} - Annual National Insurance contribution in pounds
 */
export function calculateNationalInsurance(income, employmentStatus) {
  const rates = TAX_RATES.nationalInsurance;
  let ni = 0;

  if (employmentStatus === 'employed' || employmentStatus === 'both') {
    if (income > rates.employeeThreshold) {
      if (income <= rates.employeeUpperThreshold) {
        ni = (income - rates.employeeThreshold) * rates.employeeRate1;
      } else {
        ni = (rates.employeeUpperThreshold - rates.employeeThreshold) * rates.employeeRate1;
        ni += (income - rates.employeeUpperThreshold) * rates.employeeRate2;
      }
    }
  }

  if (employmentStatus === 'selfEmployed' || employmentStatus === 'both') {
    // Simplified calculation for self-employed
    let selfEmployedIncome = employmentStatus === 'both' ? income * 0.5 : income;

    if (selfEmployedIncome > rates.selfEmployedLowerThreshold) {
      if (selfEmployedIncome <= rates.selfEmployedUpperThreshold) {
        ni += (selfEmployedIncome - rates.selfEmployedLowerThreshold) * rates.selfEmployedRate1;
      } else {
        ni += (rates.selfEmployedUpperThreshold - rates.selfEmployedLowerThreshold) * rates.selfEmployedRate1;
        ni += (selfEmployedIncome - rates.selfEmployedUpperThreshold) * rates.selfEmployedRate2;
      }
    }
  }

  return ni;
}

/**
 * Get the National Insurance tax type (direct or indirect)
 * @returns {string} - Tax type ('direct' or 'indirect')
 */
export function getNationalInsuranceTaxType() {
  return TAX_RATES.nationalInsurance.type;
}
