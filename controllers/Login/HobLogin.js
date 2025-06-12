const express = require('express');
const mySqlpool = require('../../db');

const jwt = require('jsonwebtoken'); // Import JWT library
const dotenv = require('dotenv'); // Import dotenv to access environment variables
dotenv.config(); // Load environment variables

const HobLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("HobLogin request body:", req.body);

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const [data] = await mySqlpool.query(
            "SELECT * FROM listofhob WHERE email = ? AND passwords = ?",
            [email, password]
        );

        if (!data || data.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: data[0].id, email: data[0].email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        const updatedData = data.map((record) => ({
            ...record,
            imageUrl: `${req.protocol}://${req.get('host')}/uploads/hob/${record.extraind1}`,
        }));

        res.status(200).json({
            message: "Login successful",
            token,
            data: updatedData[0],
        });
        console.log("Login successful");
        console.log({ data: data[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
module.exports = { HobLogin };