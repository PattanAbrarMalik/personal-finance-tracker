"use strict";
/**
 * Email template builder and utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotificationBuilder = exports.SMSTemplateBuilder = exports.EmailTemplateBuilder = void 0;
class EmailTemplateBuilder {
    static welcomeEmail(name, loginUrl) {
        return {
            subject: `Welcome to Finance Tracker, ${name}!`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Welcome to Finance Tracker!</h1>
          <p>Hi ${name},</p>
          <p>Thank you for signing up. We're excited to help you manage your finances.</p>
          <p>
            <a href="${loginUrl}" style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Get Started
            </a>
          </p>
          <p>Best regards,<br>Finance Tracker Team</p>
        </div>
      `,
            text: `Welcome to Finance Tracker, ${name}! Click here to get started: ${loginUrl}`,
        };
    }
    static passwordReset(name, resetUrl) {
        return {
            subject: 'Reset Your Finance Tracker Password',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Password Reset Request</h1>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. Click the button below to proceed:</p>
          <p>
            <a href="${resetUrl}" style="background-color: #DC3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p>This link expires in 1 hour.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>Best regards,<br>Finance Tracker Team</p>
        </div>
      `,
            text: `Reset your password: ${resetUrl}`,
        };
    }
    static budgetAlert(name, category, percentage) {
        return {
            subject: `Budget Alert: ${category} Spending at ${percentage}%`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Budget Alert</h1>
          <p>Hi ${name},</p>
          <p>Your spending in <strong>${category}</strong> has reached <strong>${percentage}%</strong> of your monthly budget.</p>
          <p>
            <a href="https://app.example.com/budgets" style="background-color: #FFC107; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Budget Details
            </a>
          </p>
          <p>Best regards,<br>Finance Tracker Team</p>
        </div>
      `,
            text: `Budget alert: ${category} spending at ${percentage}%`,
        };
    }
    static goalMilestone(name, goalName, percentage) {
        return {
            subject: `Milestone Reached: ${goalName} is ${percentage}% Complete!`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Congratulations!</h1>
          <p>Hi ${name},</p>
          <p>You've reached <strong>${percentage}%</strong> of your goal: <strong>${goalName}</strong></p>
          <p>Great progress! Keep it up!</p>
          <p>
            <a href="https://app.example.com/goals" style="background-color: #28A745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Your Goals
            </a>
          </p>
          <p>Best regards,<br>Finance Tracker Team</p>
        </div>
      `,
            text: `You've reached ${percentage}% of your goal: ${goalName}!`,
        };
    }
    static monthlyReport(name, income, expenses, savings) {
        return {
            subject: `Your ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} Financial Summary`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Monthly Financial Summary</h1>
          <p>Hi ${name},</p>
          <p>Here's your financial summary for ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px;">Income:</td>
              <td style="padding: 10px; text-align: right;"><strong>$${income.toFixed(2)}</strong></td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px;">Expenses:</td>
              <td style="padding: 10px; text-align: right;"><strong>$${expenses.toFixed(2)}</strong></td>
            </tr>
            <tr style="background-color: #f9f9f9; border-bottom: 1px solid #ddd;">
              <td style="padding: 10px;">Savings:</td>
              <td style="padding: 10px; text-align: right;"><strong>$${savings.toFixed(2)}</strong></td>
            </tr>
          </table>
          <p style="margin-top: 20px;">
            <a href="https://app.example.com/reports" style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Detailed Report
            </a>
          </p>
          <p>Best regards,<br>Finance Tracker Team</p>
        </div>
      `,
            text: `Monthly Summary - Income: $${income.toFixed(2)}, Expenses: $${expenses.toFixed(2)}, Savings: $${savings.toFixed(2)}`,
        };
    }
}
exports.EmailTemplateBuilder = EmailTemplateBuilder;
/**
 * SMS template builder
 */
class SMSTemplateBuilder {
    static budgetAlert(category, percentage) {
        return `Finance Tracker: Your ${category} budget is at ${percentage}%. Check your app for details.`;
    }
    static goalMilestone(goalName, percentage) {
        return `Congratulations! You've reached ${percentage}% of your goal: ${goalName}!`;
    }
    static transactionConfirmation(description, amount) {
        return `Finance Tracker: Recorded ${description} - $${amount.toFixed(2)}`;
    }
    static securityAlert(action) {
        return `Finance Tracker: ${action}. If this wasn't you, please change your password.`;
    }
}
exports.SMSTemplateBuilder = SMSTemplateBuilder;
/**
 * Push notification templates
 */
class PushNotificationBuilder {
    static budgetAlert(category, percentage) {
        return {
            title: 'Budget Alert',
            body: `${category} spending at ${percentage}%`,
            badge: '1',
            tag: 'budget-alert',
        };
    }
    static goalMilestone(goalName, percentage) {
        return {
            title: 'Goal Milestone',
            body: `${goalName} is ${percentage}% complete!`,
            badge: '1',
            tag: 'goal-milestone',
        };
    }
    static transactionAdded(description, amount) {
        return {
            title: 'Transaction Recorded',
            body: `${description} - $${amount.toFixed(2)}`,
            badge: '1',
            tag: 'transaction',
        };
    }
}
exports.PushNotificationBuilder = PushNotificationBuilder;
//# sourceMappingURL=templates.js.map