const express = require("express");
const mySqlpool = require("../../db");

const updateExperienceStatus = async (req, res) => {
  try {
    const { experienceid } = req.body;
    if (!experienceid) {
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
      "UPDATE experiences SET status = ? WHERE experienceid = ?",
      ["Processing", experienceid]
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
    const { experienceid, status } = req.body;
    console.log(req.body);

    if (!experienceid || !status) {
      return res
        .status(400)
        .json({ error: "Experience ID and status are required" });
    }

    const [existingstatus] = await mySqlpool.query(
      "SELECT * FROM experiences WHERE experienceid = ?",
      [experienceid]
    );

    const [result] = await mySqlpool.query(
      "UPDATE experiences SET status = ? WHERE experienceid = ?",
      [status, experienceid]
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

      await mySqlpool.query(
        `INSERT INTO notifications (finalExperienceid,title, message, crmid, cmid,type,is_read, created_at)
   VALUES (?,?, ?, ?, ?,?,  ?, NOW())`,
        [
          rows[0].finalExperienceid,
          "Experience Registered",
          `EXPERIENCE ID ${rows[0].finalExperienceid} of "${rows[0].cmid}" resolved successfully.`,
          rows[0].crmid,
          rows[0].cmid,
          "experience_resolved",
          0,
        ]
      );

      broadcastNotification({
        type: "notification",
        title: "Experience Resolved",
        message: `EXPERIENCE ID ${rows[0].finalExperienceid} of "${rows[0].cmid}" resolved successfully.`,
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
