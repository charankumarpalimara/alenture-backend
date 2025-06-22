
const express = require("express");
const mySqlpool = require("../../db");

const jwt = require("jsonwebtoken"); // Import JWT library
const dotenv = require("dotenv"); // Import dotenv to access environment variables
dotenv.config(); // Load environment variables

const CrmLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const [data] = await mySqlpool.query(
      "SELECT * FROM listofcrm WHERE email = ? AND passwords = ?",
      [email, password]
    );

    const token = jwt.sign(
      { id: data[0].id, email: data[0].email }, // Payload
      process.env.JWT_SECRET_KEY, // Secret key
      { expiresIn: "1h" } // Token expiration
    );

    const updatedData = data.map((record) => ({
      ...record,
      imageUrl: `${req.protocol}://${req.get("host")}/uploads/crm/${
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
module.exports = { CrmLogin };

