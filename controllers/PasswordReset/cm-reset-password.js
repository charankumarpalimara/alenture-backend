const express = require('express');
const mySqlpool = require('../../db');


const cmPasswordReset = async (req, res) => {
    try {
        // const noteId = req.params.id;
        const {  cmid, password } = req.body;

        if (!cmid || !password ) {
            return res.status(400).json({ error: "cmid ID, title, and content are required" });
        }

        // Check if the note exists
        const [rm] = await mySqlpool.query("SELECT * FROM listofcm WHERE cmid = ?", [cmid]);
        if (!cm || cm.length === 0) {
            return res.status(404).json({ error: "Cm not found" });
        }

        // Update the note
        await mySqlpool.query("UPDATE listofcm SET  passwords = ? WHERE cmid = ?", [cmid, password]);

        res.status(200).json({ message: "Cm updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { cmPasswordReset };