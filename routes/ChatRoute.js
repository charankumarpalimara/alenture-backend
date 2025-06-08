

const express = require('express');

const {ChatInsert, GetChatMessages} = require('../controllers/Chat/Chat');

const router = express.Router();


router.post('/ChatInsert', ChatInsert);
router.get('/GetChatMessages', GetChatMessages);



module.exports = router;