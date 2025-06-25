const express = require("express");
const router = express.Router();
const crmController = require("../controllers/crm-controller");

///crm
router.get("/get-crm-notifications/:crmId", crmController.getCrmNotifications);

module.exports = router;
