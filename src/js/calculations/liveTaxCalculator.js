import { getIncomeFromRange, getMonthlySpendFromRange } from './helpers.js';
import { calculateIncomeTax } from './incomeTax.js';
import { calculateNationalInsurance } from './nationalInsurance.js';
import { calculateStudentLoan } from './studentLoan.js';
import { getCouncilTax } from './councilTax.js';
import { calculateVAT } from './vat.js';
import { calculateVED } from './vehicleTax.js';
import { calculateAirPassengerDuty } from './airPassengerDuty.js';
import { calculateLandlordTaxPassthrough } from './landlordTax.js';
import { TAX_RATES } from './constants.js';

/**
 * Calculate live tax percentage based on current form data
 * @param {Object} formData - Form data object
 * @returns {Object} - Tax calculation results
 */
export function calculateLiveTaxPercentage(formData) {
  // Initialize values with defaults for fields that might not be filled yet
  let totalTax = 0;
  let grossIncome = 0;
  let netIncome = 0;
  let taxBreakdown = {};

  // Only proceed if income has been specified
  if (formData.income || formData.incomeRange) {
    // Get base income (support both new direct input and legacy dropdown)
    grossIncome = formData.income ? getIncomeFromRange(formData.income) : getIncomeFromRange(formData.incomeRange);
    netIncome = grossIncome;

    // Income tax
    const incomeTax = calculateIncomeTax(grossIncome);
    totalTax += incomeTax;
    taxBreakdown.incomeTax = incomeTax;
    netIncome -= incomeTax;

    // National Insurance
    if (formData.employmentStatus) {
      const ni = calculateNationalInsurance(grossIncome, formData.employmentStatus);
      totalTax += ni;
      taxBreakdown.nationalInsurance = ni;
      netIncome -= ni;
    }

    // Student loan
    if (formData.studentLoan) {
      const studentLoan = calculateStudentLoan(grossIncome, formData.studentLoan);
      totalTax += studentLoan;
      taxBreakdown.studentLoan = studentLoan;
      netIncome -= studentLoan;
    }

    // Council tax
    if (formData.councilTaxBand) {
      const councilTax = getCouncilTax(formData.councilTaxBand);
      totalTax += councilTax;
      taxBreakdown.councilTax = councilTax;
      // Note: We subtract this from netIncome now to allow for negative results
      netIncome -= councilTax;
    }

    // Vehicle and transport taxes
    if (formData.vehicleType && formData.vehicleType !== 'none') {
      // Vehicle Excise Duty
      const ved = calculateVED(formData.vehicleType);
      totalTax += ved;
      taxBreakdown.ved = ved;
      // Subtract from net income
      netIncome -= ved;

      // Fuel duty + VAT on fuel
      if (formData.fuelSpend && formData.fuelSpend !== 'none') {
        const monthlyFuel = getMonthlySpendFromRange(formData.fuelSpend);
        // Estimate fuel duty portion (roughly 40% of fuel cost is duty)
        const fuelDuty = monthlyFuel * 12 * 0.4;
        totalTax += fuelDuty;
        taxBreakdown.fuelDuty = fuelDuty;
        netIncome -= fuelDuty;

        // VAT on fuel (20% on the total including duty)
        const vatOnFuel = calculateVAT(monthlyFuel);
        totalTax += vatOnFuel;
        taxBreakdown.vatOnFuel = vatOnFuel;
        netIncome -= vatOnFuel;
      }
    }

    // VAT on energy and reduced-rate items
    if (formData.energyBillMonthly) {
      const energyBill = getMonthlySpendFromRange(formData.energyBillMonthly);
      const vatOnEnergy = calculateVAT(energyBill, 'energy');
      totalTax += vatOnEnergy;
      taxBreakdown.vatOnEnergy = vatOnEnergy;
      netIncome -= vatOnEnergy;
    }

    // TV License
    if (formData.tvLicence === 'yes') {
      totalTax += TAX_RATES.tvLicense.annualFee;
      taxBreakdown.tvLicense = TAX_RATES.tvLicense.annualFee;
      netIncome -= TAX_RATES.tvLicense.annualFee;
    }

    // VAT on subscriptions
    if (formData.subscriptions) {
      const subscriptions = getMonthlySpendFromRange(formData.subscriptions);
      const vatOnSubscriptions = calculateVAT(subscriptions);
      totalTax += vatOnSubscriptions;
      taxBreakdown.vatOnSubscriptions = vatOnSubscriptions;
      netIncome -= vatOnSubscriptions;
    }

    // VAT on groceries (estimate that 30% of groceries have standard VAT)
    if (formData.groceriesMonthly) {
      const groceries = getMonthlySpendFromRange(formData.groceriesMonthly);
      const vatableGroceries = groceries * 0.3; // Estimate 30% of groceries are VATable
      const vatOnGroceries = calculateVAT(vatableGroceries);
      totalTax += vatOnGroceries;
      taxBreakdown.vatOnGroceries = vatOnGroceries;
      netIncome -= vatOnGroceries;
    }

    // Alcohol and tobacco duties
    if (formData.alcoholTobacco) {
      // Rough estimates based on typical consumption patterns
      let alcoholDuty = 0;
      let tobaccoDuty = 0;

      if (formData.alcoholTobacco === 'alcohol' || formData.alcoholTobacco === 'both') {
        alcoholDuty = 500; // Rough annual estimate for average drinker
        totalTax += alcoholDuty;
        taxBreakdown.alcoholDuty = alcoholDuty;
        netIncome -= alcoholDuty;
      }

      if (formData.alcoholTobacco === 'tobacco' || formData.alcoholTobacco === 'both') {
        tobaccoDuty = 2000; // Rough annual estimate for average smoker
        totalTax += tobaccoDuty;
        taxBreakdown.tobaccoDuty = tobaccoDuty;
        netIncome -= tobaccoDuty;
      }
    }

    // Air Passenger Duty
    if (formData.holidaysYearly && formData.holidaysYearly !== 'none') {
      const apd = calculateAirPassengerDuty(formData.holidaysYearly);
      totalTax += apd;
      taxBreakdown.airPassengerDuty = apd;
      netIncome -= apd;
    }

    // Landlord Tax Passthrough for renters
    if (formData.housingStatus === 'rent' && formData.monthlyRent) {
      const monthlyRent = parseFloat(formData.monthlyRent) || 0;
      if (monthlyRent > 0) {
        const landlordTaxPassthrough = calculateLandlordTaxPassthrough(monthlyRent);
        totalTax += landlordTaxPassthrough;
        taxBreakdown.landlordTaxPassthrough = landlordTaxPassthrough;
        netIncome -= landlordTaxPassthrough;
        console.log(`Added landlord tax passthrough: £${landlordTaxPassthrough.toFixed(2)}`);
      }
    }
  }

  // Calculate tax as percentage of gross income
  const taxPercentage = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

  return {
    grossIncome,
    totalTax,
    netIncome, // This can now be negative
    taxPercentage: Math.round(taxPercentage * 10) / 10, // Round to 1 decimal place
    taxBreakdown
  };
}
