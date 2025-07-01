const express = require('express');
const mySqlpool = require('../../db');


const deleteCmByAdminAndHob = async (req, res) => {
    try {
        const { cmid } = req.body;
        if (!cmid) {
            return res.status(400).json({ error: "Cm ID is required" });
        }

        await mySqlpool.query(
            "DELETE FROM assignedrelations WHERE cmid = ?",
            [cmid]
        );

        // Delete the experience
        await mySqlpool.query(
            "DELETE FROM listofcm WHERE cmid = ?",
            [cmid]
        );


        res.status(200).json({ message: "Cm deleted successfully" });
        console.log("Cm deleted successfully for ID:", cmid);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = { deleteCmByAdminAndHob };