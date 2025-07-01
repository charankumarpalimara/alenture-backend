const  express = require('express');
const mySqlpool = require('../../db');

const jwt = require('jsonwebtoken'); // Import JWT library
const dotenv = require('dotenv'); // Import dotenv to access environment variables
dotenv.config(); // Load environment variables

const CmLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("CmLogin request body:", req.body);
        if (!email || !password) {
            return res.status(400).json({ error: "Please provide username and password" });
        }


       const [data1] = await mySqlpool.query("SELECT * FROM listofcm WHERE email = ? ", [email]);
        if (!data1 || data1.length === 0) {
            return res.status(402).json({ error: "User not Found" });
        }


        const [data] = await mySqlpool.query("SELECT * FROM listofcm WHERE email = ? AND passwords = ?", [email, password]);
        if (!data || data.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: data[0].id, email: data[0].email }, // Payload
            process.env.JWT_SECRET_KEY, // Secret key
            { expiresIn: '1h' } // Token expiration
        );

        const updatedData = data.map((record) => ({
            ...record,
            imageUrl: `${req.protocol}://${req.get('host')}/uploads/cm/${record.extraind1}`, // Construct image URL
        }));

          
        res.status(200).json({ 
            message: "Login successful", 
            token, // Include the token in the response
           data : updatedData[0],
        });
        console.log("Login successful");
        console.log({ data: data[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}





module.exports = {CmLogin}



// cmlogin