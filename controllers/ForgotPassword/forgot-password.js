const mySqlpool = require('../../db');
const sendMail = require('../Mails-Service/sendMail');
const ForgotTemplate = require("../../EmailsTemplates/forgot-password");

const userTypes = [
  { table: 'admin', idField: 'id', nameField: 'firstname', idName: 'id', resetPath: 'admin' },
  { table: 'listofhob', idField: 'hobid', nameField: 'firstname', idName: 'hobid', resetPath: 'hob' },
  { table: 'listofcrm', idField: 'crmid', nameField: 'firstname', idName: 'crmid', resetPath: 'crm' },
  { table: 'listofcm', idField: 'cmid', nameField: 'firstname', idName: 'cmid', resetPath: 'cm' },
];

const universalForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    for (const userType of userTypes) {
      const [users] = await mySqlpool.query(
        `SELECT * FROM ${userType.table} WHERE email = ?`,
        [email]
      );
      if (users && users.length > 0) {
        const user = users[0];
        const firstname = user[userType.nameField];
        const userId = user[userType.idField];
        // You can customize the reset link per role if needed
        const resetLink = `https://cem.alantur.ai/reset-password/${email}`;

        await sendMail({
          to: email,
          subject: `Reset Your ${userType.resetPath.toUpperCase()} Password`,
          text: `Hello ${firstname},\n\nYou requested a password reset. Click the link below to reset your password:\n${resetLink}`,
          html: ForgotTemplate({ firstname, email, resetLink }),
        });

        res.status(200).json({ message: "Password reset email sent successfully" });
        console.log(`Password reset email sent to: ${email} for role: ${userType.resetPath}`);
        return;
      }
    }

    // If not found in any table
    return res.status(404).json({ error: "User Not Found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { universalForgotPassword };