const express = require('express');
const mySqlpool = require('../../db');


const GetCmNames = async (req, res) => {
    try {
        const { orgName, branch } = req.body;
        console.log("Received data:", req.body);
        if (!orgName || !branch) {
            return res.status(400).json({ error: "Organization name and branch are required" });
        }
        const [data] = await mySqlpool.query("SELECT firstname, lastname, cmid FROM listofcm WHERE organizationname = ? AND branch = ? ", [orgName,branch]);
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No CM names found" });
        }

        // Map each record to a full name
       const fullNames = data.map(cm => ({
        name: `${cm.firstname} ${cm.lastname}`,
        cmid: cm.cmid
        }));

        res.status(200).json({ message: "CM Names Retrieved Successfully", data: fullNames });
        console.log("CM Names retrieved successfully:", fullNames);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error in Get CM Names API" });
    }
}


module.exports = { GetCmNames };
