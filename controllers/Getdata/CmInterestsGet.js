
const express = require("express");
const mySqlpool = require("../../db");

const GetCmInterest = async (req, res) => {
  try {
const [rows] = await mySqlpool.query("SELECT `interest` FROM cm_interest_data");
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No CM functions found" });
    }
    // Return a flat array of interest names for easier frontend use
    const interests = rows.map(row => row.interest);
    res.status(200).json({ interests });
    console.log("CM interests retrieved successfully:", interests);
  } catch (error) {
    console.error("Error in GetCmInterest:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { GetCmInterest };