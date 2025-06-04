// Form rendering functions
import { updateConditionalFields, setupConditionalFields } from './helpers';
import { createEmailSection, sendEmailReport } from './emailSection';

// Function to create a form group for a field
export function createFormGroup(field) {
  const formGroup = document.createElement('div');
  formGroup.className = 'form-group';

  // Check if this field should be conditionally displayed
  if (field.conditionalDisplay) {
    formGroup.dataset.dependsOn = field.conditionalDisplay.dependsOn;
    formGroup.dataset.showIf = field.conditionalDisplay.showIf?.join(',') || '';
    formGroup.dataset.hideIf = field.conditionalDisplay.hideIf?.join(',') || '';
    formGroup.style.display = 'none'; // Initially hidden, will be shown by conditional logic
  }

  // Handle summary field type
  if (field.type === 'summary') {
    // Create label
    if (field.label) {
      const label = document.createElement('h3');
      label.textContent = field.label;
      formGroup.appendChild(label);
    }

    // Create container for the summary content
    const summaryContainer = document.createElement('div');
    summaryContainer.id = `${field.name}-container`;
    summaryContainer.className = 'summary-container';

    // Add initial placeholder content
    summaryContainer.innerHTML = field.template || '<p>Summary will appear here when you enter data.</p>';

    formGroup.appendChild(summaryContainer);

    // Setup update logic for this summary field
    if (field.computeValues) {
      // Store the computeValues function and template on the window object for access
      window[`${field.name}_compute`] = field.computeValues;
      window[`${field.name}_template`] = field.template;

      // Add a listener for form field updates to recalculate summary
      document.addEventListener('form-field-updated', () => {
        updateSummaryField(field.name);
      });

      // Also listen for form change events
      document.addEventListener('change', (event) => {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
          updateSummaryField(field.name);
        }
      });
    }

    return formGroup;
  }

  // Create label (except for hidden fields)
  if (field.type !== 'hidden' && field.label) {
    const label = document.createElement('label');
    label.setAttribute('for', field.name);
    label.textContent = field.label;
    label.className = 'form-label'; // Add a class for better styling

    if (field.required) {
      const requiredSpan = document.createElement('span');
      requiredSpan.className = 'required';
      requiredSpan.textContent = ' *';
      label.appendChild(requiredSpan);
    }

    formGroup.appendChild(label);
  }

  // Create input/select
  let input;

  if (field.type === 'select') {
    input = document.createElement('select');

    // Add default empty option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Please select...';
    input.appendChild(defaultOption);

    // Add options
    field.options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.label;
      input.appendChild(optionElement);
    });
  } else if (field.type !== 'hidden') {
    input = document.createElement('input');
    input.type = field.type;

    // Add attributes for number inputs
    if (field.type === 'number') {
      if (field.min !== undefined) input.min = field.min;
      if (field.max !== undefined) input.max = field.max;
      if (field.step !== undefined) input.step = field.step;

      // Use custom placeholder if provided, otherwise use default
      if (field.placeholder) {
        input.placeholder = field.placeholder;
      } else if (field.name === 'monthlyRent') {
        input.placeholder = "Enter your monthly rent in £";
      } else {
        input.placeholder = "Enter amount in £";
      }
    } else if (field.type === 'text') {
      // Use custom placeholder if provided, otherwise use default
      input.placeholder = field.placeholder || "Enter here...";
    }

    // Handle readOnly attribute
    if (field.readOnly) {
      input.readOnly = true;
      input.className = 'read-only';
    }
  }

  if (input) {
    input.name = field.name;
    input.id = field.name;

    if (field.required) {
      input.required = true;
    }

    // Add change event listener for live updates
    input.addEventListener('change', (event) => {
      // Dispatch a custom event to notify of the update
      const updateEvent = new CustomEvent('form-field-updated', {
        detail: {
          name: field.name,
          value: event.target.value
        }
      });
      document.dispatchEvent(updateEvent);

      // Also trigger updates for conditional field display
      updateConditionalFields(field.name, event.target.value);

      // If this is a field that other computed fields depend on, update those fields
      if (field.name === 'monthlyRent') {
        updateSummaryField('landlordTaxPassthrough');
      }
    });

    // For number inputs, also add input event listener for real-time updates
    if (field.type === 'number' && field.name === 'monthlyRent') {
      // Add a special class to the rent input for better visibility
      input.classList.add('rent-input');

      // Make sure the input is visible
      input.style.display = 'block';

      // Add real-time update listener
      input.addEventListener('input', () => {
        updateSummaryField('landlordTaxPassthrough');
      });
    }

    // Special handling for income field - add a calculator button next to it
    if (field.name === 'income' || field.hasCalculateButton) {
      // Create an input group to hold the input and button
      const inputGroup = document.createElement('div');
      inputGroup.className = 'input-group';

      // Move input to the input group
      inputGroup.appendChild(input);

      // Add the income calculator button
      const calcButton = document.createElement('button');
      calcButton.type = 'button';
      calcButton.id = 'calculate-income-btn';
      calcButton.className = 'lookup-button';
      calcButton.textContent = 'Calculate';
      calcButton.title = 'Calculate annual income from hourly rate';
      inputGroup.appendChild(calcButton);

      // Add the income calculator popup
      const popup = document.createElement('div');
      popup.id = 'income-calculator-popup';
      popup.className = 'calculator-popup hidden';
      popup.innerHTML = `
        <div class="popup-content">
          <div class="popup-header">
            <h3>Income Calculator</h3>
            <button class="close-popup">&times;</button>
          </div>
          <div class="popup-body">
            <div class="form-group">
              <label for="popup-hours-per-week">Hours worked per week</label>
              <input type="number" id="popup-hours-per-week" min="1" max="168" step="0.5" placeholder="Enter hours per week">
              <div class="help-text">Enter your typical working hours per week</div>
            </div>
            <div class="form-group">
              <label for="popup-hourly-rate">Hourly rate (£)</label>
              <input type="number" id="popup-hourly-rate" min="0" step="0.01" placeholder="Enter your hourly rate">
              <div class="help-text">Enter your hourly pay rate in pounds</div>
            </div>
            <div id="popup-calculation-result" class="calculation-result hidden">
              <div class="result-row">
                <span class="result-label">Weekly:</span>
                <span id="popup-weekly-income" class="result-value">£0.00</span>
              </div>
              <div class="result-row">
                <span class="result-label">Monthly:</span>
                <span id="popup-monthly-income" class="result-value">£0.00</span>
              </div>
              <div class="result-row">
                <span class="result-label">Annual:</span>
                <span id="popup-annual-income" class="result-value">£0.00</span>
              </div>
            </div>
            <div class="popup-actions">
              <button id="popup-calculate-btn" class="cta-button">Calculate</button>
              <button id="popup-apply-btn" class="cta-button secondary" disabled>Apply to form</button>
            </div>
          </div>
        </div>
      `;

      // Add both input group and popup to the form group
      formGroup.appendChild(inputGroup);
      formGroup.appendChild(popup);
    } else {
      // For other fields, just add the input directly
      formGroup.appendChild(input);
    }
  }

  // Add lookup button if specified
  if (field.hasLookupButton) {
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';

    // Move input to the input group
    formGroup.removeChild(input);
    inputGroup.appendChild(input);

    // Add button
    const lookupButton = document.createElement('button');
    lookupButton.type = 'button';
    lookupButton.className = 'lookup-button';
    lookupButton.textContent = field.buttonText || 'Lookup';
    lookupButton.addEventListener('click', () => {
      if (field.name === 'postcode') {
        // Import the lookupCouncilTaxBand function dynamically to avoid circular dependencies
        import('./helpers').then(module => {
          module.lookupCouncilTaxBand(input.value);
        });
      }
    });

    inputGroup.appendChild(lookupButton);
    formGroup.appendChild(inputGroup);
  }

  // Add help text if exists
  if (field.helpText) {
    const helpText = document.createElement('div');
    helpText.className = 'help-text';
    helpText.textContent = field.helpText;
    formGroup.appendChild(helpText);
  }

  return formGroup;
}

// Function to update a summary field based on current form values
function updateSummaryField(fieldName) {
  // Check if it's a container for a summary field
  const container = document.getElementById(`${fieldName}-container`);

  // Check if it's a text input field with computeValues
  const inputField = document.getElementById(fieldName);

  // Get the compute function and template
  const computeFn = window[`${fieldName}_compute`];
  const template = window[`${fieldName}_template`];

  if (!computeFn || !template) return;

  // Get all form data
  const formData = {};
  document.querySelectorAll('input, select').forEach(input => {
    if (input.name) {
      formData[input.name] = input.value;
    }
  });

  // Compute the values
  const values = computeFn(formData);

  // Apply values to template
  let filledTemplate = template;
  Object.keys(values).forEach(key => {
    filledTemplate = filledTemplate.replace(new RegExp(`{${key}}`, 'g'), values[key]);
  });

  // Update the element
  if (container) {
    // If it's a summary container, update its innerHTML
    container.innerHTML = filledTemplate;
  } else if (inputField && inputField.type === 'text') {
    // If it's a text input field, update its value
    inputField.value = filledTemplate;
    
    // Debugging
    console.log(`Updated ${fieldName} to: ${filledTemplate}`);
  }
}

// Create a dynamic section instance (like for multiple vehicles)
export function createDynamicSectionInstance(sectionConfig, index) {
  const instanceDiv = document.createElement('div');
  instanceDiv.className = 'dynamic-instance';
  instanceDiv.dataset.index = index;

  // Add header if specified
  if (sectionConfig.fields.some(f => f.name === 'vehicleHeader')) {
    const headerField = sectionConfig.fields.find(f => f.name === 'vehicleHeader');
    const header = document.createElement('h4');
    header.className = 'instance-header';
    header.textContent = headerField.label.replace('PLACEHOLDER_INDEX', (index + 1).toString());
    instanceDiv.appendChild(header);

    // If not the first instance, add remove button
    if (index > 0) {
      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'remove-instance';
      removeButton.textContent = '✕';
      removeButton.title = 'Remove this vehicle';
      removeButton.addEventListener('click', () => {
        // Remove this instance
        instanceDiv.remove();

        // Re-enable the add button if it was disabled
        const addButton = document.querySelector(`#${sectionConfig.name} .add-dynamic-section`);
        if (addButton && addButton.disabled) {
          addButton.disabled = false;
        }

        // Renumber remaining instances
        const container = document.querySelector(`#${sectionConfig.name} .dynamic-instances`);
        Array.from(container.children).forEach((instance, idx) => {
          const header = instance.querySelector('.instance-header');
          if (header) {
            header.textContent = headerField.label.replace('PLACEHOLDER_INDEX', (idx + 1).toString());
          }

          // Update data-index
          instance.dataset.index = idx.toString();

          // Update IDs and names of fields
          instance.querySelectorAll('input, select').forEach(input => {
            const oldName = input.name;
            const baseName = oldName.split('_')[0];
            input.name = `${baseName}_${idx}`;
            input.id = `${baseName}_${idx}`;

            // Update labels
            const label = instance.querySelector(`label[for="${oldName}"]`);
            if (label) {
              label.setAttribute('for', input.id);
            }
          });
        });
      });

      header.appendChild(removeButton);
    }
  }

  // Add fields
  sectionConfig.fields.forEach(field => {
    // Skip the header field, we've already handled it
    if (field.name === 'vehicleHeader') return;

    // Create a deep copy of the field to modify
    const fieldCopy = JSON.parse(JSON.stringify(field));

    // Replace placeholder index in name and other properties
    fieldCopy.name = field.name.replace('PLACEHOLDER_INDEX', index.toString());
    if (fieldCopy.label) fieldCopy.label = field.label.replace('PLACEHOLDER_INDEX', (index + 1).toString());
    if (fieldCopy.conditionalDisplay?.dependsOn) {
      fieldCopy.conditionalDisplay.dependsOn = field.conditionalDisplay.dependsOn.replace('PLACEHOLDER_INDEX', index.toString());
    }

    const formGroup = createFormGroup(fieldCopy);
    instanceDiv.appendChild(formGroup);
  });

  return instanceDiv;
}

// Render form content
export function renderFormSteps(formSteps) {
  // If formSteps not provided, get them from the getFormSteps function
  if (!formSteps) {
    // Return a promise that resolves when rendering is complete
    return new Promise((resolve, reject) => {
      // Using dynamic import to avoid circular dependencies
      import('./index.js').then(module => {
        // Call this function again with the form steps
        renderFormSteps(module.getFormSteps())
          .then(resolve)
          .catch(reject);
      }).catch(reject);
    });
  }

  // Return a promise that resolves when rendering is complete
  return new Promise((resolve) => {
    // Remove any existing content
    const formContent = document.getElementById('form-content');
    if (formContent) {
      formContent.innerHTML = '';
    } else {
      resolve(); // Resolve early if form-content doesn't exist
      return;
    }

    // Create sections for each category
    formSteps.forEach(step => {
      // Create section for this category
      const sectionElement = document.createElement('div');
      sectionElement.className = 'form-section';

      // Add section title
      const title = document.createElement('h3');
      title.textContent = step.title;
      sectionElement.appendChild(title);

      // Add fields
      step.fields.forEach(field => {
        // Handle container div elements which may contain nested fields
        if (field.type === 'div') {
          const containerDiv = document.createElement('div');
          containerDiv.className = field.className || 'field-container';
          containerDiv.id = field.name;

          // Check if this container should be conditionally displayed
          if (field.conditionalDisplay) {
            containerDiv.dataset.dependsOn = field.conditionalDisplay.dependsOn;
            containerDiv.dataset.showIf = field.conditionalDisplay.showIf?.join(',') || '';
            containerDiv.dataset.hideIf = field.conditionalDisplay.hideIf?.join(',') || '';
            containerDiv.style.display = 'none'; // Initially hidden, will be shown by conditional logic
          }

          // Handle dynamic sections (like multiple vehicles)
          if (field.dynamicSection) {
            // Container for instances of dynamic content
            const instancesContainer = document.createElement('div');
            instancesContainer.className = 'dynamic-instances';
            containerDiv.appendChild(instancesContainer);

            // Add initial instances
            for (let i = 0; i < field.defaultCount; i++) {
              const instanceDiv = createDynamicSectionInstance(field, i);
              instancesContainer.appendChild(instanceDiv);
            }

            // Add "Add another" button if needed
            if (field.maxCount > field.defaultCount) {
              const addButton = document.createElement('button');
              addButton.type = 'button';
              addButton.className = 'add-dynamic-section';
              addButton.textContent = field.addButtonText || 'Add Another';
              addButton.dataset.targetContainer = field.name;
              addButton.dataset.maxCount = field.maxCount;

              // Add event listener for adding new instances
              addButton.addEventListener('click', () => {
                const container = document.querySelector(`#${field.name} .dynamic-instances`);
                const currentCount = container.children.length;

                if (currentCount < field.maxCount) {
                  const newInstance = createDynamicSectionInstance(field, currentCount);
                  container.appendChild(newInstance);

                  // Setup conditional fields in the new instance
                  setupConditionalFields();

                  // If we've reached the max, disable the button
                  if (container.children.length >= field.maxCount) {
                    addButton.disabled = true;
                  }
                }
              });

              containerDiv.appendChild(addButton);
            }
          } else if (field.fields) {
            // Regular container with static nested fields
            field.fields.forEach(nestedField => {
              const formGroup = createFormGroup(nestedField);
              containerDiv.appendChild(formGroup);
            });
          }

          sectionElement.appendChild(containerDiv);
        } else {
          // Regular form field
          const formGroup = createFormGroup(field);
          sectionElement.appendChild(formGroup);
        }
      });

      // Add the section to the form content
      formContent.appendChild(sectionElement);
    });

    // Add email section at the bottom
    const emailSection = createEmailSection();
    formContent.appendChild(emailSection);

    // Add event listener for the send report button
    const sendReportBtn = document.getElementById('send-report-btn');
    if (sendReportBtn) {
      sendReportBtn.addEventListener('click', sendEmailReport);
    }

    // After rendering, add conditional logic for fields that should show/hide based on other inputs
    setupConditionalFields();

    resolve(); // Resolve when rendering is complete
  });
}
