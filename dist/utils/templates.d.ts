/**
 * Email template builder and utilities
 */
export interface EmailTemplate {
    subject: string;
    html: string;
    text: string;
}
export declare class EmailTemplateBuilder {
    static welcomeEmail(name: string, loginUrl: string): EmailTemplate;
    static passwordReset(name: string, resetUrl: string): EmailTemplate;
    static budgetAlert(name: string, category: string, percentage: number): EmailTemplate;
    static goalMilestone(name: string, goalName: string, percentage: number): EmailTemplate;
    static monthlyReport(name: string, income: number, expenses: number, savings: number): EmailTemplate;
}
/**
 * SMS template builder
 */
export declare class SMSTemplateBuilder {
    static budgetAlert(category: string, percentage: number): string;
    static goalMilestone(goalName: string, percentage: number): string;
    static transactionConfirmation(description: string, amount: number): string;
    static securityAlert(action: string): string;
}
/**
 * Push notification templates
 */
export declare class PushNotificationBuilder {
    static budgetAlert(category: string, percentage: number): {
        title: string;
        body: string;
        badge: string;
        tag: string;
    };
    static goalMilestone(goalName: string, percentage: number): {
        title: string;
        body: string;
        badge: string;
        tag: string;
    };
    static transactionAdded(description: string, amount: number): {
        title: string;
        body: string;
        badge: string;
        tag: string;
    };
}
//# sourceMappingURL=templates.d.ts.map