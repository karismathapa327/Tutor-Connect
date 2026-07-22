const Notification = require("../models/Notification");

/**
 * Creates and persists a notification for a user
 */
const createNotification = async ({ recipient, sender, title, message, type = "system", link = "" }) => {
  try {
    if (!recipient) return null;
    return await Notification.create({
      recipient,
      sender,
      title,
      message,
      type,
      link,
    });
  } catch (error) {
    console.error("Failed to create notification:", error.message);
    return null;
  }
};

module.exports = createNotification;
