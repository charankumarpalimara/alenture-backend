const mySqlpool = require('../../db');
const sendMail = require('../Mails-Service/sendMail');
const ForgotTemplate = require("../../EmailsTemplates/forgot-password");

const hobForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Received data:", req.body);

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if the CM exists
    const [hob] = await mySqlpool.query("SELECT * FROM listofhob WHERE email = ?", [email]);
    if (!hob || hob.length === 0) {
      return res.status(404).json({ error: "HOB not found" });
    }

    const firstname = hob[0].firstname;
    const hobid = hob[0].hobid;

    // Generate a reset link (for production, use a
     const resetLink = `https://cem.alantur.ai/hob/reset-password/${hobid}`;

    // Send the reset email
    await sendMail({
      to: email,
      subject: 'Reset Your HOB Password',
      text: `Hello ${firstname},\n\nYou requested a password reset. Click the link below to reset your password:\n${resetLink}`,
      html: ForgotTemplate({firstname, email, resetLink }),
    });

    res.status(200).json({ message: "Password reset email sent successfully" });
    console.log("Password reset email sent to:", email);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { hobForgotPassword };