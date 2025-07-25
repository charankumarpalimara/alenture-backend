const express = require('express');
const mySqlpool = require('../../db');


const hobDetailsGet = async (req, res) => {
    try {
        const { hobid } = req.params;
        console.log("Fetching Hob details for ID:", hobid);

        // Fetch experience details from the database
        const [hobDetails] = await mySqlpool.query(
            "SELECT * FROM listofhob WHERE hobid = ?",
            [hobid]
        );

        if (!hobDetails || hobDetails.length === 0) {
            console.error("Hob not found for ID:", hobid);
            return res.status(404).json({ error: "Hob  not found" });
        }

        // Map all records to include imageUrl
        const updatedData = hobDetails.map((record) => ({
            ...record,
            imageUrl: `${req.protocol}://${req.get('host')}/uploads/hob/${record.extraind1}`,
        }));

        const message =
          updatedData.length === 1
            ? "Hob details found"
            : "Multiple Hob records found for this ID";

        res.status(200).json({ message, data: updatedData });
        console.log("Hob details fetched successfully", updatedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { hobDetailsGet };