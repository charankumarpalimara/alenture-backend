const mySqlpool = require("../../db");
// const db = require('./db');
const express = require("express");
const jwt = require("jsonwebtoken"); // Import JWT library
const dotenv = require("dotenv"); // Import dotenv to access environment variables
dotenv.config(); // Load environment variables

const AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide username and password" });
    }

    const [data] = await mySqlpool.query(
      "SELECT * FROM admin WHERE email = ? AND passwords = ?",
      [email, password]
    );
    if (!data || data.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    console.log("data", data);

    // Generate JWT token
    const token = jwt.sign(
      { id: data[0].id, email: data[0].email }, // Payload
      "secret", // Secret key
      { expiresIn: "1h" } // Token expiration
    );

    const updatedData = data.map((record) => ({
      ...record,
      imageUrl: `${req.protocol}://${req.get("host")}/uploads/admin/${
        record.extraind1
      }`, // Construct image URL
    }));

    res.status(200).json({
      message: "Login successful",
      token, // Include the token in the response
      data: updatedData[0],
    });
    console.log("Login successful");
    console.log({ data: data[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { AdminLogin };
