const express = require('express');
const mySqlpool = require('../../db');


const cmDetailsGet = async (req, res) => {
    try {
        const { cmid } = req.params;
        // console.log("Fetching experience details for ID:", cmid);

        // Fetch experience details from the database
        const [cmDetails] = await mySqlpool.query(
            "SELECT * FROM listofcm WHERE cmid = ?",
            [cmid]
        );

        if (!cmDetails || cmDetails.length === 0) {
            console.error("Customer Manager not found for ID:", cmid);
            return res.status(404).json({ error: "Customer Manager not found" });
        }

        // Map all records to include imageUrl
        const updatedData = cmDetails.map((record) => ({
            ...record,
            imageUrl: `${req.protocol}://${req.get('host')}/uploads/cm/${record.extraind1}`,
        }));

        const message =
          updatedData.length === 1
            ? "Customer Manager details found"
            : "Multiple experience records found for this ID";

        res.status(200).json({ message, data: updatedData });
        // console.log("Customer Manager details fetched successfully", updatedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { cmDetailsGet };