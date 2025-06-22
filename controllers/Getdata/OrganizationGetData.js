const mySqlpool = require('../../db');
// const db = require('./db');
const express = require('express');


const getAllOrgs = async (req, res) => {
    try {
        const [data] = await mySqlpool.query("SELECT * FROM listoforganizations WHERE branchtype = 'Parent' order by id desc ");
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No Records Found" });
        }

        // Add image URL to each record
        // const updatedData = data.map((record) => ({
        //     ...record,
        //     imageUrl: `${req.protocol}://${req.get('host')}/uploads/hob/${record.extraind1}`, // Construct image URL
        // }));

        res.status(200).json({ message: "All User Records", data: data });
        console.log("All students get successfully");
        console.log(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error in Get All Students API" });
    }
};





const getAllOrgId = async (req, res) => {
    try {
        const [data] = await mySqlpool.query("SELECT organizationid FROM listoforganizations order by organizationname asc");
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No Records Found" });
        }

        // Add image URL to each record
        // const updatedData = data.map((record) => ({
        //     ...record,
        //     imageUrl: `${req.protocol}://${req.get('host')}/uploads/hob/${record.extraind1}`, // Construct image URL
        // }));

        res.status(200).json({ message: "All User Records", data: data });
        console.log("All students get successfully");
        console.log(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error in Get All Students API" });
    }
};


const getOrgNamebyOrgId = async (req, res) => {
    try {
        const orgId = req.params.orgId;
        if (!orgId) {
            return res.status(400).json({ error: "No organization name received" });
        }

        const [rows] = await mySqlpool.query(
            "SELECT organizationname FROM listoforganizations WHERE organizationid = ?",
            [orgId]
        );
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "No organization found" });
        }
        const Organizationnames = rows[0].organizationname;
        res.status(200).json({ message: "Branch details found", Organizationnames });
        console.log({ message: "Branch details found", Organizationnames });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong in this API" });
    }
};




const getOrgDetailsById = async (req, res) => {
    try {
        const orgId = req.params.orgId;
        if (!orgId) {
            return res.status(400).json({ error: "No organization name received" });
        }

        const [rows] = await mySqlpool.query(
            "SELECT organizationname FROM listoforganizations WHERE organizationid = ?",
            [orgId]
        );
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "No organization found" });
        }
        const Organizationnames = rows[0].organizationname;
        res.status(200).json({ message: "Branch details found", Organizationnames });
        console.log({ message: "Branch details found", Organizationnames });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong in this API" });
    }
};









const getOrganizationBranchesByOrgid = async (req, res) => {
    try {
        const orgId = req.params.orgId;
        if (!orgId) {
            return res.status(400).json({ error: "No organization name received" });
        }
            //   const branchType = 'Branch';
        const [rows] = await mySqlpool.query(
            "SELECT * FROM listoforganizations WHERE organizationid = ? ",
            [orgId]
        );
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "No organization found" });
        }
     
        res.status(200).json({ message: "Branch details found", rows });
        console.log({ message: "Branch details found", rows });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong in this API" });
    }
}








// const getOrganizationBranchesByOrgid = async (req, res) => {
//     try {
//         const orgId = req.params.orgId;
//         if (!orgId) {
//             return res.status(400).json({ error: "No organization name received" });
//         }
//               const branchType = 'Branch';
//         const [rows] = await mySqlpool.query(
//             "SELECT branch FROM listoforganizations WHERE organizationid = ? AND branchtype = ?",
//             [orgId, branchType]
//         );
//         if (!rows || rows.length === 0) {
//             return res.status(404).json({ error: "No organization found" });
//         }
     
//         res.status(200).json({ message: "Branch details found", rows });
//         console.log({ message: "Branch details found", rows });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Something went wrong in this API" });
//     }
// }



module.exports = { getAllOrgs, getAllOrgId, getOrgNamebyOrgId, getOrgDetailsById, getOrganizationBranchesByOrgid };
