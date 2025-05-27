const mySqlpool = require('../db');
const express = require('express');

const TicketRegistration = async (req, res) => {
    try {
        const { cmid, cmName, organizationid, organizationname, branch, subject, experience, experienceDetails, impact, priority, status } = req.body;

        if (!cmid || !cmName || !organizationid || !organizationname || !branch || !subject || !experience || !experienceDetails || !impact || !priority || !status) {
            return res.status(400).json({ error: "Please provide all required fields." });
        }

        const id = '1';
        const [newid] = await mySqlpool.query("SELECT * FROM indicators WHERE id = ?", [id]);
        if (!newid || newid.length === 0) {
            console.log({ error: "id does not exist" });
            return res.status(404).json({ error: "id does not exist" });
        }

        const Experienceid = parseInt(newid[0].experience, 10) || 0;
        const nextExperienceid = Experienceid + 1;
        const finalExperienceid = "EXP_" + String(nextExperienceid).padStart(3, "0");

        const currentDate = new Date();
        const date = currentDate.toISOString().split('T')[0];
        const time = currentDate.toTimeString().split(' ')[0];

        const [crmDetails] = await mySqlpool.query("SELECT * FROM assignedrelations WHERE cmid = ? ", [cmid]);

        let data;

        if (!crmDetails || crmDetails.length === 0) {
            [data] = await mySqlpool.query(
                `INSERT INTO experiences (experienceid, experience, subject, experiencedetails, impact, priority, status, filename, cmid, cmname, organizationid, organizationname, branch, date, time, extraind1, extraind2, extraind3, extraind4, extraind5, extraind6, extraind7, extraind8, extraind9, extraind10) 
                VALUES (?, ?, ?, ?, ?, ?, ?, '', ?, ?, ?, ?, ?, ?, ?, '', '', '', '', '', '', '', '', '', '')`,
                [finalExperienceid, experience, subject, experienceDetails, impact, priority, status, cmid, cmName, organizationid, organizationname, branch, date, time]
            );
        } else {
            const CrmId = crmDetails[0].crmid;
            const CrmName = crmDetails[0].crmname;

            console.log("CrmId:", CrmId);
            console.log("CrmName:", CrmName);

            [data] = await mySqlpool.query(
                `INSERT INTO experiences (experienceid, experience, subject, experiencedetails, impact, priority, status, filename, cmid, cmname, organizationid, organizationname, branch, date, time, extraind1, extraind2, extraind3, extraind4, extraind5, extraind6, extraind7, extraind8, extraind9, extraind10) 
                VALUES (?, ?, ?, ?, ?, ?, ?, '', ?, ?, ?, ?, ?, ?, ?, ?, ?, '', '', '', '', '', '', '', '')`,
                [finalExperienceid, experience, subject, experienceDetails, impact, priority, status, cmid, cmName, organizationid, organizationname, branch, date, time, CrmId, CrmName]
            );
        }

        await mySqlpool.query(`UPDATE indicators SET experience = ? WHERE id = ?`, [nextExperienceid, id]);

        console.log("User registered successfully with experienceid:", finalExperienceid);
        res.status(200).json({ message: "User registered successfully", data });

    } catch (error) {
        console.error("Error during TicketRegistration:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { TicketRegistration };
