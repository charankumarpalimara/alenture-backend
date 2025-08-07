const express = require('express');
const mySqlpool = require('../../../db');
const sendMail = require("../../Mails-Service/sendMail"); // Import the mail service
const PasswordUpdateTemplate = require("../../../EmailsTemplates/password-update-confirmation");


const updateCrmProfile = async (req, res) => {
    try {
        const { crmid, firstname, lastname, email, phonecode, PhoneNo, gender, passwords, extraind3, extraind4, extraind5, extraind6 } = req.body;

        console.log("Request body:", req.body);
        console.log("Uploaded file:", req.file);


        const [rows] = await mySqlpool.query('SELECT * FROM listofcrm WHERE crmid = ?', [crmid]);
        const oldEmail = rows[0].email;
        const userRole = rows[0].extraind10;

        const crmFullName = firstname + " " + firstname;

       if (!crmid || !firstname || !lastname || !email || !PhoneNo || !gender || !passwords ) {
            return res.status(400).json({ error: "Crm ID, firstname, passwords, lastname, email, PhoneNo "})
        };
        let updateFields = [firstname, lastname, email, phonecode, PhoneNo, gender,  extraind3, extraind4, extraind5, extraind6, passwords];
        let sql = `UPDATE listofcrm SET firstname = ?, lastname = ?, email = ?, phonecode = ?, mobile = ?, extraind2 = ?, extraind3 = ?, extraind4 = ?, extraind5 = ?, extraind6 = ?, passwords = ?`;


        const CrmFullName = firstname + " " + lastname;

        let sql3 = `UPDATE experiences SET extraind2 = ? WHERE extraind1 = ?`;
        let updateFields3 = [CrmFullName, crmid];
      
        const [result3] = await mySqlpool.query(sql3, updateFields3);
      
        let sql4 = `UPDATE assignedrelations SET crmname = ? WHERE crmid = ?`;
        let updateFields4 = [CrmFullName, crmid];
        const [result4] = await mySqlpool.query(sql4, updateFields4);

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
            imageUrl = `https://alantur-api.softplix.com/uploads/crm/${imageFile}`;
        }
        res.status(200).json({ message: "Crm profile updated successfully", imageUrl: imageUrl });
        console.log("Crm profile updated successfully", imageUrl);

        // const firstname = firstName;
        const currentDate = new Date();
        const date = currentDate.toLocaleString();
    
        if (oldEmail !== email && email) {
          const emailTemplate = PasswordUpdateTemplate({ firstname, email, oldEmail, newEmail: email, updateTime: date, role: userRole });
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




const updateCrmProfileByAdminAndHob = async (req, res) => {
    try {
        const { crmid, firstname, lastname, email, phonecode, PhoneNo, gender, passwords, status, extraind3, extraind4, extraind5, extraind6 } = req.body;

        console.log("Request body:", req.body);
        console.log("Uploaded file:", req.file);

        const [rows] = await mySqlpool.query('SELECT * FROM listofcrm WHERE crmid = ?', [crmid]);
        const oldEmail = rows[0].email;
        const userRole = rows[0].extraind10;

       if (!crmid || !firstname || !lastname || !email || !PhoneNo || !gender ||!status) {
            return res.status(400).json({ error: "Crm ID, firstname, lastname, email, PhoneNo "})
        };
        let updateFields = [firstname,  lastname, email, phonecode, PhoneNo, gender, extraind3, extraind4, extraind5, extraind6,  status, passwords];
        let sql = `UPDATE listofcrm SET firstname = ?, lastname = ?,  email = ?, phonecode = ?, mobile = ?, extraind2 = ?,  extraind3 = ?, extraind4 = ?, extraind5 = ?, extraind6 = ?,  extraind7 = ?, passwords = ?`;


        const CrmFullName = firstname + " " + lastname;

        let sql3 = `UPDATE experiences SET extraind2 = ? WHERE extraind1 = ?`;
        let updateFields3 = [CrmFullName, crmid];
      
        const [result3] = await mySqlpool.query(sql3, updateFields3);
      
        let sql4 = `UPDATE assignedrelations SET crmname = ? WHERE crmid = ?`;
        let updateFields4 = [CrmFullName, crmid];
        const [result4] = await mySqlpool.query(sql4, updateFields4);

        
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

        const currentDate = new Date();
        const date = currentDate.toLocaleString();
    
        if (oldEmail !== email && email) {
          const emailTemplate = PasswordUpdateTemplate({ firstname, email, oldEmail, newEmail: email, updateTime: date, role: userRole });
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


module.exports = { updateCrmProfile, updateCrmProfileByAdminAndHob  };
