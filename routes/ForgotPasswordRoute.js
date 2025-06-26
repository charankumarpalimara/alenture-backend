

const express = require('express');

const {cmForgotPassword} = require('../controllers/ForgotPassword/cm-forgot-password');
const {crmForgotPassword} = require('../controllers/ForgotPassword/crm-forgot-password');
const {hobForgotPassword} = require('../controllers/ForgotPassword/hob-forgot-password');

const router = express.Router();


router.post('/cmForgotPassword', cmForgotPassword);
router.post('/crmForgotPassword', crmForgotPassword);
router.post('/hobForgotPassword', hobForgotPassword);



module.exports = router;