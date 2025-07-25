
const express = require("express");
const mySqlpool = require("../../db");

const GetCmFunction = async (req, res) => {
  try {
const [rows] = await mySqlpool.query("SELECT `function` FROM cm_functions_data");
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No CM functions found" });
    }
    // Return a flat array of function names for easier frontend use
    const functions = rows.map(row => row.function);
    res.status(200).json({ functions });
    console.log("CM functions retrieved successfully:", functions);
  } catch (error) {
    console.error("Error in GetCmFunction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { GetCmFunction };