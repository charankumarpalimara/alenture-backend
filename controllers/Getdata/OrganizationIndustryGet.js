
const express = require("express");
const mySqlpool = require("../../db");

const GetOrganizationIndustries = async (req, res) => {
  try {
const [rows] = await mySqlpool.query("SELECT `industry` FROM organization_industries");
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No organization industries found" });
    }
    // Return a flat array of industry names for easier frontend use
    const industries = rows.map(row => row.industry);
    res.status(200).json({ industries });
    console.log("Organization industries retrieved successfully:", industries);
  } catch (error) {
    console.error("Error in GetOrganizationIndustries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { GetOrganizationIndustries };