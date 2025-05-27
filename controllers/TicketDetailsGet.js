const mySqlpool = require('../db');
// const db = require('./db');
const express = require('express');


const getAllTickets = async (req, res) => {
    try {
        const [data] = await mySqlpool.query("SELECT * FROM experiences order by experienceid desc");
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No Records Found" });
        }

        // Add image URL to each record
        const updatedData = data.map((record) => ({
            ...record,
            imageUrl: `${req.protocol}://${req.get('host')}/uploads/cm/${record.extraind1}`, // Construct image URL
        }));

        res.status(200).json({ message: "All User Records", data: updatedData });
        console.log({message: "All Experiences get successfully", data: updatedData  });
        // console.log(updatedData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error in Get All Students API" });
    }
};


const getAllTicketsbyCrmid = async (req, res) => {
    
    try {
       const CmId = req.params.cmid;

         if (!CmId) {
            return res.status(400).json({ error: "No organization name received" });
        }

        const [rows] = await mySqlpool.query(
            "SELECT * FROM experiences WHERE cmid = ?",
            [CmId]
        );
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "No organization found" });
        }
        const experienceDetails = rows
        // const branchDetails = rows[0].branch;
        res.status(200).json({ message: "Experience details found", experienceDetails });
        console.log({ message: "Experience details found", experienceDetails });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong in this API" });
    }
};


module.exports = { getAllTickets, getAllTicketsbyCrmid };