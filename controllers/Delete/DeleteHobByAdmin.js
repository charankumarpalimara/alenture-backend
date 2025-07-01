const express = require('express');
const mySqlpool = require('../../db');


const deleteHobByAdmin = async (req, res) => {
    try {
        const { hobid } = req.body;
        console.log("Received data:", req.body);
        if (!hobid) {
            return res.status(400).json({ error: "Hob ID is required" });
        }

        // Delete the experience
        await mySqlpool.query(
            "DELETE FROM listofhob WHERE hobid = ?",
            [hobid]
        );

        res.status(200).json({ message: "Hob deleted successfully" });
        console.log("Hob deleted successfully for ID:", hobid);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = { deleteHobByAdmin };