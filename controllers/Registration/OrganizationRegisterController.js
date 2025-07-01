const express = require("express");
const mySqlpool = require("../../db");
const { broadcast, broadcastNotification } = require("../../WebSocketUtils");
const sendMail = require('../Mails-Service/sendMail'); // Import the mail service

const organizationRegister = async (req, res) => {
  try {
    console.log("Incoming body:", req.body); // Log incoming text fields
    const {
      organizationname,
      branch,
      phonecode,
      mobile,
      email,
      username,
      passwords,
      country,
      state,
      district,
      address,
      postalcode,
      createrid,
      createrrole,
    } = req.body;
    // if (!organizationname || !branch || !email || !username || !passwords || !country || !state || !district || !postalcode || !createrid || !createrrole) {
    //     return res.status(400).json({ error: "Please provide all required fields" });
    //     console.log("Incoming body:", req.body); // Log incoming text fields
    // }

    const [existingUser] = await mySqlpool.query(
      "SELECT * FROM listoforganizations WHERE organizationname  = ? AND branch = ? ",
      [organizationname, branch]
    );
    if (existingUser.length > 0) {
      return res.status(409).json({ error: "Organization Already Excist" });
    }

    const [parentBranch] = await mySqlpool.query(
      "SELECT * FROM listoforganizations WHERE organizationname = ? AND branchtype = 'Parent'",
      [organizationname]
    );
    let branchtype = parentBranch.length === 0 ? "Parent" : "Branch";

    const id = "1";

    const [newid] = await mySqlpool.query(
      "SELECT * FROM indicators WHERE id = ?",
      [id]
    );
    if (!newid || newid.length === 0) {
      return res.status(404).json({ error: "id does not exist" });
    }

    if (newid) {
      const fifthColumnName = Object.keys(newid[0])[5]; // Get the second column name
      const fifthColumnValue = newid[0][fifthColumnName]; // Get the second column value
      console.log("fifth column name:", fifthColumnName);
      console.log("fifth column value:", fifthColumnValue);
    }

    const orgid = parseInt(newid[0].org, 10) || 0;
    const nextorgid = orgid + 1;
    const finalOrgid = "ORG_" + String(nextorgid).padStart(3, "0");
    const currentDate = new Date();
    const date = currentDate.toISOString().split("T")[0];
    const time = currentDate.toTimeString().split(" ")[0];

    const [data] = await mySqlpool.query(
      "INSERT INTO listoforganizations (organizationid, organizationname, branch, branchtype, phonecode, mobile, email, username, passwords, country, state, district, address, postalcode, createrid, createrrole, date, time, extraind1, extraind2, extraind3, extraind4, extraind5, extraind6, extraind7, extraind8, extraind9, extraind10) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', '', '', '', '', '', '', '', '', '')",
      [
        finalOrgid,
        organizationname,
        branch,
        branchtype,
        phonecode,
        mobile,
        email,
        username,
        passwords,
        country,
        state,
        district,
        address,
        postalcode,
        createrid,
        createrrole,
        date,
        time,
      ]
    );

    if (!data) {
      return res.status(500).json({ error: "Error in registration" });
    }
    await mySqlpool.query(`UPDATE indicators SET org = ? WHERE id = ?`, [
      nextorgid,
      id,
    ]);
    // Fetch the newly inserted organization data
    const [newOrgRows] = await mySqlpool.query(
      "SELECT * FROM listoforganizations WHERE organizationid = ?",
      [finalOrgid]
    );
    if (newOrgRows && newOrgRows.length > 0) {
      broadcast(newOrgRows[0]); // Broadcast the new org to all WebSocket clients
    }
    broadcastNotification({
      type: "notification",
      title: "New ORGANIZATION Registered",
      message: `ORGANIZATION ID ${finalOrgid} ORGANIZATION "${organizationname}" registered successfully.`,
      timestamp: new Date().toISOString(),
    });


    // await sendMail({
    //   to: email,
    //   subject: 'Organization Registration Successful',
    //   text: `Hello ${organizationname},\n\nYour organization has been registered successfully. Your Organization ID is ${finalOrgid}.`,
    //   html: `<p>Hello <b>${organizationname}</b>,</p><p>Your organization has been registered successfully.<br>Your Organization ID is <b>${finalOrgid}</b>.</p>`
    // });

     res.status(201).json({
        message: "Registration successful",
        data,
        orgid: finalOrgid,
        organization: newOrgRows[0] || null,
      });
    console.log("User registered successfully with orgid:", finalOrgid);
  } catch (error) {
    console.error("Error during user registration:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};


const updateOrganization = async (req, res) => {
  try {
    const {
      organizationid,        // You should send this from frontend for update
      organizationname,
      branch,
      phonecode,
      mobile,
      email,
      username,
      passwords,
      country,
      state,
      district,
      address,
      postalcode,
      createrid,
      createrrole,
    } = req.body;
    console.log("Received data for update:", req.body);

    // Build the update query and parameters
    const updateFields = [
      organizationname,
      branch,
      phonecode,
      mobile,
      email,
      username,
      passwords,
      country,
      state,
      district,
      address,
      postalcode,
      createrid,
      createrrole,
      organizationid,
      // branch,
    ];

    const query = `
      UPDATE listoforganizations
      SET organizationname = ?, branch = ?, phonecode = ?, mobile = ?, email = ?, username = ?, passwords = ?, country = ?, state = ?, district = ?, address = ?, postalcode = ?, createrid = ?, createrrole = ?
      WHERE organizationid = ? 
    `;

    const [result] = await mySqlpool.query(query, updateFields);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Organization not found" });
    }

    res.status(200).json({ message: "Organization updated successfully" });
  } catch (error) {
    console.error("Error updating organization:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



const organizationAdding = async (req, res) => {
  try {
    console.log("Incoming body:", req.body); // Log incoming text fields
    const {
      organizationid,
      organizationname,
      branch,
      branchtype,
      phonecode,
      mobile,
      email,
      username,
      passwords,
      country,
      state,
      district,
      address,
      postalcode,
      createrid,
      createrrole,
    } = req.body;
    console.log("Received data:", req.body); // Log incoming text fieldss
    if (
      !organizationid ||
      !organizationname ||
      !branch ||
      !branchtype ||
      !email ||
      !username ||
      !passwords ||
      !country ||
      !state ||
      !district ||
      !postalcode ||
      !createrid ||
      !createrrole
    ) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    const [existingUser] = await mySqlpool.query(
      "SELECT * FROM listoforganizations WHERE organizationid  = ? AND branch = ? ",
      [organizationid, branch]
    );
    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ error: "Branch Already Exicist", branch: branch });
    }

    const currentDate = new Date();
    const date = currentDate.toISOString().split("T")[0];
    const time = currentDate.toTimeString().split(" ")[0];

    const [data] = await mySqlpool.query(
      "INSERT INTO listoforganizations (organizationid, organizationname, branch, branchtype, phonecode, mobile, email, username, passwords, country, state, district, address, postalcode, createrid, createrrole, date, time, extraind1, extraind2, extraind3, extraind4, extraind5, extraind6, extraind7, extraind8, extraind9, extraind10) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', '', '', '', '', '', '', '', '', '')",
      [
        organizationid,
        organizationname,
        branch,
        branchtype,
        phonecode,
        mobile,
        email,
        username,
        passwords,
        country,
        state,
        district,
        address,
        postalcode,
        createrid,
        createrrole,
        date,
        time,
      ]
    );

    if (!data) {
      return res.status(500).json({ error: "Error in registration" });
    }
    // Fetch the newly inserted organization data
    const [newOrgRows] = await mySqlpool.query(
      "SELECT * FROM listoforganizations WHERE organizationid = ?",
      [organizationid]
    );
    if (newOrgRows && newOrgRows.length > 0) {
      broadcast(newOrgRows[0]); // Broadcast the new org to all WebSocket clients
    }
    broadcastNotification({
      type: "notification",
      title: "New ORGANIZATION BRANCH Registered",
      message: `ORGANIZATION"${organizationname}'s BRACH ${branch}" registered successfully.`,
      timestamp: new Date().toISOString(),
    });
    res
      .status(201)
      .json({ message: "Branch Added  successful", data, organizationid });
    console.log("User registered successfully with orgid:", organizationid);
  } catch (error) {
    console.error("Error during user registration:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

module.exports = { organizationRegister, updateOrganization, organizationAdding };
