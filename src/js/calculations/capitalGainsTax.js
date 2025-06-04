import { TAX_RATES } from './constants.js';

/**
 * Calculate Capital Gains Tax
 * @param {number} gain - Capital gain in pounds
 * @param {boolean} isHigherRateTaxpayer - Whether the person is a higher rate taxpayer
 * @param {boolean} isResidentialProperty - Whether the gain is from residential property
 * @returns {number} - Capital Gains Tax in pounds
 */
export function calculateCapitalGainsTax(gain, isHigherRateTaxpayer = false, isResidentialProperty = false) {
  // Apply annual exempt amount
  const taxableGain = Math.max(0, gain - TAX_RATES.capitalGainsTax.annualExemptAmount);
  
  if (taxableGain <= 0) return 0;
  
  // Apply appropriate rate based on taxpayer status and asset type
  let rate;
  
  if (isResidentialProperty) {
    rate = isHigherRateTaxpayer 
      ? TAX_RATES.capitalGainsTax.residentialPropertyHigher 
      : TAX_RATES.capitalGainsTax.residentialPropertyBasic;
  } else {
    rate = isHigherRateTaxpayer 
      ? TAX_RATES.capitalGainsTax.higherRatePayer 
      : TAX_RATES.capitalGainsTax.basicRatePayer;
  }
  
  return taxableGain * rate;
}

/**
 * Get the Capital Gains Tax type (direct or indirect)
 * @returns {string} - Tax type ('direct' or 'indirect')
 */
export function getCapitalGainsTaxType() {
  return TAX_RATES.capitalGainsTax.type;
}
