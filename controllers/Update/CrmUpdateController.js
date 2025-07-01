const express = require('express');
const mySqlpool = require('../../db');


// Update Customer Manager details
const updateCustomerRelationshipManager = async (req, res) => {
    try {
        const { crmid, firstname, lastname, email, phoneCode, mobile, status, gender, createrrole, createrid } = req.body;

        if (!crmid) {
           return res.status(400).json({ error: "cmid is required" });
           console.error("cmid is required");
       }

        // Fix: updateFields should match SQL order and cmid only at the end
        let updateFields = [firstname, lastname, email, phoneCode, mobile, gender, status];
        let sql = `UPDATE listofcrm SET firstname = ?, lastname = ?, email = ?, phonecode = ?, mobile = ?, extraind2 = ?, extraind7 = ?`;
        // If file is present, update extraind1 (profile image)
        if (req.file && req.file.filename) {
            sql += ', extraind1 = ?';
            updateFields.push(req.file.filename);
        }
        sql += ' WHERE crmid = ?';
        updateFields.push(crmid);
        // Debug log to help diagnose 404 issues
        console.log("[DEBUG] crmid:", crmid, "updateFields:", updateFields, "SQL:", sql);
        const [result] = await mySqlpool.query(sql, updateFields);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "crm not found or no changes made" });
        }

        let crmfullname = firstname + " " + lastname;
        let updateFields1 = [crmfullname];
        let sql1 = `UPDATE assignedrelations SET firstname = ? `;
        sql1 += ' WHERE crmid = ?';
        updateFields1.push(crmid);

        // Construct imageUrl if image was updated, else fetch current image
        let imageUrl = null;
        let imageFile = req.file && req.file.filename ? req.file.filename : null;
        if (!imageFile) {
            // Fetch current image filename from DB
            const [rows] = await mySqlpool.query('SELECT extraind1 FROM listofcm WHERE crmid = ?', [crmid]);
            if (rows && rows[0] && rows[0].extraind1) {
                imageFile = rows[0].extraind1;
            }
        }


        if (imageFile) {
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/crm/${imageFile}`;
        };



        res.status(200).json({ message: "crm profile updated successfully", imageUrl: imageUrl });
        console.log("crm profile updated successfully", imageUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = { updateCustomerRelationshipManager };
