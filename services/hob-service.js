const mySqlpool = require("../db");

const getHobNotifications = async () => {
  return new Promise((resolve, reject) => {
    mySqlpool
      .query(
        `SELECT * FROM notifications 
   WHERE type = 'cm_registration' OR type = 'crm_registration'
   ORDER BY created_at DESC 
   LIMIT 50`
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
  getHobNotifications: () =>
    new Promise((resolve, reject) => {
      return getHobNotifications()
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
