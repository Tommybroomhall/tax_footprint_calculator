// Income & Employment section configuration

const incomeEmploymentSection = {
  id: 1,
  title: 'Income & Employment',
  fields: [
    {
      type: 'number',
      name: 'income',
      label: 'What is your annual income before tax (£)?',
      required: true,
      min: 0,
      step: 1,
      helpText: 'Enter your annual pre-tax income in pounds. Click "Calculate" to estimate from hourly rate.',
      hasCalculateButton: true
    },
    {
      type: 'select',
      name: 'employmentStatus',
      label: 'What is your employment status?',
      required: true,
      options: [
        { value: 'employed', label: 'Employed (PAYE)' },
        { value: 'selfEmployed', label: 'Self-employed' },
        { value: 'both', label: 'Both employed and self-employed' },
        { value: 'retired', label: 'Retired' },
        { value: 'unemployed', label: 'Unemployed/Benefits' }
      ]
    },
    {
      type: 'select',
      name: 'studentLoan',
      label: 'Do you have a student loan?',
      required: true,
      options: [
        { value: 'none', label: 'No student loan' },
        { value: 'plan1', label: 'Yes - Plan 1' },
        { value: 'plan2', label: 'Yes - Plan 2' },
        { value: 'plan4', label: 'Yes - Plan 4' },
        { value: 'plan5', label: 'Yes - Plan 5 (Postgraduate)' }
      ]
    }
  ]
};

export default incomeEmploymentSection;
