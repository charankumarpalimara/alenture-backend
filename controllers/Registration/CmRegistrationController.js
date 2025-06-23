const mySqlpool = require("../../db");
// const db = require('./db');

const multer = require("multer");
const path = require("path");
const WebSocket = require("ws");
const { broadcast, broadcastNotification } = require("../../WebSocketUtils");

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For URL-encoded payloads

const cmimage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/cm")); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate a unique filename
  },
});

const uploadcm = multer({ cmimage });

const CmRegister = async (req, res) => {
  try {
   
    // console.log("Incoming file:", req.file); // Log incoming file
    const {
      firstname,
      lastname,
      phonecode,
      mobile,
      email,
      gender,
      designation,
      organization,
      branch,
      username,
      passwords,
      crmId,
      crmName,
      createrid,
      createrrole,
    } = req.body;
     console.log("Incoming body:", req.body); // Log incoming text fields

    // Validate required fields
    // if (!firstname || !lastname || !phonecode || !mobile || !email || !gender || !designation || !organization || !branch || !username || !passwords || !createrid || !createrrole) {
    //     return res.status(400).json({ error: "Please provide firstname, lastname, and other required fields" });
    //     console.log("Please provide firstname, lastname, and other required fields");
    // }
    // if (!req.file) {
    //   return res.status(400).json({ error: "Please upload an image" });
    //   console.log("image is required");
    // }




    const imagePath = req.file ? req.file.filename : "";
    const id = "1";
    const extraind10 = "cm";
    const extraind3 = "Active";

    if ((crmId, crmName)) {
      // Get the current cm indicator
      const [newid] = await mySqlpool.query(
        "SELECT * FROM indicators WHERE id = ?",
        [id]
      );
      if (!newid || newid.length === 0) {
        return res.status(404).json({ error: "id does not exist" });
      }
      if (newid) {
        const cmColumnName = Object.keys(newid[0])[3];
        const cmColumnValue = newid[0][cmColumnName];
        console.log("third column name:", cmColumnName);
        console.log("third column value:", cmColumnValue);
      }

      const cmid = parseInt(newid[0].cm, 10) || 0;
      const nextcmid = cmid + 1;
      const finalCMid = "CM_" + String(nextcmid).padStart(3, "0");
      // Get current date and time
      const currentDate = new Date();
      const date = currentDate.toISOString().split("T")[0];
      const time = currentDate.toTimeString().split(" ")[0];

      const [existingOrganization] = await mySqlpool.query(
        "SELECT * FROM listoforganizations WHERE organizationname = ? ",
        [organization]
      );
      if (existingOrganization.length === 0) {
        return res.status(404).json({ error: "Organization does not exist" });
      }
      const organizationid = existingOrganization[0].organizationid;
      const organizationname = existingOrganization[0].organizationname;
      // Insert the new CM
      const [data] = await mySqlpool.query(
        "INSERT INTO listofcm (id, cmid, firstname, lastname, organizationid, organizationname, branch, crmid, crmname, phonecode, mobile, email, username, passwords, createrid, createrrole, date, time, extraind1, extraind2, extraind3, extraind4, extraind5, extraind6, extraind7, extraind8, extraind9, extraind10) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', '', '', '', '', '', ?)",
        [
          finalCMid,
          firstname,
          lastname,
          organizationid,
          organizationname,
          branch,
          crmId,
          crmName,
          phonecode,
          mobile,
          email,
          username,
          passwords,
          createrid,
          createrrole,
          date,
          time,
          imagePath,
          gender,
          extraind3,
          extraind10,
        ]
      );
      if (!data) {
        return res
          .status(500)
          .json({ error: "Error inserting data into the database" });
      }
      const CmFullName = firstname + lastname;

      const [result] = await mySqlpool.query(
        `INSERT INTO assignedrelations (id, crmid, crmname, cmid, cmname, organizationid, organizationname, branch, phonecode, mobile, email, username, passwords, createrid, createrrole, date, time, extraind1, extraind2, extraind3, extraind4, extraind5, extraind6, extraind7, extraind8, extraind9, extraind10)
            VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, '', '', '', '', '', ?, ?, ?, ?, '', '', '', '', '', '', '', '', '', '')`,
        [
          crmId,
          crmName,
          finalCMid,
          CmFullName,
          organizationid,
          organizationname,
          branch,
          createrid,
          createrrole,
          date,
          time,
        ]
      );

      await mySqlpool.query(`UPDATE indicators SET cm = ? WHERE id = ?`, [
        nextcmid,
        id,
      ]);

      broadcastNotification({
        type: "notification",
        title: "New CM Registered",
        message: `CM "${firstname} ${lastname}" registered successfully.`,
        timestamp: new Date().toISOString(),
      });
      broadcast({
        title: "New CM Registered",
        message: `CM "${firstname} ${lastname}" registered successfully.`,
      });
      res.status(200).json({ message: "User registered successfully", data });
      console.log("User registered successfully with cmid:", finalCMid);
    } else {
      // Get the current cm indicator
      const [newid] = await mySqlpool.query(
        "SELECT * FROM indicators WHERE id = ?",
        [id]
      );
      if (!newid || newid.length === 0) {
        return res.status(404).json({ error: "id does not exist" });
      }
      if (newid) {
        const cmColumnName = Object.keys(newid[0])[3];
        const cmColumnValue = newid[0][cmColumnName];
        console.log("third column name:", cmColumnName);
        console.log("third column value:", cmColumnValue);
      }

      const cmid = parseInt(newid[0].cm, 10) || 0;
      const nextcmid = cmid + 1;
      const finalCMid = "CM_" + String(nextcmid).padStart(3, "0");
      // Get current date and time
      const currentDate = new Date();
      const date = currentDate.toISOString().split("T")[0];
      const time = currentDate.toTimeString().split(" ")[0];

      const [existingOrganization] = await mySqlpool.query(
        "SELECT * FROM listoforganizations WHERE organizationname = ? ",
        [organization]
      );
      if (existingOrganization.length === 0) {
        return res.status(404).json({ error: "Organization does not exist" });
      }
      const organizationid = existingOrganization[0].organizationid;
      const organizationname = existingOrganization[0].organizationname;
      // Insert the new CM
      const [data] = await mySqlpool.query(
        "INSERT INTO listofcm (id, cmid, firstname, lastname, organizationid, organizationname, branch, crmid, crmname, phonecode, mobile, email, username, passwords, createrid, createrrole, date, time, extraind1, extraind2, extraind3, extraind4, extraind5, extraind6, extraind7, extraind8, extraind9, extraind10) VALUES (NULL, ?, ?, ?, ?, ?, ?, '', '', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', '', '', '', '', '', ?)",
        [
          finalCMid,
          firstname,
          lastname,
          organizationid,
          organizationname,
          branch,
          crmId,
          crmName,
          phonecode,
          mobile,
          email,
          username,
          passwords,
          createrid,
          createrrole,
          date,
          time,
          imagePath,
          gender,
          extraind3,
          extraind10,
        ]
      );
      if (!data) {
        return res
          .status(500)
          .json({ error: "Error inserting data into the database" });
      }
      await mySqlpool.query(`UPDATE indicators SET cm = ? WHERE id = ?`, [
        nextcmid,
        id,
      ]);
      broadcastNotification({
        type: "notification",
        title: "New CM Registered",
        message: `CM ID ${finalCMid}   CM "${firstname} ${lastname}" registered successfully.`,
        timestamp: new Date().toISOString(),
      });
      broadcast({
        title: "New CM Registered",
        message: `CM "${firstname} ${lastname}" registered successfully.`,
      });

      res.status(200).json({ message: "User registered successfully", data });
      console.log("User registered successfully with cmid:", finalCMid);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { CmRegister };
