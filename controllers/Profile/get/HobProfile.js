const express = require('express');
const mySqlpool = require('../../../db');

const getHobProfile = async (req, res) => {
    const hobId = req.params.hobid;
    try {
        const [rows] = await mySqlpool.query("SELECT * FROM listofhob WHERE hobid = ?", [hobId]);
        if(rows.length === 0){
            return res.status(404).json({ error: "Hob profile not found" });
        }
        const hobProfile = rows[0];
        let imageUrl = null;
        if(hobProfile.extraind1){
            imageUrl = `https://alantur-api.softplix.com/uploads/hob/${hobProfile.extraind1}`;
        }
        res.status(200).json({
            message: "Hob profile retrieved successfully",
            data: { ...hobProfile, imageUrl }
        });
        console.log("Hob profile retrieved successfully", { ...hobProfile, imageUrl });
    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { getHobProfile };