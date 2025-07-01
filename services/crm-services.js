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
        `SELECT * FROM notifications 
   WHERE crmid = ? AND type = 'experience_registration' 
   ORDER BY created_at DESC 
   LIMIT 50`,
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
const getExperienceDetailsById = async (experienceId) => {
  return new Promise((resolve, reject) => {
    if (!experienceId) {
      return reject({
        status: 400,
        message: "Invalid Experience ID",
        data: [],
      });
    }

    mySqlpool
      .query(`SELECT * FROM experiences WHERE experienceid = ?`, [experienceId])
      .then(([rows]) => {
        if (rows.length > 0) {
          resolve({
            status: 200,
            message: "Experience details fetched successfully",
            data: rows[0],
          });
        } else {
          reject({
            status: 404,
            message: "Experience not found",
            data: [],
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching experience details:", err);
        reject({
          status: 500,
          message: "Database error while fetching experience details",
          data: [],
        });
      });
  });
};
const markNotificationAsRead = async (notificationId) => {
  return new Promise((resolve, reject) => {
    if (!notificationId) {
      return reject({
        status: 400,
        message: "Invalid notification ID",
        data: [],
      });
    }

    mySqlpool
      .query(`UPDATE notifications SET is_read = 1 WHERE id = ?`, [
        notificationId,
      ])
      .then(([result]) => {
        if (result.affectedRows > 0) {
          resolve({
            status: 200,
            message: "Notification marked as read",
            data: [],
          });
        } else {
          reject({
            status: 404,
            message: "Notification not found",
            data: [],
          });
        }
      })
      .catch((err) => {
        console.error("Error updating notification:", err);
        reject({
          status: 500,
          message: "Database error while updating notification",
          data: [],
        });
      });
  });
};

module.exports = {
  //getExperienceDetailsById
  //markNotificationAsRead
  markNotificationAsRead: (id) =>
    new Promise((resolve, reject) => {
      return markNotificationAsRead(id)
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
  getExperienceDetailsById: (id) =>
    new Promise((resolve, reject) => {
      return getExperienceDetailsById(id)
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
