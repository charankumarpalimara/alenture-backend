const express = require('express');
const mySqlpool = require('../../../db');


const getCrmProfile = async (req, res) => {
    try {
        const crmId = req.params.crmid;

        if (!crmId) {
            return res.status(400).json({ error: "CRM ID is required" });
        }

        const [rows] = await mySqlpool.query("SELECT * FROM listofcrm WHERE crmid = ?", [crmId]);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "CRM profile not found" });
        }

        const crmProfile = rows[0];
        // Construct image URL if profile image exists
        let imageUrl = null;
        if (crmProfile.extraind1) {
            imageUrl = `https://alantur-api.softplix.com/uploads/crm/${crmProfile.extraind1}`;
        }

        res.status(200).json({
            message: "CRM profile retrieved successfully",
            data: { ...crmProfile, imageUrl }
        });
        console.log("CRM profile retrieved successfully", { ...crmProfile, imageUrl });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = { getCrmProfile };