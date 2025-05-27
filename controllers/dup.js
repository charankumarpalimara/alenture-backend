const express = require('express');
const mySqlpool = require('../db');


// Update Customer Manager details
const updateCustomerManager = async (req, res) => {
    try {
        const { cmid, firstName, lastName, email, PhoneCode, PhoneNo, status, gender, password, crmid, crmname } = req.body;

        const [crmdetailscheck] = await mySqlpool.query(
            "SELECT * FROM listofcm WHERE cmid = ? AND crmid = ?",
            [cmid, crmid]
        );
        if (!crmdetailscheck || crmdetailscheck.length === 0) {
            // return res.status(404).json({ error: "No organization found" });
             
        };


        let updateFields = [cmid, firstName, lastName, email, PhoneCode, PhoneNo, gender, status, password, ];
        let sql = `UPDATE admin SET firstname = ?, lastname = ?, email = ?, phonecode = ?, mobile = ?, extraind2 = ?, extraind3 = ?, password = ?`;
        // If file is present, update extraind1 (profile image)
        if (req.file && req.file.filename) {
            sql += ', extraind1 = ?';
            updateFields.push(req.file.filename);
        }
        sql += ' WHERE cmid = ?';
        updateFields.push(cmid);
        const [result] = await mySqlpool.query(sql, updateFields);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Admin not found or no changes made" });
        }



        // Construct imageUrl if image was updated, else fetch current image
        let imageUrl = null;
        let imageFile = req.file && req.file.filename ? req.file.filename : null;
        if (!imageFile) {
            // Fetch current image filename from DB
            const [rows] = await mySqlpool.query('SELECT extraind1 FROM listofcm WHERE cmid = ?', [cmid]);
            if (rows && rows[0] && rows[0].extraind1) {
                imageFile = rows[0].extraind1;
            }
        }




        if (imageFile) {
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/crm/${imageFile}`;
        }
        res.status(200).json({ message: "Admin profile updated successfully", imageUrl: imageUrl });
        console.log("Admin profile updated successfully", imageUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

       
            // const [cmdetailsget] = await mySqlpool.query(
            //     "SELECT organizationid, organizationname FROM listofcm WHERE cmid = ? ",
            //     [cmid]
            // );
            // const organizationid = cmdetailsget[0].organizationid;
            // const organizationname = cmdetailsget[0].organizationname;

            // const currentDate = new Date();
            // const date = currentDate.toISOString().split('T')[0];
            // const time = currentDate.toTimeString().split(' ')[0];

            // const [assignedetailsget] = await mySqlpool.query(
            //     "SELECT * FROM assignedrelations WHERE cmid = ? ",
            //     [cmid]
            // );
            // if (!assignedetailsget || assignedetailsget.length === 0) {
            //     await mySqlpool.query(
            //         `INSERT INTO assignedrelations (id, crmid, crmname, cmid, cmname, organizationid, organizationname, branch, phonecode, mobile, email, username, passwords, createrid, createrrole, date, time, extraind1, extraind2, extraind3, extraind4, extraind5, extraind6, extraind7, extraind8, extraind9, extraind10)
            //         VALUES (NULL, ?, ?, ?, ?, ?, ?, '', '', '', '', '', '', ?, ?, ?, ?, '', '', '', '', '', '', '', '', '', '')`,
            //         [crmid, crmname, cmid, firstName + " " + lastName, organizationid, organizationname, createrid, createrrole, date, time]
            //     );
            // } else {
            //     await mySqlpool.query(
            //         `UPDATE assignedrelations SET crmid = ?, crmname = ? WHERE cmid = ?`,
            //         [crmid, crmname, cmid]
            //     );
            // }
            // // res.status(200).json({ message: "CM already exists with this crmid" });
            // res.status(200).json({ message: "CM profile updated successfully", imageUrl });
            // console.log("CM profile updated successfully", imageUrl);


module.exports = { updateCustomerManager };
