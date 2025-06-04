// Helper functions for the form

// Function to lookup council tax band by postcode
export async function lookupCouncilTaxBand(postcode) {
  if (!postcode) {
    showLookupMessage('Please enter a valid postcode', 'error');
    return;
  }

  try {
    // Show loading state
    showLookupMessage('Looking up your council tax band...', 'info');

    // Format postcode (remove spaces)
    const formattedPostcode = postcode.replace(/\s/g, '');

    // First, validate the postcode using postcodes.io
    const validationResponse = await fetch(`https://api.postcodes.io/postcodes/${formattedPostcode}/validate`);
    const validationData = await validationResponse.json();

    if (!validationData.result) {
      showLookupMessage('Invalid postcode. Please check and try again.', 'error');
      return;
    }

    // Now fetch the postcode data
    const response = await fetch(`https://api.postcodes.io/postcodes/${formattedPostcode}`);
    const data = await response.json();

    if (data.status !== 200 || !data.result) {
      showLookupMessage('Could not find information for this postcode.', 'error');
      return;
    }

    // Postcode.io doesn't provide Council Tax Band directly
    // We'll use an approximation based on average property values in the area

    // Get the LSOA code which can be linked to average property values
    const lsoa = data.result.lsoa;
    const localAuthority = data.result.admin_district;

    // For a real implementation, here you would query another API or database
    // that maps LSOA codes or local authorities to average council tax bands

    // For now, we'll simulate by selecting a band based on the postcode's first character
    // This is just a placeholder - in a real implementation, this would use real data
    let estimatedBand;
    const firstChar = formattedPostcode.charAt(0).toUpperCase();

    // Simple algorithm to simulate a band lookup
    // Note: This is NOT accurate and should be replaced with a real API
    const charCode = firstChar.charCodeAt(0);
    let bandIndex = (charCode % 8); // 0-7 for A-H

    const bands = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    estimatedBand = bands[bandIndex];

    // Update the council tax band dropdown
    const councilTaxBandSelect = document.getElementById('councilTaxBand');
    if (councilTaxBandSelect) {
      councilTaxBandSelect.value = estimatedBand;

      // Trigger the change event to update calculations
      const changeEvent = new Event('change');
      councilTaxBandSelect.dispatchEvent(changeEvent);

      showLookupMessage(`We've estimated your Council Tax band as ${estimatedBand}. Note: This is a demonstration - in a real implementation, this would use official data sources.`, 'success');
    } else {
      showLookupMessage('Could not update Council Tax band selection.', 'error');
    }

  } catch (error) {
    console.error('Error looking up council tax band:', error);
    showLookupMessage('An error occurred while looking up your Council Tax band.', 'error');
  }
}

// Helper function to show lookup message
export function showLookupMessage(message, type = 'info') {
  // Find or create message element
  let messageElement = document.getElementById('lookup-message');
  if (!messageElement) {
    messageElement = document.createElement('div');
    messageElement.id = 'lookup-message';

    // Insert after the postcode input group
    const postcodeGroup = document.getElementById('postcode').closest('.form-group');
    postcodeGroup.parentNode.insertBefore(messageElement, postcodeGroup.nextSibling);
  }

  // Set message content and class
  messageElement.textContent = message;
  messageElement.className = `lookup-message ${type}`;

  // Auto-remove success or info messages after 5 seconds
  if (type === 'success' || type === 'info') {
    setTimeout(() => {
      messageElement.remove();
    }, 5000);
  }
}

// Function to update conditional fields visibility
export function updateConditionalFields(changedFieldName, changedFieldValue) {
  // Find elements that depend on this field
  const dependentElements = document.querySelectorAll(`[data-depends-on="${changedFieldName}"]`);

  dependentElements.forEach(element => {
    const showIfValues = element.dataset.showIf?.split(',') || [];
    const hideIfValues = element.dataset.hideIf?.split(',') || [];

    if (showIfValues.length > 0) {
      // Show if value matches any in the showIf list
      element.style.display = showIfValues.includes(changedFieldValue) ? 'block' : 'none';
    } else if (hideIfValues.length > 0) {
      // Hide if value matches any in the hideIf list
      element.style.display = hideIfValues.includes(changedFieldValue) ? 'none' : 'block';
    }

    // If this is a container that was just shown, recursively check its contents
    if (element.style.display === 'block') {
      // Force a reflow to ensure the element is fully rendered
      void element.offsetWidth;

      // Ensure all labels and inputs are properly displayed
      element.querySelectorAll('label').forEach(label => {
        label.style.display = 'block';
      });

      // Special handling for rent section
      if (element.classList.contains('rent-payment-section') || element.id === 'rentSection') {
        console.log('Rent section displayed - ensuring inputs are visible');

        // Find the monthly rent input and ensure it's visible
        const rentInput = element.querySelector('input[name="monthlyRent"]');
        if (rentInput) {
          rentInput.style.display = 'block';
          rentInput.classList.add('rent-input');

          // Make sure the label is visible too
          const rentLabel = element.querySelector('label[for="monthlyRent"]');
          if (rentLabel) {
            rentLabel.style.display = 'block';
            rentLabel.style.fontWeight = 'bold';
          }
        }
      }

      // Process all inputs in the container
      element.querySelectorAll('select, input').forEach(input => {
        if (input.name) {
          // Make sure the input is visible
          input.style.display = 'block';

          // Special handling for monthly rent input
          if (input.name === 'monthlyRent') {
            input.classList.add('rent-input');
          }

          updateConditionalFields(input.name, input.value);
        }
      });
    }
  });
}

// Setup conditional field visibility for the entire form
export function setupConditionalFields() {
  // Get all form elements that have conditional display
  const conditionalElements = document.querySelectorAll('[data-depends-on]');

  // For each one, find the field it depends on and add initial visibility
  conditionalElements.forEach(element => {
    const dependsOn = element.dataset.dependsOn;
    const dependentField = document.querySelector(`input[name="${dependsOn}"], select[name="${dependsOn}"]`);

    if (dependentField) {
      // Update visibility based on current value
      updateConditionalFields(dependsOn, dependentField.value);

      // Add event listener for changes
      dependentField.addEventListener('change', (event) => {
        updateConditionalFields(dependsOn, event.target.value);
      });
    }
  });

  // Also initialize computed text fields
  initializeComputedTextFields();
}

// Function to initialize text inputs with computed values
export function initializeComputedTextFields() {
  // Look for all text fields that might have compute functions
  const textFields = document.querySelectorAll('input[type="text"].read-only');
  
  textFields.forEach(field => {
    const fieldName = field.id;
    
    // Check if this field has computation functions
    if (window[`${fieldName}_compute`] && window[`${fieldName}_template`]) {
      console.log(`Initializing computed text field: ${fieldName}`);
      
      // Get the compute function and template
      const computeFn = window[`${fieldName}_compute`];
      const template = window[`${fieldName}_template`];
      
      // Get form data
      const formData = {};
      document.querySelectorAll('input, select').forEach(input => {
        if (input.name) {
          formData[input.name] = input.value;
        }
      });
      
      // Compute values and update the field
      try {
        const values = computeFn(formData);
        
        // Apply values to template
        let filledTemplate = template;
        Object.keys(values).forEach(key => {
          filledTemplate = filledTemplate.replace(new RegExp(`{${key}}`, 'g'), values[key]);
        });
        
        // Update field
        field.value = filledTemplate;
        console.log(`Initialized ${fieldName} with: ${filledTemplate}`);
      } catch (err) {
        console.error(`Error initializing ${fieldName}:`, err);
      }
    }
  });
}

// Function to collect all form data
export function getFormData() {
  const formData = {};

  // Get all input and select elements
  const inputs = document.querySelectorAll('input, select');
  inputs.forEach(input => {
    if (input.name) {
      formData[input.name] = input.value;
    }
  });

  return formData;
}

// Placeholder function for tax calculation - replace with actual calculations
export function calculateTaxEstimates(formData) {
  // This is a placeholder - implement actual tax calculations based on the form data
  // For now, return dummy values

  // Get annual income for percentage calculation
  const income = parseFloat(formData.income) || 0;

  // Placeholder calculation - implement real calculations based on UK tax rules
  let annualTax = 0;

  // Basic Income Tax calculation
  if (income > 12570) {
    const taxableIncome = income - 12570;
    if (income <= 50270) {
      annualTax += taxableIncome * 0.2; // 20% basic rate
    } else if (income <= 125140) {
      annualTax += (50270 - 12570) * 0.2; // 20% on basic rate portion
      annualTax += (Math.min(income, 125140) - 50270) * 0.4; // 40% on higher rate portion
    } else {
      annualTax += (50270 - 12570) * 0.2; // 20% on basic rate portion
      annualTax += (125140 - 50270) * 0.4; // 40% on higher rate portion
      annualTax += (income - 125140) * 0.45; // 45% on additional rate portion
    }
  }

  // Add National Insurance (simplified)
  if (income > 12570 && income <= 50270) {
    annualTax += (income - 12570) * 0.08; // 8% NI on this band
  } else if (income > 50270) {
    annualTax += (50270 - 12570) * 0.08; // 8% on earnings up to 50270
    annualTax += (income - 50270) * 0.02; // 2% on earnings above 50270
  }

  // Add Council Tax based on band
  const councilTaxRates = {
    'A': 1200,
    'B': 1400,
    'C': 1600,
    'D': 1800,
    'E': 2200,
    'F': 2600,
    'G': 3000,
    'H': 3600,
    'unknown': 1800 // Default to band D if unknown
  };

  annualTax += councilTaxRates[formData.councilTaxBand] || 0;

  // Add TV License if applicable
  if (formData.tvLicence === 'yes') {
    annualTax += 174.50;
  }

  // Add fuel duty based on monthly spend
  const fuelDutyMap = {
    'under50': 25 * 12, // £25/month in duty+VAT
    '50to100': 50 * 12,
    '100to200': 100 * 12,
    '200to300': 150 * 12,
    'over300': 200 * 12,
    'none': 0
  };

  annualTax += fuelDutyMap[formData.fuelSpend] || 0;

  // Calculate 5 year tax and percentage
  const fiveYearTax = annualTax * 5;
  const taxPercentage = income > 0 ? Math.round((annualTax / income) * 100) : 0;

  return {
    annualTax: Math.round(annualTax),
    fiveYearTax: Math.round(fiveYearTax),
    taxPercentage: taxPercentage
  };
}
