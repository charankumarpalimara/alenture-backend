
const express = require("express");
const mySqlpool = require("../../../db");

// updateCmProfile

const updateCmProfile = async (req, res) => {
  try {
    const { cmid, firstName, password, lastName, PhoneNo, email, gender } =
      req.body;
      console.log("Received request to update CM profile:", req.body);
      console.log("Received file:", req.file);
    let updateFields = [firstName, lastName, email, PhoneNo, gender, password];
    let sql = `UPDATE listofcm SET firstname = ?, lastname = ?,  email = ?, mobile = ?, extraind2 = ?, passwords = ?`;
    // If file is present, update extraind1 (profile image)
    if (req.file && req.file.filename) {
      sql += ", extraind1 = ?";
      updateFields.push(req.file.filename);
    }
    sql += " WHERE cmid = ?";
    updateFields.push(cmid);
    const [result] = await mySqlpool.query(sql, updateFields);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cm not found or no changes made" });
    }
    // Construct imageUrl if image was updated, else fetch current image
    let imageUrl = null;
    let imageFile = req.file && req.file.filename ? req.file.filename : null;
    if (!imageFile) {
      // Fetch current image filename from DB
      const [rows] = await mySqlpool.query(
        "SELECT extraind1 FROM listofcm WHERE cmid = ?",
        [cmid]
      );
      if (rows && rows[0] && rows[0].extraind1) {
        imageFile = rows[0].extraind1;
      }
    }
    if (imageFile) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/cm/${imageFile}`;
    }
    res
      .status(200)
      .json({ message: "Cm profile updated successfully", imageUrl: imageUrl });
    console.log("Cm profile updated successfully", imageUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};







const updateCmProfileByAdminHob = async (req, res) => {
  try {
    const {
      cmid,
      firstName,
      lastName,
      password = " ",
      PhoneNo,
      email,
      gender,
      crmid,
      crmname,
      organizationid,
      organizationname,
      branch,
      status,
      createrid,
      createrrole
    } = req.body;
    console.log("Received request to update CM profile by Admin:", req.body);
    let updateFields = [
      firstName,
      lastName,
      email,
      PhoneNo,
      organizationid,
      organizationname,
      branch,
      status,
      gender,
      password,
      crmid,
      crmname,
    ];
    let sql = `UPDATE listofcm SET firstname = ?, lastname = ?,  email = ?, mobile = ?, organizationid = ?, organizationname = ?, branch = ?, extraind3 = ?, extraind2 = ?, passwords = ?, crmid = ?, crmname = ?`;


    // If file is present, update extraind1 (profile image)
    if (req.file && req.file.filename) {
      sql += ", extraind1 = ?";
      updateFields.push(req.file.filename);
    }
    sql += " WHERE cmid = ?";
    updateFields.push(cmid);
    const [result] = await mySqlpool.query(sql, updateFields);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cm not found or no changes made" });
    }
    let updateFields2 = [
      crmid,
      crmname,
      cmid
    ];

      const currentDate = new Date();
      const date = currentDate.toISOString().split("T")[0];
      const time = currentDate.toTimeString().split(" ")[0];


      const  CmFullName = firstName + " " + lastName;

  let sql2 = `UPDATE assignedrelations SET crmid = ?, crmname = ? WHERE cmid = ?`;
  const [result2] = await mySqlpool.query(sql2, updateFields2);

if (result2.affectedRows === 0) {
    const [result3] = await mySqlpool.query(
        `INSERT INTO assignedrelations (id, crmid, crmname, cmid, cmname, organizationid, organizationname, branch, phonecode, mobile, email, username, passwords, createrid, createrrole, date, time, extraind1, extraind2, extraind3, extraind4, extraind5, extraind6, extraind7, extraind8, extraind9, extraind10)
            VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, '', '', '', '', '', ?, ?, ?, ?, '', '', '', '', '', '', '', '', '', '')`,
        [
            crmid,
            crmname,
            cmid,
            CmFullName,
            organizationid,
            organizationname,
            branch,
            createrid,
            createrrole,
            date,
            time
        ]
    );
}

    // Construct imageUrl if image was updated, else fetch current image
    let imageUrl = null;
    let imageFile = req.file && req.file.filename ? req.file.filename : null;
    if (!imageFile) {
      // Fetch current image filename from DB
      const [rows] = await mySqlpool.query(
        "SELECT extraind1 FROM listofcm WHERE cmid = ?",
        [cmid]
      );
      if (rows && rows[0] && rows[0].extraind1) {
        imageFile = rows[0].extraind1;
      }
    }
    if (imageFile) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/cm/${imageFile}`;
    }
    res
      .status(200)
      .json({ message: "Cm profile updated successfully", imageUrl: imageUrl });
    console.log("Cm profile updated successfully", imageUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { updateCmProfile, updateCmProfileByAdminHob };

