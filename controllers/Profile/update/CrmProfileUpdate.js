const express = require('express');
const mySqlpool = require('../../../db');


const updateCrmProfile = async (req, res) => {
    try {
        const { crmid, firstname, lastname, email, PhoneNo, gender, passwords } = req.body;

        console.log("Request body:", req.body);
        console.log("Uploaded file:", req.file);
       if (!crmid || !firstname || !lastname || !email || !PhoneNo || !gender || !passwords) {
            return res.status(400).json({ error: "Crm ID, firstname, passwords, lastname, email, PhoneNo "})
        };
        let updateFields = [firstname,  lastname, email, PhoneNo, gender, passwords];
        let sql = `UPDATE listofcrm SET firstname = ?, lastname = ?,  email = ?, mobile = ?, extraind2 = ?, passwords = ?`;
        // If file is present, update extraind1 (profile image)
        if (req.file && req.file.filename) {
            sql += ', extraind1 = ?';
            updateFields.push(req.file.filename);
        }
        sql += ' WHERE crmid = ?';
        updateFields.push(crmid);
        const [result] = await mySqlpool.query(sql, updateFields);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Crm not found or no changes made" });
        }
        // Construct imageUrl if image was updated, else fetch current image
        let imageUrl = null;
        let imageFile = req.file && req.file.filename ? req.file.filename : null;
        if (!imageFile) {
            // Fetch current image filename from DB
            const [rows] = await mySqlpool.query('SELECT extraind1 FROM listofcrm WHERE crmid = ?', [crmid]);
            if (rows && rows[0] && rows[0].extraind1) {
                imageFile = rows[0].extraind1;
            }
        }
        if (imageFile) {
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/crm/${imageFile}`;
        }
        res.status(200).json({ message: "Crm profile updated successfully", imageUrl: imageUrl });
        console.log("Crm profile updated successfully", imageUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = { updateCrmProfile };