const AdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please provide username and password" });
        }

        let emailFound = false;

        for (const userType of userTypes) {
            // Check if email exists in this table
            const [emailRows] = await mySqlpool.query(
                `SELECT * FROM ${userType.table} WHERE email = ?`,
                [email]
            );
            if (emailRows && emailRows.length > 0) {
                emailFound = true;
                // Now check if password matches
                const [users] = await mySqlpool.query(
                    `SELECT * FROM ${userType.table} WHERE email = ? AND passwords = ?`,
                    [email, password]
                );
                if (users && users.length > 0) {
                    const user = users[0];
                    const token = jwt.sign(
                        { id: user[userType.idField], email: user.email, role: userType.table },
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: '1h' }
                    );
                    const userWithImage = {
                        ...user,
                        imageUrl: user[userType.imageField]
                            ? `${req.protocol}://${req.get('host')}/uploads/${userType.imagePath}/${user[userType.imageField]}`
                            : null,
                    };
                    return res.status(200).json({
                        message: "Login successful",
                        token,
                        data: userWithImage,
                        extraind10: userType,
                    });
                }
            }
        }

        if (emailFound) {
            return res.status(401).json({ error: "Invalid username or password" });
        } else {
            return res.status(404).json({ error: "User not found" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { AdminLogin };