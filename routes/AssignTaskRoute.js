

const express = require('express');

const {AssignTaskandExperience} = require('../controllers/AssignTaskandExperience/AssignTaskandExperience');

const router = express.Router();


router.post('/AssignTask', AssignTaskandExperience);



module.exports = router;