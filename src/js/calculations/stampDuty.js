import { TAX_RATES } from './constants.js';

/**
 * Calculate Stamp Duty Land Tax (SDLT) for property purchases
 * @param {number} propertyValue - Property value in pounds
 * @param {boolean} isFirstTimeBuyer - Whether the buyer is a first-time buyer
 * @returns {number} - Stamp Duty Land Tax in pounds
 */
export function calculateStampDuty(propertyValue, isFirstTimeBuyer = false) {
  // Get the appropriate thresholds based on buyer type
  const thresholds = isFirstTimeBuyer 
    ? TAX_RATES.stampDuty.firstTimeBuyerThresholds 
    : TAX_RATES.stampDuty.thresholds;
  
  let tax = 0;
  let remainingValue = propertyValue;
  
  // Calculate tax for each band
  for (let i = 0; i < thresholds.length; i++) {
    const currentThreshold = thresholds[i].threshold;
    const currentRate = thresholds[i].rate;
    const previousThreshold = i > 0 ? thresholds[i-1].threshold : 0;
    
    // Calculate the portion of the property value that falls within this band
    const valueInBand = Math.min(remainingValue, currentThreshold - previousThreshold);
    
    // Calculate tax for this band
    tax += valueInBand * currentRate;
    
    // Reduce the remaining value
    remainingValue -= valueInBand;
    
    // If no more value to tax, break out of the loop
    if (remainingValue <= 0) break;
  }
  
  return tax;
}

/**
 * Get the Stamp Duty tax type (direct or indirect)
 * @returns {string} - Tax type ('direct' or 'indirect')
 */
export function getStampDutyTaxType() {
  return TAX_RATES.stampDuty.type;
}
