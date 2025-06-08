const mySqlpool = require('../../db');
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


const getAllTicketsbyCmid = async (req, res) => {
    
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
            return res.status(404).json({ error: "No Experiences found" });
        }
        const experienceDetails = rows;
        // const branchDetails = rows[0].branch;
        res.status(200).json({ message: "Experience details found", experienceDetails });
        console.log({ message: "Experience details found", experienceDetails });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong in this API" });
    }
};


const getPendingTicketsbyCmid = async (req, res) => {
    
    try {
       const CmId = req.params.cmid;

         if (!CmId) {
            return res.status(400).json({ error: "No organization name received" });
        }

        const [rows] = await mySqlpool.query(
            "SELECT * FROM experiences WHERE cmid = ? AND status = 'Processing'",
            [CmId]
        );
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "No Experiences found" });
        }
        const experienceDetails = rows;
        // const branchDetails = rows[0].branch;
        res.status(200).json({ message: "Experience details found", experienceDetails });
        console.log({ message: "Experience details found", experienceDetails });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong in this API" });
    }
};



const getResolvedTicketsbyCmid = async (req, res) => {
    
    try {
       const CmId = req.params.cmid;

         if (!CmId) {
            return res.status(400).json({ error: "No organization name received" });
        }

        const [rows] = await mySqlpool.query(
            "SELECT * FROM experiences WHERE cmid = ? AND status = 'Resolved'",
            [CmId]
        );
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "No Experiences found" });
        }
        const experienceDetails = rows;
        // const branchDetails = rows[0].branch;
        res.status(200).json({ message: "Experience details found", experienceDetails });
        console.log({ message: "Experience details found", experienceDetails });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong in this API" });
    }
};


const getNewTicketsbyCmid = async (req, res) => {
    
    try {
       const CmId = req.params.cmid;

         if (!CmId) {
            return res.status(400).json({ error: "No organization name received" });
        }

        const [rows] = await mySqlpool.query(
            "SELECT * FROM experiences WHERE cmid = ? AND status = 'New'",
            [CmId]
        );
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "No Experiences found" });
        }
        const experienceDetails = rows;
        // const branchDetails = rows[0].branch;
        res.status(200).json({ message: "Experience details found", experienceDetails });
        console.log({ message: "Experience details found", experienceDetails });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong in this API" });
    }
};




const getAllTicketsbyCrmid = async (req, res) => {
    
    try {
       const CrmId = req.params.crmid;

         if (!CrmId) {
            return res.status(400).json({ error: "No organization name received" });
        }

        const [rows] = await mySqlpool.query(
            "SELECT * FROM experiences WHERE extraind1 = ?",
            [CrmId]
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


const getPendingTicketsbyCrmid = async (req, res) => {
    
    try {
       const CrmId = req.params.crmid;

         if (!CrmId) {
            return res.status(400).json({ error: "No organization name received" });
        }
         const status = 'Processing';
        const [rows] = await mySqlpool.query(
            "SELECT * FROM experiences WHERE extraind1 = ? AND status = ?",
            [CrmId, status]
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


const getNewTicketsbyCrmid = async (req, res) => {
    
    try {
       const CrmId = req.params.crmid;

         if (!CrmId) {
            return res.status(400).json({ error: "No organization name received" });
        }
         const status = 'New';
        const [rows] = await mySqlpool.query(
            "SELECT * FROM experiences WHERE extraind1 = ? AND status = ?",
            [CrmId, status]
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

const getReslveTicketsbyCrmid = async (req, res) => {
    
    try {
       const CrmId = req.params.crmid;

         if (!CrmId) {
            return res.status(400).json({ error: "No organization name received" });
        }
         const status = 'Resolved';
        const [rows] = await mySqlpool.query(
            "SELECT * FROM experiences WHERE extraind1 = ? AND status = ?",
            [CrmId, status]
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

module.exports = { getAllTickets, getAllTicketsbyCrmid, getAllTicketsbyCmid, getPendingTicketsbyCmid, getNewTicketsbyCmid, getResolvedTicketsbyCmid, getPendingTicketsbyCrmid, getNewTicketsbyCrmid, getReslveTicketsbyCrmid };