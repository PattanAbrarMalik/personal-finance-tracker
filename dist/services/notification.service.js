"use strict";
/**
 * Notification service (Email, SMS, Push)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = exports.NotificationTopic = exports.NotificationType = void 0;
var NotificationType;
(function (NotificationType) {
    NotificationType["EMAIL"] = "email";
    NotificationType["SMS"] = "sms";
    NotificationType["PUSH"] = "push";
    NotificationType["IN_APP"] = "in_app";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationTopic;
(function (NotificationTopic) {
    NotificationTopic["BUDGET_ALERT"] = "budget_alert";
    NotificationTopic["GOAL_MILESTONE"] = "goal_milestone";
    NotificationTopic["TRANSACTION_CREATED"] = "transaction_created";
    NotificationTopic["SECURITY"] = "security";
    NotificationTopic["PROMOTION"] = "promotion";
})(NotificationTopic || (exports.NotificationTopic = NotificationTopic = {}));
class NotificationService {
    /**
     * Send notification
     */
    async send(payload) {
        try {
            switch (payload.type) {
                case NotificationType.EMAIL:
                    return await this.sendEmail(payload);
                case NotificationType.SMS:
                    return await this.sendSMS(payload);
                case NotificationType.PUSH:
                    return await this.sendPushNotification(payload);
                case NotificationType.IN_APP:
                    return await this.storeInAppNotification(payload);
                default:
                    return false;
            }
        }
        catch (error) {
            console.error('Notification send failed:', error);
            return false;
        }
    }
    async sendEmail(payload) {
        // Implement with your email service (SendGrid, Mailgun, etc.)
        console.log('Email notification:', payload);
        return true;
    }
    async sendSMS(payload) {
        // Implement with Twilio or similar
        console.log('SMS notification:', payload);
        return true;
    }
    async sendPushNotification(payload) {
        // Implement with Firebase Cloud Messaging
        console.log('Push notification:', payload);
        return true;
    }
    async storeInAppNotification(payload) {
        // Store in database
        console.log('In-app notification:', payload);
        return true;
    }
    /**
     * Get user preferences
     */
    async getUserPreferences(userId) {
        return {
            email: true,
            sms: false,
            push: true,
            inApp: true,
            budgetAlerts: true,
            goalMilestones: true,
            promotions: false,
        };
    }
}
exports.notificationService = new NotificationService();
//# sourceMappingURL=notification.service.js.map