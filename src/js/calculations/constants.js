// Tax rates and constants
export const TAX_RATES = {
  // Tax type classification
  taxTypes: {
    direct: 'Direct Tax', // Taxes paid directly by the consumer
    indirect: 'Indirect Tax' // Taxes included in the price of goods/services
  },

  // Income tax rates (2025 estimates)
  incomeTax: {
    type: 'direct', // Classification as direct tax
    personalAllowance: 12570, // No tax on income up to this amount
    basicRate: 0.20, // 20% on income between personal allowance and basic rate threshold
    higherRate: 0.40, // 40% on income between basic rate threshold and higher rate threshold
    additionalRate: 0.45, // 45% on income above higher rate threshold
    basicRateThreshold: 50270, // This is the total income threshold (includes personal allowance)
    higherRateThreshold: 125140 // Income above this amount is taxed at the additional rate
  },

  // National Insurance rates (2025 estimates)
  nationalInsurance: {
    type: 'direct', // Classification as direct tax
    employeeThreshold: 12570,
    employeeRate1: 0.08, // Updated from 12% to 8% for 2025-26 as per government announcements
    employeeRate2: 0.02,
    employeeUpperThreshold: 50270,
    selfEmployedLowerThreshold: 12570,
    selfEmployedRate1: 0.06, // Updated from 9% to 6% for 2025-26 as per government announcements
    selfEmployedRate2: 0.02,
    selfEmployedUpperThreshold: 50270
  },

  // VAT rates
  vat: {
    type: 'indirect', // Classification as indirect tax
    standardRate: 0.20,
    reducedRate: 0.05 // For energy, etc.
  },

  // Council tax (average by band - 2025 estimates)
  councilTax: {
    type: 'direct', // Classification as direct tax
    A: 1200,
    B: 1400,
    C: 1600,
    D: 1800,
    E: 2200,
    F: 2600,
    G: 3000,
    H: 3600,
    unknown: 1800 // Default to band D if unknown
  },

  // Fuel duty
  fuelDuty: {
    type: 'indirect', // Classification as indirect tax
    petrol: 0.5295, // per liter, updated to 52.95p as of 2025
    diesel: 0.5295, // per liter
    lpg: 0.3161, // per liter
    biofuel: 0.5295 // per liter (same as petrol)
  },

  // Vehicle Excise Duty (road tax) - updated for 2025
  ved: {
    type: 'direct', // Classification as direct tax
    petrol: 165, // Standard rate for cars registered after April 2017
    diesel: 165, // Standard rate for diesel cars
    hybrid: 165, // Standard rate for hybrids 
    electric: 165, // New rate for EVs starting from 2025
    motorcycle: 101, // For a typical motorcycle (varies by engine size)
    expensiveSurcharge: 425, // Additional charge for vehicles over £40,000 for 5 years
    // First year rates vary by CO2 emissions and are handled separately
    firstYearRates: [
      { co2: 0, rate: 10 }, // 0g/km (EVs) - £10
      { co2: 50, rate: 30 }, // 1-50g/km - £30
      { co2: 75, rate: 130 }, // 51-75g/km - £130
      { co2: 90, rate: 165 }, // 76-90g/km - £165
      { co2: 100, rate: 185 }, // 91-100g/km - £185
      { co2: 110, rate: 205 }, // 101-110g/km - £205
      { co2: 130, rate: 240 }, // 111-130g/km - £240
      { co2: 150, rate: 260 }, // 131-150g/km - £260
      { co2: 170, rate: 570 }, // 151-170g/km - £570
      { co2: 190, rate: 955 }, // 171-190g/km - £955
      { co2: 225, rate: 1420 }, // 191-225g/km - £1,420
      { co2: 255, rate: 2015 }, // 226-255g/km - £2,015
      { co2: 999, rate: 2365 } // Over 255g/km - £2,365
    ]
  },

  // TV License
  tvLicense: {
    type: 'direct', // Classification as direct tax
    annualFee: 174.50
  },

  // Insurance Premium Tax
  ipt: {
    type: 'indirect', // Classification as indirect tax
    rate: 0.12, // 12% standard rate
    higherRate: 0.20 // 20% higher rate for travel insurance
  },

  // Air Passenger Duty (updated for 2025)
  airPassengerDuty: {
    type: 'indirect', // Classification as indirect tax
    domestic: {
      economy: 7,
      premium: 14
    },
    shortHaul: { // Band A (0-2,000 miles)
      economy: 13,
      premium: 28
    },
    longHaul: { // Band B (2,001-5,500 miles)
      economy: 90,
      premium: 216
    },
    ultraLongHaul: { // Band C (over 5,500 miles)
      economy: 94,
      premium: 224
    }
  },

  // Transport charges and fines
  transportCharges: {
    type: 'direct', // Classification as direct tax
    congestionCharge: 15, // London congestion charge daily rate
    ulezCharge: 12.50, // London ULEZ daily rate
    cleanAirZones: { // Other UK Clean Air Zones
      birmingham: 8,
      bath: 9,
      bristol: 9,
      portsmouth: 10,
      bradford: 9,
      sheffield: 10,
      newcastle: 12.50
    },
    dartfordCrossing: 2.50, // Dartford Crossing charge
    m6Toll: 7.10, // M6 Toll typical rate
    merseyTunnels: 2.00, // Mersey Tunnels typical rate
    cliftonSuspensionBridge: 1.00, // Bristol toll bridge
    // Add other common UK tolls as needed
    parkingFines: {
      lowRate: 80, // Outside London typical
      highRate: 130 // London typical
    },
    buslaneFineMid: 70, // Typical bus lane fine outside London
    buslaneFineLondon: 160, // London bus lane fine
    speedingFine: 100, // Typical speeding fine
    noInsuranceFine: 300 // Typical fine for no insurance
  },

  // Alcohol duty (simplified)
  alcoholDuty: {
    type: 'indirect', // Classification as indirect tax
    rate: 0.25 // Estimated percentage of alcohol spend
  },

  // Tobacco duty (simplified)
  tobaccoDuty: {
    type: 'indirect', // Classification as indirect tax
    rate: 0.80 // Estimated percentage of tobacco spend
  },

  // Student loan repayment rates
  studentLoan: {
    type: 'direct', // Classification as direct tax
    plan1Threshold: 22015,
    plan1Rate: 0.09,
    plan2Threshold: 27295,
    plan2Rate: 0.09,
    plan4Threshold: 27660,
    plan4Rate: 0.09,
    plan5Threshold: 21000,
    plan5Rate: 0.06
  },

  // New taxes to add

  // Stamp Duty Land Tax (SDLT) for property purchases
  stampDuty: {
    type: 'direct', // Classification as direct tax
    thresholds: [
      { threshold: 250000, rate: 0.00 }, // No tax up to £250,000
      { threshold: 925000, rate: 0.05 }, // 5% on portion between £250,001 and £925,000
      { threshold: 1500000, rate: 0.10 }, // 10% on portion between £925,001 and £1,500,000
      { threshold: Infinity, rate: 0.12 } // 12% on portion above £1,500,000
    ],
    firstTimeBuyerThresholds: [
      { threshold: 425000, rate: 0.00 }, // No tax up to £425,000 for first-time buyers
      { threshold: 625000, rate: 0.05 }, // 5% on portion between £425,001 and £625,000
      { threshold: 925000, rate: 0.05 }, // 5% on portion between £625,001 and £925,000
      { threshold: 1500000, rate: 0.10 }, // 10% on portion between £925,001 and £1,500,000
      { threshold: Infinity, rate: 0.12 } // 12% on portion above £1,500,000
    ]
  },

  // Capital Gains Tax
  capitalGainsTax: {
    type: 'direct', // Classification as direct tax
    basicRatePayer: 0.10, // 10% for basic rate taxpayers (18% for residential property)
    higherRatePayer: 0.20, // 20% for higher rate taxpayers (28% for residential property)
    residentialPropertyBasic: 0.18, // 18% for residential property (basic rate)
    residentialPropertyHigher: 0.28, // 28% for residential property (higher rate)
    annualExemptAmount: 3000 // Annual exempt amount (reduced from £12,300 in previous years)
  },

  // Inheritance Tax
  inheritanceTax: {
    type: 'direct', // Classification as direct tax
    threshold: 325000, // Nil-rate band
    residenceNilRateBand: 175000, // Additional threshold for main residence
    rate: 0.40 // 40% on value above threshold
  },

  // Corporation Tax
  corporationTax: {
    type: 'direct', // Classification as direct tax
    rate: 0.25, // 25% standard rate
    smallProfitsRate: 0.19 // 19% for profits under £50,000
  },

  // Dividend Tax
  dividendTax: {
    type: 'direct', // Classification as direct tax
    allowance: 500, // Tax-free dividend allowance
    basicRate: 0.0875, // 8.75% for basic rate taxpayers
    higherRate: 0.3375, // 33.75% for higher rate taxpayers
    additionalRate: 0.3935 // 39.35% for additional rate taxpayers
  },

  // Plastic Packaging Tax
  plasticPackagingTax: {
    type: 'indirect', // Classification as indirect tax
    rate: 210.82 // £210.82 per tonne of plastic packaging with less than 30% recycled content
  },

  // Landfill Tax
  landfillTax: {
    type: 'indirect', // Classification as indirect tax
    standardRate: 102.10, // £102.10 per tonne for standard rate
    lowerRate: 3.25 // £3.25 per tonne for lower rate (inert waste)
  },

  // Betting and Gaming Duties
  gamblingDuty: {
    type: 'indirect', // Classification as indirect tax
    generalBettingDuty: 0.15, // 15% on betting profits
    remoteBettingDuty: 0.21, // 21% on remote betting profits
    gamingDuty: [
      { threshold: 2584000, rate: 0.15 }, // 15% on first £2,584,000
      { threshold: 4436000, rate: 0.20 }, // 20% on next £1,852,000
      { threshold: 7513000, rate: 0.30 }, // 30% on next £3,077,000
      { threshold: 14340000, rate: 0.40 }, // 40% on next £6,827,000
      { threshold: Infinity, rate: 0.50 } // 50% on remainder
    ]
  }
};
