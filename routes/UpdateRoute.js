const express = require('express');
const mySqlpool = require('../db');
const path = require('path');

const multer = require('multer');


const { updateAdminProfile } = require('../controllers/Profile/update/AdminProfileUpdate');
const  { updateCmProfile, updateCmProfileByAdminHob } = require('../controllers/Profile/update/CmProfileUpdate');
const { updateCrmProfile, updateCrmProfileByAdminAndHob } = require('../controllers/Profile/update/CrmProfileUpdate');
const { updateCustomerManager } = require('../controllers/Update/CmUpdateController');
const { updateCustomerRelationshipManager } = require('../controllers/Update/CrmUpdateController');
const { updateHob } = require('../controllers/Update/HobUpdateController');
const { OrganizationUpdate } = require('../controllers/Update/OrganizationUpdateCotroller');
const { NoteUpdate } = require('../controllers/Update/NoteUpdate');
const { updateExperienceStatus, updateExperienceStatusToResolve } = require('../controllers/Update/ExperienceStatusUpdate');
const { updateTaskStatus } = require('../controllers/Update/TaskStatusUpdate');
const { updateExperiencePriority } = require('../controllers/Update/ExperiencePriorityUpdate');
const { updateHobProfile } = require('../controllers/Profile/update/HobProfileUpdate');
// const { Upload } = require('antd');

const router = express.Router();
const upload = multer();

// Routes
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




// personal update options for cm profile

router.post('/updateCmProfile', multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../uploads/cm'));
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    })
}).single('cmProfileImage'), updateCmProfile);




// admin and hob  Dashboard update cm profile
router.post('/updateCmProfileByAdminHob', multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../uploads/cm'));
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    })
}).single('cmProfileImageByAdminHob'), updateCmProfileByAdminHob);



router.post('/UpdatecrmProfileDetailsByitsSelf', multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../uploads/crm'));
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    })
}).single('crmProfileImageBySelf'), updateCrmProfile);



router.post('/UpdatecrmProfileByAdminAndHob', multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../uploads/crm'));
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    })
}).single('crmProfileByAdminAndHob'), updateCrmProfileByAdminAndHob);




router.post('/UpdateHobDetails', multer({   
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../uploads/hob'));
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    })
}).single('hobProfileImage'), updateHob);

router.post('/HobUpdateByitsSelf', multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../uploads/hob'));
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    })
}).single('hobProfileImageBySelf'), updateHobProfile);


router.post('/UpdateOrganizationDetails', OrganizationUpdate);

router.put('/UpdateNoteDetails/:id', NoteUpdate);

router.post('/updateExperienceStatus', updateExperienceStatus);

router.post('/updateExperienceStatusToResolve', updateExperienceStatusToResolve);

router.post('/updateTaskStatus/:id', updateTaskStatus);

router.post('/updateExperiencePriority', updateExperiencePriority);

module.exports = router;
