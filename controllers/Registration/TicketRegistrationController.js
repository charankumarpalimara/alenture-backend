const mySqlpool = require("../../db");
const express = require("express");
const path = require("path");

const { wss } = require("../../index"); // Adjust path if needed
const { broadcast, broadcastNotification } = require("../../WebSocketUtils"); // Adjust path if needed

async function broadcastExperienceCounts(mySqlpool, cmid, crmid) {
  // For admin dashboard (all)
  const [[{ total }]] = await mySqlpool.query(
    "SELECT COUNT(experienceid) AS total FROM experiences"
  );
  // For admin dashboard (resolved)
  const [[{ totalResolved }]] = await mySqlpool.query(
    "SELECT COUNT(experienceid) AS totalResolved FROM experiences WHERE status = 'Resolved'"
  );
  // For admin dashboard (new)
  const [[{ totalNew }]] = await mySqlpool.query(
    "SELECT COUNT(experienceid) AS totalNew FROM experiences WHERE status = 'Open'"
  );
  // For admin dashboard (pending)
  const [[{ totalPending }]] = await mySqlpool.query(
    "SELECT COUNT(experienceid) AS totalPending FROM experiences WHERE status = 'Processing'"
  );

  // For CRM dashboard (by crmid)
  let crmCounts = {};
  if (crmid) {
    const [[{ crmTotal }]] = await mySqlpool.query(
      "SELECT COUNT(experienceid) AS crmTotal FROM experiences WHERE extraind1 = ?",
      [crmid]
    );
    const [[{ crmResolved }]] = await mySqlpool.query(
      "SELECT COUNT(experienceid) AS crmResolved FROM experiences WHERE extraind1 = ? AND status = 'Resolved'",
      [crmid]
    );
    const [[{ crmNew }]] = await mySqlpool.query(
      "SELECT COUNT(experienceid) AS crmNew FROM experiences WHERE extraind1 = ? AND status = 'Open'",
      [crmid]
    );
    const [[{ crmPending }]] = await mySqlpool.query(
      "SELECT COUNT(experienceid) AS crmPending FROM experiences WHERE extraind1 = ? AND status = 'Processing'",
      [crmid]
    );
    crmCounts = { crmTotal, crmResolved, crmNew, crmPending, crmid };
  }

  // Broadcast to all clients
  if (wss && wss.clients) {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        // Admin counts
        client.send(
          JSON.stringify({
            type: "adminCounts",
            total,
            totalResolved,
            totalNew,
            totalPending,
          })
        );
        // CRM counts (if available)
        if (crmid) {
          client.send(JSON.stringify({ type: "crmCounts", ...crmCounts }));
        }
      }
    });
  }
}







function generateRandomId(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
} 

// Helper to get a unique experienceid
async function getUniqueExperienceId(pool) {
  let unique = false;
  let randomId = '';
  while (!unique) {
    randomId = generateRandomId();
    const [rows] = await pool.query(
      'SELECT experienceid FROM experiences WHERE experienceid = ?',
      [randomId]
    );
    if (!rows || rows.length === 0) {
      unique = true;
    }
  }
  return randomId;
}


const TicketRegistration = async (req, res) => {
  try {
    const {
      cmid,
      cmname,
      organizationid,
      organizationname,
      branch,
      subject,
      experience,
      experienceDetails,
      impact,
      priority,
      status,
      date,
      time
    } = req.body;
    console.log("Received data:", req.body);
    console.log("Received file:", req.file);

    // Handle file upload
    let filename = "";
    if (req.file) {
      filename = req.file.filename; // This is the saved filename with unique suffix
      console.log("File uploaded successfully:", filename);
    }

    if (
      !cmid ||
      !cmname ||
      !organizationid ||
      !organizationname ||
      !branch ||
      !subject ||
      !experience ||
      !experienceDetails ||
      !impact ||
      !priority ||
      !status
    ) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields." });
    }


    // Generate a unique random experienceid
    const finalExperienceid = await getUniqueExperienceId(mySqlpool);


    const [crmDetails] = await mySqlpool.query(
      "SELECT * FROM assignedrelations WHERE cmid = ? ",
      [cmid]
    );

    if (!crmDetails || crmDetails.length === 0) {
      return res.status(407).json({ error: "Not Assigned to any CRM." });
    }

    let data;

    if (!crmDetails || crmDetails.length === 0) {
      [data] = await mySqlpool.query(
        `INSERT INTO experiences (experienceid, experience, subject, experiencedetails, impact, priority, status, filename, cmid, cmname, organizationid, organizationname, branch, date, time, extraind1, extraind2, extraind3, extraind4, extraind5, extraind6, extraind7, extraind8, extraind9, extraind10) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', '', '', '', '', '', '', '', '', '')`,
        [
          finalExperienceid,
          experience,
          subject,
          experienceDetails,
          impact,
          priority,
          status,
          filename,
          cmid,
          cmname,
          organizationid,
          organizationname,
          branch,
          date,
          time,
        ]
      );
    } else {
      const CrmId = crmDetails[0].crmid;
      const CrmName = crmDetails[0].crmname;

      console.log("CrmId:", CrmId);
      console.log("CrmName:", CrmName);

      [data] = await mySqlpool.query(
        `INSERT INTO experiences (experienceid, experience, subject, experiencedetails, impact, priority, status, filename, cmid, cmname, organizationid, organizationname, branch, date, time, extraind1, extraind2, extraind3, extraind4, extraind5, extraind6, extraind7, extraind8, extraind9, extraind10) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', '', '', '', '', '', '', '')`,
        [
          finalExperienceid,
          experience,
          subject,
          experienceDetails,
          impact,
          priority,
          status,
          filename,
          cmid,
          cmname,
          organizationid,
          organizationname,
          branch,
          date,
          time,
          CrmId,
          CrmName,
        ]
      );
    }

    // await mySqlpool.query(`UPDATE indicators SET experience = ? WHERE id = ?`, [
    //   nextExperienceid,
    //   id,
    // ]);

    const crmid = crmDetails && crmDetails[0] ? crmDetails[0].crmid : null;
    await broadcastExperienceCounts(mySqlpool, cmid, crmid);
    await mySqlpool.query(
      `INSERT INTO notifications (finalExperienceid,title, message, crmid, cmid,type,is_read, created_at)
   VALUES (?,?, ?, ?, ?,?,  ?, NOW())`,
      [
        finalExperienceid,
        "New Experience Registered",
        `EXPERIENCE ID ${finalExperienceid} Experience "${cmname}" registered successfully.`,
        crmid,
        cmid,
        "experience_registration",
        0,
      ]
    );

    broadcastNotification({
      type: "notification",
      title: "New Experience Registered",
      message: `EXPERIENCE ID ${finalExperienceid} Experience "${cmname}" registered successfully.`,
      crmid, // Pass crmid for targeted notification
    });

    console.log(
      "User registered successfully with experienceid:",
      finalExperienceid
    );

    // imageUrl: `${req.protocol}://${req.get('host')}/uploads/experience/${record.filename}`,
    res.status(200).json({
      message: "User registered successfully",
      data,
      experienceid: finalExperienceid,
      filename: filename || null,
    });
  } catch (error) {
    console.error("Error during TicketRegistration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};








const updateTicket = async (req, res) => {
  try {
    const {
      experience,
      subject,
      experienceDetails,
      impact,
      experienceid, // This is the unique identifier for the ticket
    } = req.body;
    console.log("Received data for update:", req.body);

    let filename = "";
    if (req.file) {
      filename = req.file.filename;
    }

    // Build the update query and parameters
    const updateFields = [
      experience,
      subject,
      experienceDetails,
      impact,
    ];
    let query = `
      UPDATE experiences
      SET experience = ?, subject = ?, experiencedetails = ?, impact = ?
    `;

    if (filename) {
      query += `, filename = ?`;
      updateFields.push(filename);
    }

    query += ` WHERE experienceid = ?`;
    updateFields.push(experienceid);

    // Execute the update
    const [result] = await mySqlpool.query(query, updateFields);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Experience not found" });
    }

    res.status(200).json({ message: "Experience updated successfully" });
  } catch (error) {
    console.error("Error updating experience:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// module.exports = { updateTicket };

module.exports = { TicketRegistration, updateTicket };
