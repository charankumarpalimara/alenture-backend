const express = require('express');
const mySqlpool = require('../../db');


const updateTaskStatus = async (req, res) => {
    try {
        const Id = req.params.id;
        const { taskname, description, taskowner, priority, status } = req.body;
        console.log("Update Task Status request received with ID:", Id, "and body:", req.body);

        if (!Id || !taskname || !taskowner || !priority || !status) {
            return res.status(400).json({ error: "Invalid parameters" });
        }

        const [result] = await mySqlpool.query(
            `UPDATE experiencetasks 
             SET taskname = ?, description = ?, taskownername = ?, priority = ?, status = ?
             WHERE id = ?`,
            [taskname, description, taskowner, priority, status, Id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(200).json({ message: "Task status updated successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
module.exports = { updateTaskStatus };