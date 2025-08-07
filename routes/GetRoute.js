
const express = require('express');
const multer = require('multer');
const path = require('path');




const { getRelationByCrmId } = require('../controllers/Getdata/GetRelationByCrmId');
const { getHobById } = require('../controllers/Getdata/GetHobById');
const { getAllCrm, getAllCrmid, getCrmName } = require('../controllers/Tables/CrmGetData');
const { getAllHobs } = require('../controllers/Tables/HobGetData');
const { getAllOrgs, getAllOrgId, GetOrganizationName, getOrgNamebyOrgId, getOrgDetailsById, getOrganizationBranchesByOrgid } = require('../controllers/Getdata/OrganizationGetData');
const { getAllCm, getCmDataById, getCmDataByCrmid } = require('../controllers/Tables/CmGetData');




const { getAllTickets, getPendingTickets, getNewTickets, getResolvedTickets, getAllTicketsbyCrmid, getPendingTicketsbyCrmid, getNewTicketsbyCrmid, getReslveTicketsbyCrmid, getAllTicketsbyCmid, getPendingTicketsbyCmid, getNewTicketsbyCmid, getResolvedTicketsbyCmid, experienceDetailsGet } = require('../controllers/Tables/TicketDetailsGet');

const { AllExperiencesCountByCrmid } = require('../controllers/Getdata/GetExperiencesCountByCrmId');

const { AllExperiencesCountByCmid } = require('../controllers/Getdata/GetExperiencesCountByCmId');

const {getBranchbyOrganizationname} =require('../controllers/Tables/BrachGetData');
const { getRelationsDataByCrmid } = require('../controllers/Relations/get/RelationsGetData');
const { getCrmProfile } = require('../controllers/Profile/get/CrmProfileGet');
const { getCmProfile } = require('../controllers/Profile/get/CmProfileGet');
const { noteGetByid } = require('../controllers/Tables/notesController');

const { GetCrmNames, getCrmNamesByExperienceid } = require('../controllers/Getdata/GetCrmNames');
const { GetCmNames } = require('../controllers/Getdata/GetCmNames');



const { getTaskDataByExpId } = require('../controllers/Getdata/TaskDataGetByExpId');
// const { GetCrmNames } = require('../controllers/Getdata/GetCrmNames');
// const { GetCmNames } = require('../controllers/Getdata/GetCmNames');

const { AllExperiencesCount} = require('../controllers/Getdata/GetExperiencesCountAdminHob');

 const { cmDetailsGet } = require('../controllers/Getdata/GetCmDetailsById');
 const { crmDetailsGet } = require('../controllers/Getdata/GetCrmDetailsById');
 const { hobDetailsGet } = require('../controllers/Getdata/GetHobDetailsById');

 const { getHobProfile } = require('../controllers/Profile/get/HobProfile');

 const { GetCmFunction } = require('../controllers/Getdata/CmFunctionGet');

 const { GetCmInterest } = require('../controllers/Getdata/CmInterestsGet');

 const { GetOrganizationIndustries } = require('../controllers/Getdata/OrganizationIndustryGet');

 const { CmDataGetByBranches } = require('../controllers/Getdata/cmDataGetByBranches')




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

router.get('/getAllOrganizationnames', GetOrganizationName);

router.get('/getCrmProfile/:crmid', getCrmProfile);

router.get('/getCmProfile/:cmid', getCmProfile);

router.get('/getHob/:id', getHobById);

router.get('/GetCrmNames', GetCrmNames);

router.get('/getCrmNamesByExperienceid/:experienceid', getCrmNamesByExperienceid);

router.post('/GetCmNames', GetCmNames);

router.get('/getCmDataByCrmid/:crmid', getCmDataByCrmid);

router.get('/getCrmNamesByExperienceid/:experienceid', getCrmNamesByExperienceid);

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

// router.get('/getResolvedExperiencesCount', ResolvedExperiencesCount);

// router.get('/getNewExperiencesCount', NewExperiencesCount);

// router.get('/getPendingExperiencesCount', PendingExperiencesCount);



router.get('/AllExperiencesCountByCrmid/:crmid', AllExperiencesCountByCrmid);






//Cm Dashboard Counts
router.get('/AllExperiencesCountByCmid/:cmid', AllExperiencesCountByCmid);








// router.get('/getAllExperiencesCountByCmId/:cmid', getAllExperiencesCountByCmId);
router.get('/getTicketsbyCmid/:cmid', getAllTicketsbyCmid );
router.get('/getNewTicketsbyCmid/:cmid', getNewTicketsbyCmid);
router.get('/getResolvedTicketsbyCmid/:cmid', getResolvedTicketsbyCmid);
router.get('/getPendingTicketsbyCmid/:cmid', getPendingTicketsbyCmid);





router.get('/getRelationsDataByCrmid/:crmid', getRelationsDataByCrmid);

router.post('/getTaskDataByExpId', getTaskDataByExpId);

router.get('/experienceDetailsGet/:experienceId', experienceDetailsGet);

router.get('/cmDetailsGet/:cmid', cmDetailsGet);

router.get('/crmDetailsGet/:crmid', crmDetailsGet);

router.get('/hobDetailsGet/:hobid', hobDetailsGet);

router.get('/getHobProfile/:hobid', getHobProfile);

router.get('/GetCmFunction', GetCmFunction);

router.get('/GetCmInterest', GetCmInterest);

router.get('/GetOrganizationIndustries', GetOrganizationIndustries);


router.post('/getCmDataOrganiozations', CmDataGetByBranches)

module.exports = router;

