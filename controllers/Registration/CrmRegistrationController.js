const mySqlpool = require('../../db');
const multer = require('multer');
const path = require('path');

const WebSocket = require('ws');
const { broadcast, broadcastNotification } = require('../../WebSocketUtils'); // Import broadcast from WebSocketUtils.js

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For URL-encoded payloads

const crmimage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/crm')); // Save files in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate a unique filename
    }
});

const uploadcrm = multer({ crmimage });

const CrmRegister = async (req, res) => {
    try {
        console.log("Incoming body:", req.body); // Log incoming text fields
        console.log("Incoming file:", req.file); // Log incoming file

        const { firstname, lastname, email, gender, phonecode, mobile, country, state, city, postalcode, username, passwords, createrid, createrrole } = req.body;

        if (!firstname || !lastname || !email || !gender || !phonecode || !mobile || !country || !state || !city || !postalcode || !username || !passwords || !createrid || !createrrole ) {
            return res.status(400).json({ error: "Please provide firstname, lastname, and other required fields" });
            console.log( "error to data insert" );
        }
        // if (!req.file) {
        //     return res.status(400).json({ error: "Please upload an image" });
        // }

    const imagePath = req.file ? req.file.filename : "";
        const id = '1';
        const extraind10 = 'crm';
        const extraind7 = 'Active';

        const [newid] = await mySqlpool.query("SELECT * FROM indicators WHERE id = ?", [id]);
        if (!newid || newid.length === 0) {
            return res.status(404).json({ error: "id does not exist" });
        }

        const secondColumnName = Object.keys(newid[0])[2]; // Get the second column name
        const secondColumnValue = newid[0][secondColumnName]; // Get the second column value
        console.log("third column name:", secondColumnName);
        console.log("third column value:", secondColumnValue);

        const crmid = parseInt(newid[0].crm, 10) || 0; // Safely parse customerid
        const nextcrmid = crmid + 1;
        const finalCRMid = "CRM_" + String(nextcrmid).padStart(3, "0"); // Generate ID like STR_001

        // Get current date and time
        const currentDate = new Date();
        const date = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const time = currentDate.toTimeString().split(' ')[0]; // Format: HH:MM:SS

            const [result] = await mySqlpool.query(
                `INSERT INTO listofcrm (crmid, firstname, lastname, phonecode, mobile, email, username, passwords, createrid, createrrole, date, time, extraind1, extraind2, extraind3, extraind4, extraind5, extraind6, extraind7, extraind8, extraind9, extraind10) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', '', ?)`,
                [finalCRMid, firstname, lastname, phonecode, mobile, email, username, passwords, createrid, createrrole, date, time, imagePath, gender, country, state, city, postalcode, extraind7, extraind10]
            );

            if (!result || result.affectedRows === 0) {
                console.log("crm insert failed");
                return res.status(500).json({ error: "Error inserting data into the database" });
            }

        const indicators = await mySqlpool.query(`UPDATE indicators SET crm = ? WHERE id = ?`, [nextcrmid, id]);
        const newCrm = {
            crmid: finalCRMid,
            firstname,
            lastname,
            phonecode,
            mobile,
            email,
            gender,
            country,
            state,
            city,
            postalcode,
            date,
            time,
            imageUrl: `${req.protocol}://${req.get('host')}/uploads/crm/${imagePath}`,
        };
        broadcast(newCrm); // Use broadcast to send updates
         broadcastNotification({
            type: 'notification',
            title: 'New CRM Registered',
            message: `CRM ID ${finalCRMid} CRM "${firstname} ${lastname}" registered successfully.`,
            timestamp: new Date().toISOString()
        });
            // broadcast({
            //     title: 'New CM Registered',
            //     message: `CM "${firstname} ${lastname}" registered successfully.`
            // });
        res.status(200).json({ message: "User registered successfully", result });
        console.log("User registered successfully with hobid:", finalCRMid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { CrmRegister }
