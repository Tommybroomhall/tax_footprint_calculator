// Transport & Vehicles section configuration
const transportVehiclesSection = {
  id: 3,
  title: 'Transport & Vehicles',
  fields: [
    {
      type: 'select',
      name: 'ownVehicle',
      label: 'Do you own a vehicle?',
      required: true,
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]
    },
    {
      type: 'div',
      name: 'vehiclesContainer',
      className: 'vehicles-container',
      conditionalDisplay: { dependsOn: 'ownVehicle', showIf: ['yes'] },
      dynamicSection: true,
      defaultCount: 1,
      maxCount: 5,
      addButtonText: 'Add Another Vehicle',
      fields: [
        {
          type: 'div',
          name: 'vehicleHeader',
          className: 'vehicle-header',
          label: 'Vehicle PLACEHOLDER_INDEX'
        },
        {
          type: 'select',
          name: 'vehicleType_PLACEHOLDER_INDEX',
          label: 'Vehicle type',
          required: true,
          options: [
            { value: 'car', label: 'Car' },
            { value: 'motorcycle', label: 'Motorcycle' },
            { value: 'van', label: 'Van' },
            { value: 'hgv', label: 'HGV' },
            { value: 'bus', label: 'Bus/Coach' },
            { value: 'other', label: 'Other' }
          ]
        },
        {
          type: 'select',
          name: 'fuelType_PLACEHOLDER_INDEX',
          label: 'Fuel type',
          required: true,
          options: [
            { value: 'petrol', label: 'Petrol' },
            { value: 'diesel', label: 'Diesel' },
            { value: 'hybrid', label: 'Hybrid (non-plug-in)' },
            { value: 'phev', label: 'Plug-in Hybrid' },
            { value: 'electric', label: 'Electric' },
            { value: 'other', label: 'Other' }
          ]
        },
        {
          type: 'select',
          name: 'registrationYear_PLACEHOLDER_INDEX',
          label: 'First registration year',
          required: true,
          options: [
            { value: 'pre2001', label: 'Before 2001' },
            { value: '2001to2017', label: '2001-2017' },
            { value: '2017to2020', label: '2017-2020' },
            { value: '2020onwards', label: '2020 onwards' }
          ],
          helpText: 'Vehicle age affects Vehicle Excise Duty (VED) rates'
        },
        {
          type: 'select',
          name: 'co2Emissions_PLACEHOLDER_INDEX',
          label: 'CO2 emissions (g/km)',
          conditionalDisplay: { dependsOn: 'fuelType_PLACEHOLDER_INDEX', hideIf: ['electric'] },
          options: [
            { value: 'under75', label: 'Under 75 g/km' },
            { value: '75to90', label: '75-90 g/km' },
            { value: '91to100', label: '91-100 g/km' },
            { value: '101to110', label: '101-110 g/km' },
            { value: '111to130', label: '111-130 g/km' },
            { value: '131to150', label: '131-150 g/km' },
            { value: '151to170', label: '151-170 g/km' },
            { value: '171to190', label: '171-190 g/km' },
            { value: '191to225', label: '191-225 g/km' },
            { value: '226to255', label: '226-255 g/km' },
            { value: 'over255', label: 'Over 255 g/km' },
            { value: 'unknown', label: 'I don\'t know' }
          ],
          helpText: 'Affects your Vehicle Excise Duty (road tax) rate'
        },
        {
          type: 'select',
          name: 'listPrice_PLACEHOLDER_INDEX',
          label: 'Vehicle list price when new',
          options: [
            { value: 'under15k', label: 'Under £15,000' },
            { value: '15kto25k', label: '£15,000 - £25,000' },
            { value: '25kto40k', label: '£25,000 - £40,000' },
            { value: 'over40k', label: 'Over £40,000' },
            { value: 'unknown', label: 'I don\'t know' }
          ],
          helpText: 'Vehicles over £40,000 incur an additional premium rate VED surcharge'
        },
        {
          type: 'number',
          name: 'vedAmount_PLACEHOLDER_INDEX',
          label: 'Annual Vehicle Excise Duty (Road Tax) in £',
          helpText: 'If you know the amount you pay, enter it here. Otherwise leave blank and we\'ll estimate it.'
        },
        {
          type: 'select',
          name: 'annualMileage_PLACEHOLDER_INDEX',
          label: 'Annual mileage',
          required: true,
          options: [
            { value: 'under5k', label: 'Under 5,000 miles' },
            { value: '5kto10k', label: '5,000 - 10,000 miles' },
            { value: '10kto15k', label: '10,000 - 15,000 miles' },
            { value: '15kto20k', label: '15,000 - 20,000 miles' },
            { value: 'over20k', label: 'Over 20,000 miles' }
          ]
        },
        {
          type: 'select',
          name: 'mpg_PLACEHOLDER_INDEX',
          label: 'Fuel efficiency (MPG)',
          conditionalDisplay: { dependsOn: 'fuelType_PLACEHOLDER_INDEX', hideIf: ['electric'] },
          options: [
            { value: 'under20', label: 'Under 20 MPG' },
            { value: '20to30', label: '20-30 MPG' },
            { value: '30to40', label: '30-40 MPG' },
            { value: '40to50', label: '40-50 MPG' },
            { value: '50to60', label: '50-60 MPG' },
            { value: 'over60', label: 'Over 60 MPG' },
            { value: 'unknown', label: 'I don\'t know' }
          ],
          helpText: 'Used to estimate fuel duty and VAT on fuel'
        },
        {
          type: 'number',
          name: 'monthlyFuel_PLACEHOLDER_INDEX',
          label: 'Monthly fuel cost in £',
          conditionalDisplay: { dependsOn: 'fuelType_PLACEHOLDER_INDEX', hideIf: ['electric'] },
          helpText: 'If you know your monthly spend, enter it here. Otherwise leave blank and we\'ll estimate it.'
        },
        {
          type: 'select',
          name: 'electricityForCar_PLACEHOLDER_INDEX',
          label: 'Monthly electricity cost for vehicle (£)',
          conditionalDisplay: { dependsOn: 'fuelType_PLACEHOLDER_INDEX', showIf: ['electric', 'phev'] },
          options: [
            { value: 'under20', label: 'Under £20' },
            { value: '20to40', label: '£20-£40' },
            { value: '40to60', label: '£40-£60' },
            { value: '60to80', label: '£60-£80' },
            { value: 'over80', label: 'Over £80' }
          ]
        },
        {
          type: 'select',
          name: 'insuranceCost_PLACEHOLDER_INDEX',
          label: 'Annual insurance cost',
          options: [
            { value: 'under300', label: 'Under £300' },
            { value: '300to500', label: '£300-£500' },
            { value: '500to800', label: '£500-£800' },
            { value: '800to1200', label: '£800-£1,200' },
            { value: 'over1200', label: 'Over £1,200' }
          ],
          helpText: 'Insurance Premium Tax is charged at 12% on motor insurance'
        }
      ]
    },
    {
      type: 'select',
      name: 'congestionCharge',
      label: 'Do you regularly pay congestion charges or ULEZ (Ultra Low Emission Zone)?',
      options: [
        { value: 'never', label: 'Never' },
        { value: 'occasionally', label: 'Occasionally (less than once a week)' },
        { value: 'weekly', label: '1-3 times per week' },
        { value: 'daily', label: 'Most days (4+ times per week)' }
      ]
    },
    {
      type: 'select',
      name: 'roadTolls',
      label: 'Do you regularly pay road or bridge tolls?',
      options: [
        { value: 'never', label: 'Never' },
        { value: 'occasionally', label: 'Occasionally (less than once a week)' },
        { value: 'weekly', label: '1-3 times per week' },
        { value: 'daily', label: 'Most days (4+ times per week)' }
      ]
    },
    {
      type: 'select',
      name: 'parkingCosts',
      label: 'Monthly parking costs (permits, workplace parking, public car parks)',
      options: [
        { value: 'under20', label: 'Under £20' },
        { value: '20to50', label: '£20-£50' },
        { value: '50to100', label: '£50-£100' },
        { value: '100to200', label: '£100-£200' },
        { value: 'over200', label: 'Over £200' },
        { value: 'none', label: 'No parking costs' }
      ]
    },
    {
      type: 'select',
      name: 'publicTransport',
      label: 'Do you use public transport?',
      required: true,
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]
    },
    {
      type: 'div',
      name: 'publicTransportSection',
      conditionalDisplay: { dependsOn: 'publicTransport', showIf: ['yes'] },
      fields: [
        {
          type: 'select',
          name: 'trainMonthly',
          label: 'Monthly train/rail costs',
          options: [
            { value: 'under50', label: 'Under £50' },
            { value: '50to100', label: '£50-£100' },
            { value: '100to200', label: '£100-£200' },
            { value: '200to300', label: '£200-£300' },
            { value: '300to500', label: '£300-£500' },
            { value: 'over500', label: 'Over £500' },
            { value: 'none', label: 'I don\'t use trains' }
          ]
        },
        {
          type: 'select',
          name: 'busMonthly',
          label: 'Monthly bus/coach costs',
          options: [
            { value: 'under20', label: 'Under £20' },
            { value: '20to50', label: '£20-£50' },
            { value: '50to100', label: '£50-£100' },
            { value: '100to200', label: '£100-£200' },
            { value: 'over200', label: 'Over £200' },
            { value: 'none', label: 'I don\'t use buses' }
          ]
        },
        {
          type: 'select',
          name: 'taxiMonthly',
          label: 'Monthly taxi/private hire/ride-hailing costs',
          options: [
            { value: 'under20', label: 'Under £20' },
            { value: '20to50', label: '£20-£50' },
            { value: '50to100', label: '£50-£100' },
            { value: '100to200', label: '£100-£200' },
            { value: 'over200', label: 'Over £200' },
            { value: 'none', label: 'I don\'t use taxis' }
          ],
          helpText: 'Includes standard taxis, Uber, Lyft, or other ride services'
        }
      ]
    }
  ]
};

// Add the air travel fields to the transport section
const airTravelFields = [
  {
    type: 'select',
    name: 'airTravel',
    label: 'How many flights do you take per year?',
    required: true,
    options: [
      { value: 'none', label: 'None' },
      { value: '1to2', label: '1-2 flights' },
      { value: '3to5', label: '3-5 flights' },
      { value: '6to10', label: '6-10 flights' },
      { value: 'over10', label: 'More than 10 flights' }
    ]
  },
  {
    type: 'div',
    name: 'airTravelSection',
    conditionalDisplay: { dependsOn: 'airTravel', hideIf: ['none'] },
    fields: [
      {
        type: 'select',
        name: 'domesticFlights',
        label: 'How many of these are domestic UK flights?',
        options: [
          { value: 'none', label: 'None' },
          { value: '1to2', label: '1-2 flights' },
          { value: '3to5', label: '3-5 flights' },
          { value: 'over5', label: 'More than 5 flights' }
        ]
      },
      {
        type: 'select',
        name: 'europeanFlights',
        label: 'How many are short-haul European flights?',
        options: [
          { value: 'none', label: 'None' },
          { value: '1to2', label: '1-2 flights' },
          { value: '3to5', label: '3-5 flights' },
          { value: 'over5', label: 'More than 5 flights' }
        ]
      },
      {
        type: 'select',
        name: 'longHaulFlights',
        label: 'How many are long-haul international flights?',
        options: [
          { value: 'none', label: 'None' },
          { value: '1to2', label: '1-2 flights' },
          { value: '3to5', label: '3-5 flights' },
          { value: 'over5', label: 'More than 5 flights' }
        ]
      },
      {
        type: 'select',
        name: 'cabinClass',
        label: 'What cabin class do you typically fly?',
        options: [
          { value: 'economy', label: 'Economy' },
          { value: 'premium', label: 'Premium Economy' },
          { value: 'business', label: 'Business/First Class' },
          { value: 'mixed', label: 'Mix of different classes' }
        ],
        helpText: 'Higher cabin classes pay more Air Passenger Duty'
      }
    ]
  },
  {
    type: 'select',
    name: 'motorPenalties',
    label: 'Do you typically pay any driving penalties yearly?',
    options: [
      { value: 'none', label: 'None' },
      { value: 'parking', label: 'Parking fines only' },
      { value: 'traffic', label: 'Traffic/speeding fines only' },
      { value: 'both', label: 'Both parking and traffic fines' }
    ],
    helpText: 'Penalties often include VAT and administrative charges'
  }
];

// Add the air travel fields to the transport section
transportVehiclesSection.fields = [...transportVehiclesSection.fields, ...airTravelFields];

export default transportVehiclesSection;
