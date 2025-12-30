/**
 * Date and time utilities
 */
export declare class DateUtils {
    /**
     * Get start of month
     */
    static startOfMonth(date?: Date): Date;
    /**
     * Get end of month
     */
    static endOfMonth(date?: Date): Date;
    /**
     * Get start of year
     */
    static startOfYear(date?: Date): Date;
    /**
     * Get end of year
     */
    static endOfYear(date?: Date): Date;
    /**
     * Get start of week
     */
    static startOfWeek(date?: Date): Date;
    /**
     * Get end of week
     */
    static endOfWeek(date?: Date): Date;
    /**
     * Add days
     */
    static addDays(date: Date, days: number): Date;
    /**
     * Add months
     */
    static addMonths(date: Date, months: number): Date;
    /**
     * Get days between two dates
     */
    static daysBetween(date1: Date, date2: Date): number;
    /**
     * Check if date is today
     */
    static isToday(date: Date): boolean;
    /**
     * Check if date is in the past
     */
    static isPast(date: Date): boolean;
    /**
     * Check if date is in the future
     */
    static isFuture(date: Date): boolean;
    /**
     * Format relative time (e.g., "2 hours ago")
     */
    static formatRelative(date: Date): string;
    /**
     * Get last N months
     */
    static getLastNMonths(n: number): Date[];
    /**
     * Check if date is in current month
     */
    static isCurrentMonth(date: Date): boolean;
    /**
     * Check if date is in current year
     */
    static isCurrentYear(date: Date): boolean;
}
/**
 * Currency and number utilities
 */
export declare class CurrencyUtils {
    private static formatter;
    static format(value: number): string;
    static parse(value: string): number;
    static round(value: number, decimals?: number): number;
    static isValidAmount(value: number): boolean;
    static calculatePercentage(value: number, total: number): number;
    static calculatePercentageOf(percentage: number, total: number): number;
    static applyTax(amount: number, taxRate: number): number;
    static removePercentage(amount: number, percentage: number): number;
}
/**
 * String utilities
 */
export declare class StringUtils {
    static capitalize(str: string): string;
    static pascalCase(str: string): string;
    static camelCase(str: string): string;
    static slugify(str: string): string;
    static truncate(str: string, length: number, suffix?: string): string;
    static reverse(str: string): string;
    static countWords(str: string): number;
    static removeWhitespace(str: string): string;
    static toCamelCaseKeys(obj: Record<string, any>): Record<string, any>;
}
//# sourceMappingURL=index.d.ts.map