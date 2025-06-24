
const express = require('express');
const multer = require('multer');
const path = require('path');


const { RelationCreate } = require('../controllers/Relations/create/Relation');


const router = express.Router();

const upload = multer();


router.post('/createRelation', upload.none(), RelationCreate);


module.exports = router;
