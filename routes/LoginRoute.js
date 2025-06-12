const express = require('express');
const multer = require('multer');
const path = require('path');

// Login Components
const { AdminLogin } = require('../controllers/Login/AdminLogin');
const {CmLogin} = require('../controllers/Login/CmLogin');
const { CrmLogin } = require('../controllers/Login/CrmLogin');
const { HobLogin } = require('../controllers/Login/HobLogin');



const router = express.Router();



router.post('/adminLogin', AdminLogin);

router.post('/cmlogin', CmLogin)

router.post('/crmLogin', CrmLogin);

router.post('/hobLogin', HobLogin);



module.exports = router;