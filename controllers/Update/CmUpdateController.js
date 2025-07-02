const express = require('express');
const mySqlpool = require('../../db');


// Update Customer Manager details
const updateCustomerManager = async (req, res) => {
    try {
        const { cmid, firstname, lastname, email, phoneCode, mobile, status, gender, organizationid, organizationname, branch,  crmid, crmname, createrrole, createrid } = req.body;

        if (!cmid) {
           return res.status(400).json({ error: "cmid is required" });
           console.error("cmid is required");
       }

        // Fix: updateFields should match SQL order and cmid only at the end
        let updateFields = [firstname, lastname, email, phoneCode, mobile, gender, status,  crmid, crmname];
        let sql = `UPDATE listofcm SET firstname = ?, lastname = ?, email = ?, phonecode = ?, mobile = ?, extraind2 = ?, extraind3 = ?,  crmid = ?, crmname = ?`;


        // If file is present, update extraind1 (profile image)
        if (req.file && req.file.filename) {
            sql += ', extraind1 = ?';
            updateFields.push(req.file.filename);
        }
        sql += ' WHERE cmid = ?';
        updateFields.push(cmid);
        // Debug log to help diagnose 404 issues
        console.log("[DEBUG] cmid:", cmid, "updateFields:", updateFields, "SQL:", sql);
        const [result] = await mySqlpool.query(sql, updateFields);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "cm not found or no changes made" });
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
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/cm/${imageFile}`;
        };


      const [cmDetails] = await mySqlpool.query(
            "SELECT * FROM listofcm WHERE cmid = ?",
            [cmid]
        );
        const cmId = cmDetails[0].cmid;
        const cmFullname = cmDetails[0].firstname  + " " + cmDetails[0].lastname;
        // const cmLastname = ;
        const crmId = cmDetails[0].crmid;
        const crmFullName = crmname ;
        const organizationId = cmDetails[0].organizationid;
        const organizationName = cmDetails[0].organizationname;

                    const currentDate = new Date();
            const date = currentDate.toISOString().split('T')[0];
            const time = currentDate.toTimeString().split(' ')[0];

        const [crmDetails] = await mySqlpool.query(
            "SELECT * FROM assignedrelations WHERE cmid = ?",
            [cmid]
        );
        if (!crmDetails || crmDetails.length === 0) {


          const [creatingRelation] = await mySqlpool.query(
                "INSERT INTO assignedrelations (id, crmid, crmname, cmid, cmname, organizationid, organizationname, branch, phonecode, mobile, email, username, passwords, createrid, createrrole, date, time, extraind1, extraind2, extraind3, extraind4, extraind5, extraind6, extraind7, extraind8, extraind9, extraind10) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, '', '', '', '', '', ?, ?, ?, ?, '', '', '', '', '', '', '', '', '', '')",
                [crmId, crmFullName, cmId, cmFullname, organizationId, organizationName, branch, createrid, createrrole, date, time]
            );

        }else{
             let creatingRelation = `UPDATE assignedrelations SET crmid = ?, crmname = ?, cmname = ? , createrid = ?, createrrole = ?, date = ?, time = ?  WHERE cmid = ?`;
              await mySqlpool.query(creatingRelation, [crmId, crmFullName, cmFullname, createrid, createrrole, date , time, cmid]);

        }







        res.status(200).json({ message: "cm profile updated successfully", imageUrl: imageUrl });
        console.log("cm profile updated successfully", imageUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = { updateCustomerManager };
