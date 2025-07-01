const express = require("express");
const router = express.Router();
const crmController = require("../controllers/crm-controller");
const cmController = require("../controllers/cm-controller");
const hobController = require("../controllers/hob-controller");
const adminController = require("../controllers/admin-controller");

///crm
router.get("/get-crm-notifications/:crmId", crmController.getCrmNotifications);
router.get(
  "/get-experience-details/:id",
  crmController.getExperienceDetailsById
);
router.get("/mark-notification-read/:id", crmController.markNotificationAsRead);

//cm
router.get("/get-cm-notifications/:cmId", cmController.getCmNotifications);

///hob
router.get("/get-hob-notifications", hobController.getHobNotifications);

//admin
router.get("/get-admin-notifications", adminController.getAdminNotifications);
module.exports = router;
