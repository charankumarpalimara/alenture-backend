const nodemailer = require('nodemailer');
// const { prepare } = require('../../db');
const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

// const transporter = nodemailer.createTransport({
//   host: `${process.env.Mail_Host}`,
//   port: process.env.Mail_Port, // Replace with your actual SMTP port
//   secure: false,
//   auth: {
//     user: `${process.env.Mail_User}`, // Replace with your actual SMTP email   
//     pass: `${process.env.Mail_Pass}`, // Replace with your actual SMTP password
//   },
// });


// async function sendMail({ to, subject, text, html }) {
//   return transporter.sendMail({
//     from: '"Alentur " <no_reply@alantur.ai>',
//     to,
//     subject,
//     text,
//     html,
//   }).then(info => {
//   console.log('Mail sent:', info);
// }).catch(err => {
//   console.error('Mail error:', err);
// });
// }


const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY; // Set your Brevo API key in .env

async function sendMail({ to, subject, text, html }) {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;
  sendSmtpEmail.sender = { name: 'Alantur', email: 'no_reply@alantur.ai' };
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.textContent = text;

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Mail sent:', data);
    return data;
  } catch (error) {
    console.error('Mail error:', error);
    throw error;
  }
}


// async function sendMailForForGotPassword({ to, subject, text, html }) {
//   const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

//   const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
//   sendSmtpEmail.subject = subject;
//   sendSmtpEmail.htmlContent = html;
//   sendSmtpEmail.sender = { name: 'Alantur', email: 'no_reply@alantur.ai' };
//   sendSmtpEmail.to = [{ email: to }];
//   sendSmtpEmail.textContent = text;

//   try {
//     const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
//     console.log('Mail sent:', data);
//     return data;
//   } catch (error) {
//     console.error('Mail error:', error);
//     throw error;
//   }
// }









module.exports = {sendMail};