import { TAX_RATES } from './constants.js';

/**
 * Calculate Inheritance Tax
 * @param {number} estateValue - Value of the estate in pounds
 * @param {boolean} includesMainResidence - Whether the estate includes a main residence
 * @param {boolean} passingToDirectDescendants - Whether the estate is passing to direct descendants
 * @returns {number} - Inheritance Tax in pounds
 */
export function calculateInheritanceTax(estateValue, includesMainResidence = true, passingToDirectDescendants = true) {
  // Calculate the tax-free threshold
  let threshold = TAX_RATES.inheritanceTax.threshold;
  
  // Add residence nil-rate band if applicable
  if (includesMainResidence && passingToDirectDescendants) {
    threshold += TAX_RATES.inheritanceTax.residenceNilRateBand;
  }
  
  // Calculate taxable amount
  const taxableAmount = Math.max(0, estateValue - threshold);
  
  // Calculate tax
  return taxableAmount * TAX_RATES.inheritanceTax.rate;
}

/**
 * Get the Inheritance Tax type (direct or indirect)
 * @returns {string} - Tax type ('direct' or 'indirect')
 */
export function getInheritanceTaxType() {
  return TAX_RATES.inheritanceTax.type;
}
