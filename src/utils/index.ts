/**
 * Date and time utilities
 */

export class DateUtils {
  /**
   * Get start of month
   */
  static startOfMonth(date: Date = new Date()): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  /**
   * Get end of month
   */
  static endOfMonth(date: Date = new Date()): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  /**
   * Get start of year
   */
  static startOfYear(date: Date = new Date()): Date {
    return new Date(date.getFullYear(), 0, 1);
  }

  /**
   * Get end of year
   */
  static endOfYear(date: Date = new Date()): Date {
    return new Date(date.getFullYear(), 11, 31);
  }

  /**
   * Get start of week
   */
  static startOfWeek(date: Date = new Date()): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  /**
   * Get end of week
   */
  static endOfWeek(date: Date = new Date()): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + 6;
    return new Date(d.setDate(diff));
  }

  /**
   * Add days
   */
  static addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  /**
   * Add months
   */
  static addMonths(date: Date, months: number): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  }

  /**
   * Get days between two dates
   */
  static daysBetween(date1: Date, date2: Date): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.floor((date2.getTime() - date1.getTime()) / msPerDay);
  }

  /**
   * Check if date is today
   */
  static isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  /**
   * Check if date is in the past
   */
  static isPast(date: Date): boolean {
    return date < new Date();
  }

  /**
   * Check if date is in the future
   */
  static isFuture(date: Date): boolean {
    return date > new Date();
  }

  /**
   * Format relative time (e.g., "2 hours ago")
   */
  static formatRelative(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals: Record<string, number> = {
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
  static getLastNMonths(n: number): Date[] {
    const months: Date[] = [];
    const now = new Date();
    for (let i = n - 1; i >= 0; i--) {
      months.push(this.addMonths(now, -i));
    }
    return months;
  }

  /**
   * Check if date is in current month
   */
  static isCurrentMonth(date: Date): boolean {
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }

  /**
   * Check if date is in current year
   */
  static isCurrentYear(date: Date): boolean {
    return date.getFullYear() === new Date().getFullYear();
  }
}

/**
 * Currency and number utilities
 */
export class CurrencyUtils {
  private static formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  static format(value: number): string {
    return this.formatter.format(value);
  }

  static parse(value: string): number {
    return parseFloat(value.replace(/[^0-9.-]+/g, ''));
  }

  static round(value: number, decimals: number = 2): number {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  static isValidAmount(value: number): boolean {
    return value > 0 && isFinite(value);
  }

  static calculatePercentage(value: number, total: number): number {
    return total === 0 ? 0 : this.round((value / total) * 100);
  }

  static calculatePercentageOf(percentage: number, total: number): number {
    return this.round((percentage / 100) * total);
  }

  static applyTax(amount: number, taxRate: number): number {
    return this.round(amount + amount * (taxRate / 100));
  }

  static removePercentage(amount: number, percentage: number): number {
    return this.round(amount - this.calculatePercentageOf(percentage, amount));
  }
}

/**
 * String utilities
 */
export class StringUtils {
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static pascalCase(str: string): string {
    return str
      .split(/[\s_-]+/)
      .map(word => this.capitalize(word))
      .join('');
  }

  static camelCase(str: string): string {
    return str
      .split(/[\s_-]+/)
      .map((word, i) => (i === 0 ? word.toLowerCase() : this.capitalize(word)))
      .join('');
  }

  static slugify(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static truncate(str: string, length: number, suffix: string = '...'): string {
    return str.length > length ? str.substring(0, length) + suffix : str;
  }

  static reverse(str: string): string {
    return str.split('').reverse().join('');
  }

  static countWords(str: string): number {
    return str.trim().split(/\s+/).length;
  }

  static removeWhitespace(str: string): string {
    return str.replace(/\s/g, '');
  }

  static toCamelCaseKeys(obj: Record<string, any>): Record<string, any> {
    return Object.entries(obj).reduce(
      (acc, [key, value]) => {
        acc[this.camelCase(key)] = value;
        return acc;
      },
      {} as Record<string, any>
    );
  }
}
