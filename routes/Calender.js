const express = require('express');
const { getUserEvents, addEvent, updateEvent, deleteEvent } = require('../controllers/Calender/Calender');

const router = express.Router();


router.get('/events/:userid', getUserEvents);

// Add a new event
router.post('/addEvent', addEvent);

// Update event by id
router.put('/EditEvent/:id', updateEvent);

// Delete event by id
router.delete('/DeleteEvent/:id', deleteEvent);

module.exports = router;