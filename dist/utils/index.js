"use strict";
/**
 * Date and time utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringUtils = exports.CurrencyUtils = exports.DateUtils = void 0;
class DateUtils {
    /**
     * Get start of month
     */
    static startOfMonth(date = new Date()) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }
    /**
     * Get end of month
     */
    static endOfMonth(date = new Date()) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }
    /**
     * Get start of year
     */
    static startOfYear(date = new Date()) {
        return new Date(date.getFullYear(), 0, 1);
    }
    /**
     * Get end of year
     */
    static endOfYear(date = new Date()) {
        return new Date(date.getFullYear(), 11, 31);
    }
    /**
     * Get start of week
     */
    static startOfWeek(date = new Date()) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    }
    /**
     * Get end of week
     */
    static endOfWeek(date = new Date()) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + 6;
        return new Date(d.setDate(diff));
    }
    /**
     * Add days
     */
    static addDays(date, days) {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    }
    /**
     * Add months
     */
    static addMonths(date, months) {
        const d = new Date(date);
        d.setMonth(d.getMonth() + months);
        return d;
    }
    /**
     * Get days between two dates
     */
    static daysBetween(date1, date2) {
        const msPerDay = 24 * 60 * 60 * 1000;
        return Math.floor((date2.getTime() - date1.getTime()) / msPerDay);
    }
    /**
     * Check if date is today
     */
    static isToday(date) {
        const today = new Date();
        return (date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear());
    }
    /**
     * Check if date is in the past
     */
    static isPast(date) {
        return date < new Date();
    }
    /**
     * Check if date is in the future
     */
    static isFuture(date) {
        return date > new Date();
    }
    /**
     * Format relative time (e.g., "2 hours ago")
     */
    static formatRelative(date) {
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
        };
        for (const [key, value] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / value);
            if (interval >= 1) {
                return interval === 1 ? `${interval} ${key} ago` : `${interval} ${key}s ago`;
            }
        }
        return 'just now';
    }
    /**
     * Get last N months
     */
    static getLastNMonths(n) {
        const months = [];
        const now = new Date();
        for (let i = n - 1; i >= 0; i--) {
            months.push(this.addMonths(now, -i));
        }
        return months;
    }
    /**
     * Check if date is in current month
     */
    static isCurrentMonth(date) {
        const now = new Date();
        return (date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear());
    }
    /**
     * Check if date is in current year
     */
    static isCurrentYear(date) {
        return date.getFullYear() === new Date().getFullYear();
    }
}
exports.DateUtils = DateUtils;
/**
 * Currency and number utilities
 */
class CurrencyUtils {
    static formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    static format(value) {
        return this.formatter.format(value);
    }
    static parse(value) {
        return parseFloat(value.replace(/[^0-9.-]+/g, ''));
    }
    static round(value, decimals = 2) {
        return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }
    static isValidAmount(value) {
        return value > 0 && isFinite(value);
    }
    static calculatePercentage(value, total) {
        return total === 0 ? 0 : this.round((value / total) * 100);
    }
    static calculatePercentageOf(percentage, total) {
        return this.round((percentage / 100) * total);
    }
    static applyTax(amount, taxRate) {
        return this.round(amount + amount * (taxRate / 100));
    }
    static removePercentage(amount, percentage) {
        return this.round(amount - this.calculatePercentageOf(percentage, amount));
    }
}
exports.CurrencyUtils = CurrencyUtils;
/**
 * String utilities
 */
class StringUtils {
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    static pascalCase(str) {
        return str
            .split(/[\s_-]+/)
            .map(word => this.capitalize(word))
            .join('');
    }
    static camelCase(str) {
        return str
            .split(/[\s_-]+/)
            .map((word, i) => (i === 0 ? word.toLowerCase() : this.capitalize(word)))
            .join('');
    }
    static slugify(str) {
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    static truncate(str, length, suffix = '...') {
        return str.length > length ? str.substring(0, length) + suffix : str;
    }
    static reverse(str) {
        return str.split('').reverse().join('');
    }
    static countWords(str) {
        return str.trim().split(/\s+/).length;
    }
    static removeWhitespace(str) {
        return str.replace(/\s/g, '');
    }
    static toCamelCaseKeys(obj) {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            acc[this.camelCase(key)] = value;
            return acc;
        }, {});
    }
}
exports.StringUtils = StringUtils;
//# sourceMappingURL=index.js.map