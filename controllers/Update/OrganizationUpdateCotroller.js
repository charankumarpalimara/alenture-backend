const express = require('express');
const mySqlpool = require('../../db');

const OrganizationUpdate = async (req, res) => {
    try {
        const {
            id, // <-- add this
            organizationid,
            organizationname,
            branch,
            branchtype,
            phonecode,
            mobile,
            email,
            country,
            state,
            district,
            address,
            postalcode,
            createrid,
            createrrole
        } = req.body;
        console.log("Received data:", req.body);
        if (!id) {
            return res.status(400).json({ error: "Branch id is required" });
        }

        const updateFields = [
            organizationname,
            branch,
            branchtype,
            phonecode,
            mobile,
            email,
            country,
            state,
            district,
            address,
            postalcode,
            createrid,
            createrrole,
            id // <-- use id here
        ];

        const sql = `
    UPDATE listoforganizations SET
        organizationname = ?,
        branch = ?,
        branchtype = ?,
        phonecode = ?,
        mobile = ?,
        email = ?,
        country = ?,
        state = ?,
        district = ?,
        address = ?,
        postalcode = ?,
        createrid = ?,
        createrrole = ?
    WHERE id = ?
`;
        // Get the old organizationname for this id
        const [orgRows] = await mySqlpool.query(
            "SELECT organizationname FROM listoforganizations WHERE id = ?",
            [id]
        );
        let oldOrganizationName = orgRows && orgRows[0] ? orgRows[0].organizationname : null;

        const [result] = await mySqlpool.query(sql, updateFields);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Organization not found or no changes made" });
        }

        // If organizationname changed, update all related rows
        if (oldOrganizationName && organizationname && oldOrganizationName !== organizationname) {
            // Update in listoforganizations (other branches of same org)
            await mySqlpool.query(
                "UPDATE listoforganizations SET organizationname = ? WHERE organizationname = ?",
                [organizationname, oldOrganizationName]
            );
            // Update in assignedrelations
            await mySqlpool.query(
                "UPDATE assignedrelations SET organizationname = ? WHERE organizationname = ?",
                [organizationname, oldOrganizationName]
            );
            // Update in experiencesgroups
            await mySqlpool.query(
                "UPDATE experiences SET organizationname = ? WHERE organizationname = ?",
                [organizationname, oldOrganizationName]
            );
        }

        res.status(200).json({ message: "Organization updated successfully" });
        console.log("Organization updated successfully");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
        console.error("Internal server error in OrganizationUpdate");
    }
}

module.exports = { OrganizationUpdate };