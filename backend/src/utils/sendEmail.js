const nodemailer = require('nodemailer');

async function sendEmail(to, subject, html) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    throw new Error('Missing SMTP configuration');
  }

  const transporter = nodemailer.createTransport({
    host:     process.env.SMTP_HOST,
    port:     Number(process.env.SMTP_PORT) || 587,
    secure:   process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Build the `from` field as an object so nodemailer sets both
  // the envelope-from (mail FROM) and header-from correctly.
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
  const fromName  = process.env.SMTP_FROM_NAME  || '';
  const from = fromName
    ? { name: fromName, address: fromEmail }
    : fromEmail;

  const info = await transporter.sendMail({
    from,   // object or string
    to,
    subject,
    html,
  });

  console.log('📧 Email sent:', info.messageId);
  return info;
}

module.exports = sendEmail;
