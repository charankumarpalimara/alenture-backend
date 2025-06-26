const mySqlpool = require('../../db');
// const db = require('./db');
const express = require('express');
const multer = require('multer');
const path = require('path');
const { broadcast, broadcastNotification } = require('../../WebSocketUtils'); // Import broadcast from WebSocketUtils.js
const sendMail = require('../Mails-Service/sendMail'); // Import the mail service
const hobRegistrationTemplate = require('../../services/hob-mail-provider'); // Import the HOB registration email template

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/hob')); // Save files in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate a unique filename
    }
});

const upload = multer({ storage });

const HobRegistration = async (req, res) => {
    try {
        console.log("Incoming body:", req.body); // Log incoming text fields
        console.log("Incoming file:", req.file); // Log incoming file

        const { firstname, lastname, phonecode, mobile, email, gender, country, state, city, username, passwords } = req.body;

        if (!firstname || !lastname || !phonecode || !mobile || !email || !username || !passwords || !country || !city || !gender) {
            return res.status(400).json({ error: "Please provide all required fields" });
        }

        // if (!req.file) {
        //     return res.status(400).json({ error: "Please upload an image" });
        // }

        const imagePath = req.file ? req.file.filename : "";
        const id = '1';
        const extraind10 = 'hob';
        const extraind6 = 'Active';
        const createrid = '1'; // Assuming a static creator ID for now
        const createrrole = 'admin'; // Assuming a static creator role for now

        const [newid] = await mySqlpool.query("SELECT * FROM indicators WHERE id = ?", [id]);
        if (!newid || newid.length === 0) {
            return res.status(404).json({ error: "id does not exist" });
        }

        const hobid = parseInt(newid[0].hob, 10) || 0;
        const nexthobid = hobid + 1;
        const finalHobid = "HOB_" + String(nexthobid).padStart(3, "0");

        const currentDate = new Date();
        const date = currentDate.toISOString().split('T')[0];
        const time = currentDate.toTimeString().split(' ')[0];

        console.log("Executing query with values:", [
            finalHobid, firstname, lastname, phonecode, mobile, email, username, passwords, date, time, imagePath, country, state, city, gender
        ]);

        const data = await mySqlpool.query(
            `INSERT INTO listofhob (hobid, firstname, lastname, organizationid, organizationname, phonecode, mobile, email, username, passwords, createrid, createrrole, date, time, extraind1, extraind2, extraind3, extraind4, extraind5, extraind6, extraind7, extraind8, extraind9, extraind10) 
            VALUES (?, ?, ?, '', '', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', '', '', ?)`,
            [finalHobid, firstname, lastname, phonecode, mobile, email, username, passwords, createrid, createrrole, date, time, imagePath, gender, country, state, city, extraind6, extraind10]
        );

        if (!data) {
            return res.status(500).json({ error: "Error inserting data into the database" });
        }

        await mySqlpool.query(`UPDATE indicators SET hob = ? WHERE id = ?`, [nexthobid, id]);

        const newHob = {
            hobid: finalHobid,
            firstname,
            lastname,
            phonecode,
            mobile,
            email,
            gender,
            country,
            state,
            city,
            date,
            time,
            imageUrl: `${req.protocol}://${req.get('host')}/uploads/hob/${imagePath}`,
        };
        broadcast(newHob); // Use broadcast to send updates

        broadcastNotification({
            type: 'notification',
            title: 'New HOB Registered',
            message: `HOB ID ${finalHobid} HOB "${firstname} ${lastname}" registered successfully.`,
            timestamp: new Date().toISOString()
        });




        res.status(201).json({ message: "HOB registered successfully", hobid: finalHobid });

        await sendMail({
            to: email,
            subject: 'HOB Registration Successful',
            text: `Hello ${firstname},\n\nYour HOB has been registered successfully. Your HOB ID is ${finalHobid}.`,
            html:  hobRegistrationTemplate({ firstname, email, extraind10 })
        });



    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

const getHobById = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(402).json({ error: "we not recieved any id value" })
        }

        const [data] = await mySqlpool.query(`SELECT * FROM listofhob WHERE id=?`, [userId]);
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No user found" });
        }
        res.status(200).json({ messege: "user details is ", HobDetails: data[0] });
        console.log({ messege: "user details is ", HobDetails: data[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Somthing Wrong in this API" })
    }
}

// Update User code 
// const userUpdate = async (req, res) => {
//     try {
//         const userid = req.params.id;
//         if (!userid) {
//             res.status(404).json({ messege: "Ivalid Id or Privide Id" })
//             console.log("we didnt get any id");
//         }
//         const { name, mobile, email, age } = req.body
//         const data = await db.query(`UPDATE  register SET name = ? , mobile = ?, email = ?, age = ? WHERE id = ?`, [name, mobile, email, age, userid]);
//         if (!data) {
//             return res.status(401).json({ error: "Error in Update code" });
//             console.log("this code is not working")
//         }
//         res.status(200).json({ messege: "Updated successfully" })
//         console.log("Updated Successfully");
//     } catch (error) {
//         console.error(error)
//         res.status(500).json({ messege: "Internal server error", error })
//     }
// }

// const userDelete = async (req, res) => {
//     try {
//         const userID = req.params.id;
//         if (!userID) {
//             res.status(401).json({ error: "Invalid Id or we didnt any id" })
//             console.log("we didnt get any id")
//         }
//         const data = await db.query(`DELETE FROM register WHERE id = ?`, [userID])
//         if (!data) {
//             res.status(405).json({ error: "something is thing in this delete code" });
//             console.log("some thing wrong in the code")
//         }
//         res.status(203).json({ messege: "user deleted succesfully" })
//         console.log("user Delete Successfully");

//     } catch (error) {
//         res.status(504).json({ messege: "Internal server Error", error })
//         console.error(error);
//     }
// }

module.exports = { getHobById, HobRegistration }
