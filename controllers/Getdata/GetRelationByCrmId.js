const express = require('express');
const mySqlpool = require('../../db');

const getRelationByCrmId = async (req, res) => {
    try {
        const crmId = req.params.crmid;
        if (!crmId) {
            return res.status(400).json({ error: "CRM ID is required" });
        }

        const [data] = await mySqlpool.query(
            "SELECT id, crmid, crmname, cmid, cmname, organizationid, organizationname, branch, date FROM assignedrelations WHERE crmid = ? order by id desc ", 
            [crmId]
        );
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No records found for the given CRM ID" });
        }

        // Optimization: Fetch all required CM details in a single query
        const cmIds = data.map(relation => relation.cmid);
        let cmDetailsMap = {};
        if (cmIds.length > 0) {
            const [cmDetailsRows] = await mySqlpool.query(
                `SELECT cmid, firstname, lastname, email, phonecode, mobile, extraind2, extraind3, extraind1, passwords FROM listofcm WHERE cmid IN (${cmIds.map(() => '?').join(',')}) order by id desc`,
                cmIds
            );
            cmDetailsMap = cmDetailsRows.reduce((acc, cm) => {
                acc[cm.cmid] = {
                    ...cm,
                    imageUrl: cm.extraind1 ? `${req.protocol}://${req.get('host')}/uploads/cm/${cm.extraind1}` : null
                };
                return acc;
            }, {});
        }

        const combinedData = data.map(relation => ({
            ...relation,
            cmDetails: cmDetailsMap[relation.cmid] || null
        }));

        res.status(200).json({ 
            message: "CRM relation retrieved successfully", 
            data: combinedData 
        });
        // console.log("CRM relation retrieved successfully", combinedData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { getRelationByCrmId };
