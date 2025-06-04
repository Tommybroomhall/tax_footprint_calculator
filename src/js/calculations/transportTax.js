import { TAX_RATES } from './constants.js';
import { calculateVehicleTaxes } from './vehicleTax.js';
import { calculateMultipleFlightsAPD } from './airPassengerDuty.js';
import { calculatePublicTransportTax } from './publicTransportTax.js';

/**
 * Calculate VAT on public transport spending
 * @param {Object} transportData - Public transport spending data
 * @returns {number} - Annual VAT on public transport in pounds
 */
export function calculatePublicTransportVAT(transportData) {
  if (!transportData) return 0;
  
  // Extract public transport spending
  const trainMonthly = Number(transportData.trainMonthly || 0);
  const busMonthly = Number(transportData.busMonthly || 0);
  const taxiMonthly = Number(transportData.taxiMonthly || 0);
  
  // Public transport VAT rules:
  // - Train and bus fares are generally VAT-exempt (0%)
  // - Taxi fares are subject to standard VAT rate (20%)
  
  // Calculate VAT - only taxi fares have VAT
  const taxiVAT = taxiMonthly * 12 * (TAX_RATES.vat.standardRate / (1 + TAX_RATES.vat.standardRate));
  
  return taxiVAT;
}

/**
 * Calculate total transport taxes
 * @param {Object} data - Complete transport data object
 * @returns {Object} - Breakdown of all transport-related taxes
 */
export function calculateTotalTransportTaxes(data) {
  if (!data) return {
    vehicleTaxes: {
      total: 0,
      breakdown: {}
    },
    flightTaxes: 0,
    publicTransportTaxes: {
      total: 0,
      breakdown: {}
    },
    total: 0
  };
  
  // Calculate vehicle taxes for all vehicles
  let totalVehicleTaxes = 0;
  const vehicleTaxes = {};
  
  if (data.vehicles && Array.isArray(data.vehicles)) {
    data.vehicles.forEach((vehicle, index) => {
      const vehicleId = `vehicle${index + 1}`;
      const taxes = calculateVehicleTaxes(vehicle);
      vehicleTaxes[vehicleId] = taxes;
      totalVehicleTaxes += taxes.total;
    });
  }
  
  // Calculate flight taxes
  const flightTaxes = calculateMultipleFlightsAPD(data.flights || []);
  
  // Calculate public transport taxes
  const publicTransportTaxResults = calculatePublicTransportTax(data.publicTransport || {});
  
  // Calculate total transport taxes
  const totalTransportTaxes = totalVehicleTaxes + flightTaxes + publicTransportTaxResults.total;
  
  return {
    vehicleTaxes: {
      total: totalVehicleTaxes,
      breakdown: vehicleTaxes
    },
    flightTaxes,
    publicTransportTaxes: {
      total: publicTransportTaxResults.total,
      breakdown: publicTransportTaxResults
    },
    total: totalTransportTaxes
  };
}

/**
 * Calculate the relative tax burden percentage for different transport modes
 * @param {Object} transportTaxes - Transport tax breakdown
 * @returns {Object} - Percentage breakdown by transport mode
 */
export function getTransportTaxPercentages(transportTaxes) {
  if (!transportTaxes || transportTaxes.total === 0) {
    return {
      vehicles: 0,
      flights: 0,
      publicTransport: 0
    };
  }
  
  const total = transportTaxes.total;
  
  return {
    vehicles: Math.round((transportTaxes.vehicleTaxes.total / total) * 100),
    flights: Math.round((transportTaxes.flightTaxes / total) * 100),
    publicTransport: Math.round((transportTaxes.publicTransportTaxes.total / total) * 100)
  };
}

/**
 * Calculate 5-year transport tax projection
 * @param {Object} transportTaxes - Current transport tax breakdown
 * @param {number} growthRate - Annual growth rate as decimal (default: 0.02 for 2%)
 * @returns {number} - Projected transport taxes over 5 years
 */
export function projectTransportTaxes(transportTaxes, growthRate = 0.02) {
  if (!transportTaxes || !transportTaxes.total) return 0;
  
  let projection = 0;
  const annualTax = transportTaxes.total;
  
  for (let year = 1; year <= 5; year++) {
    projection += annualTax * Math.pow(1 + growthRate, year);
  }
  
  return projection;
}

/**
 * Group transport taxes by direct vs indirect
 * @param {Object} transportTaxes - Transport tax breakdown
 * @returns {Object} - Taxes grouped by direct and indirect
 */
export function groupTransportTaxesByType(transportTaxes) {
  if (!transportTaxes) return { direct: 0, indirect: 0 };
  
  let directTaxes = 0;
  let indirectTaxes = 0;
  
  // Process vehicle taxes
  if (transportTaxes.vehicleTaxes && transportTaxes.vehicleTaxes.breakdown) {
    Object.values(transportTaxes.vehicleTaxes.breakdown).forEach(vehicle => {
      // VED is direct
      directTaxes += vehicle.ved || 0;
      
      // Congestion charges are direct
      directTaxes += vehicle.congestionCharges || 0;
      
      // Parking fees and road tolls are direct
      directTaxes += vehicle.parkingCharges || 0;
      directTaxes += vehicle.roadTolls || 0;
      
      // Fuel duty and VAT are indirect
      indirectTaxes += vehicle.fuelDuty || 0;
      indirectTaxes += vehicle.fuelVAT || 0;
      
      // Insurance Premium Tax is indirect
      indirectTaxes += vehicle.insuranceIPT || 0;
    });
  }
  
  // Flight taxes (APD) are indirect
  indirectTaxes += transportTaxes.flightTaxes || 0;
  
  // Public transport taxes are indirect
  if (transportTaxes.publicTransportTaxes) {
    indirectTaxes += transportTaxes.publicTransportTaxes.total || 0;
  }
  
  return {
    direct: directTaxes,
    indirect: indirectTaxes
  };
}

/**
 * Calculate detailed transport tax breakdown by tax type
 * @param {Object} transportTaxes - Transport tax breakdown
 * @returns {Object} - Detailed breakdown by tax type
 */
export function getDetailedTransportTaxBreakdown(transportTaxes) {
  if (!transportTaxes) return {
    ved: 0,
    fuelDuty: 0,
    fuelVAT: 0,
    insuranceIPT: 0,
    congestionCharges: 0,
    parkingAndTolls: 0,
    airPassengerDuty: 0,
    publicTransportVAT: 0
  };
  
  let ved = 0;
  let fuelDuty = 0;
  let fuelVAT = 0;
  let insuranceIPT = 0;
  let congestionCharges = 0;
  let parkingAndTolls = 0;
  
  // Process vehicle taxes
  if (transportTaxes.vehicleTaxes && transportTaxes.vehicleTaxes.breakdown) {
    Object.values(transportTaxes.vehicleTaxes.breakdown).forEach(vehicle => {
      ved += vehicle.ved || 0;
      fuelDuty += vehicle.fuelDuty || 0;
      fuelVAT += vehicle.fuelVAT || 0;
      insuranceIPT += vehicle.insuranceIPT || 0;
      congestionCharges += vehicle.congestionCharges || 0;
      parkingAndTolls += (vehicle.parkingCharges || 0) + (vehicle.roadTolls || 0);
    });
  }
  
  // Flight and public transport taxes
  const airPassengerDuty = transportTaxes.flightTaxes || 0;
  const publicTransportVAT = transportTaxes.publicTransportTaxes?.total || 0;
  
  return {
    ved,
    fuelDuty,
    fuelVAT,
    insuranceIPT,
    congestionCharges,
    parkingAndTolls,
    airPassengerDuty,
    publicTransportVAT
  };
} 