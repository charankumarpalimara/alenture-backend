const express = require('express');
const mySqlpool = require('../../db');



const AllExperiencesCount = async (req, res) => {
    try{

        const [data] = await mySqlpool.query("SELECT COUNT(experienceid) AS total FROM experiences");
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No Records Found" });
        }

        res.status(200).json({ message: "Total Experience Count", count: data[0].total });
        console.log("Total Experience Count:", data[0].total);

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


const ResolvedExperiencesCount = async (req, res) => {
    try{

        const [data] = await mySqlpool.query("SELECT COUNT(experienceid) AS totalPending FROM experiences WHERE status = 'Resolved'");
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


const NewExperiencesCount = async (req, res) => {
    try{

        const [data] = await mySqlpool.query("SELECT COUNT(experienceid) AS totalNew FROM experiences WHERE status = 'Open'");
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
    try{

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