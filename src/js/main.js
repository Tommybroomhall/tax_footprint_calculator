// Import dependencies
import { renderFormSteps } from './formSteps.js';
import { calculateTaxFootprint, calculateLiveTaxPercentage } from './calculations/index.js';
import { renderResults } from './resultsRenderer.js';
import { setupConditionalFields } from './formSections/helpers.js';

// DOM elements
const startCalculatorBtn = document.getElementById('start-calculator');
const introSection = document.getElementById('intro');
const calculatorSection = document.getElementById('calculator');
const resultsSection = document.getElementById('results');
const viewResultsLink = document.getElementById('view-detailed-results');
const restartCalculatorBtn = document.getElementById('restart-calculator');
const downloadResultsBtn = document.getElementById('download-results');

// Live tax display elements
const liveTaxDisplay = document.getElementById('live-tax-display');
const liveTaxAmount = document.getElementById('live-tax-amount');
const liveTaxPercentage = document.getElementById('live-tax-percentage');
const liveIncomeRemaining = document.getElementById('live-income-remaining');
const taxMeterFill = document.getElementById('tax-meter-fill');
const taxDisplayContent = document.getElementById('tax-display-content');
const taxDisplayCompact = document.getElementById('tax-display-compact');
const compactMeterFill = document.getElementById('compact-meter-fill');
const compactPercentage = document.getElementById('compact-percentage');
const toggleTaxDisplayBtn = document.getElementById('toggle-tax-display');
const toggleIcon = document.querySelector('.toggle-icon');

// State management
let formData = {};
let taxDisplayCollapsed = false;
let calculatedIncomeValues = {
  weekly: 0,
  monthly: 0,
  annual: 0
};

// Initialize the application
function initApp() {
  // Render form content and wait for it to complete
  renderFormSteps()
    .then(() => {
      // Add event listeners
      addEventListeners();

      // Set up sticky tax display on scroll
      setupStickyTaxDisplay();

      // Register compute functions and templates for fields that need them
      registerTemplateFields();

      // Initialize summary fields if they exist
      initializeSummaryFields();

      // Setup conditional fields visibility
      setupConditionalFields();

      // Set up income calculator popup
      setupIncomeCalculator();

      // Ensure rent input is properly styled if it exists
      ensureRentInputVisibility();
    })
    .catch(error => {
      console.error('Error rendering form:', error);
    });
}

// Function to ensure rent input is properly visible
function ensureRentInputVisibility() {
  const rentInput = document.getElementById('monthlyRent');
  if (!rentInput) return;

  // Add special styling
  rentInput.classList.add('rent-input');

  // Make sure any visual styles make it stand out
  rentInput.style.borderColor = 'var(--accent-color)';
  rentInput.style.padding = '10px';
  
  // Add event listeners that directly update the landlord tax field
  ['input', 'change', 'blur'].forEach(eventType => {
    rentInput.addEventListener(eventType, () => {
      const value = rentInput.value;
      console.log(`Rent input ${eventType}: £${value}`);
      
      // Force update of the landlord tax field
      updateLandlordTaxField(value);
    });
  });
}

// Direct function to update the landlord tax field based on the rent amount
function updateLandlordTaxField(rentAmount) {
  const taxField = document.getElementById('landlordTaxPassthrough');
  if (!taxField) return;
  
  const rent = parseFloat(rentAmount) || 0;
  
  // Calculate tax amounts
  const taxRate = 0.15;
  const monthlyTax = (rent * taxRate).toFixed(2);
  const annualTax = (monthlyTax * 12).toFixed(2);
  
  // Update the formData object to ensure the values are used in calculations
  formData.monthlyRent = rent;
  formData.housingStatus = 'rent'; // Ensure this is set
  
  // Update the field
  const template = window['landlordTaxPassthrough_template'] || '';
  const formattedText = template
    .replace(/{monthlyTaxAmount}/g, monthlyTax)
    .replace(/{annualTaxAmount}/g, annualTax);
  
  taxField.value = formattedText;
  console.log(`Updated landlord tax field: £${monthlyTax}/month, £${annualTax}/year`);
  
  // Trigger calculation update
  updateLiveTaxDisplay();
}

// Set up income calculator popup functionality
function setupIncomeCalculator() {
  // Get references to popup elements
  const calculateBtn = document.getElementById('calculate-income-btn');
  if (!calculateBtn) return;

  const popup = document.getElementById('income-calculator-popup');
  const closeBtn = popup.querySelector('.close-popup');
  const hoursInput = document.getElementById('popup-hours-per-week');
  const rateInput = document.getElementById('popup-hourly-rate');
  const calcBtn = document.getElementById('popup-calculate-btn');
  const applyBtn = document.getElementById('popup-apply-btn');
  const resultDiv = document.getElementById('popup-calculation-result');
  const weeklyResult = document.getElementById('popup-weekly-income');
  const monthlyResult = document.getElementById('popup-monthly-income');
  const annualResult = document.getElementById('popup-annual-income');

  // Open popup on button click
  calculateBtn.addEventListener('click', () => {
    popup.classList.remove('hidden');

    // Focus on hours input
    setTimeout(() => {
      hoursInput.focus();
    }, 100);

    // Reset fields
    hoursInput.value = '';
    rateInput.value = '';
    resultDiv.classList.add('hidden');
    applyBtn.disabled = true;
  });

  // Close popup when clicking close button
  closeBtn.addEventListener('click', () => {
    popup.classList.add('hidden');
  });

  // Close popup when clicking outside of it
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.classList.add('hidden');
    }
  });

  // Calculate income when clicking calculate button
  calcBtn.addEventListener('click', () => {
    const hours = parseFloat(hoursInput.value) || 0;
    const rate = parseFloat(rateInput.value) || 0;

    if (hours <= 0 || rate <= 0) {
      alert('Please enter valid hours and hourly rate values');
      return;
    }

    // Calculate income values
    calculatedIncomeValues.weekly = hours * rate;
    calculatedIncomeValues.monthly = calculatedIncomeValues.weekly * 52 / 12;
    calculatedIncomeValues.annual = calculatedIncomeValues.weekly * 52;

    // Update result display
    weeklyResult.textContent = `£${calculatedIncomeValues.weekly.toFixed(2)}`;
    monthlyResult.textContent = `£${calculatedIncomeValues.monthly.toFixed(2)}`;
    annualResult.textContent = `£${calculatedIncomeValues.annual.toFixed(2)}`;

    // Show results and enable apply button
    resultDiv.classList.remove('hidden');
    applyBtn.disabled = false;
  });

  // Apply calculated income to form
  applyBtn.addEventListener('click', () => {
    // Find the income input field
    const incomeField = document.getElementById('income');
    if (incomeField) {
      // Round to the nearest pound for the income field
      const annualIncome = Math.round(calculatedIncomeValues.annual);

      // Update the field
      incomeField.value = annualIncome;

      // Trigger change event to update tax calculations
      const changeEvent = new Event('change', { bubbles: true });
      incomeField.dispatchEvent(changeEvent);

      // Update the formData object
      formData.income = annualIncome.toString();

      // Update live tax display
      updateLiveTaxDisplay();

      // Close the popup
      popup.classList.add('hidden');

      // Show success notification
      showNotification(`Annual income of £${annualIncome.toLocaleString()} applied`, 'success');
    }
  });
}

// Show a temporary notification
function showNotification(message, type = 'info') {
  // Check if there's an existing notification
  let notification = document.querySelector('.notification');

  // If not, create one
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'notification';
    document.body.appendChild(notification);
  }

  // Set message and type
  notification.textContent = message;
  notification.className = `notification ${type}`;

  // Show the notification
  notification.classList.add('show');

  // Hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Set up the sticky tax display functionality
function setupStickyTaxDisplay() {
  // Add scroll event listener
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;

    // Add 'floating' class when scrolled down
    if (scrollPosition > 50) {
      liveTaxDisplay.classList.add('floating');

      // Switch to compact mode if collapsed
      if (taxDisplayCollapsed) {
        taxDisplayCompact.classList.remove('hidden');
      }
    } else {
      liveTaxDisplay.classList.remove('floating');

      // Always hide compact view when at the top
      taxDisplayCompact.classList.add('hidden');
    }
  });

  // Add toggle button event listener
  toggleTaxDisplayBtn.addEventListener('click', () => {
    toggleTaxDisplay();
  });
}

// Toggle between expanded and collapsed tax display
function toggleTaxDisplay() {
  taxDisplayCollapsed = !taxDisplayCollapsed;

  if (taxDisplayCollapsed) {
    // Collapse the display
    taxDisplayContent.classList.add('collapsed');
    toggleIcon.classList.add('collapsed');
    liveTaxDisplay.classList.add('compact-mode');

    // Show compact view if floating
    if (liveTaxDisplay.classList.contains('floating')) {
      taxDisplayCompact.classList.remove('hidden');
    }
  } else {
    // Expand the display
    taxDisplayContent.classList.remove('collapsed');
    toggleIcon.classList.remove('collapsed');
    liveTaxDisplay.classList.remove('compact-mode');

    // Always hide compact view when expanded
    taxDisplayCompact.classList.add('hidden');
  }
}

// Add event listeners
function addEventListeners() {
  // Start calculator button
  startCalculatorBtn.addEventListener('click', () => {
    introSection.classList.add('hidden');
    calculatorSection.classList.remove('hidden');
  });

  // View detailed results link
  viewResultsLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (validateForm()) {
      submitForm();
    }
  });

  // Restart calculator button
  restartCalculatorBtn.addEventListener('click', () => {
    resetCalculator();
  });

  // Download results button
  downloadResultsBtn.addEventListener('click', () => {
    downloadResults();
  });

  // Add live update listeners to all form inputs
  document.addEventListener('change', (event) => {
    const target = event.target;

    // Check if it's a form input element
    if (target.tagName === 'INPUT' || target.tagName === 'SELECT') {
      // Store the value in formData
      formData[target.name] = target.value;

      // Update live tax display
      updateLiveTaxDisplay();
    }
  });

  // Listen for the custom event from formSteps.js
  document.addEventListener('form-field-updated', (event) => {
    // Update formData with the new value
    formData[event.detail.name] = event.detail.value;

    // Update live tax display
    updateLiveTaxDisplay();
  });
}

// Update the live tax percentage display
function updateLiveTaxDisplay() {
  // Only update if we have at least income data (either direct income or income range)
  if (formData.income || formData.incomeRange) {
    // Calculate live tax percentage
    const liveTaxData = calculateLiveTaxPercentage(formData);

    // Log all tax components for debugging
    console.log('Tax breakdown:', liveTaxData.taxBreakdown);
    
    // Specifically check if landlord tax is included
    if (formData.housingStatus === 'rent' && formData.monthlyRent) {
      console.log(`Landlord tax in calculation: £${liveTaxData.taxBreakdown.landlordTaxPassthrough || 0}`);
    }

    // Update main display
    liveTaxAmount.textContent = `£${Math.round(liveTaxData.totalTax).toLocaleString()}`;
    liveTaxPercentage.textContent = `${liveTaxData.taxPercentage}%`;

    // Format net income, handling negative values
    const netIncomeValue = Math.round(liveTaxData.netIncome);
    const netIncomeFormatted = netIncomeValue < 0
      ? `-£${Math.abs(netIncomeValue).toLocaleString()}`
      : `£${netIncomeValue.toLocaleString()}`;
    liveIncomeRemaining.textContent = netIncomeFormatted;

    // Add a visual indicator for negative net income
    if (netIncomeValue < 0) {
      liveIncomeRemaining.classList.add('negative');
    } else {
      liveIncomeRemaining.classList.remove('negative');
    }

    // Update compact display
    compactPercentage.textContent = `${liveTaxData.taxPercentage}%`;

    // Update meter fills (cap at 100%)
    const fillPercentage = Math.min(liveTaxData.taxPercentage, 100);
    taxMeterFill.style.width = `${fillPercentage}%`;
    compactMeterFill.style.width = `${fillPercentage}%`;

    // Change color classes based on percentage
    const percentageClass = liveTaxData.taxPercentage > 60 ? 'highlight' :
                           (liveTaxData.taxPercentage > 40 ? 'warning' : 'standard');

    liveTaxPercentage.className = `amount ${percentageClass}`;
    compactPercentage.className = `compact-value ${percentageClass}`;
  }
}

// Validate the entire form
function validateForm() {
  const formContent = document.getElementById('form-content');
  const inputs = formContent.querySelectorAll('input, select');
  let hasIncome = false;

  // Collect form data and validate
  inputs.forEach(input => {
    // Store all input values regardless of validation
    if (input.value) {
      formData[input.name] = input.value;

      // Check if we have income data
      if (input.name === 'income' && input.value) {
        hasIncome = true;
      }
    }

    // Mark required fields that are empty
    if (input.required && !input.value) {
      input.classList.add('error');
    } else {
      input.classList.remove('error');
    }
  });

  // Update live tax display after validation
  updateLiveTaxDisplay();

  // Allow form submission if at least income is provided
  return hasIncome;
}

// Submit form and show results
function submitForm() {
  // Calculate tax footprint based on all form data
  const results = calculateTaxFootprint(formData);

  // Render results
  renderResults(results);

  // Hide calculator section and show results section
  calculatorSection.classList.add('hidden');
  resultsSection.classList.remove('hidden');
}

// Reset calculator
function resetCalculator() {
  // Clear form data
  formData = {};

  // Reset display fields
  liveTaxAmount.textContent = '£0';
  liveTaxPercentage.textContent = '0%';
  liveIncomeRemaining.textContent = '£0';
  taxMeterFill.style.width = '0%';
  compactPercentage.textContent = '0%';
  compactMeterFill.style.width = '0%';

  // Reset all form elements
  document.querySelectorAll('input, select').forEach(input => {
    input.value = '';
    input.classList.remove('error');
  });

  // Hide results section and show calculator
  resultsSection.classList.add('hidden');
  calculatorSection.classList.remove('hidden');
}

// Download results
function downloadResults() {
  // Implementation for downloading results as PDF
  console.log('Download results functionality coming soon...');

  // Alert user for now
  alert('Download functionality coming soon!');
}

// Initialize summary fields
function initializeSummaryFields() {
  // Look for all summary containers
  document.querySelectorAll('.summary-container').forEach(container => {
    const fieldName = container.id.replace('-container', '');

    // Check if this summary field has computation functions
    if (window[`${fieldName}_compute`]) {
      // Trigger an update
      const event = new CustomEvent('form-field-updated', {
        detail: { name: 'init', value: null }
      });
      document.dispatchEvent(event);
    }
  });
}

// Register compute functions and templates for fields that need them
function registerTemplateFields() {
  // Fields that need template processing but aren't summary fields
  const templateFields = [
    {
      name: 'landlordTaxPassthrough',
      template: 'Approximately £{monthlyTaxAmount} per month (£{annualTaxAmount} per year) of your rent is estimated to cover taxes that landlords pay and pass on to tenants. This includes Section 24 tax changes (2017-2020) that removed landlords\' ability to deduct mortgage interest from rental income before calculating tax, effectively increasing their tax burden by 20-25% in many cases. Economic studies show these costs are largely passed on to tenants through higher rents.',
      computeValues: function(formData) {
        const monthlyRent = parseFloat(formData.monthlyRent) || 0;
        console.log('Computing landlord tax passthrough for rent: £' + monthlyRent);

        // Estimate the percentage of rent that represents passed-through landlord taxes
        const taxPassthroughRate = 0.15; // Approximately 15% of rent goes to cover landlord taxes

        const monthlyTaxAmount = monthlyRent * taxPassthroughRate;
        const annualTaxAmount = monthlyTaxAmount * 12;

        return {
          monthlyTaxAmount: monthlyTaxAmount.toFixed(2),
          annualTaxAmount: annualTaxAmount.toFixed(2)
        };
      }
    }
  ];

  // Register each template field
  templateFields.forEach(field => {
    window[`${field.name}_compute`] = field.computeValues;
    window[`${field.name}_template`] = field.template;
    console.log(`Registered template field: ${field.name}`);
  });
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);
