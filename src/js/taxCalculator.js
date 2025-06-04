/**
 * Tax Calculator Module
 *
 * This file now imports all calculation functions from the calculations folder
 * to maintain a modular and organized codebase.
 */

// Import all calculation functions from the calculations folder
import {
  calculateLiveTaxPercentage,
  calculateTaxFootprint
} from './calculations/index.js';

// Export the main calculation functions
export { calculateLiveTaxPercentage, calculateTaxFootprint };
