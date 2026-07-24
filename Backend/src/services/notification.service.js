const Notification = require("../models/Notification");

class NotificationService {
  async getMyNotifications(userId) {
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 });

    return {
      count: notifications.length,
      notifications,
    };
  }

  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) {
      throw new Error("Notification not found.");
    }

    notification.isRead = true;
    await notification.save();

    return notification;
  }

  async markAllAsRead(userId) {
    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );

    return { message: "All notifications marked as read." };
  }
}

module.exports = new NotificationService();
