// Lifestyle & Consumption section configuration
const lifestyleConsumptionSection = {
  id: 5,
  title: 'Lifestyle & Consumption',
  fields: [
    {
      type: 'select',
      name: 'groceriesMonthly',
      label: 'How much do you spend on groceries per month?',
      required: true,
      options: [
        { value: 'under100', label: 'Under £100' },
        { value: '100to200', label: '£100 - £200' },
        { value: '200to300', label: '£200 - £300' },
        { value: '300to500', label: '£300 - £500' },
        { value: 'over500', label: 'Over £500' }
      ]
    },
    {
      type: 'select',
      name: 'alcoholTobacco',
      label: 'Do you regularly purchase alcohol or tobacco products?',
      required: true,
      options: [
        { value: 'neither', label: 'Neither' },
        { value: 'alcohol', label: 'Alcohol only' },
        { value: 'tobacco', label: 'Tobacco only' },
        { value: 'both', label: 'Both alcohol and tobacco' }
      ]
    },
    {
      type: 'select',
      name: 'holidaysYearly',
      label: 'How many flights do you take per year (return trips)?',
      required: true,
      options: [
        { value: 'none', label: 'None' },
        { value: '1to2', label: '1-2 flights' },
        { value: '3to5', label: '3-5 flights' },
        { value: 'over5', label: 'More than 5 flights' }
      ]
    }
  ]
};

export default lifestyleConsumptionSection;
