const express = require('express');
const mySqlpool = require('../../../db');



const RelationCreate = async (req, res) => {
    try {
                
 const { organization, branch, cmid, cmname, crmid, crmname, createrid, createrrole } = req.body;

 console.log("Received data:", req.body);
        if (!organization || !branch || !cmid || !cmname || !crmid || !crmname || !createrid || !createrrole) {
            return res.status(400).json({ error: "All fields are required" });
        }
    //  const [existingCmDetails] = await mySqlpool.query(
    //     "SELECT * FROM listofocm WHERE cmname = ? ",
    //     [organization]
    //   );


      const [existingOrganization] = await mySqlpool.query(
        "SELECT * FROM listoforganizations WHERE organizationname = ? ",
        [organization]
      );
    //   if (existingOrganization.length === 0) {
    //     return res.status(404).json({ error: "Organization does not exist" });
    //   }
      const organizationid = existingOrganization[0].organizationid;
      const organizationname = existingOrganization[0].organizationname;


      const [existingCmDetails] = await mySqlpool.query(
        "SELECT * FROM assignedrelations WHERE organizationid = ? AND cmid = ? AND crmid = ?",
        [organizationid, cmid, crmid]
      );
            if (!existingCmDetails || existingCmDetails.length > 0) {
            return res.status(404).json({ error: "Relation Already Exicist" });
        }

      const currentDate = new Date();
      const date = currentDate.toISOString().split("T")[0];
      const time = currentDate.toTimeString().split(" ")[0];

    const [result] = await mySqlpool.query(
        `INSERT INTO assignedrelations (id, crmid, crmname, cmid, cmname, organizationid, organizationname, branch, phonecode, mobile, email, username, passwords, createrid, createrrole, date, time, extraind1, extraind2, extraind3, extraind4, extraind5, extraind6, extraind7, extraind8, extraind9, extraind10)
            VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, '', '', '', '', '', ?, ?, ?, ?, '', '', '', '', '', '', '', '', '', '')`,
        [
          crmid,
          crmname,
          cmid,
          cmname,
          organizationid,
          organizationname,
          branch,
          createrid,
          createrrole,
          date,
          time,
        ]
      );

        res.status(201).json({ message: "Relation created successfully", id: result.insertId });
        console.log("Relation created successfully with ID:", result.insertId);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error in Create Relation API" });
    }
}


module.exports = {RelationCreate};