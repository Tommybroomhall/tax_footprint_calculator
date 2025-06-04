// Utilities & Energy section configuration
const utilitiesEnergySection = {
  id: 4,
  title: 'Utilities & Energy',
  fields: [
    {
      type: 'select',
      name: 'energyBillMonthly',
      label: 'What is your average monthly energy bill?',
      required: true,
      options: [
        { value: 'under50', label: 'Under £50' },
        { value: '50to100', label: '£50 - £100' },
        { value: '100to150', label: '£100 - £150' },
        { value: '150to200', label: '£150 - £200' },
        { value: '200to300', label: '£200 - £300' },
        { value: 'over300', label: 'Over £300' }
      ]
    },
    {
      type: 'select',
      name: 'tvLicence',
      label: 'Do you pay for a TV licence?',
      required: true,
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]
    },
    {
      type: 'select',
      name: 'subscriptions',
      label: 'How much do you spend on digital subscriptions monthly?',
      required: true,
      options: [
        { value: 'under10', label: 'Under £10' },
        { value: '10to30', label: '£10 - £30' },
        { value: '30to50', label: '£30 - £50' },
        { value: '50to100', label: '£50 - £100' },
        { value: 'over100', label: 'Over £100' }
      ]
    }
  ]
};

export default utilitiesEnergySection;
