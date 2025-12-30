/**
 * Notification service (Email, SMS, Push)
 */
export declare enum NotificationType {
    EMAIL = "email",
    SMS = "sms",
    PUSH = "push",
    IN_APP = "in_app"
}
export declare enum NotificationTopic {
    BUDGET_ALERT = "budget_alert",
    GOAL_MILESTONE = "goal_milestone",
    TRANSACTION_CREATED = "transaction_created",
    SECURITY = "security",
    PROMOTION = "promotion"
}
interface NotificationPayload {
    userId: string;
    type: NotificationType;
    topic: NotificationTopic;
    title: string;
    message: string;
    data?: Record<string, any>;
    priority?: 'low' | 'normal' | 'high';
}
declare class NotificationService {
    /**
     * Send notification
     */
    send(payload: NotificationPayload): Promise<boolean>;
    private sendEmail;
    private sendSMS;
    private sendPushNotification;
    private storeInAppNotification;
    /**
     * Get user preferences
     */
    getUserPreferences(userId: string): Promise<{
        email: boolean;
        sms: boolean;
        push: boolean;
        inApp: boolean;
        budgetAlerts: boolean;
        goalMilestones: boolean;
        promotions: boolean;
    }>;
}
export declare const notificationService: NotificationService;
export {};
//# sourceMappingURL=notification.service.d.ts.map