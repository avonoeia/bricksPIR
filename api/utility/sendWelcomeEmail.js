const nodemailer = require('nodemailer');
require('dotenv').config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send HTML email
async function sendWelcomeEmail(recipientEmail, name, password) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: 'Welcome to BricksPIR',
    html: `
      <p>Hey there, ${name.split(" ")[0]}</p>
      <p>Welcome to Bricks and Bridges' custom Progress Information Reporting portal. You can now log in using the login credentials below.</p>
      <p>
        Email: <strong>${recipientEmail}</strong><br />
        Password: <strong>${password}</strong>
      </p>
      <p>
        Best regards, <br />
        BricksPIR team.
      </p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('HTML email sent:', info.response);
  } catch (error) {
    console.error('HTML email sending error:', error);
  }
}

module.exports = { sendWelcomeEmail }