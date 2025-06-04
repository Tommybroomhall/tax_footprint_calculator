// Export all form sections and utilities
import incomeEmploymentSection from './incomeEmployment';
import housingPropertySection from './housingProperty';
import transportVehiclesSection from './transportVehicles';
import utilitiesEnergySection from './utilitiesEnergy';
import lifestyleConsumptionSection from './lifestyleConsumption';
import investmentsTaxesSection from './investmentsTaxes';
import { renderFormSteps, createFormGroup, createDynamicSectionInstance } from './formRendering';
import { updateRunningTotal } from './formUtils';
import { 
  lookupCouncilTaxBand, 
  showLookupMessage, 
  updateConditionalFields, 
  setupConditionalFields,
  getFormData,
  calculateTaxEstimates
} from './helpers';
import { createEmailSection, sendEmailReport } from './emailSection';

// Combine all form sections into a single array
const formSteps = [
  incomeEmploymentSection,
  housingPropertySection,
  transportVehiclesSection,
  utilitiesEnergySection,
  lifestyleConsumptionSection,
  investmentsTaxesSection
];

// Export the form data to be used by other modules
export const getFormSteps = () => formSteps;

// Export all the functions
export {
  renderFormSteps,
  updateRunningTotal,
  lookupCouncilTaxBand,
  showLookupMessage,
  updateConditionalFields,
  setupConditionalFields,
  getFormData,
  calculateTaxEstimates,
  createEmailSection,
  sendEmailReport,
  createFormGroup,
  createDynamicSectionInstance
};
