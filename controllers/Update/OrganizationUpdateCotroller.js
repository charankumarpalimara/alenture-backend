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
        const [result] = await mySqlpool.query(sql, updateFields);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Organization not found or no changes made" });
            console.error("Organization not found or no changes made");
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