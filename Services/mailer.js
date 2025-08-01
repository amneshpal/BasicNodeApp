const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

// Set up transporter for nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Can be replaced with another SMTP service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send reset email
const sendMail = async (to, subject, templateData) => {
  const templatePath = path.join(__dirname, '../views/resetPasswordEmailTemplate.ejs');

  // Render the EJS template for the email
  const htmlContent = await ejs.renderFile(templatePath, templateData);

  const mailOptions = {
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }
};

module.exports = { sendMail };
