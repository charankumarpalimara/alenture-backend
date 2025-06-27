const mySqlpool = require('../../db');
const sendMail = require('../Mails-Service/sendMail');
const ForgotTemplate = require("../../EmailsTemplates/forgot-password");

const cmForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Received data:", req.body);

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if the CM exists
    const [cm] = await mySqlpool.query("SELECT * FROM listofcm WHERE email = ?", [email]);
    if (!cm || cm.length === 0) {
      return res.status(404).json({ error: "CM not found" });
    }

    const firstname = cm[0].firstname;
    const cmid = cm[0].cmid;

    // Generate a reset link (for production, use a
     const resetLink = `https://cem.alantur.ai/reset-password/${cmid}`;

    // Send the reset email
    await sendMail({
      to: email,
      subject: 'Reset Your CM Password',
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

module.exports = { cmForgotPassword };