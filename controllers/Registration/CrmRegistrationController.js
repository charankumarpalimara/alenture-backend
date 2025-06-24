const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For URL-encoded payloads

// const crmimage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, '../uploads/crm')); // Save files in the 'uploads' folder
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate a unique filename
//     }
// });

// const uploadcrm = multer({ crmimage });

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
        // Construct imageUrl if image was updated, else fetch current image
        let imageUrl = null;
        let imageFile = req.file && req.file.filename ? req.file.filename : null;
        if (!imageFile) {
            // Fetch current image filename from DB
            const [rows] = await mySqlpool.query('SELECT extraind1 FROM listofcrm WHERE crmid = ?', [crmid]);
            if (rows && rows[0] && rows[0].extraind1) {
                imageFile = rows[0].extraind1;
            }
        }
        if (imageFile) {
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/crm/${imageFile}`;
        }
        res.status(200).json({ message: "Crm profile updated successfully", imageUrl: imageUrl });
        console.log("Crm profile updated successfully", imageUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {  CrmRegister  };
