const express = require('express');
const multer = require('multer');
const path = require('path');

// Login Components
const { AdminLogin } = require('../controllers/AdminLogin');
const { updateAdminProfile } = require('../controllers/AdminProfileUpdate');
const {CmLogin} = require('../controllers/CmLogin');

// Users Data get Components
const { getAllCrm, getAllCrmid, getCrmName } = require('../controllers/CrmgetData');
const { getAllHobs } = require('../controllers/HobGetData');
const { getAllOrgs, getAllOrgId, getOrgNamebyOrgId } = require('../controllers/OrganizationGetData');
const { getAllCm, getCmDataById } = require('../controllers/CmGetData');
const { getAllTickets, getAllTicketsbyCrmid } = require('../controllers/TicketDetailsGet')
const {getBranchbyOrganizationname} =require('../controllers/BrachGetData');
// const {getAllbyCrmid } = require('../controllers/TicketDetailsGet')
// Registration Components
const { getElementById, userRegister } = require('../controllers/HobRegistrationController');
const { CrmRegister } = require('../controllers/CrmRegistrationController');
const { CmRegister } = require('../controllers/CmRegistrationController');
const {organizationRegister} = require('../controllers/OrganizationRegisterController');
const { TicketRegistration } = require('../controllers/TicketRegistrationController');
const { updateCustomerManager } = require('../controllers/CmUpdateController');

// Configure multer for file uploads
const hobimage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/hob')); // Save files in the 'uploads/hob' folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate a unique filename
    }
});

const crmimage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/crm')); // Save files in the 'uploads/crm' folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate a unique filename
    }
});

const cmimage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/cm')); // Save files in the 'uploads/cm' folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate a unique filename
    }
});


const uploadhob = multer({ storage: hobimage });
const uploadcrm = multer({ storage: crmimage });
const uploadcm = multer({ storage: cmimage });
const upload = multer(); // Add this for handling multipart/form-data text fields

// Routes object
const router = express.Router();

// Routes

router.post('/adminLogin', AdminLogin);
router.post('/updateAdminProfile', multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../uploads/admin'));
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    })
}).single('adminProfileImage'), updateAdminProfile);
router.post('/cmlogin', CmLogin)

// Get all students LIST || GET
router.get('/getAllHob', getAllHobs);
// Get all CRM LIST || GET
router.get('/getAllCrm', getAllCrm);

router.get('/getCrmId', getAllCrmid)

router.get('/getAllCrm', getAllOrgId);
// Get all organizations LIST || GET
router.get('/getAllOrgId', getAllOrgId);

router.get('/getAllCm', getAllCm);

router.get('/getAllOrgs', getAllOrgs);

router.get('/getAllExperiences', getAllTickets);

router.get('/getCrmNamebyId/:crmid', getCrmName);

router.get('/getBranchbyOrganizationname/:organizationname', getBranchbyOrganizationname);

router.get('/getOrgNamebyOrgId/:orgId', getOrgNamebyOrgId);

router.get('/getTicketsbycmId/:cmid', getAllTicketsbyCrmid );

router.get('/getCmDataById/:cmid', getCmDataById);

// Create HOB with image upload
router.post('/createHob', uploadhob.single('hobimage'), userRegister);

// Create CRM
router.post('/createCrm', uploadcrm.single('crmimage'), CrmRegister);

// Organization Registration
router.post('/createOrganization', upload.none(), organizationRegister);

// Create CM
router.post('/createCm', uploadcm.single('cmimage'), CmRegister);

// Create Ticket
router.post('/createTicket', TicketRegistration);

// Get individual student details
router.get('/getHob/:id', getElementById);





// Use uploadcm for /UpdateCmDetails to store images in the correct folder
router.post('/UpdateCmDetails', multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../uploads/cm'));
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    })
}).single('cmProfileImage'), updateCustomerManager);
// http://localhost:8080/api/v1/UpdateCmDetails 
// Export the routerx
module.exports = router;