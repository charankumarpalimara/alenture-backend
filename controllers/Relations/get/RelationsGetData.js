const express = require('express');
const mySqlpool = require('../../../db');

const getRelationsDataByCrmid = async (req, res) => {
    try {
        const crmid = req.params.crmid;
        if (!crmid) {
            return res.status(400).json({ error: "No CRM ID received" });
        }

        const [data] = await mySqlpool.query("SELECT * FROM assignedrelations WHERE crmid = ? ", [crmid]);
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No Records Found" });
        }

        res.status(200).json({ message: "Relations Data Retrieved Successfully", data: data });
        console.log("Relations data retrieved successfully for CRM ID:", crmid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error in Get Relations Data API" });
    }
}


module.exports = { getRelationsDataByCrmid };