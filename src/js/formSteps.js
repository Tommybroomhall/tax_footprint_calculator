// Import form sections and utilities from separate files
import {
  getFormSteps,
  renderFormSteps,
  lookupCouncilTaxBand,
  showLookupMessage,
  updateConditionalFields,
  setupConditionalFields,
  createFormGroup,
  createDynamicSectionInstance,
  updateRunningTotal,
  getFormData,
  calculateTaxEstimates,
  sendEmailReport
} from './formSections';

// Re-export all the functions to maintain compatibility with existing code
export {
  getFormSteps,
  renderFormSteps,
  lookupCouncilTaxBand,
  showLookupMessage,
  updateConditionalFields,
  setupConditionalFields,
  createFormGroup,
  createDynamicSectionInstance,
  updateRunningTotal,
  getFormData,
  calculateTaxEstimates,
  sendEmailReport
};
