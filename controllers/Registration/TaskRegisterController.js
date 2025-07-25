const express = require('express');
const mySqlpool = require('../../db');
const { broadcast } = require('../../WebSocketUtils'); // Make sure yo

const TaskRegister = async (req, res) => {
    try {
        const { experienceid, taskname, taskowner, priority, description, crmid } = req.body;
        console.log("Task registration request received with body:", req.body);

        if (!experienceid || !taskname || !taskowner || !priority || !description || !crmid) {
            return res.status(400).json({ error: "Task name, assigned to, and due date are required" });
        }
        const currentDate = new Date();
        const date = currentDate.toLocaleDateString('en-US'); // e.g., "07/04/2025"
        const time = currentDate.toLocaleTimeString('en-US', { hour12: true }); // e.g., "3:45:12 PM"

        const status = 'New'; // Default status for new tasks

        const [data] = await mySqlpool.query(
            "INSERT INTO experiencetasks (id, experienceid, crmid, cmid, taskid, taskname, taskownername, description, status, priority, date, time, extraind1, extraind2, extraind3, extraind4, extraind5) VALUES (NULL, ?, ?, '', '', ?, ?, ?, ?, ?, ?, ?, '', '', '', '', '')",
            [experienceid, crmid, taskname, taskowner, description, status, priority, date, time]
        );
        broadcast({
            type: 'task_update',
            experienceid,
            task: {
                experienceid,
                taskname,
                taskowner,
                priority,
                description,
                crmid,
                status,
                date,
                time
            }
        });
        // Here you would typically save the task to the database
        // For demonstration, we will just return the task details

        res.status(201).json({ message: "Task registered successfully", task: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = { TaskRegister };