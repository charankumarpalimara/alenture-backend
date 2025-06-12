const express = require('express');
const mySqlpool = require('../../../db');


const getCmProfile = async (req, res) => {
    try {
        const cmId = req.params.cmid;

        if (!cmId) {
            return res.status(400).json({ error: "CRM ID is required" });
        }

        const [rows] = await mySqlpool.query("SELECT * FROM listofcm WHERE cmid = ?", [cmId]);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "CM profile not found" });
        }

        const crmProfile = rows[0];
        // Construct image URL if profile image exists
        let imageUrl = null;
        if (cmProfile.extraind1) {
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/cm/${crmProfile.extraind1}`;
        }

        res.status(200).json({
            message: "CM profile retrieved successfully",
            data: { ...crmProfile, imageUrl }
        });
        console.log("CM profile retrieved successfully", { ...cmProfile, imageUrl });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = { getCmProfile };