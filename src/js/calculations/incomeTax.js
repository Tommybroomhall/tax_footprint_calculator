import { TAX_RATES } from './constants.js';

/**
 * Calculate income tax based on annual income
 * @param {number} income - Annual income in pounds
 * @returns {number} - Annual income tax in pounds
 */
export function calculateIncomeTax(income) {
  const rates = TAX_RATES.incomeTax;
  let tax = 0;

  // No tax on income up to personal allowance
  if (income <= rates.personalAllowance) {
    return 0;
  }

  // Calculate taxable income (income minus personal allowance)
  const taxableIncome = income - rates.personalAllowance;

  // Basic rate band: from personal allowance up to basic rate threshold
  // The basic rate applies to the first £37,700 of taxable income
  const basicRateBand = rates.basicRateThreshold - rates.personalAllowance;

  // Higher rate band: from basic rate threshold up to higher rate threshold
  const higherRateBand = rates.higherRateThreshold - rates.basicRateThreshold;

  // Basic rate (20%)
  if (taxableIncome <= basicRateBand) {
    tax = taxableIncome * rates.basicRate;
  }
  // Higher rate (40%)
  else if (taxableIncome <= basicRateBand + higherRateBand) {
    tax = basicRateBand * rates.basicRate;
    tax += (taxableIncome - basicRateBand) * rates.higherRate;
  }
  // Additional rate (45%)
  else {
    tax = basicRateBand * rates.basicRate;
    tax += higherRateBand * rates.higherRate;
    tax += (taxableIncome - basicRateBand - higherRateBand) * rates.additionalRate;
  }

  return tax;
}

/**
 * Get the Income Tax type (direct or indirect)
 * @returns {string} - Tax type ('direct' or 'indirect')
 */
export function getIncomeTaxType() {
  return TAX_RATES.incomeTax.type;
}
