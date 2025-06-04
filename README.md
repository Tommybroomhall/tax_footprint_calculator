<div align="center">

# 🧮 UK Tax Footprint Calculator

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF.svg)](https://vitejs.dev/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.4.0-FF6384.svg)](https://www.chartjs.org/)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)](#)
[![Version](https://img.shields.io/badge/Version-0.1.0-blue.svg)](#)

*Discover your true tax burden across the past 5 years and project the next 5*

[🚀 Live Demo](#demo) • [📖 Documentation](#usage) • [🛠️ Installation](#installation) • [🤝 Contributing](#contributing)

</div>

---

## � Introduction

The **UK Tax Footprint Calculator** is a simple web application that reveals the hidden reality of your total tax contribution to the UK government. Unlike simple income tax calculators, this tool analyzes your complete tax footprint across **17+ different tax categories** including direct taxes (Income Tax, National Insurance) and indirect taxes (VAT, fuel duty, council tax, and more).

Built with JavaScript and powered by real-time calculations, this tool demonstrates simple but quite advanced frontend development skills including modular architecture, live data visualization, and complex financial calculations being calculated on the fly in the browser. The application processes sensitive financial data entirely client-side, ensuring complete privacy while delivering professional-grade tax analysis.

**Key Technologies:** Vanilla JavaScript (ES6+), Vite build system, Chart.js for data visualization, CSS3 with responsive design, and modular component architecture.

---

## ✨ Features

- 🔍 **Comprehensive Tax Analysis** - Calculates 17+ UK tax types including hidden indirect taxes
- 📊 **Real-Time Visualization** - Live charts and meters update as you input data
- 🏠 **Smart Property Calculations** - Conditional logic for property owners vs. renters with Section 24 considerations
- 📈 **10-Year Projections** - Historical analysis (past 5 years) and future projections (next 5 years)
- 🔒 **Privacy-First Design** - All calculations performed client-side, no data stored or transmitted
- 📱 **Responsive Interface** - Optimized for desktop, tablet, and mobile devices
- 💾 **Export Functionality** - Download detailed PDF reports of your tax footprint
- ⚡ **Performance Optimized** - Modular architecture with code splitting and lazy loading

---

## 🎯 Demo

### Screenshots
![Tax Calculator Interface](images/calculator-interface.png)
*Main calculator interface with live tax meter*


### Live Demo
🌐 **[View Live Application](https://tax-footprint-calculator.vercel.app/)**

---

## 🚀 Installation

### Prerequisites
- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher) or **yarn**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tommybroomhall/tax_footprint_calculator.git
   cd tax_footprint_calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 💻 Usage

### Basic Usage

1. **Launch the calculator** by clicking "Estimate Your Tax Footprint"
2. **Complete each section:**
   - Income & Employment (salary, benefits, pension contributions)
   - Housing & Property (ownership status, council tax, rent/mortgage)
   - Transport & Vehicles (fuel consumption, vehicle tax, public transport)
   - Lifestyle & Consumption (spending patterns, VAT calculations)
   - Utilities & Energy (gas, electricity, green levies)
   - Investments & Other Taxes (capital gains, inheritance tax)

3. **View real-time calculations** in the live tax meter
4. **Analyze detailed results** with interactive charts and breakdowns
5. **Export your report** as a PDF for record-keeping

### Code Example

```javascript
// Example: Calculate income tax for a given salary
import { calculateIncomeTax } from './src/js/calculations/incomeTax.js';

const salary = 50000;
const taxYear = 2024;
const incomeTax = calculateIncomeTax(salary, taxYear);

console.log(`Income tax on £${salary}: £${incomeTax.total}`);
// Output: Income tax on £50000: £7540
```

---

## 🛠️ Technologies Used

| Technology | Version | Purpose |
|------------|---------|---------|
| **JavaScript (ES6+)** | Latest | Core application logic and calculations |
| **Vite** | ^6.3.5 | Build tool and development server |
| **Chart.js** | ^4.4.0 | Interactive data visualization |
| **CSS3** | Latest | Responsive styling and animations |
| **HTML5** | Latest | Semantic markup and accessibility |
| **Terser** | ^5.39.0 | JavaScript minification |
| **Node.js** | 16+ | Development environment |

---

## 📁 Project Structure

```
tax_footprint_calculator/
├── src/
│   ├── js/
│   │   ├── calculations/          # Tax calculation modules
│   │   │   ├── incomeTax.js      # Income tax calculations
│   │   │   ├── nationalInsurance.js
│   │   │   ├── vat.js            # VAT calculations
│   │   │   ├── councilTax.js     # Council tax logic
│   │   │   └── index.js          # Calculation exports
│   │   ├── formSections/         # Form component modules
│   │   │   ├── incomeEmployment.js
│   │   │   ├── housingProperty.js
│   │   │   └── index.js
│   │   ├── main.js               # Application entry point
│   │   ├── taxCalculator.js      # Main calculator logic
│   │   └── resultsRenderer.js    # Results visualization
│   └── styles/
│       └── main.css              # Application styles
├── dist/                         # Production build output
├── images/                       # Screenshots and assets
├── package.json                  # Dependencies and scripts
├── vite.config.js               # Vite configuration
├── vercel.json                  # Deployment configuration
└── README.md                    # Project documentation
```

### Key Files Explained
- **`src/js/calculations/`** - Modular tax calculation functions for each UK tax type
- **`src/js/formSections/`** - Reusable form components with conditional rendering
- **`vite.config.js`** - Optimized build configuration with code splitting
- **`vercel.json`** - Deployment settings for Vercel hosting

---

## 🧮 Tax Calculations

### Comprehensive Coverage

The calculator analyzes **17+ different UK tax categories** with sophisticated calculation logic:

#### 💼 Employment & Income Taxes
- **Income Tax** - Progressive rates (20%, 40%, 45%) with personal allowance
- **National Insurance** - Employee and employer contributions
- **Student Loan Repayments** - All plan types (1, 2, 4, 5) with correct thresholds
- **Pension Tax Relief** - Automatic allowance calculations

#### 🏠 Housing & Property Taxes
- **Council Tax** - Band-based calculations with regional variations
- **Stamp Duty Land Tax** - Progressive rates for property purchases
- **Capital Gains Tax** - Property disposal calculations
- **Landlord Tax Estimates** - Section 24 mortgage interest considerations

#### 🚗 Transport & Vehicle Taxes
- **Fuel Duty** - Real-time calculations based on consumption
- **Vehicle Excise Duty** - CO2-based rates for different vehicle types
- **Insurance Premium Tax** - Applied to vehicle insurance premiums
- **Air Passenger Duty** - Flight-based calculations

#### ⚡ Utilities & Energy Taxes
- **VAT on Energy** - Reduced rate (5%) calculations
- **Green Levies** - Environmental obligation costs
- **Climate Change Levy** - Business energy tax pass-through
- **TV License Fee** - Annual household charge

#### � Consumption Taxes
- **Value Added Tax (VAT)** - Standard (20%) and reduced rates
- **Alcohol Duties** - Beer, wine, and spirits calculations
- **Tobacco Duties** - Cigarette and rolling tobacco rates
- **Sugar Tax** - Soft Drinks Industry Levy

### Direct vs Indirect Classification

The application intelligently categorizes each tax:

- **🎯 Direct Taxes** - Paid directly to government (visible on payslips, bills)
- **🔍 Indirect Taxes** - Hidden in product prices (embedded in costs)

---

## 🎨 Architecture & Design

### Modular JavaScript Architecture

```javascript
// Clean separation of concerns
src/js/
├── calculations/     # Pure calculation functions
├── formSections/     # UI component modules
├── main.js          # Application orchestration
└── resultsRenderer.js # Data visualization
```

### Key Design Patterns

- **📦 Module Pattern** - Encapsulated calculation logic
- **🔄 Observer Pattern** - Real-time form updates
- **🏗️ Factory Pattern** - Dynamic form section generation
- **📊 Strategy Pattern** - Multiple tax calculation strategies

### Performance Optimizations

- **⚡ Code Splitting** - Lazy loading of calculation modules
- **🗜️ Minification** - Terser optimization for production
- **📱 Responsive Design** - Mobile-first CSS architecture
- **🎯 Efficient DOM** - Minimal re-renders with targeted updates

---

## 🤝 Contributing

We welcome contributions from developers of all skill levels! This project offers excellent opportunities to work with:

- **Financial calculations** and hidden tax logic 
- **Data visualization** with Chart.js
- **Modern JavaScript** (ES6+ modules)
- **Build tools** and optimization
- **Responsive web design**

### Getting Started

1. **Fork the repository** and create your feature branch
   ```bash
   git checkout -b feature/amazing-new-tax-calculation
   ```

2. **Follow the coding standards**
   - Use ES6+ syntax and modules
   - Add JSDoc comments for functions
   - Maintain the modular architecture
   - Write descriptive commit messages

3. **Test your changes**
   ```bash
   npm run dev    # Test in development
   npm run build  # Verify production build
   ```

4. **Submit a Pull Request** with:
   - Clear description of changes
   - Screenshots for UI changes
   - Updated documentation if needed

### Contribution Ideas

- 🆕 **New Tax Types** - Add missing UK taxes (e.g. stamp duty, capital gains)
- 🎨 **UI Improvements** - Enhanced user experience for actual users
- 📊 **Visualization** - New chart types or insights
- 🔧 **Performance** - Optimization opportunities
- 📱 **Mobile** - Enhanced mobile experience
- 🧪 **Testing** - Unit tests for calculations

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

---

## 👨‍💻 Contact & Professional Links

<div align="center">

### Interested in my work? Let's connect!

[![GitHub](https://img.shields.io/badge/GitHub-[YOUR-USERNAME]-181717?style=for-the-badge&logo=github)](https://github.com/Tommybroomhall)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-[YOUR-NAME]-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/tom-b-80ab43165/)
[![Email](https://img.shields.io/badge/Email-[YOUR-EMAIL]-D14836?style=for-the-badge&logo=gmail)](mailto:hello@tbroomhall.com)

**🚀 Open to opportunities in:**
- Full-Stack Development
- Financial Technology (FinTech)
- Data Visualization
- JavaScript/TypeScript Development
- Web Performance Optimization

</div>

---

## 🙏 Acknowledgements

- **UK Government** - Official tax rates and documentation
- **Chart.js Community** - Excellent visualization library
- **Vite Team** - Lightning-fast build tool
- **Open Source Community** - Inspiration and best practices

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

*Built with ❤️ and modern JavaScript*

</div>
