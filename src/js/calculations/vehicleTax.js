import { TAX_RATES } from './constants.js';

/**
 * Calculate Vehicle Excise Duty (road tax)
 * @param {Object} vehicleDetails - Vehicle details object
 * @returns {number} - Annual VED amount in pounds
 */
export function calculateVED(vehicleDetails) {
  if (!vehicleDetails) return 0;
  
  // If user manually entered VED amount, use that
  if (vehicleDetails.vedAmount && vehicleDetails.vedAmount > 0) {
    return Number(vehicleDetails.vedAmount);
  }
  
  const vehicleType = vehicleDetails.fuelType || 'petrol';
  // Check if it's a high-value vehicle (over £40,000)
  const isExpensiveVehicle = vehicleDetails.listPrice > 40000;
  const expensiveSurcharge = isExpensiveVehicle ? TAX_RATES.ved.expensiveSurcharge : 0;
  
  // Use base rate plus any surcharge
  return (TAX_RATES.ved[vehicleType] || TAX_RATES.ved.petrol) + expensiveSurcharge;
}

/**
 * Get the Vehicle Excise Duty tax type (direct or indirect)
 * @returns {string} - Tax type ('direct' or 'indirect')
 */
export function getVEDTaxType() {
  return TAX_RATES.ved.type;
}

/**
 * Calculate fuel duty based on monthly fuel spend
 * @param {Object} vehicleDetails - Vehicle details object
 * @returns {number} - Annual fuel duty in pounds
 */
export function calculateFuelDuty(vehicleDetails) {
  if (!vehicleDetails || vehicleDetails.fuelType === 'electric') return 0;
  
  // Extract monthly fuel spend, defaulting to 0 if not provided
  const monthlyFuelSpend = Number(vehicleDetails.monthlyFuelSpend || 0);
  
  // Calculate based on spend if provided
  if (monthlyFuelSpend > 0) {
    // Estimate fuel consumption in liters (rough estimate)
    const fuelConsumption = monthlyFuelSpend * 12 / 1.5; // Assuming average £1.50 per liter
    
    // Get the appropriate duty rate
    const dutyRate = TAX_RATES.fuelDuty[vehicleDetails.fuelType] || TAX_RATES.fuelDuty.petrol;
    
    return fuelConsumption * dutyRate;
  }
  
  // Alternative calculation based on mileage and MPG if provided
  if (vehicleDetails.weeklyMileage && vehicleDetails.mpg) {
    const weeklyMileage = Number(vehicleDetails.weeklyMileage);
    const mpg = Number(vehicleDetails.mpg);
    
    // Calculate annual fuel consumption in liters
    // Convert from MPG to liters: miles ÷ MPG × 4.54609 (liters per gallon)
    const annualLiters = (weeklyMileage * 52) / mpg * 4.54609;
    
    // Get the appropriate duty rate
    const dutyRate = TAX_RATES.fuelDuty[vehicleDetails.fuelType] || TAX_RATES.fuelDuty.petrol;
    
    return annualLiters * dutyRate;
  }
  
  return 0;
}

/**
 * Calculate VAT on fuel
 * @param {Object} vehicleDetails - Vehicle details object
 * @returns {number} - Annual VAT on fuel in pounds
 */
export function calculateFuelVAT(vehicleDetails) {
  if (!vehicleDetails || vehicleDetails.fuelType === 'electric') return 0;
  
  // Extract monthly fuel spend, defaulting to 0 if not provided
  const monthlyFuelSpend = Number(vehicleDetails.monthlyFuelSpend || 0);
  
  if (monthlyFuelSpend > 0) {
    // VAT is 20% of the pre-tax price
    // In fuel, duty is already included, so we need to calculate VAT on (price with duty)
    return monthlyFuelSpend * 12 * (TAX_RATES.vat.standardRate / (1 + TAX_RATES.vat.standardRate));
  }
  
  // Alternative calculation if using mileage
  if (vehicleDetails.weeklyMileage && vehicleDetails.mpg) {
    const weeklyMileage = Number(vehicleDetails.weeklyMileage);
    const mpg = Number(vehicleDetails.mpg);
    
    // Calculate annual fuel consumption in liters
    const annualLiters = (weeklyMileage * 52) / mpg * 4.54609;
    
    // Estimate fuel cost (£1.50 per liter average)
    const annualFuelCost = annualLiters * 1.5;
    
    // VAT is 20% of the pre-tax price
    return annualFuelCost * (TAX_RATES.vat.standardRate / (1 + TAX_RATES.vat.standardRate));
  }
  
  return 0;
}

/**
 * Get the Fuel Duty tax type (direct or indirect)
 * @returns {string} - Tax type ('direct' or 'indirect')
 */
export function getFuelDutyTaxType() {
  return TAX_RATES.fuelDuty.type;
}

/**
 * Calculate Insurance Premium Tax on vehicle insurance
 * @param {Object} vehicleDetails - Vehicle details object
 * @returns {number} - Annual IPT on vehicle insurance in pounds
 */
export function calculateVehicleIPT(vehicleDetails) {
  if (!vehicleDetails) return 0;
  
  const annualInsurance = Number(vehicleDetails.annualInsurance || 0);
  
  // IPT is calculated on the base premium
  // The insurance cost already includes IPT, so we need to extract it
  return annualInsurance * (TAX_RATES.ipt.rate / (1 + TAX_RATES.ipt.rate));
}

/**
 * Calculate congestion and emission zone charges
 * @param {Object} vehicleDetails - Vehicle details object
 * @returns {number} - Annual congestion/emission charges in pounds
 */
export function calculateCongestionCharges(vehicleDetails) {
  if (!vehicleDetails) return 0;
  
  const daysPerMonthCongestion = Number(vehicleDetails.daysPerMonthCongestion || 0);
  const congestionCharge = Number(vehicleDetails.congestionCharge || TAX_RATES.congestionCharge || 15);
  
  const daysPerMonthULEZ = Number(vehicleDetails.daysPerMonthULEZ || 0);
  const ulezCharge = Number(vehicleDetails.ulezCharge || TAX_RATES.ulezCharge || 12.50);
  
  return (daysPerMonthCongestion * congestionCharge * 12) + (daysPerMonthULEZ * ulezCharge * 12);
}

/**
 * Calculate parking charges and fines
 * @param {Object} vehicleDetails - Vehicle details object
 * @returns {number} - Annual parking charges and fines in pounds
 */
export function calculateParkingCharges(vehicleDetails) {
  if (!vehicleDetails) return 0;
  
  const monthlyParkingCharges = Number(vehicleDetails.monthlyParkingCharges || 0);
  const annualParkingFines = Number(vehicleDetails.annualParkingFines || 0);
  
  return (monthlyParkingCharges * 12) + annualParkingFines;
}

/**
 * Calculate road and bridge tolls
 * @param {Object} vehicleDetails - Vehicle details object
 * @returns {number} - Annual toll charges in pounds
 */
export function calculateRoadTolls(vehicleDetails) {
  if (!vehicleDetails) return 0;
  
  return Number(vehicleDetails.annualTollCharges || 0);
}

/**
 * Calculate total vehicle-related taxes
 * @param {Object} vehicleDetails - Vehicle details object
 * @returns {Object} - Breakdown of all vehicle-related taxes
 */
export function calculateVehicleTaxes(vehicleDetails) {
  if (!vehicleDetails) return {
    ved: 0,
    fuelDuty: 0,
    fuelVAT: 0,
    insuranceIPT: 0,
    congestionCharges: 0,
    parkingCharges: 0,
    roadTolls: 0,
    total: 0
  };
  
  const ved = calculateVED(vehicleDetails);
  const fuelDuty = calculateFuelDuty(vehicleDetails);
  const fuelVAT = calculateFuelVAT(vehicleDetails);
  const insuranceIPT = calculateVehicleIPT(vehicleDetails);
  const congestionCharges = calculateCongestionCharges(vehicleDetails);
  const parkingCharges = calculateParkingCharges(vehicleDetails);
  const roadTolls = calculateRoadTolls(vehicleDetails);
  
  const total = ved + fuelDuty + fuelVAT + insuranceIPT + congestionCharges + parkingCharges + roadTolls;
  
  return {
    ved,
    fuelDuty,
    fuelVAT,
    insuranceIPT,
    congestionCharges,
    parkingCharges,
    roadTolls,
    total
  };
}
