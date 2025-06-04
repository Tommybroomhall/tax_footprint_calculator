import { TAX_RATES } from './constants.js';

/**
 * Calculate the estimated tax that landlords pass on to tenants through rent
 *
 * This calculation estimates the portion of rent that represents taxes landlords
 * must pay and typically pass on to tenants through higher rent prices.
 *
 * The primary tax burden comes from Section 24 of the Finance Act (2015-2020 phase-in),
 * which removed landlords' ability to deduct mortgage interest from rental income
 * before calculating tax. Instead, they now receive only a 20% tax credit.
 *
 * For landlords in higher tax brackets (40%+), this significantly increased their
 * tax burden, which economic studies show is largely passed on to tenants.
 *
 * The 15% estimate is based on:
 * - Average mortgage interest as a percentage of rent (typically 30-50%)
 * - Tax rate differential between deduction and credit (20% for higher-rate taxpayers)
 * - Additional landlord taxes (e.g., stamp duty surcharge, capital gains tax)
 *
 * @param {number} monthlyRent - Monthly rent in pounds
 * @returns {number} - Annual landlord tax passed on to tenant in pounds
 */
export function calculateLandlordTaxPassthrough(monthlyRent) {
  if (!monthlyRent || monthlyRent <= 0) return 0;

  // Estimate the percentage of rent that represents passed-through landlord taxes
  // Based on Section 24 mortgage interest relief removal and other landlord taxes
  const taxPassthroughRate = 0.15; // Approximately 15% of rent goes to cover landlord taxes

  // Calculate annual amount
  const annualRent = monthlyRent * 12;
  const annualTaxPassthrough = annualRent * taxPassthroughRate;

  return annualTaxPassthrough;
}

/**
 * Get the landlord tax passthrough type (direct or indirect)
 * @returns {string} - Tax type ('direct' or 'indirect')
 */
export function getLandlordTaxPassthroughType() {
  // This is an indirect tax as it's not directly paid to the government by the tenant
  return 'indirect';
}
