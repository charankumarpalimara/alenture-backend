const express = require('express');
const mySqlpool = require('../../db');

const AssignTaskandExperience = async (req, res) => {
    try {
        const { crmid, experienceid, existcrmid, crmname } = req.body;

        if (!crmid || !experienceid || !existcrmid || !crmname) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Get all rows for the given experienceid
        const [experienceDetailsGet] = await mySqlpool.query(
            'SELECT * FROM experiencetasks WHERE experienceid = ? AND crmid = ?',
            [experienceid, existcrmid]
        );
        if (!experienceDetailsGet || experienceDetailsGet.length === 0) {
            return res.status(404).json({ error: "No experience tasks found for this experience ID" });
        }

        const currentDate = new Date();
        const date = currentDate.toISOString().split('T')[0];
        const time = currentDate.toTimeString().split(' ')[0];

        // Insert each row with new crmid and crmname
        for (const task of experienceDetailsGet) {
            await mySqlpool.query(
                "INSERT INTO experiencetasks (experienceid, crmid, cmid, taskid, taskname, taskownername, description, status, priority, date, time, extraind1, extraind2, extraind3, extraind4, extraind5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    task.experienceid,
                    crmid,
                    task.cmid,
                    task.taskid,
                    task.taskname,
                    task.taskownername,
                    task.description,
                    task.status,
                    task.priority,
                    date,
                    time,
                    task.extraind1,
                    task.extraind2,
                    task.extraind3,
                    task.extraind4,
                    task.extraind5
                ]
            );
        }


          const [rows] = await mySqlpool.query(
            "SELECT * FROM experiences WHERE experienceid = ?",
            [experienceid]
        );
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "Source experience not found" });
        }
        const source = rows[0];

        // 2. Insert a new row with (optionally) changed fields
        await mySqlpool.query(
            `INSERT INTO experiences (
                experienceid, experience, subject, experiencedetails, impact, priority, status, filename, cmid, cmname, organizationid, organizationname, branch, date, time,
                extraind1, extraind2, extraind3, extraind4, extraind5, extraind6, extraind7, extraind8, extraind9, extraind10
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                experienceid, // new experienceid
                source.experience,
                source.subject,
                source.experiencedetails,
                source.impact,
                source.priority,
                source.status,
                source.filename,
                source.cmid, // new cmid
                source.cmname, // new cmname
                source.organizationid,
                source.organizationname,
                source.branch,
                date,
                time,
                crmid,
                crmname,
                source.extraind3,
                source.extraind4,
                source.extraind5,
                source.extraind6,
                source.extraind7,
                source.extraind8,
                source.extraind9,
                source.extraind10
            ]
        );

      


        res.status(201).json({ message: "Tasks duplicated and assigned to new CRM successfully" });
    } catch (error) {
        console.error("Error assigning task and experience:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = { AssignTaskandExperience };