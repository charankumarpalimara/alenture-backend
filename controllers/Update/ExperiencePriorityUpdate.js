const express = require('express');
const mySqlpool = require('../../db');


const updateExperiencePriority = async (req, res) => { 


    try {
        const { experienceid, priority } = req.body;
        if (!experienceid || !priority) {
            return res.status(400).json({ error: "Experience ID is required" });
        }


        // Update to Processing
        const [result] = await mySqlpool.query(
            "UPDATE experiences SET priority = ? WHERE experienceid = ?",
            [priority, experienceid]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Experience not found" });
        }

        res.status(200).json({ message: "Experience status updated to Processing successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }




}



module.exports = { updateExperiencePriority };