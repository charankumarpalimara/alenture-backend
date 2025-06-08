const express = require('express');
const mySqlpool = require('../../db');

const getRelationByCrmId = async (req, res) => {
    try {
        const crmId = req.params.crmid;
        if (!crmId) {
            return res.status(400).json({ error: "CRM ID is required" });
        }

        const [data] = await mySqlpool.query(
            "SELECT id, crmid, crmname, cmid, cmname, organizationid, organizationname, branch, date FROM assignedrelations WHERE crmid = ?", 
            [crmId]
        );
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No records found for the given CRM ID" });
        }

        // For each assigned relation, fetch and attach CM details
        const combinedData = await Promise.all(data.map(async (relation) => {
            const [cmDetails] = await mySqlpool.query(
                "SELECT email, phonecode, mobile, extraind2, extraind3, extraind1 FROM listofcm WHERE cmid = ?", 
                [relation.cmid]
            );
            if (cmDetails && cmDetails.length > 0) {
                return {
                    ...relation,
                    cmDetails: {
                        ...cmDetails[0],
                        imageUrl: `${req.protocol}://${req.get('host')}/uploads/cm/${cmDetails[0].extraind1}`
                    }
                };
            } else {
                return { ...relation, cmDetails: null };
            }
        }));

        res.status(200).json({ 
            message: "CRM relation retrieved successfully", 
            data: combinedData 
        });
        console.log("CRM relation retrieved successfully", combinedData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { getRelationByCrmId };