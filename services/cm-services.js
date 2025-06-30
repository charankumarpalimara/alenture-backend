const mySqlpool = require("../db");

const getCmNotifications = async (cmId) => {
  return new Promise((resolve, reject) => {
    if (!cmId) {
      return reject({
        status: 400,
        message: "Invalid CRM ID",
        data: [],
      });
    }
    mySqlpool
      .query(
        `SELECT * FROM notifications 
   WHERE cmid = ? AND type = 'experience_resolved' 
   ORDER BY created_at DESC 
   LIMIT 50`,
        [cmId]
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
  getCmNotifications: (cmId) =>
    new Promise((resolve, reject) => {
      return getCmNotifications(cmId)
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
