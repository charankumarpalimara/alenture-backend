const express = require("express");
const mySqlpool = require("../../db");
const { broadcastNotification } = require("../../WebSocketUtils");

const updateExperienceStatus = async (req, res) => {
  try {
    const { experienceid, date, time } = req.body;
    console.log("experinec data :", req.body)
    if (!experienceid || !date || !time) {
      return res.status(400).json({ error: "Experience ID is required" });
    }

    // Get current status
    const [existingStatusRows] = await mySqlpool.query(
      "SELECT status FROM experiences WHERE experienceid = ?",
      [experienceid]
    );

    if (!existingStatusRows || existingStatusRows.length === 0) {
      return res.status(404).json({ error: "Experience not found" });
    }

    const currentStatus = existingStatusRows[0].status;

    if (currentStatus !== "New") {
      return res
        .status(200)
        .json({ message: "Status is not 'New', so no update performed." });
    }


    // Update to Processing
    const [result] = await mySqlpool.query(
      "UPDATE experiences SET status = ?, extraind3 = ?, extraind4 = ? WHERE experienceid = ?",
      ["Processing", time, date, experienceid]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Experience not found" });
    }

    res.status(200).json({
      message: "Experience status updated to Processing successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



const updateExperienceStatusToResolve = async (req, res) => {
  try {
    const { experienceid, status, date, time } = req.body;
    console.log("experience update resolve", req.body);

    if (!experienceid || !status) {
      return res
        .status(400)
        .json({ error: "Experience ID and status are required" });
    }

    // const currentDate = new Date();
    // const resolvedDate = currentDate.toLocaleDateString('en-US'); // e.g., "07/04/2025"
    // const resolvedTime = currentDate.toLocaleTimeString('en-US', { hour12: true }); // e.g., "3:45:12 PM"

    const [existingstatus] = await mySqlpool.query(
      "SELECT * FROM experiences WHERE experienceid = ?",
      [experienceid]
    );

    const [existingTasks] = await mySqlpool.query(
      "SELECT * FROM experiencetasks WHERE experienceid = ? AND (status = 'New' OR status = 'In Progress')",
      [experienceid]
    );

    if (existingTasks.length > 0) {
      return res.status(402).json({
        error: "Task Should Complete First",
      });
    }



    const [result] = await mySqlpool.query(
      "UPDATE experiences SET status = ?, extraind5 = ?, extraind6 = ? WHERE experienceid = ?",
      [status, time, date, experienceid]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Experience not found" });
    } else {
      const [rows] = await mySqlpool.execute(
        "SELECT * FROM experiences WHERE experienceid = ?",
        [experienceid]
      );
      if (rows.length === 0) {
        return res
          .status(404)
          .json({ error: "Experience data missing after update" });
      }
      console.log("row in experience resolve", rows[0]);

      await mySqlpool.query(
        `INSERT INTO notifications (finalExperienceid, title, message, crmid, cmid, type,is_read, created_at)
   VALUES (?,?, ?, ?, ?,?, ?, NOW())`,
        [
          rows[0].experienceid,
          "Experience Resolved",
          `EXPERIENCE ID ${rows[0].experienceid} of "${rows[0].cmid}" resolved successfully.`,
          rows[0].extraind1,
          rows[0].cmid,
          "experience_resolved",
          0,
        ]
      );

      broadcastNotification({
        type: "notification",
        title: "Experience Resolved",
        message: `EXPERIENCE ID ${rows[0].experienceid} of "${rows[0].cmid}" resolved successfully.`,
        cmid: rows[0].cmid,
      });
    }

    res.status(200).json({ message: "Experience status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  updateExperienceStatus,
  updateExperienceStatusToResolve,
};
