import { TAX_RATES } from './constants.js';

/**
 * Calculate student loan repayments based on income and plan type
 * @param {number} income - Annual income in pounds
 * @param {string} plan - Student loan plan ('plan1', 'plan2', 'plan4', 'plan5', 'none')
 * @returns {number} - Annual student loan repayment in pounds
 */
export function calculateStudentLoan(income, plan) {
  if (plan === 'none') return 0;

  const rates = TAX_RATES.studentLoan;
  let repayment = 0;

  switch (plan) {
    case 'plan1':
      if (income > rates.plan1Threshold) {
        repayment = (income - rates.plan1Threshold) * rates.plan1Rate;
      }
      break;
    case 'plan2':
      if (income > rates.plan2Threshold) {
        repayment = (income - rates.plan2Threshold) * rates.plan2Rate;
      }
      break;
    case 'plan4':
      if (income > rates.plan4Threshold) {
        repayment = (income - rates.plan4Threshold) * rates.plan4Rate;
      }
      break;
    case 'plan5':
      if (income > rates.plan5Threshold) {
        repayment = (income - rates.plan5Threshold) * rates.plan5Rate;
      }
      break;
  }

  return repayment;
}

/**
 * Get the Student Loan tax type (direct or indirect)
 * @returns {string} - Tax type ('direct' or 'indirect')
 */
export function getStudentLoanTaxType() {
  return TAX_RATES.studentLoan.type;
}
