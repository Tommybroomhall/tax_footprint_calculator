/**
 * Index file to export all calculation functions
 */

// Export constants
export { TAX_RATES } from './constants.js';

// Export helper functions
export { getIncomeFromRange, getMonthlySpendFromRange } from './helpers.js';

// Export income tax calculations
export { calculateIncomeTax, getIncomeTaxType } from './incomeTax.js';

// Export National Insurance calculations
export { calculateNationalInsurance, getNationalInsuranceTaxType } from './nationalInsurance.js';

// Export student loan calculations
export { calculateStudentLoan, getStudentLoanTaxType } from './studentLoan.js';

// Export VAT calculations
export { calculateVAT, getVATTaxType } from './vat.js';

// Export council tax calculations
export { getCouncilTax, getCouncilTaxType } from './councilTax.js';

// Export vehicle tax calculations
export {
  calculateVED,
  getVEDTaxType,
  calculateFuelDuty,
  getFuelDutyTaxType
} from './vehicleTax.js';

// Export consumption tax calculations
export {
  calculateAlcoholDuty,
  getAlcoholDutyTaxType,
  calculateTobaccoDuty,
  getTobaccoDutyTaxType,
  calculateTVLicense,
  getTVLicenseTaxType,
  calculateInsurancePremiumTax,
  getInsurancePremiumTaxType
} from './consumptionTax.js';

// Export air passenger duty calculations
export { calculateAirPassengerDuty, getAirPassengerDutyTaxType } from './airPassengerDuty.js';

// Export stamp duty calculations
export { calculateStampDuty, getStampDutyTaxType } from './stampDuty.js';

// Export capital gains tax calculations
export { calculateCapitalGainsTax, getCapitalGainsTaxType } from './capitalGainsTax.js';

// Export inheritance tax calculations
export { calculateInheritanceTax, getInheritanceTaxType } from './inheritanceTax.js';

// Export landlord tax passthrough calculations
export { calculateLandlordTaxPassthrough, getLandlordTaxPassthroughType } from './landlordTax.js';

// Export tax category functions
export {
  getDirectTaxes,
  getIndirectTaxes,
  calculateTotalDirectTaxes,
  calculateTotalIndirectTaxes,
  getDirectTaxPercentage,
  getIndirectTaxPercentage
} from './taxCategories.js';

// Export live tax calculator
export { calculateLiveTaxPercentage } from './liveTaxCalculator.js';

// Export tax footprint calculator
export { calculateTaxFootprint } from './taxFootprint.js';
