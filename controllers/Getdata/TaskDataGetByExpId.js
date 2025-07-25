const express = require('express');
const mySqlpool = require('../../db');

const getTaskDataByExpId = async (req, res) => {
    
    try {
        const {experienceId, crmid} = req.body;
        // console.log("Received request to get tasks for Experience ID:", experienceId, "and CRM ID:", crmid);
        if (!experienceId || !crmid) {
            return res.status(400).json({ error: "Experience ID is required" });
        }

        const [data] = await mySqlpool.query(
            "SELECT * FROM experiencetasks WHERE experienceid = ? AND crmid =  ?", 
            [experienceId, crmid]
        );

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No tasks found for the given Experience ID" });
        }

        // Construct image URLs for each task
        const updatedData = data.map((task) => ({
            ...task
        }));

        res.status(200).json({ 
            message: "Tasks retrieved successfully", 
            data: updatedData 
        });
        // console.log("Tasks retrieved successfully", updatedData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = { getTaskDataByExpId };