const nodemailer = require('nodemailer');
const { prepare } = require('../../db');
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: `${process.env.Mail_Host}`,
  port: process.env.Mail_Port, // Replace with your actual SMTP port
  secure: false,
  auth: {
    user: `${process.env.Mail_User}`, // Replace with your actual SMTP email   
    pass: `${process.env.Mail_Pass}`, // Replace with your actual SMTP password
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