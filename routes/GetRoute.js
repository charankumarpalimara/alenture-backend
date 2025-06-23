
const express = require('express');
const multer = require('multer');
const path = require('path');




const { getRelationByCrmId } = require('../controllers/Getdata/GetRelationByCrmId');
const { getHobById } = require('../controllers/Getdata/GetHobById');
const { getAllCrm, getAllCrmid, getCrmName } = require('../controllers/Tables/CrmGetData');
const { getAllHobs } = require('../controllers/Tables/HobGetData');
const { getAllOrgs, getAllOrgId, GetOrganizationName, getOrgNamebyOrgId, getOrgDetailsById, getOrganizationBranchesByOrgid } = require('../controllers/Getdata/OrganizationGetData');
const { getAllCm, getCmDataById } = require('../controllers/Tables/CmGetData');




const { getAllTickets, getPendingTickets, getNewTickets, getResolvedTickets, getAllTicketsbyCrmid, getAllTicketsbyCmid, getPendingTicketsbyCrmid, getNewTicketsbyCrmid, getReslveTicketsbyCrmid, getPendingTicketsbyCmid, getNewTicketsbyCmid, getResolvedTicketsbyCmid } = require('../controllers/Tables/TicketDetailsGet');
const { getAllExperiencesCountByCrmId, getResolvedExperiencesCountByCrmId, getNewExperiencesCountByCrmId, getPendingExperiencesCountByCrmId } = require('../controllers/Getdata/GetExperiencesCountByCrmId');
const { getAllExperiencesCountByCmId, getResolvedExperiencesCountByCmId, getNewExperiencesCountByCmId, getPendingExperiencesCountByCmId } = require('../controllers/Getdata/GetExperiencesCountByCmId');
const {getBranchbyOrganizationname} =require('../controllers/Tables/BrachGetData');
const { getRelationsDataByCrmid } = require('../controllers/Relations/get/RelationsGetData');
const { getCrmProfile } = require('../controllers/Profile/get/CrmProfileGet');
const { getCmProfile } = require('../controllers/Profile/get/CmProfileGet');
const { noteGetByid } = require('../controllers/Tables/notesController');

const { getTaskDataByExpId } = require('../controllers/Getdata/TaskDataGetByExpId');
const { GetCrmNames } = require('../controllers/Getdata/GetCrmNames');
const { GetCmNames } = require('../controllers/Getdata/GetCmNames');

const { AllExperiencesCount, ResolvedExperiencesCount, NewExperiencesCount, PendingExperiencesCount } = require('../controllers/Getdata/GetExperiencesCountAdminHob');





const router = express.Router();


// Get all students LIST || GET
router.get('/getAllHob', getAllHobs);
// Get all CRM LIST || GET
router.get('/getAllCrm', getAllCrm);

router.get('/getCrmId', getAllCrmid)

router.get('/getAllCrm', getAllOrgId);
// Get all organizations LIST || GET
router.get('/getAllOrgId', getAllOrgId);

router.get('/getAllCm', getAllCm);

router.get('/getAllOrgs', getAllOrgs);

router.get('/getAllOrganizationnames', GetOrganizationName);

router.get('/getCrmProfile/:crmid', getCrmProfile);

router.get('/getCmProfile/:cmid', getCmProfile);

router.get('/getHob/:id', getHobById);


router.get('/GetCrmNames', GetCrmNames);

router.post('/GetCmNames', GetCmNames);

router.get('/getCrmNamebyId/:crmid', getCrmName);

router.get('/getOrgNamebyOrgId/:orgId', getOrgNamebyOrgId);

router.get('/getOrgDetailsById/:orgId', getOrgDetailsById);






router.get('/getBranchbyOrganizationname/:organizationname', getBranchbyOrganizationname);

router.get('/getOrganizationBranchesByOrgid/:orgId', getOrganizationBranchesByOrgid);

router.get('/getOrgNamebyOrgId/:orgId', getOrgNamebyOrgId);

router.get('/getCmDataById/:cmid', getCmDataById);

router.get('/noteGetByid/:createrid', noteGetByid);


router.get('/getAllExperiences', getAllTickets);

router.get('/getAllPendingExperiences', getPendingTickets);

router.get('/getAllNewExperiences', getNewTickets);

router.get('/getAllResolvedExperiences', getResolvedTickets);





router.get('/getTicketsbycrmId/:crmid', getAllTicketsbyCrmid );



router.get('/getPendingTicketsbyCrmid/:crmid', getPendingTicketsbyCrmid);

router.get('/getNewTicketsbyCrmid/:crmid', getNewTicketsbyCrmid);

router.get('/getResolvedTicketsbyCrmid/:crmid', getReslveTicketsbyCrmid);

router.get('/getRelationByCrmId/:crmid', getRelationByCrmId);





router.get('/getAllExperienceCount', AllExperiencesCount);

router.get('/getResolvedExperiencesCount', ResolvedExperiencesCount);

router.get('/getNewExperiencesCount', NewExperiencesCount);

router.get('/getPendingExperiencesCount', PendingExperiencesCount);



router.get('/getAllExperiencesCountByCrmId/:crmid', getAllExperiencesCountByCrmId);
router.get('/getResolvedExperiencesCountByCrmId/:crmid', getResolvedExperiencesCountByCrmId);
router.get('/getNewExperiencesCountByCrmId/:crmid', getNewExperiencesCountByCrmId);
router.get('/getPendingExperiencesCountByCrmId/:crmid', getPendingExperiencesCountByCrmId);






router.get('/getAllExperiencesCountByCmId/:cmid', getAllExperiencesCountByCmId);
router.get('/getResolvedExperiencesCountByCmId/:cmid', getResolvedExperiencesCountByCmId);
router.get('/getNewExperiencesCountByCmId/:cmid', getNewExperiencesCountByCmId);
router.get('/getPendingExperiencesCountByCmId/:cmid', getPendingTicketsbyCmid);







// router.get('/getAllExperiencesCountByCmId/:cmid', getAllExperiencesCountByCmId);
router.get('/getTicketsbyCmid/:cmid', getAllTicketsbyCmid );
router.get('/getNewTicketsbyCmid/:cmid', getNewTicketsbyCmid);
router.get('/getResolvedTicketsbyCmid/:cmid', getResolvedTicketsbyCmid);
router.get('/getPendingTicketsbyCmid/:cmid', getPendingTicketsbyCmid);





router.get('/getRelationsDataByCrmid/:crmid', getRelationsDataByCrmid);

router.post('/getTaskDataByExpId', getTaskDataByExpId);



module.exports = router;