const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: '7953bd001@smtp-brevo.com',
    pass: 'gyEcFL73TmwSUDA9', // Replace with your actual SMTP password
  },
});

async function sendMail({ to, subject, text, html }) {
  return transporter.sendMail({
    from: '"Alentur " <alantur.ai2000@gmail.com>',
    to,
    subject,
    text,
    html,
  }).then(info => {
  console.log('Mail sent:', info);
}).catch(err => {
  console.error('Mail error:', err);
});
}

module.exports = sendMail;