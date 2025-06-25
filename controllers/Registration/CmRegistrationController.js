const mySqlpool = require("../../db");
// const db = require('./db');

const multer = require("multer");
const path = require("path");
const WebSocket = require("ws");
const { broadcast, broadcastNotification } = require("../../WebSocketUtils");
const sendMail = require('../Mails/sendMail'); // Import the mail service

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


      await sendMail({
        to: email,
        subject: 'CM Registration Successful',
        text: `Hello ${firstname},\n\nYour CM has been registered successfully. Your CM ID is ${finalCMid}.`,
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Alantur</title>
    <style>
        /* Reset styles for email clients */
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        /* Main styles */
        body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: #f4f4f4;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }

        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }

        .header .emoji {
            font-size: 32px;
            margin-right: 10px;
        }

        .content {
            padding: 40px 30px;
            line-height: 1.6;
            color: #333333;
        }

        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #2c3e50;
        }

        .main-text {
            font-size: 16px;
            margin-bottom: 25px;
            color: #555555;
        }

        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            transition: transform 0.2s ease;
        }

        .cta-button:hover {
            transform: translateY(-2px);
        }

        .features-list {
            background-color: #f8f9fa;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
        }

        .features-list h3 {
            color: #2c3e50;
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 18px;
        }

        .feature-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;
            font-size: 15px;
        }

        .feature-item .checkmark {
            color: #27ae60;
            font-weight: bold;
            margin-right: 10px;
            font-size: 16px;
        }

        .role-specific {
            background-color: #e8f4fd;
            border-left: 4px solid #3498db;
            padding: 20px;
            margin: 25px 0;
            border-radius: 0 6px 6px 0;
        }

        .role-specific h4 {
            color: #2980b9;
            margin-top: 0;
            margin-bottom: 15px;
        }

        .footer {
            background-color: #2c3e50;
            color: white;
            padding: 25px 30px;
            text-align: center;
        }

        .footer p {
            margin: 5px 0;
            font-size: 14px;
        }

        .company-name {
            font-weight: 600;
            color: #3498db;
        }

        .security-notice {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            font-size: 14px;
            color: #856404;
        }

        .expiry-notice {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            font-size: 14px;
            color: #721c24;
            font-weight: 500;
        }

        /* Responsive design */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                margin: 0 !important;
                border-radius: 0 !important;
            }
            
            .content {
                padding: 30px 20px !important;
            }
            
            .header {
                padding: 25px 20px !important;
            }
            
            .header h1 {
                font-size: 24px !important;
            }
            
            .cta-button {
                display: block !important;
                text-align: center !important;
                width: 100% !important;
                box-sizing: border-box !important;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
<div class="header">
    <img src="https://yukthitech.co.in/logo.png" alt="Alantur Logo" style="max-width: 180px; margin-bottom: 15px;" />
    <h1>Welcome to Alantur</h1>
</div>

        <!-- Content -->
        <div class="content">
<div class="greeting">
    Hi <strong>${firstname}</strong>,
</div>

<div class="main-text">
    Welcome to <strong>Alantur</strong> – we're excited to have you on board!
    <br><br>
    Your login username is: <strong>${email}</strong>
</div>

            <div class="main-text">
                Your account has been successfully created, and you've just taken the first step toward transforming your business operations.
            </div>

            <div class="main-text">
                Before you dive in, please take a moment to set up your password:
            </div>

            <div style="text-align: center;">
                <a href="[PASSWORD_SETUP_LINK]" class="cta-button">
                    🔐 Set Your Password Now
                </a>
            </div>

            <div class="features-list">
                <h3>Once that's done, you'll be ready to:</h3>
                <div class="feature-item">
                    <span class="checkmark">✅</span>
                    <span>Log in to your account</span>
                </div>
                <div class="feature-item">
                    <span class="checkmark">✅</span>
                    <span>Personalize your profile</span>
                </div>
                <div class="feature-item">
                    <span class="checkmark">✅</span>
                    <span>Explore everything we've built just for you</span>
                </div>
            </div>

            <div class="role-specific">
                <h4>What's next for you:</h4>
                <p>As a <strong>${extraind10}</strong>, you can:</p>
                
                 <!-- Head of Business Role 
                // <div class="feature-item" data-role="hob">
                //     <span class="checkmark">✅</span>
                //     <span><strong>Head of Business</strong> – Oversee business performance, access key reports, and manage high-level strategy</span>
                // </div> -->
                
                <!-- CRM Role 
                // <div class="feature-item" data-role="crm">
                //     <span class="checkmark">✅</span>
                //     <span><strong>CRM</strong> – Track customer interactions, manage leads, and build stronger relationships</span>
                // </div> -->
                
                 <!-- Admin Role 
                // <div class="feature-item" data-role="admin">
                //     <span class="checkmark">✅</span>
                //     <span><strong>Admin</strong> – Control user permissions, manage platform settings, and maintain security</span>
                // </div> -->
                
                <!-- Customer Manager Role -->
                <div class="feature-item" data-role="cm">
                    <span class="checkmark">✅</span>
                    <span><strong>Customer Manager</strong> – Submit customer feedback and manage customer experiences</span>
                </div>
            </div>

            <div class="main-text">
                Need help getting started? Our support team is here to help—just hit reply or visit our <a href="https://www.alantur.ai/" style="color: #3498db;">Help Center</a>.
            </div>

            <div class="main-text">
                We're excited to have you with us. Let's make something great happen!
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Warm regards,</p>
            <p><span class="company-name">Alantur Inc</span></p>
            <p style="font-size: 12px; margin-top: 15px; opacity: 0.8;">
                This email was sent to ${email}. If you have any questions, please contact our support team.
            </p>
        </div>
    </div>
</body>
</html>
`
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
