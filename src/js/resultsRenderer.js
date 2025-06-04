// Import Chart.js
import Chart from 'chart.js/auto';

// Format currency
function formatCurrency(amount) {
  // Handle negative values with a minus sign before the currency symbol
  if (amount < 0) {
    return '-' + new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amount));
  }
  
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Format percentage
function formatPercentage(percentage) {
  return new Intl.NumberFormat('en-GB', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(percentage / 100);
}

// Create tax breakdown chart
function createTaxBreakdownChart(taxBreakdown) {
  const ctx = document.getElementById('tax-breakdown-chart').getContext('2d');

  // Prepare data
  const labels = [
    'Income Tax',
    'National Insurance',
    'Council Tax',
    'VAT',
    'Fuel Duty',
    'Vehicle Tax',
    'TV License',
    'Alcohol & Tobacco',
    'Air Passenger Duty',
    'Insurance Tax',
    'Student Loan',
    'Landlord Tax Passthrough'
  ];

  const data = [
    taxBreakdown.incomeTax.amount,
    taxBreakdown.nationalInsurance.amount,
    taxBreakdown.councilTax.amount,
    taxBreakdown.vat.amount,
    taxBreakdown.fuelDuty.amount,
    taxBreakdown.ved.amount,
    taxBreakdown.tvLicense.amount,
    taxBreakdown.alcoholTobaccoDuty.amount,
    taxBreakdown.airPassengerDuty.amount,
    taxBreakdown.insurancePremiumTax.amount,
    taxBreakdown.studentLoan.amount,
    taxBreakdown.landlordTaxPassthrough ? taxBreakdown.landlordTaxPassthrough.amount : 0
  ];

  // Prepare background colors based on tax type (direct or indirect)
  const backgroundColors = [
    taxBreakdown.incomeTax.type === 'direct' ? '#e74c3c' : '#3498db',
    taxBreakdown.nationalInsurance.type === 'direct' ? '#c0392b' : '#2980b9',
    taxBreakdown.councilTax.type === 'direct' ? '#e67e22' : '#1abc9c',
    taxBreakdown.vat.type === 'direct' ? '#d35400' : '#16a085',
    taxBreakdown.fuelDuty.type === 'direct' ? '#f39c12' : '#27ae60',
    taxBreakdown.ved.type === 'direct' ? '#f1c40f' : '#2ecc71',
    taxBreakdown.tvLicense.type === 'direct' ? '#9b59b6' : '#8e44ad',
    taxBreakdown.alcoholTobaccoDuty.type === 'direct' ? '#6c3483' : '#5b2c6f',
    taxBreakdown.airPassengerDuty.type === 'direct' ? '#2c3e50' : '#34495e',
    taxBreakdown.insurancePremiumTax.type === 'direct' ? '#7f8c8d' : '#95a5a6',
    taxBreakdown.studentLoan.type === 'direct' ? '#bdc3c7' : '#ecf0f1',
    taxBreakdown.landlordTaxPassthrough && taxBreakdown.landlordTaxPassthrough.type === 'direct' ? '#e74c3c' : '#3498db'
  ];

  // Create chart
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw;
              const percentage = (value / context.dataset.data.reduce((a, b) => a + b, 0)) * 100;
              const index = context.dataIndex;
              const taxTypes = [
                taxBreakdown.incomeTax.type,
                taxBreakdown.nationalInsurance.type,
                taxBreakdown.councilTax.type,
                taxBreakdown.vat.type,
                taxBreakdown.fuelDuty.type,
                taxBreakdown.ved.type,
                taxBreakdown.tvLicense.type,
                taxBreakdown.alcoholTobaccoDuty.type,
                taxBreakdown.airPassengerDuty.type,
                taxBreakdown.insurancePremiumTax.type,
                taxBreakdown.studentLoan.type,
                taxBreakdown.landlordTaxPassthrough ? taxBreakdown.landlordTaxPassthrough.type : 'indirect'
              ];
              const taxType = taxTypes[index] === 'direct' ? 'Direct Tax' : 'Indirect Tax';
              return [
                `${label}: ${formatCurrency(value)} (${percentage.toFixed(1)}%)`,
                `Type: ${taxType}`
              ];
            }
          }
        }
      }
    }
  });
}

// Create direct vs indirect tax chart
function createTaxTypeChart(directTaxTotal, indirectTaxTotal) {
  const ctx = document.getElementById('tax-type-chart').getContext('2d');

  // Prepare data
  const labels = ['Direct Taxes', 'Indirect Taxes'];
  const data = [directTaxTotal, indirectTaxTotal];

  // Create chart
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          '#e74c3c', // Direct taxes
          '#3498db'  // Indirect taxes
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw;
              const total = data.reduce((a, b) => a + b, 0);
              const percentage = (value / total) * 100;
              return `${label}: ${formatCurrency(value)} (${percentage.toFixed(1)}%)`;
            }
          }
        }
      }
    }
  });
}

// Create projection chart
function createProjectionChart(results) {
  const ctx = document.getElementById('projection-chart').getContext('2d');

  // Calculate yearly projections
  const yearlyData = [];
  const currentYear = new Date().getFullYear();

  // Past 5 years (simple division for this demo)
  for (let i = 5; i > 0; i--) {
    yearlyData.push({
      year: currentYear - i,
      tax: results.pastFiveYearsTax / 5
    });
  }

  // Current year
  yearlyData.push({
    year: currentYear,
    tax: results.totalAnnualTax
  });

  // Future 5 years (with 2% annual increase)
  for (let i = 1; i <= 5; i++) {
    yearlyData.push({
      year: currentYear + i,
      tax: results.totalAnnualTax * Math.pow(1.02, i)
    });
  }

  // Prepare data for chart
  const labels = yearlyData.map(item => item.year);
  const data = yearlyData.map(item => item.tax);

  // Create chart
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Annual Tax',
        data: data,
        backgroundColor: [
          // Past years
          'rgba(52, 152, 219, 0.5)',
          'rgba(52, 152, 219, 0.5)',
          'rgba(52, 152, 219, 0.5)',
          'rgba(52, 152, 219, 0.5)',
          'rgba(52, 152, 219, 0.5)',
          // Current year
          'rgba(231, 76, 60, 0.8)',
          // Future years
          'rgba(243, 156, 18, 0.5)',
          'rgba(243, 156, 18, 0.5)',
          'rgba(243, 156, 18, 0.5)',
          'rgba(243, 156, 18, 0.5)',
          'rgba(243, 156, 18, 0.5)'
        ],
        borderColor: [
          // Past years
          'rgba(52, 152, 219, 1)',
          'rgba(52, 152, 219, 1)',
          'rgba(52, 152, 219, 1)',
          'rgba(52, 152, 219, 1)',
          'rgba(52, 152, 219, 1)',
          // Current year
          'rgba(231, 76, 60, 1)',
          // Future years
          'rgba(243, 156, 18, 1)',
          'rgba(243, 156, 18, 1)',
          'rgba(243, 156, 18, 1)',
          'rgba(243, 156, 18, 1)',
          'rgba(243, 156, 18, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatCurrency(value);
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Tax: ${formatCurrency(context.raw)}`;
            }
          }
        },
        legend: {
          display: false
        }
      }
    }
  });
}

// Render results
export function renderResults(results) {
  // Update summary values
  document.getElementById('past-total').textContent = formatCurrency(results.pastFiveYearsTax);
  document.getElementById('future-total').textContent = formatCurrency(results.futureFiveYearsTax);
  document.getElementById('effective-rate').textContent = formatPercentage(results.effectiveTaxRate);
  
  // Add net income to the results summary if it exists
  if (results.netIncome !== undefined) {
    // Find the results summary container
    const resultsSummary = document.querySelector('.results-summary');
    
    // Check if we already have a net income card
    let netIncomeCard = document.getElementById('net-income-card');
    
    if (!netIncomeCard) {
      // Create a new card for net income
      netIncomeCard = document.createElement('div');
      netIncomeCard.id = 'net-income-card';
      netIncomeCard.className = 'result-card';
      
      // Add heading
      const heading = document.createElement('h3');
      heading.textContent = 'Net Income';
      netIncomeCard.appendChild(heading);
      
      // Add amount div
      const amountDiv = document.createElement('div');
      amountDiv.id = 'net-income';
      amountDiv.className = 'amount';
      netIncomeCard.appendChild(amountDiv);
      
      // Add description
      const description = document.createElement('p');
      description.textContent = 'After all taxes';
      netIncomeCard.appendChild(description);
      
      // Add to results summary
      resultsSummary.appendChild(netIncomeCard);
    }
    
    // Update the net income value
    const netIncomeElement = document.getElementById('net-income');
    netIncomeElement.textContent = formatCurrency(results.netIncome);
    
    // Add negative class if net income is negative
    if (results.netIncome < 0) {
      netIncomeElement.classList.add('negative');
    } else {
      netIncomeElement.classList.remove('negative');
    }
  }

  // Update direct and indirect tax values
  document.getElementById('direct-tax-total').textContent = formatCurrency(results.directTaxTotal);
  document.getElementById('indirect-tax-total').textContent = formatCurrency(results.indirectTaxTotal);
  document.getElementById('direct-tax-percentage').textContent = formatPercentage(results.directTaxPercentage);
  document.getElementById('indirect-tax-percentage').textContent = formatPercentage(results.indirectTaxPercentage);

  // Update insight
  document.getElementById('insight-amount').textContent = formatCurrency(results.pastFiveYearsTax + results.futureFiveYearsTax);

  // Create charts
  createTaxBreakdownChart(results.taxBreakdown);
  createTaxTypeChart(results.directTaxTotal, results.indirectTaxTotal);
  createProjectionChart(results);
}
