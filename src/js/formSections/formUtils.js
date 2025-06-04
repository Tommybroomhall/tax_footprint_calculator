// Utility functions for the form
import { getFormData, calculateTaxEstimates } from './helpers';

// Function to update the running total at the top of the form
export function updateRunningTotal() {
  // Get all form input values
  const formData = getFormData();

  // Calculate tax estimates
  const taxEstimates = calculateTaxEstimates(formData);

  // Update the display
  document.getElementById('annual-tax').textContent = `£${taxEstimates.annualTax.toLocaleString()}`;
  document.getElementById('five-year-tax').textContent = `£${taxEstimates.fiveYearTax.toLocaleString()}`;
  document.getElementById('tax-percentage').textContent = `${taxEstimates.taxPercentage}%`;
}

// Re-export these functions to avoid circular dependencies
export { getFormData, calculateTaxEstimates };
