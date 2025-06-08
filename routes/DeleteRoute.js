const express = require('express');


const { RelationDelete } = require('../controllers/Relations/delete/RelationDelete');
const { NoteDelete } = require('../controllers/Delete/NoteDelete');
const { deleteTask } = require('../controllers/Delete/TaskDelete'); 
const { deleteExperienceByCm} = require('../controllers/Delete/DeleteExperienceByCm');

const router = express.Router();

router.delete('/RelationDelete/:id', RelationDelete);

router.delete('/NoteDelete/:id', NoteDelete);

router.delete('/TaskDelete/:id', deleteTask);

router.post('/deleteExperienceByCm', deleteExperienceByCm);

module.exports = router;