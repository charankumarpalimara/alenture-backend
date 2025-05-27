const mySqlpool = require('../db');
// const db = require('./db');
const express = require('express');



const updateAdminProfile = async (req, res) => {
    try {
        const { adminid, firstName, password, lastName, email, PhoneNo, gender } = req.body;
        let updateFields = [firstName, password, lastName, email, PhoneNo, gender];
        let sql = `UPDATE admin SET firstName = ?, password = ?, lastName = ?,  email = ?, mobile = ?, extraind2 = ?`;
        // If file is present, update extraind1 (profile image)
        if (req.file && req.file.filename) {
            sql += ', extraind1 = ?';
            updateFields.push(req.file.filename);
        }
        sql += ' WHERE adminid = ?';
        updateFields.push(adminid);
        const [result] = await mySqlpool.query(sql, updateFields);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Admin not found or no changes made" });
        }
        // Construct imageUrl if image was updated, else fetch current image
        let imageUrl = null;
        let imageFile = req.file && req.file.filename ? req.file.filename : null;
        if (!imageFile) {
            // Fetch current image filename from DB
            const [rows] = await mySqlpool.query('SELECT extraind1 FROM admin WHERE adminid = ?', [adminid]);
            if (rows && rows[0] && rows[0].extraind1) {
                imageFile = rows[0].extraind1;
            }
        }
        if (imageFile) {
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/admin/${imageFile}`;
        }
        res.status(200).json({ message: "Admin profile updated successfully", imageUrl: imageUrl });
        console.log("Admin profile updated successfully", imageUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { updateAdminProfile };

