import { TAX_RATES } from './constants.js';

/**
 * Get council tax amount based on band
 * @param {string} band - Council tax band (A-H or 'unknown')
 * @returns {number} - Annual council tax amount in pounds
 */
export function getCouncilTax(band) {
  return TAX_RATES.councilTax[band] || TAX_RATES.councilTax.unknown;
}

/**
 * Get the Council Tax type (direct or indirect)
 * @returns {string} - Tax type ('direct' or 'indirect')
 */
export function getCouncilTaxType() {
  return TAX_RATES.councilTax.type;
}
