// Email section configuration and functionality
export function createEmailSection() {
  const emailSection = document.createElement('div');
  emailSection.className = 'form-section email-section';

  // Add section title
  const emailTitle = document.createElement('h3');
  emailTitle.textContent = 'Get Your Report (Optional)';
  emailSection.appendChild(emailTitle);

  // Add email field
  const emailGroup = document.createElement('div');
  emailGroup.className = 'form-group';
  emailGroup.innerHTML = `
    <label for="email">Email address</label>
    <input type="email" id="email" name="email" placeholder="Enter your email address">
    <div class="help-text">We don't store your data. This is only used to send your one-time report.</div>
    <button type="button" id="send-report-btn" class="send-report-btn">Send Me A Copy</button>
  `;
  emailSection.appendChild(emailGroup);

  // Add disclaimer
  const disclaimer = document.createElement('div');
  disclaimer.className = 'calculator-disclaimer';
  disclaimer.innerHTML = `
    <p>This calculator is for educational purposes only. No data is collected or stored.</p>
  `;
  emailSection.appendChild(disclaimer);

  return emailSection;
}

// Function to send email report using Resend
export function sendEmailReport() {
  const email = document.getElementById('email').value;

  if (!email) {
    alert('Please enter your email address to receive the report.');
    return;
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  // Get form data and tax estimates
  const formData = getFormData();
  const taxEstimates = calculateTaxEstimates(formData);

  // Create report content
  const reportData = {
    email: email,
    taxEstimates: taxEstimates,
    formData: formData
  };

  // Show sending state
  const sendButton = document.getElementById('send-report-btn');
  const originalText = sendButton.textContent;
  sendButton.textContent = 'Sending...';
  sendButton.disabled = true;

  // This would normally call an API endpoint that uses Resend to send the email
  // For now we'll just simulate it with a timeout
  setTimeout(() => {
    console.log('Sending report to:', email, reportData);
    alert(`Your tax footprint report would be sent to ${email}. In a production version, this would use Resend to deliver your report.`);

    // Reset button state
    sendButton.textContent = originalText;
    sendButton.disabled = false;
  }, 1500);

  // In a real implementation, you would call your backend API:
  /*
  fetch('/api/send-tax-report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reportData),
  })
  .then(response => response.json())
  .then(data => {
    alert('Your tax footprint report has been sent to your email.');
    sendButton.textContent = originalText;
    sendButton.disabled = false;
  })
  .catch(error => {
    console.error('Error sending report:', error);
    alert('There was an error sending your report. Please try again.');
    sendButton.textContent = originalText;
    sendButton.disabled = false;
  });
  */
}

// These functions are imported from other files
import { getFormData, calculateTaxEstimates } from './formUtils';
