const express = require('express');
const mySqlpool = require('../../db');


const hobPasswordReset = async (req, res) => {
    try {
        // const noteId = req.params.id;
        const {  hobid, password } = req.body;

        if (!hobid || !password ) {
            return res.status(400).json({ error: "hobid ID, title, and content are required" });
        }

        // Check if the note exists
        const [hob] = await mySqlpool.query("SELECT * FROM listofcrm WHERE hobid = ?", [hobid]);
        if (!hob || hob.length === 0) {
            return res.status(404).json({ error: "Hob not found" });
        }

        // Update the note
        await mySqlpool.query("UPDATE listofhob SET  passwords = ? WHERE hobid = ?", [password, hobid]);

        res.status(200).json({ message: "Hob updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { hobPasswordReset };