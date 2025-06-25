const express = require('express');
const mySqlpool = require('../../db');
const nodemailer = require('nodemailer');

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



// function generateOTP() {
//     return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
// }

// async function sendOTPEmail(email, otp, recentPassword = null) {
//     const transporter = nodemailer.createTransport({
//   host: 'smtp-relay.brevo.com',
//   port: 587,
//   secure: false,
//   auth: {
//     user: '7953bd001@smtp-brevo.com',
//     pass: 'gyEcFL73TmwSUDA9', // Replace with your actual SMTP password
//   },
//     });

//     let textContent = `Your OTP code for login is: ${otp}\n\n`;
//     let htmlContent = `<p>Your OTP code for login is: <b>${otp}</b></p>`;

//     if (recentPassword) {
//         textContent += `\nYour recent password: ${recentPassword}\n`;
//         htmlContent += `<p>Your recent password: <b>${recentPassword}</b></p>`;
//     }

//     textContent += `\nThis OTP is valid for 5 minutes. Please do not share this code with anyone.\nIf you did not request this login, please ignore this email.`;
//     htmlContent += `<p>This OTP is valid for 5 minutes. <b>Do not share this code with anyone.</b></p><p>If you did not request this login, please ignore this email.</p>`;

//     await transporter.sendMail({
//         from: '" Alentue " <alantur.ai2000@gmail.com>',
//         to: email,
//         subject: 'Your OTP Code for Login',
//         text: textContent,
//         html: htmlContent,
//     });
// }


// const HobLogin = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(400).json({ error: "Email and password are required" });
//         }

//         const [data] = await mySqlpool.query(
//             "SELECT * FROM listofhob WHERE email = ? AND passwords = ?",
//             [email, password]
//         );

//         if (!data || data.length === 0) {
//             return res.status(401).json({ error: "Invalid email or password" });
//         }

//         // Generate OTP and store it (with expiry)
//         const otp = generateOTP();
//         otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // 5 min expiry

//         await sendOTPEmail(userEmail, otp);

//         res.status(200).json({ message: "OTP sent to your email" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };


// const HobLoginVerifyOtp = async (req, res) => {
//     try {
//         const { email, otp } = req.body;
//         if (!email || !otp) {
//             return res.status(400).json({ error: "Email and OTP are required" });
//         }

//         const record = otpStore[email];
//         if (!record || record.otp !== otp || Date.now() > record.expires) {
//             return res.status(401).json({ error: "Invalid or expired OTP" });
//         }

//         // OTP is valid, remove it from store
//         delete otpStore[email];

//         // Fetch user data
//         const [data] = await mySqlpool.query(
//             "SELECT * FROM listofhob WHERE email = ?",
//             [email]
//         );

//         const token = jwt.sign(
//             { id: data[0].id, email: data[0].email },
//             process.env.JWT_SECRET_KEY,
//             { expiresIn: '1h' }
//         );

//         const updatedData = data.map((record) => ({
//             ...record,
//             imageUrl: `${req.protocol}://${req.get('host')}/uploads/hob/${record.extraind1}`,
//         }));

//         res.status(200).json({
//             message: "Login successful",
//             token,
//             data: updatedData[0],
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };
module.exports = { HobLogin };