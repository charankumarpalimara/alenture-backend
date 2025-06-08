const express = require('express');
const mySqlpool = require('../../db');


const deleteExperienceByCm = async (req, res) => {
    try {
        const { experienceid } = req.body;
        if (!experienceid) {
            return res.status(400).json({ error: "Experience ID is required" });
        }

        // Delete the experience
        await mySqlpool.query(
            "DELETE FROM experiences WHERE experienceid = ?",
            [experienceid]
        );

        res.status(200).json({ message: "Experience deleted successfully" });
        console.log("Experience deleted successfully for ID:", experienceid);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = { deleteExperienceByCm };