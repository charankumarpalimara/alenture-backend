const express = require('express');
const multer = require('multer');
const sendMail = require("../../Mails-Service/sendMail"); // Import the mail service
const PasswordUpdateTemplate = require("../../../EmailsTemplates/password-update-confirmation");

const mySqlpool = require('../../../db'); // Adjust the path as necessary


const updateHobProfile = async (req, res) => {
    try {
        const { hobid, firstName,lastName, password, email, PhoneNo, phonecode, gender, extraind3, extraind4, extraind5, extraind7 } = req.body;
        console.log("Received data:", req.body);
        console.log(req.file);

        // Fetch old email and role before updating
        const [rows] = await mySqlpool.query('SELECT * FROM listofhob WHERE hobid = ?', [hobid]);
        const oldEmail = rows[0].email;
        const userRole = rows[0].extraind10;
        let updateFields = [firstName, lastName, email, phonecode, PhoneNo, gender, extraind3, extraind4, extraind5, extraind7, password];
        let sql = `UPDATE listofhob SET firstname = ?, lastname = ?, email = ?, phonecode = ?, mobile = ?, extraind2 = ?, extraind3 = ?, extraind4 = ?, extraind5 = ?, extraind7 = ?, passwords = ?`;
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
            imageUrl = `https://alantur-api.softplix.com/uploads/hob/${imageFile}`;
        }
        res.status(200).json({ message: "hob profile updated successfully", imageUrl: imageUrl });
        console.log("hob profile updated successfully", imageUrl);

        // Send email notification if email changed
        const currentDate = new Date();
        const date = currentDate.toLocaleString();

        if (oldEmail !== email && email) {
            const emailTemplate = PasswordUpdateTemplate({ 
                firstname: firstName, 
                email, 
                oldEmail, 
                newEmail: email, 
                updateTime: date, 
                role: userRole 
            });
            await sendMail({
                to: email,
                subject: 'Account Updated Successfully - Alantur',
                html: emailTemplate
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    updateHobProfile
};