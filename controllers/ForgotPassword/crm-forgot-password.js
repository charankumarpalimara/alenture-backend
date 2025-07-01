const mySqlpool = require('../../db');
const sendMail = require('../Mails-Service/sendMail');
const ForgotTemplate = require("../../EmailsTemplates/forgot-password");

const crmForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Received data:", req.body);

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if the CM exists
    const [crm] = await mySqlpool.query("SELECT * FROM listofcrm WHERE email = ?", [email]);
    if (!crm || crm.length === 0) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const firstname = crm[0].firstname;
    const crmid = crm[0].crmid;

    // Generate a reset link (for production, use a
     const resetLink = `https://cem.alantur.ai/crm/reset-password/${crmid}`;

    // Send the reset email
    await sendMail({
      to: email,
      subject: 'Reset Your CRM Password',
      text: `Hello ${firstname},\n\nYou requested a password reset. Click the link below to reset your password:\n${resetLink}`,
      html: ForgotTemplate({ firstname, email, resetLink }),
    });

    res.status(200).json({ message: "Password reset email sent successfully" });
    console.log("Password reset email sent to:", email);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { crmForgotPassword };