const express = require('express');
const mySqlpool = require('../../db');


const updateTaskStatus = async (req, res) => {
    try{

        const Id =  req.params.id;
    //    const { id } = req.body;
        // console.log(req.body);

        if (!Id) {
            return res.status(400).json({ error: "status Update Failed Technical Issue" });
        }
        const status = "Completed";

        const [result] = await mySqlpool.query(
                "UPDATE experiencetasks SET status = ? WHERE id = ?",
                [status, Id]
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