const express = require('express');
const mySqlpool = require('../../db');

const deleteTask = async (req, res) => {
    try {
      const taskId = req.params.id;

        if (!taskId) {
            return res.status(400).json({ error: "taskId is required" });
        }

        const [result] = await mySqlpool.query('DELETE FROM experiencetasks WHERE id = ?', [taskId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found or no changes made" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    deleteTask
};