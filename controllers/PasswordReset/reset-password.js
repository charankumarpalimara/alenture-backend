const mySqlpool = require('../../db');

const userTypes = [
    { table: 'admin', emailField: 'email', passwordField: 'password' },
    { table: 'listofhob', emailField: 'email', passwordField: 'passwords' },
    { table: 'listofcrm', emailField: 'email', passwordField: 'passwords' },
    { table: 'listofcm', emailField: 'email', passwordField: 'passwords' },
];

const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        for (const userType of userTypes) {
            const [user] = await mySqlpool.query(
                `SELECT * FROM ${userType.table} WHERE ${userType.emailField} = ?`,
                [email]
            );
            if (user && user.length > 0) {
                await mySqlpool.query(
                    `UPDATE ${userType.table} SET ${userType.passwordField} = ? WHERE ${userType.emailField} = ?`,
                    [password, email]
                );
                res.status(200).json({ message: "Password updated successfully" });
                console.log(`Password updated for ${userType.table}`);
                return;
            }
        }

        res.status(404).json({ error: "User not found" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { resetPassword };