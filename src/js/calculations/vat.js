import { TAX_RATES } from './constants.js';

/**
 * Calculate VAT on spending
 * @param {number} monthlySpend - Monthly spend in pounds
 * @param {string} category - Spending category ('standard' or 'energy')
 * @returns {number} - Annual VAT amount in pounds
 */
export function calculateVAT(monthlySpend, category = 'standard') {
  const annualSpend = monthlySpend * 12;
  const vatRate = category === 'energy' ? TAX_RATES.vat.reducedRate : TAX_RATES.vat.standardRate;

  // VAT is included in the price, so we need to extract it
  // Formula: VAT = Price * (VAT Rate / (1 + VAT Rate))
  return annualSpend * (vatRate / (1 + vatRate));
}

/**
 * Get the VAT tax type (direct or indirect)
 * @returns {string} - Tax type ('direct' or 'indirect')
 */
export function getVATTaxType() {
  return TAX_RATES.vat.type;
}
