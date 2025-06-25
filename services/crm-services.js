const mySqlpool = require("../db");

const getCrmNotifications = async (crmId) => {
  return new Promise((resolve, reject) => {
    if (!crmId) {
      return reject({
        status: 400,
        message: "Invalid CRM ID",
        data: [],
      });
    }
    mySqlpool
      .query(
        `SELECT * FROM notifications WHERE crmid = ? ORDER BY created_at DESC LIMIT 50`,
        [crmId]
      )
      .then(([rows]) => {
        if (rows.length > 0) {
          resolve({
            status: 200,
            message: "Notifications fetched successfully",
            data: rows,
          });
        } else {
          reject({
            status: 404,
            message: "No notifications found",
            data: [],
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err);
        reject({
          status: 500,
          message: "Database error while fetching notifications",
          data: [],
        });
      });
  });
};

module.exports = {
  getCrmNotifications: (crmId) =>
    new Promise((resolve, reject) => {
      return getCrmNotifications(crmId)
        .then((result) => {
          if (result && result.status == 200) {
            resolve(result);
          } else {
            reject(result);
          }
        })
        .catch((err) => {
          reject(err);
        });
    }),
};
