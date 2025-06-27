

const express = require('express');

const {cmPasswordReset} = require('../controllers/PasswordReset/cm-reset-password');
const {crmPasswordReset} = require('../controllers/PasswordReset/crm-reset-password');
const {hobPasswordReset} = require('../controllers/PasswordReset/hob-reset-password');

const router = express.Router();


router.post('/cmPasswordReset', cmPasswordReset);
router.post('/crmPasswordReset', crmPasswordReset);
router.post('/hobPasswordReset', hobPasswordReset);



module.exports = router;