const express = require('express');
const mySqlpool = require('../../db');


const crmPasswordReset = async (req, res) => {
    try {
        // const noteId = req.params.id;
        const {  crmid, password } = req.body;
        console.log("Received data:", req.body);

        if (!crmid || !password ) {
            return res.status(400).json({ error: "crmid ID, title, and content are required" });
        }

        // Check if the note exists
        const [crm] = await mySqlpool.query("SELECT * FROM listofcrm WHERE crmid = ?", [crmid]);
        if (!crm || crm.length === 0) {
            return res.status(404).json({ error: "Crm not found" });
        }

        // Update the note
        await mySqlpool.query("UPDATE listofcrm SET  passwords = ? WHERE crmid = ?", [password, crmid]);

        res.status(200).json({ message: "Crm updated successfully" });
        console.log("Crm Paasword Reset successfully");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { crmPasswordReset };