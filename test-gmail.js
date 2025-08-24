import nodemailer from 'nodemailer';

// === FILL THESE IN ===
const EMAIL_USER = 'atrvictor@gmail.com'; // <-- your Gmail address
const EMAIL_PASS = 'ozhw ymfc pnyz lwnc';    // <-- your 16-char app password
// ====================

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const mailOptions = {
  from: EMAIL_USER,
  to: EMAIL_USER, // send to yourself
  subject: 'Test Email from Nodemailer',
  text: 'If you received this, your Gmail app password works!',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('FAILED:', error);
  } else {
    console.log('SUCCESS! Email sent:', info.response);
  }
}); 