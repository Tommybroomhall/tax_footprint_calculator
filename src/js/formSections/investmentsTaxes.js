// Investments & Additional Taxes section configuration
const investmentsTaxesSection = {
  id: 6,
  title: 'Investments & Additional Taxes',
  fields: [
    {
      type: 'select',
      name: 'hasInvestments',
      label: 'Do you have investments that generate capital gains?',
      required: true,
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]
    },
    {
      type: 'number',
      name: 'capitalGains',
      label: 'Estimated annual capital gains (£)',
      required: false,
      min: 0,
      step: 100,
      helpText: 'Enter your estimated annual capital gains in pounds'
    },
    {
      type: 'select',
      name: 'investmentType',
      label: 'What type of investments do you have?',
      required: false,
      options: [
        { value: 'shares', label: 'Shares/Stocks' },
        { value: 'property', label: 'Investment Property' },
        { value: 'both', label: 'Both Shares and Property' },
        { value: 'other', label: 'Other Investments' },
        { value: 'none', label: 'None' }
      ]
    },
    {
      type: 'select',
      name: 'receiveDividends',
      label: 'Do you receive dividend income?',
      required: true,
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]
    },
    {
      type: 'number',
      name: 'dividendIncome',
      label: 'Annual dividend income (£)',
      required: false,
      min: 0,
      step: 100,
      helpText: 'Enter your annual dividend income in pounds'
    },
    {
      type: 'select',
      name: 'gambling',
      label: 'Do you regularly gamble or bet?',
      required: true,
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]
    }
  ]
};

export default investmentsTaxesSection;
