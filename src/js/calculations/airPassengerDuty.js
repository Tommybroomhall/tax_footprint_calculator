import { TAX_RATES } from './constants.js';

/**
 * Calculate Air Passenger Duty based on flight details
 * @param {Object} flightDetails - Object containing flight details
 * @returns {number} - Annual Air Passenger Duty in pounds
 */
export function calculateAirPassengerDuty(flightDetails) {
  if (!flightDetails) return 0;
  
  // Extract flight information
  const flightsPerYear = Number(flightDetails.flightsPerYear || 0);
  if (flightsPerYear === 0) return 0;
  
  // Get flight type information
  const flightType = flightDetails.flightType || 'domestic'; // domestic, shortHaul, longHaul, ultraLongHaul
  const cabinClass = flightDetails.cabinClass || 'economy'; // economy or premium
  
  // Calculate APD based on flight type and cabin class
  let apdPerFlight = 0;
  
  if (flightType === 'domestic') {
    apdPerFlight = cabinClass === 'premium' 
      ? TAX_RATES.airPassengerDuty.domestic.premium 
      : TAX_RATES.airPassengerDuty.domestic.economy;
  } else if (flightType === 'shortHaul') {
    apdPerFlight = cabinClass === 'premium' 
      ? TAX_RATES.airPassengerDuty.shortHaul.premium 
      : TAX_RATES.airPassengerDuty.shortHaul.economy;
  } else if (flightType === 'longHaul') {
    apdPerFlight = cabinClass === 'premium' 
      ? TAX_RATES.airPassengerDuty.longHaul.premium 
      : TAX_RATES.airPassengerDuty.longHaul.economy;
  } else if (flightType === 'ultraLongHaul') {
    apdPerFlight = cabinClass === 'premium' 
      ? TAX_RATES.airPassengerDuty.ultraLongHaul.premium 
      : TAX_RATES.airPassengerDuty.ultraLongHaul.economy;
  }
  
  // For return flights, double the APD (only charged on departures from UK)
  const isReturn = flightDetails.isReturn || false;
  const apdMultiplier = isReturn ? 2 : 1;
  
  // Number of passengers
  const passengers = Number(flightDetails.passengers || 1);
  
  // Calculate total APD
  return apdPerFlight * flightsPerYear * apdMultiplier * passengers;
}

/**
 * Calculate Air Passenger Duty for multiple flights
 * @param {Array} flightsList - Array of flight detail objects
 * @returns {number} - Total annual Air Passenger Duty in pounds
 */
export function calculateMultipleFlightsAPD(flightsList) {
  if (!flightsList || !Array.isArray(flightsList) || flightsList.length === 0) {
    return 0;
  }
  
  return flightsList.reduce((total, flight) => {
    return total + calculateAirPassengerDuty(flight);
  }, 0);
}

/**
 * Get the Air Passenger Duty tax type (direct or indirect)
 * @returns {string} - Tax type ('direct' or 'indirect')
 */
export function getAirPassengerDutyTaxType() {
  return TAX_RATES.airPassengerDuty.type;
}

/**
 * Get the flight type description
 * @param {string} flightType - Flight type code
 * @returns {string} - Human-readable flight type description
 */
export function getFlightTypeDescription(flightType) {
  const descriptions = {
    domestic: 'UK Domestic Flight',
    shortHaul: 'Short Haul (Europe, up to 2,000 miles)',
    longHaul: 'Long Haul (2,001-5,500 miles)',
    ultraLongHaul: 'Ultra Long Haul (over 5,500 miles)'
  };
  
  return descriptions[flightType] || 'Unknown Flight Type';
}
