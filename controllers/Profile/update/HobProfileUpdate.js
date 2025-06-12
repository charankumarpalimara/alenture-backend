const express = require('express');
const multer = require('multer');


const mySqlpool = require('../../../db'); // Adjust the path as necessary


const updateHobProfile = async (req, res) => {
    try {
        const { hobid, firstName,lastName, password, email, PhoneNo, gender } = req.body;
        let updateFields = [password];
        let sql = `UPDATE listofhob SET passwords = ?`;
        // If file is present, update extraind1 (profile image)
        if (req.file && req.file.filename) {
            sql += ', extraind1 = ?';
            updateFields.push(req.file.filename);
        }
        sql += ' WHERE hobid = ?';
        updateFields.push(hobid);
        const [result] = await mySqlpool.query(sql, updateFields);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Admin not found or no changes made" });
        }
        // Construct imageUrl if image was updated, else fetch current image
        let imageUrl = null;
        let imageFile = req.file && req.file.filename ? req.file.filename : null;
        if (!imageFile) {
            // Fetch current image filename from DB
            const [rows] = await mySqlpool.query('SELECT extraind1 FROM listofhob WHERE hobid = ?', [hobid]);
            if (rows && rows[0] && rows[0].extraind1) {
                imageFile = rows[0].extraind1;
            }
        }
        if (imageFile) {
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/hob/${imageFile}`;
        }
        res.status(200).json({ message: "admin profile updated successfully", imageUrl: imageUrl });
        console.log("admin profile updated successfully", imageUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    updateHobProfile
};