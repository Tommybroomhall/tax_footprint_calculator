import { getIncomeFromRange, getMonthlySpendFromRange } from './helpers.js';
import { calculateIncomeTax, getIncomeTaxType } from './incomeTax.js';
import { calculateNationalInsurance, getNationalInsuranceTaxType } from './nationalInsurance.js';
import { calculateStudentLoan, getStudentLoanTaxType } from './studentLoan.js';
import { getCouncilTax, getCouncilTaxType } from './councilTax.js';
import { calculateVAT, getVATTaxType } from './vat.js';
import { calculateTotalTransportTaxes, groupTransportTaxesByType, projectTransportTaxes } from './transportTax.js';
import {
  calculateTVLicense,
  getTVLicenseTaxType,
  calculateAlcoholDuty,
  getAlcoholDutyTaxType,
  calculateTobaccoDuty,
  calculateInsurancePremiumTax,
  getInsurancePremiumTaxType
} from './consumptionTax.js';
import {
  calculateTotalDirectTaxes,
  calculateTotalIndirectTaxes,
  getDirectTaxPercentage,
  getIndirectTaxPercentage
} from './taxCategories.js';
import { calculateLandlordTaxPassthrough, getLandlordTaxPassthroughType } from './landlordTax.js';
import { TAX_RATES } from './constants.js';

/**
 * Calculate comprehensive tax footprint based on form data
 * @param {Object} formData - Form data object
 * @returns {Object} - Tax footprint calculation results
 */
export function calculateTaxFootprint(formData) {
  // Extract values from form data
  const income = formData.income ? getIncomeFromRange(formData.income) : getIncomeFromRange(formData.incomeRange);
  const employmentStatus = formData.employmentStatus;
  const studentLoanPlan = formData.studentLoan;
  const councilTaxBand = formData.councilTaxBand;
  const energyBill = getMonthlySpendFromRange(formData.energyBillMonthly);
  const groceries = getMonthlySpendFromRange(formData.groceriesMonthly);
  const subscriptions = getMonthlySpendFromRange(formData.subscriptions);
  const alcoholTobacco = formData.alcoholTobacco;
  const tvLicence = formData.tvLicence === 'yes';
  const housingStatus = formData.housingStatus;
  const monthlyRent = parseFloat(formData.monthlyRent) || 0;

  // Calculate individual tax components
  const incomeTax = calculateIncomeTax(income);
  const nationalInsurance = calculateNationalInsurance(income, employmentStatus);
  const studentLoan = calculateStudentLoan(income, studentLoanPlan);
  const councilTax = getCouncilTax(councilTaxBand);
  const energyVAT = calculateVAT(energyBill, 'energy');
  const groceriesVAT = calculateVAT(groceries);
  const subscriptionsVAT = calculateVAT(subscriptions);

  // Transport taxes - using the new comprehensive system
  const transportData = {
    vehicles: formData.vehicles || [],
    flights: formData.flights || [],
    publicTransport: {
      trainMonthly: formData.trainMonthly || 0,
      busMonthly: formData.busMonthly || 0,
      taxiMonthly: formData.taxiMonthly || 0
    }
  };

  const transportTaxes = calculateTotalTransportTaxes(transportData);
  const transportTaxesByType = groupTransportTaxesByType(transportTaxes);

  // TV License
  const tvLicenseFee = calculateTVLicense(tvLicence);

  // Alcohol and tobacco duty
  let alcoholDuty = 0;
  let tobaccoDuty = 0;

  if (alcoholTobacco === 'alcohol' || alcoholTobacco === 'both') {
    const alcoholMonthlySpend = getMonthlySpendFromRange(formData.alcoholSpend);
    alcoholDuty = calculateAlcoholDuty(alcoholMonthlySpend);
  }

  if (alcoholTobacco === 'tobacco' || alcoholTobacco === 'both') {
    const tobaccoMonthlySpend = getMonthlySpendFromRange(formData.tobaccoSpend);
    tobaccoDuty = calculateTobaccoDuty(tobaccoMonthlySpend);
  }

  // Insurance Premium Tax (non-vehicle related)
  const homeInsurance = getMonthlySpendFromRange(formData.homeInsurance);
  const otherInsurance = getMonthlySpendFromRange(formData.otherInsurance);
  const nonVehicleInsurancePremiumTax = calculateInsurancePremiumTax(
    (homeInsurance + otherInsurance) * 12
  );

  // Calculate landlord tax passthrough for renters
  const landlordTaxPassthrough = housingStatus === 'rent' ? calculateLandlordTaxPassthrough(monthlyRent) : 0;

  // Calculate total annual tax
  const totalAnnualTax = incomeTax +
                         nationalInsurance +
                         studentLoan +
                         councilTax +
                         energyVAT +
                         groceriesVAT +
                         subscriptionsVAT +
                         transportTaxes.total +
                         tvLicenseFee +
                         alcoholDuty +
                         tobaccoDuty +
                         nonVehicleInsurancePremiumTax +
                         landlordTaxPassthrough;

  // Calculate 5-year retrospective
  const pastFiveYearsTax = totalAnnualTax * 5;

  // Calculate 5-year projection (with 2% annual increase)
  let futureFiveYearsTax = 0;
  for (let i = 1; i <= 5; i++) {
    futureFiveYearsTax += totalAnnualTax * Math.pow(1.02, i);
  }

  // Calculate transport tax projection
  const transportTaxProjection = projectTransportTaxes(transportTaxes);

  // Calculate effective tax rate
  const effectiveTaxRate = (totalAnnualTax / income) * 100;

  // Prepare breakdown by category with tax type information
  const taxBreakdown = {
    incomeTax: {
      amount: incomeTax,
      type: getIncomeTaxType()
    },
    nationalInsurance: {
      amount: nationalInsurance,
      type: getNationalInsuranceTaxType()
    },
    studentLoan: {
      amount: studentLoan,
      type: getStudentLoanTaxType()
    },
    councilTax: {
      amount: councilTax,
      type: getCouncilTaxType()
    },
    vat: {
      amount: energyVAT + groceriesVAT + subscriptionsVAT,
      type: getVATTaxType()
    },
    transport: {
      amount: transportTaxes.total,
      type: 'mixed',
      breakdown: transportTaxes,
      directAmount: transportTaxesByType.direct,
      indirectAmount: transportTaxesByType.indirect
    },
    tvLicense: {
      amount: tvLicenseFee,
      type: getTVLicenseTaxType()
    },
    alcoholTobaccoDuty: {
      amount: alcoholDuty + tobaccoDuty,
      type: getAlcoholDutyTaxType() // Using alcohol duty type for combined value
    },
    insurancePremiumTax: {
      amount: nonVehicleInsurancePremiumTax,
      type: getInsurancePremiumTaxType()
    },
    landlordTaxPassthrough: {
      amount: landlordTaxPassthrough,
      type: getLandlordTaxPassthroughType()
    }
  };

  // Calculate direct and indirect tax totals
  const directTaxTotal = calculateTotalDirectTaxes(taxBreakdown);
  const indirectTaxTotal = calculateTotalIndirectTaxes(taxBreakdown);
  const directTaxPercentage = getDirectTaxPercentage(taxBreakdown, totalAnnualTax);
  const indirectTaxPercentage = getIndirectTaxPercentage(taxBreakdown, totalAnnualTax);

  // Return results
  return {
    annualIncome: income,
    totalAnnualTax,
    netIncome: income - totalAnnualTax,
    directTaxTotal,
    indirectTaxTotal,
    directTaxPercentage,
    indirectTaxPercentage,
    pastFiveYearsTax,
    futureFiveYearsTax,
    effectiveTaxRate,
    taxBreakdown,
    transportTaxes,
    transportTaxProjection
  };
}
