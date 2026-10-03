const Notification = require("../models/Notification");

const createNotification = async ({
  recipient,
  type,
  title,
  message,
  relatedTask = null,
  relatedUser = null,
}) => {
  return Notification.create({
    recipient,
    type,
    title,
    message,
    relatedTask,
    relatedUser,
  });
};

module.exports = {
  createNotification,
};