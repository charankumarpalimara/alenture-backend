const express = require('express');
const mySqlpool = require('../../db');


const crmDetailsGet = async (req, res) => {
    try {
        const { crmid } = req.params;
        // console.log("Fetching experience details for ID:", crmid);

        // Fetch experience details from the database
        const [crmDetails] = await mySqlpool.query(
            "SELECT * FROM listofcrm WHERE crmid = ?",
            [crmid]
        );

        if (!crmDetails || crmDetails.length === 0) {
            console.error("Relationship Manager not found for ID:", crmid);
            return res.status(404).json({ error: "Relationship Manager not found" });
        }

        // Map all records to include imageUrl
        const updatedData = crmDetails.map((record) => ({
            ...record,
            imageUrl: `${req.protocol}://${req.get('host')}/uploads/crm/${record.extraind1}`,
        }));

        const message =
          updatedData.length === 1
            ? "Relationship Manager details found"
            : "Multiple Relationship manager records found for this ID";

        res.status(200).json({ message, data: updatedData });
        // console.log("Relationship Manager details fetched successfully", updatedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { crmDetailsGet };