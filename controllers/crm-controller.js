let crmService = require("../services/crm-services");
module.exports = {
  //getExperienceDetailsById
  //markNotificationAsRead

  markNotificationAsRead: (req, res, next) => {
    crmService
      .markNotificationAsRead(req.params.id)
      .then((result) => {
        if (result && result.status === 200) {
          res.status(result.status || 200).send(result);
        } else {
          res.status(result.status || 400).send(result);
        }
      })
      .catch((err) => {
        res.status(err.status || 500).send({
          status: err.status || 500,
          message: err.message ? err.message : "Internal server error.",
          data: [],
        });
      });
  },
  getCrmNotifications: (req, res, next) => {
    crmService
      .getCrmNotifications(req.params.crmId)
      .then((result) => {
        if (result && result.status === 200) {
          res.status(result.status || 200).send(result);
        } else {
          res.status(result.status || 400).send(result);
        }
      })
      .catch((err) => {
        res.status(err.status || 500).send({
          status: err.status || 500,
          message: err.message ? err.message : "Internal server error.",
          data: [],
        });
      });
  },
  getExperienceDetailsById: (req, res, next) => {
    crmService
      .getExperienceDetailsById(req.params.id)
      .then((result) => {
        if (result && result.status === 200) {
          res.status(result.status || 200).send(result);
        } else {
          res.status(result.status || 400).send(result);
        }
      })
      .catch((err) => {
        res.status(err.status || 500).send({
          status: err.status || 500,
          message: err.message ? err.message : "Internal server error.",
          data: [],
        });
      });
  },
};
