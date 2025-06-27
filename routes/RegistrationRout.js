const express = require('express');
const multer = require('multer');
const path = require('path');

const { HobRegistration } = require('../controllers/Registration/HobRegistrationController');
const { CrmRegister } = require('../controllers/Registration/CrmRegistrationController');
const { CmRegister } = require('../controllers/Registration/CmRegistrationController');
const { organizationRegister, organizationAdding } = require('../controllers/Registration/OrganizationRegisterController');
const { TicketRegistration, updateTicket } = require('../controllers/Registration/TicketRegistrationController');
const { noteRegister } = require('../controllers/Tables/notesController');
const { TaskRegister } = require('../controllers/Registration/TaskRegisterController');

// Configure multer for file uploads
const hobimage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/hob'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const crmimage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/crm'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const cmimage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/cm'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});


// const fileupload = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, '../uploads/experience'));
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + path.extname(file.originalname));
//     }
// });

const uploadcrm = multer({ storage: crmimage });
// const uploadcm = multer({ storage: cmimage });
// const uploadfile = multer({ storage: fileupload });
const upload = multer();


const router = express.Router();

// Create HOB with image upload
router.post('/createHob', multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../uploads/hob'));
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    })
}).single('hobimage'), HobRegistration);

// Create CRM


// Organization Registration
router.post('/createOrganization', upload.none(), organizationRegister);



router.post('/createCrm', multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../uploads/crm'));
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    })
}).single('crmimage'), CrmRegister);


router.post('/createCm', multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../uploads/cm'));
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    })
}).single('cmimage'), CmRegister);




// Create Ticket (no file upload)
router.post('/createTicket', multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../uploads/experience'));
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    })
}).single('fileupload'), TicketRegistration);


router.post('/updateTicket', multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../uploads/experience'));
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    })
}).single('fileupload'), updateTicket);








router.post('/organizationAdding', upload.none(), organizationAdding);

router.post('/createNote', upload.none(), noteRegister);

router.post('/createTask', upload.none(), TaskRegister);


module.exports = router;
