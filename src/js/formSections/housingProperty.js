// Housing & Property section configuration
const housingPropertySection = {
  id: 2,
  title: 'Housing & Property',
  fields: [
    {
      type: 'select',
      name: 'ownsPropertyUK',
      label: 'Do you own a property in the UK?',
      required: true,
      helpText: 'This determines which property-related taxes apply to you. Property owners pay different taxes than renters.',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]
    },
    // Property owner section
    {
      type: 'div',
      name: 'propertyOwnerSection',
      conditionalDisplay: { dependsOn: 'ownsPropertyUK', showIf: ['yes'] },
      fields: [
        {
          type: 'select',
          name: 'housingStatus',
          label: 'What is your ownership status?',
          required: true,
          helpText: 'This affects your tax footprint. Mortgage interest is no longer fully tax-deductible for landlords (Section 24).',
          options: [
            { value: 'ownOutright', label: 'Own outright (no mortgage)' },
            { value: 'ownMortgage', label: 'Own with mortgage' }
          ]
        },
        {
          type: 'text',
          name: 'postcode',
          label: 'What is your postcode?',
          required: false,
          placeholder: 'e.g., SW1A 1AA',
          helpText: 'We\'ll use this to look up your Council Tax band. Council Tax is a direct tax paid to local authorities.',
          hasLookupButton: true,
          buttonText: 'Find My Band'
        },
        {
          type: 'select',
          name: 'councilTaxBand',
          label: 'What is your Council Tax band?',
          required: true,
          helpText: 'Council Tax is a direct property tax paid to local authorities based on your property\'s value band. The amounts shown are national averages.',
          options: [
            { value: 'A', label: 'Band A (avg. £1,200/year) - Property value up to £40,000' },
            { value: 'B', label: 'Band B (avg. £1,400/year) - £40,001 to £52,000' },
            { value: 'C', label: 'Band C (avg. £1,600/year) - £52,001 to £68,000' },
            { value: 'D', label: 'Band D (avg. £1,800/year) - £68,001 to £88,000' },
            { value: 'E', label: 'Band E (avg. £2,200/year) - £88,001 to £120,000' },
            { value: 'F', label: 'Band F (avg. £2,600/year) - £120,001 to £160,000' },
            { value: 'G', label: 'Band G (avg. £3,000/year) - £160,001 to £320,000' },
            { value: 'H', label: 'Band H (avg. £3,600/year) - Over £320,000' },
            { value: 'unknown', label: 'I don\'t know my band' }
          ]
        },
        {
          type: 'select',
          name: 'propertyBought',
          label: 'Have you bought a property in the last 5 years?',
          required: true,
          helpText: 'This helps us calculate if you\'ve paid Stamp Duty Land Tax (SDLT) recently.',
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ]
        },
        {
          type: 'select',
          name: 'firstTimeBuyer',
          label: 'Were you a first-time buyer?',
          required: false,
          conditionalDisplay: { dependsOn: 'propertyBought', showIf: ['yes'] },
          helpText: 'First-time buyers get Stamp Duty relief on properties up to £425,000.',
          options: [
            { value: 'yes', label: 'Yes - I had never owned property before' },
            { value: 'no', label: 'No - I had owned property previously' }
          ]
        },
        {
          type: 'number',
          name: 'propertyValue',
          label: 'What was the property value when you bought it (£)?',
          required: false,
          conditionalDisplay: { dependsOn: 'propertyBought', showIf: ['yes'] },
          min: 0,
          step: 1000,
          placeholder: 'e.g., 250000',
          helpText: 'This is used to calculate Stamp Duty Land Tax (SDLT) you paid. SDLT is a direct tax on property purchases.'
        }
      ]
    },
    // Non-property owner section
    {
      type: 'div',
      name: 'nonPropertyOwnerSection',
      conditionalDisplay: { dependsOn: 'ownsPropertyUK', showIf: ['no'] },
      fields: [
        {
          type: 'select',
          name: 'housingStatus',
          label: 'What is your living situation?',
          required: true,
          helpText: 'Different living arrangements have different tax implications.',
          options: [
            { value: 'rent', label: 'Rent from a private landlord' },
            { value: 'livingWithFamily', label: 'Living with family (not paying rent)' },
            { value: 'other', label: 'Other arrangement' }
          ]
        },
        // Monthly Rent Input - Direct field instead of nested in a div
        {
          type: 'number',
          name: 'monthlyRent',
          label: '💰 Monthly Rent Payment (£)',
          required: true,
          min: 0,
          step: 10,
          placeholder: 'Enter your monthly rent (e.g., 800)',
          helpText: 'Enter the total amount you pay to your landlord each month (before any bills or utilities). This helps us calculate hidden taxes in your rent that result from landlord tax policies.',
          conditionalDisplay: { dependsOn: 'housingStatus', showIf: ['rent'] }
        },
        // Landlord Tax Passthrough - Direct field instead of nested in a div
        {
          type: 'text',
          name: 'landlordTaxPassthrough',
          label: 'Hidden landlord taxes in your rent',
          readOnly: true,
          conditionalDisplay: { dependsOn: 'housingStatus', showIf: ['rent'] },
          computeValues: function(formData) {
            const monthlyRent = parseFloat(formData.monthlyRent) || 0;
            console.log('Computing landlord tax passthrough for rent: £' + monthlyRent);

            // Estimate the percentage of rent that represents passed-through landlord taxes
            // Based on Section 24 mortgage interest relief removal and other landlord taxes
            const taxPassthroughRate = 0.15; // Approximately 15% of rent goes to cover landlord taxes

            const monthlyTaxAmount = monthlyRent * taxPassthroughRate;
            const annualTaxAmount = monthlyTaxAmount * 12;

            return {
              monthlyTaxAmount: monthlyTaxAmount.toFixed(2),
              annualTaxAmount: annualTaxAmount.toFixed(2)
            };
          },
          template: 'Approximately £{monthlyTaxAmount} per month (£{annualTaxAmount} per year) of your rent is estimated to cover taxes that landlords pay and pass on to tenants. This includes Section 24 tax changes (2017-2020) that removed landlords\' ability to deduct mortgage interest from rental income before calculating tax, effectively increasing their tax burden by 20-25% in many cases. Economic studies show these costs are largely passed on to tenants through higher rents.'
        },
        {
          type: 'text',
          name: 'postcode',
          label: 'What is your postcode?',
          required: false,
          placeholder: 'e.g., SW1A 1AA',
          helpText: 'We\'ll use this to look up your Council Tax band. Council Tax is a direct tax paid to local authorities.',
          hasLookupButton: true,
          buttonText: 'Find My Band'
        },
        {
          type: 'select',
          name: 'councilTaxBand',
          label: 'What is your Council Tax band?',
          required: true,
          helpText: 'Council Tax is a direct property tax paid to local authorities based on your property\'s value band. As a renter, you typically pay this tax directly or through your rent. The amounts shown are national averages.',
          options: [
            { value: 'A', label: 'Band A (avg. £1,200/year) - Property value up to £40,000' },
            { value: 'B', label: 'Band B (avg. £1,400/year) - £40,001 to £52,000' },
            { value: 'C', label: 'Band C (avg. £1,600/year) - £52,001 to £68,000' },
            { value: 'D', label: 'Band D (avg. £1,800/year) - £68,001 to £88,000' },
            { value: 'E', label: 'Band E (avg. £2,200/year) - £88,001 to £120,000' },
            { value: 'F', label: 'Band F (avg. £2,600/year) - £120,001 to £160,000' },
            { value: 'G', label: 'Band G (avg. £3,000/year) - £160,001 to £320,000' },
            { value: 'H', label: 'Band H (avg. £3,600/year) - Over £320,000' },
            { value: 'unknown', label: 'I don\'t know my band' }
          ]
        }
      ]
    }
  ]
};

export default housingPropertySection;
