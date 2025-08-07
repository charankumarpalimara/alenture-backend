const mySqlpool = require('../../db');
const express = require('express');
const sendMail = require("../Mails-Service/sendMail"); // Import the mail service
const PasswordUpdateTemplate = require("../../EmailsTemplates/password-update-confirmation");



const updateHob = async (req, res) => {
    try {
        const { hobid, firstname, lastname, email, phoneCode, mobile, status, gender, extraind3, extraind4, extraind5, extraind7, createrrole, createrid } = req.body;

        if (!hobid) {
           return res.status(400).json({ error: "hob is required" });
           console.error("hobid is required");
       }

        // Fetch old email and role before updating
        const [rows] = await mySqlpool.query('SELECT * FROM listofhob WHERE hobid = ?', [hobid]);
        const oldEmail = rows[0].email;
        const userRole = rows[0].extraind10;

        // Fix: updateFields should match SQL order and cmid only at the end
        let updateFields = [firstname, lastname, email, phoneCode, mobile, gender, extraind3, extraind4, extraind5, status, extraind7];
        let sql = `UPDATE listofhob SET firstname = ?, lastname = ?, email = ?, phonecode = ?, mobile = ?, extraind2 = ?, extraind3 = ?, extraind4 = ?, extraind5 = ?, extraind6 = ?, extraind7 = ?`;
        // If file is present, update extraind1 (profile image)
        if (req.file && req.file.filename) {
            sql += ', extraind1 = ?';
            updateFields.push(req.file.filename);
        }
        sql += ' WHERE hobid = ?';
        updateFields.push(hobid);
        // Debug log to help diagnose 404 issues
        console.log("[DEBUG] hobid:", hobid, "updateFields:", updateFields, "SQL:", sql);
        const [result] = await mySqlpool.query(sql, updateFields);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "hob not found or no changes made" });
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
        };



        res.status(200).json({ message: "Hob profile updated successfully", imageUrl: imageUrl });
        console.log("Hob profile updated successfully", imageUrl);

        // Send email notification if email changed
        const currentDate = new Date();
        const date = currentDate.toLocaleString();

        if (oldEmail !== email && email) {
            const emailTemplate = PasswordUpdateTemplate({ 
                firstname, 
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

module.exports = { updateHob };