const express = require('express');
const mySqlpool = require('../../db');


const deleteCrmByAdminAndHob = async (req, res) => {
    try {
        const { crmid } = req.body;
        if (!crmid) {
            return res.status(400).json({ error: "Cm ID is required" });
        }

        // Delete the experience
        await mySqlpool.query(
            "DELETE FROM listofcrm WHERE crmid = ?",
            [crmid]
        );

        res.status(200).json({ message: "Crm deleted successfully" });
        console.log("Crm deleted successfully for ID:", crmid);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = { deleteCrmByAdminAndHob };