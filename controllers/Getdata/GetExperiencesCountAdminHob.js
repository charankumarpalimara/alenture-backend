const express = require('express');
const mySqlpool = require('../../db');



const AllExperiencesCount = async (req, res) => {
    try {
        const [total] = await mySqlpool.query("SELECT COUNT(experienceid) AS total FROM experiences");
        const [resolved] = await mySqlpool.query("SELECT COUNT(experienceid) AS resolved FROM experiences WHERE status = 'Resolved'");
        const [newCount] = await mySqlpool.query("SELECT COUNT(experienceid) AS newCount FROM experiences WHERE status = 'New'");
        const [processing] = await mySqlpool.query("SELECT COUNT(experienceid) AS processing FROM experiences WHERE status = 'Processing'");

        res.status(200).json({
            message: "Total Experience Count",
            total: total[0].total,
            resolved: resolved[0].resolved,
            new: newCount[0].newCount,
            processing: processing[0].processing
        });
        console.log("Total Experience Count:", total[0].total);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}; 


const ResolvedExperiencesCount = async (req, res) => {
    try {

        const [data] = await mySqlpool.query("SELECT COUNT(experienceid) AS totalResolved FROM experiences WHERE status = 'Resolved'");
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No Records Found" });
        }

        res.status(200).json({ message: "Pending Experience Count", count: data[0].totalResolved });
        console.log("Pending Experience Count:", data[0].totalResolved);

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


const NewExperiencesCount = async (req, res) => {
    try {

        const [data] = await mySqlpool.query("SELECT COUNT(experienceid) AS totalNew FROM experiences WHERE status = 'New'");
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No Records Found" });
        }

        res.status(200).json({ message: "New Experience Count", count: data[0].totalNew });
        console.log("New Experience Count:", data[0].totalNew);

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


const PendingExperiencesCount = async (req, res) => {
    try {

        const [data] = await mySqlpool.query("SELECT COUNT(experienceid) AS totalPending FROM experiences WHERE status = 'Processing'");
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No Records Found" });
        }

        res.status(200).json({ message: "Pending Experience Count", count: data[0].totalPending });
        console.log("Pending Experience Count:", data[0].totalPending);

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}



module.exports = { AllExperiencesCount, ResolvedExperiencesCount, NewExperiencesCount, PendingExperiencesCount };
