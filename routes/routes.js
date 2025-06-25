const express = require("express");
const router = express.Router();
const crmController = require("../controllers/crm-controller");

///crm
router.get("/get-crm-notifications/:crmId", crmController.getCrmNotifications);
router.get(
  "/get-experience-details/:id",
  crmController.getExperienceDetailsById
);
router.get("/mark-notification-read/:id", crmController.markNotificationAsRead);

module.exports = router;
