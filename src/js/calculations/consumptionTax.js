import { TAX_RATES } from './constants.js';

/**
 * Calculate alcohol duty
 * @param {number} monthlySpend - Monthly spend on alcohol in pounds (default: 50)
 * @returns {number} - Annual alcohol duty in pounds
 */
export function calculateAlcoholDuty(monthlySpend = 50) {
  const annualSpend = monthlySpend * 12;
  return annualSpend * TAX_RATES.alcoholDuty.rate;
}

/**
 * Get the Alcohol Duty tax type (direct or indirect)
 * @returns {string} - Tax type ('direct' or 'indirect')
 */
export function getAlcoholDutyTaxType() {
  return TAX_RATES.alcoholDuty.type;
}

/**
 * Calculate tobacco duty
 * @param {number} monthlySpend - Monthly spend on tobacco in pounds (default: 100)
 * @returns {number} - Annual tobacco duty in pounds
 */
export function calculateTobaccoDuty(monthlySpend = 100) {
  const annualSpend = monthlySpend * 12;
  return annualSpend * TAX_RATES.tobaccoDuty.rate;
}

/**
 * Get the Tobacco Duty tax type (direct or indirect)
 * @returns {string} - Tax type ('direct' or 'indirect')
 */
export function getTobaccoDutyTaxType() {
  return TAX_RATES.tobaccoDuty.type;
}

/**
 * Calculate TV license fee
 * @param {boolean} hasTVLicense - Whether the person pays for a TV license
 * @returns {number} - Annual TV license fee in pounds
 */
export function calculateTVLicense(hasTVLicense) {
  return hasTVLicense ? TAX_RATES.tvLicense.annualFee : 0;
}

/**
 * Get the TV License tax type (direct or indirect)
 * @returns {string} - Tax type ('direct' or 'indirect')
 */
export function getTVLicenseTaxType() {
  return TAX_RATES.tvLicense.type;
}

/**
 * Calculate Insurance Premium Tax
 * @param {number} annualInsurancePremiums - Annual insurance premiums in pounds (default: 500)
 * @returns {number} - Annual Insurance Premium Tax in pounds
 */
export function calculateInsurancePremiumTax(annualInsurancePremiums = 500) {
  return annualInsurancePremiums * TAX_RATES.ipt.rate;
}

/**
 * Get the Insurance Premium Tax type (direct or indirect)
 * @returns {string} - Tax type ('direct' or 'indirect')
 */
export function getInsurancePremiumTaxType() {
  return TAX_RATES.ipt.type;
}
