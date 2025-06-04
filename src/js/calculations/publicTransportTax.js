import { TAX_RATES } from './constants.js';

/**
 * Calculate VAT on taxi/ride-hailing services
 * @param {number} monthlySpend - Monthly spend on taxis/Uber in pounds
 * @returns {number} - Annual VAT on taxi services in pounds
 */
export function calculateTaxiVAT(monthlySpend) {
  if (!monthlySpend || monthlySpend <= 0) return 0;
  
  // Taxi fares include standard rate VAT (20%)
  const annualSpend = monthlySpend * 12;
  
  // VAT is included in the price, so we need to extract it
  // VAT amount = Price * (VAT Rate / (1 + VAT Rate))
  return annualSpend * (TAX_RATES.vat.standardRate / (1 + TAX_RATES.vat.standardRate));
}

/**
 * Check if rail fare includes VAT
 * @param {string} ticketType - Type of rail ticket
 * @returns {boolean} - Whether the ticket includes VAT
 */
export function isRailFareVATExempt(ticketType) {
  // Most UK public transport is zero-rated for VAT
  const vatExemptTypes = [
    'train', 'commuter', 'season', 'day', 'advance', 'anytime', 'off-peak',
    'travelcard', 'network', 'railcard'
  ];
  
  // Convert to lowercase for comparison
  const normalizedType = ticketType.toLowerCase();
  
  // Check if ticket type is in the exempt list
  return vatExemptTypes.some(type => normalizedType.includes(type));
}

/**
 * Calculate VAT on rail expenditure (if applicable)
 * @param {number} monthlySpend - Monthly spend on rail in pounds
 * @param {string} ticketType - Type of rail ticket
 * @returns {number} - Annual VAT on rail services in pounds
 */
export function calculateRailVAT(monthlySpend, ticketType = 'commuter') {
  if (!monthlySpend || monthlySpend <= 0) return 0;
  
  // Check if ticket type is VAT exempt (most are)
  if (isRailFareVATExempt(ticketType)) return 0;
  
  // Only calculate VAT for non-exempt types
  const annualSpend = monthlySpend * 12;
  return annualSpend * (TAX_RATES.vat.standardRate / (1 + TAX_RATES.vat.standardRate));
}

/**
 * Calculate VAT on bus expenditure
 * @param {number} monthlySpend - Monthly spend on buses in pounds
 * @returns {number} - Annual VAT on bus services in pounds (usually zero)
 */
export function calculateBusVAT(monthlySpend) {
  // Most bus services in the UK are zero-rated for VAT
  return 0;
}

/**
 * Calculate total public transport tax
 * @param {Object} transportData - Public transport data object
 * @returns {Object} - Breakdown of public transport taxes
 */
export function calculatePublicTransportTax(transportData) {
  if (!transportData) return {
    railVAT: 0,
    busVAT: 0,
    taxiVAT: 0,
    total: 0
  };
  
  const railMonthly = Number(transportData.railMonthly || 0);
  const railTicketType = transportData.railTicketType || 'commuter';
  const busMonthly = Number(transportData.busMonthly || 0);
  const taxiMonthly = Number(transportData.taxiMonthly || 0);
  
  const railVAT = calculateRailVAT(railMonthly, railTicketType);
  const busVAT = calculateBusVAT(busMonthly);
  const taxiVAT = calculateTaxiVAT(taxiMonthly);
  
  const total = railVAT + busVAT + taxiVAT;
  
  return {
    railVAT,
    busVAT,
    taxiVAT,
    total
  };
}

/**
 * Get the tax type for public transport VAT
 * @returns {string} - Tax type ('direct' or 'indirect')
 */
export function getPublicTransportTaxType() {
  return TAX_RATES.vat.type; // 'indirect'
}

/**
 * Calculate total cost of public transport (including tax)
 * @param {Object} transportData - Public transport data object
 * @returns {number} - Annual total cost of public transport in pounds
 */
export function calculateTotalPublicTransportCost(transportData) {
  if (!transportData) return 0;
  
  const railMonthly = Number(transportData.railMonthly || 0);
  const busMonthly = Number(transportData.busMonthly || 0);
  const taxiMonthly = Number(transportData.taxiMonthly || 0);
  
  return (railMonthly + busMonthly + taxiMonthly) * 12;
}

/**
 * Calculate percentage of public transport cost that is tax
 * @param {Object} transportData - Public transport data object
 * @returns {number} - Percentage of public transport cost that is tax
 */
export function getPublicTransportTaxPercentage(transportData) {
  const totalCost = calculateTotalPublicTransportCost(transportData);
  if (totalCost === 0) return 0;
  
  const taxAmount = calculatePublicTransportTax(transportData).total;
  return Math.round((taxAmount / totalCost) * 100);
} 