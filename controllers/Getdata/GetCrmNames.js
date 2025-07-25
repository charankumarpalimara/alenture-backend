
const express = require('express');
const mySqlpool = require('../../db');

const GetCrmNames = async (req, res) => {
    try {
        const [data] = await mySqlpool.query("SELECT firstname, lastname,crmid FROM listofcrm ORDER BY id DESC");
        if (!data || data.length === 0) {
            return res.status(400).json({ error: "No CRM names found" });
        }

        // Map each record to a full name
        const fullNames = data.map(crm => ({
        name: `${crm.firstname} ${crm.lastname}`,
        crmid: crm.crmid
        }));
        res.status(200).json({ message: "CRM Names Retrieved Successfully", data: fullNames });
        // console.log("CRM Names retrieved successfully:", fullNames);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error in Get CRM Names API" });
    }
}


const getCrmNamesByExperienceid = async (req, res) => {
    try {
    const ExperienceId = req.params.experienceid;
        const [data] = await mySqlpool.query("SELECT extraind1, extraind2 FROM experiences WHERE experienceid =  ? ORDER BY id DESC", [ExperienceId]);
        if (!data || data.length === 0) {
            return res.status(400).json({ error: "No Experience Not found" });
        }

        // Map each record to a full name
        const fullNames = data.map(crm => ({
        crmnamebyexp: `${crm.extraind2}`,
        crmid: crm.crmid
        }));
        res.status(200).json({ message: "CRM Names Retrieved Successfully", data: fullNames });
        // console.log("CRM Names retrieved successfully:", fullNames);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error in Get CRM Names API" });
    }
}


module.exports = { GetCrmNames, getCrmNamesByExperienceid };


