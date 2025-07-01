const express = require('express');


const { RelationDelete } = require('../controllers/Relations/delete/RelationDelete');
const { NoteDelete } = require('../controllers/Delete/NoteDelete');
const { deleteTask } = require('../controllers/Delete/TaskDelete'); 
const { deleteExperienceByCm} = require('../controllers/Delete/DeleteExperienceByCm');
const { deleteCmByAdminAndHob } = require('../controllers/Delete/DeleteCmByAdminAndHob');
const { deleteCrmByAdminAndHob } = require('../controllers/Delete/DeleteCrmByAdminAndHob');
const { deleteHobByAdmin } = require('../controllers/Delete/DeleteHobByAdmin');
const { OrganizationDelete } = require('../controllers/Delete/DeleteOrganizationByAdminAndHob');


const router = express.Router();

router.delete('/RelationDelete/:id', RelationDelete);

router.delete('/NoteDelete/:id', NoteDelete);

router.delete('/TaskDelete/:id', deleteTask);

router.delete('/OrganizationDelete/:id', OrganizationDelete);

router.post('/deleteExperienceByCm', deleteExperienceByCm);

router.post('/deleteCmByAdminAndHob', deleteCmByAdminAndHob);

router.post('/deleteCrmByAdminAndHob', deleteCrmByAdminAndHob);

router.post('/deleteHobByAdmin', deleteHobByAdmin)


module.exports = router;