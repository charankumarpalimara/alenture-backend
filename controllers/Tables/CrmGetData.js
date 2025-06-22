const mySqlpool = require('../../db');
// const db = require('./db');
const express = require('express');



const getAllCrm = async (req, res) => {
    try {
        const [data] = await mySqlpool.query("SELECT * FROM listofcrm  order by id desc ");
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No Records Found" });
        }

        // Add image URL to each record
        const updatedData = data.map((record) => ({
            ...record,
            imageUrl: `${req.protocol}://${req.get('host')}/uploads/crm/${record.extraind1}`, // Construct image URL
        }));

        res.status(200).json({ message: "All User Records", data: updatedData });
        console.log("All students get successfully");
        // console.log(updatedData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error in Get All Students API" });
    }
};



const getAllCrmid = async(req, res) => {
    try{
      const [crmid] = await mySqlpool.query("SELECT crmid FROM listofcrm order by crmid desc ");
       if (!crmid || crmid.length === 0) {
            return res.status(404).json({ error: "No Records Found" });
        }
        res.status(200).json({ message: "All User Records", crmid });
        console.log("All Crmid get successfully");
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error in Get All Crmid API" });
    }
}



const getCrmName = async (req, res) => {
    try {
        const userId = req.params.crmid;
        const [crmname] = await mySqlpool.query(
            "SELECT firstname, lastname FROM listofcrm WHERE crmid = ? order by firstname asc",
            [userId]
        );
        if (!crmname || crmname.length === 0) {
            return res.status(404).json({ error: "No organization found" });
        }
        // crmname is an array of rows, so use crmname[0]
        const crmNames = crmname[0].firstname + " " + crmname[0].lastname;
        res.status(200).json({ message: "Crm details found", crmNames });
        console.log({ message: "Crm details found", crmNames });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong in this API" });
    }
};

module.exports = { getAllCrm , getAllCrmid, getCrmName};