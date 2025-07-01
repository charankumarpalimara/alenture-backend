const express = require('express');
const mySqlpool = require('../../db');

const OrganizationDelete = async (req, res) => {
    try {
        const orgId = req.params.id;
        console.log("Received data:", req.params);
        if (!orgId) {
            return res.status(400).json({ error: "Organization ID is required" });
        }

        await mySqlpool.query(
            "DELETE FROM assignedrelations WHERE organizationid = ?",
            [orgId]
        );

        await mySqlpool.query(
            "DELETE FROM listofcm WHERE organizationid = ?",
            [orgId]
        );

        // Check if the note exists
        const [oragnization] = await mySqlpool.query("SELECT * FROM listoforganizations WHERE id = ?", [orgId]);
        if (!oragnization || oragnization.length === 0) {
            return res.status(404).json({ error: "Organization not found" });
        }

        // Delete the note
        await mySqlpool.query("DELETE FROM listoforganizations WHERE id = ?", [orgId]);

        res.status(200).json({ message: "Organization deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
module.exports = { OrganizationDelete };