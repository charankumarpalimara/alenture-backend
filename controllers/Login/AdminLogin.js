const mySqlpool = require('../../db');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const userTypes = [
    {
        table: 'admin',
        idField: 'id',
        imageField: 'extraind1',
        imagePath: 'admin',
    },
    {
        table: 'listofhob',
        idField: 'hobid',
        imageField: 'extraind1',
        imagePath: 'hob',
    },
    {
        table: 'listofcrm',
        idField: 'crmid',
        imageField: 'extraind1',
        imagePath: 'crm',
    },
    {
        table: 'listofcm',
        idField: 'cmid',
        imageField: 'extraind1',
        imagePath: 'cm',
    },
];

const AdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login request received with email:",req.body);
        if (!email || !password) {
            return res.status(400).json({ error: "Please provide username and password" });
        }

        for (const userType of userTypes) {
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

        // If no user found in any table
        return res.status(401).json({ error: "Invalid username or password" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { AdminLogin };