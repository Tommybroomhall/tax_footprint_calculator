import { TAX_RATES } from './constants.js';

/**
 * Get all direct taxes from the tax breakdown
 * @param {Object} taxBreakdown - Tax breakdown object with tax type information
 * @returns {Object} - Object containing only direct taxes
 */
export function getDirectTaxes(taxBreakdown) {
  const directTaxes = {};

  for (const [taxName, taxInfo] of Object.entries(taxBreakdown)) {
    if (taxInfo.type === 'direct') {
      directTaxes[taxName] = taxInfo;
    }
  }

  return directTaxes;
}

/**
 * Get all indirect taxes from the tax breakdown
 * @param {Object} taxBreakdown - Tax breakdown object with tax type information
 * @returns {Object} - Object containing only indirect taxes
 */
export function getIndirectTaxes(taxBreakdown) {
  const indirectTaxes = {};

  for (const [taxName, taxInfo] of Object.entries(taxBreakdown)) {
    if (taxInfo.type === 'indirect') {
      indirectTaxes[taxName] = taxInfo;
    }
  }

  return indirectTaxes;
}

/**
 * Calculate total direct taxes from tax breakdown
 * @param {Object} taxBreakdown - Tax breakdown object with type information
 * @returns {number} - Total direct taxes in pounds
 */
export function calculateTotalDirectTaxes(taxBreakdown) {
  let directTotal = 0;

  // Iterate through all tax categories
  for (const category in taxBreakdown) {
    const taxItem = taxBreakdown[category];

    // Handle mixed types (like transport)
    if (taxItem.type === 'mixed' && taxItem.directAmount !== undefined) {
      directTotal += taxItem.directAmount;
      continue;
    }

    // Normal direct tax categories
    if (taxItem.type === TAX_RATES.taxTypes.direct) {
      directTotal += taxItem.amount;
    }
  }

  return directTotal;
}

/**
 * Calculate total indirect taxes from tax breakdown
 * @param {Object} taxBreakdown - Tax breakdown object with type information
 * @returns {number} - Total indirect taxes in pounds
 */
export function calculateTotalIndirectTaxes(taxBreakdown) {
  let indirectTotal = 0;

  // Iterate through all tax categories
  for (const category in taxBreakdown) {
    const taxItem = taxBreakdown[category];

    // Handle mixed types (like transport)
    if (taxItem.type === 'mixed' && taxItem.indirectAmount !== undefined) {
      indirectTotal += taxItem.indirectAmount;
      continue;
    }

    // Normal indirect tax categories
    if (taxItem.type === TAX_RATES.taxTypes.indirect) {
      indirectTotal += taxItem.amount;
    }
  }

  return indirectTotal;
}

/**
 * Get percentage of total tax that is direct
 * @param {Object} taxBreakdown - Tax breakdown object with type information
 * @param {number} totalTax - Total tax amount
 * @returns {number} - Percentage of tax that is direct
 */
export function getDirectTaxPercentage(taxBreakdown, totalTax) {
  if (totalTax === 0) return 0;
  const directTotal = calculateTotalDirectTaxes(taxBreakdown);
  return Math.round((directTotal / totalTax) * 100);
}

/**
 * Get percentage of total tax that is indirect
 * @param {Object} taxBreakdown - Tax breakdown object with type information
 * @param {number} totalTax - Total tax amount
 * @returns {number} - Percentage of tax that is indirect
 */
export function getIndirectTaxPercentage(taxBreakdown, totalTax) {
  if (totalTax === 0) return 0;
  const indirectTotal = calculateTotalIndirectTaxes(taxBreakdown);
  return Math.round((indirectTotal / totalTax) * 100);
}

/**
 * Get a breakdown of tax by category (direct vs indirect)
 * @param {Object} taxBreakdown - Tax breakdown object
 * @returns {Object} - Categorized breakdown of taxes
 */
export function getTaxCategoryBreakdown(taxBreakdown) {
  const categories = {
    income: 0,
    consumption: 0,
    property: 0,
    transport: 0,
    other: 0
  };

  // Income-related taxes
  categories.income += taxBreakdown.incomeTax?.amount || 0;
  categories.income += taxBreakdown.nationalInsurance?.amount || 0;
  categories.income += taxBreakdown.studentLoan?.amount || 0;

  // Property taxes
  categories.property += taxBreakdown.councilTax?.amount || 0;
  categories.property += taxBreakdown.stampDuty?.amount || 0;
  categories.property += taxBreakdown.landlordTaxPassthrough?.amount || 0;

  // Consumption taxes (VAT, duties)
  categories.consumption += taxBreakdown.vat?.amount || 0;
  categories.consumption += taxBreakdown.alcoholTobaccoDuty?.amount || 0;
  categories.consumption += taxBreakdown.insurancePremiumTax?.amount || 0;

  // Transport taxes
  categories.transport += taxBreakdown.transport?.amount || 0;

  // Other taxes
  categories.other += taxBreakdown.tvLicense?.amount || 0;

  return categories;
}
