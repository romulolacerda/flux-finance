import Decimal from 'decimal.js';

/**
 * Utility functions for handling decimal precision in financial calculations
 */

/**
 * Converts a number or string to a Decimal instance
 * @param value - The value to convert (number, string, or null/undefined)
 * @returns Decimal instance, or Decimal(0) if value is null/undefined
 */
export function toDecimal(value: number | string | null | undefined): Decimal {
    if (value === null || value === undefined || value === '') {
        return new Decimal(0);
    }
    
    try {
        return new Decimal(value);
    } catch (error) {
        console.error('Error converting to Decimal:', value, error);
        return new Decimal(0);
    }
}

/**
 * Converts a Decimal instance back to a number
 * @param decimal - The Decimal instance to convert
 * @returns number representation
 */
export function fromDecimal(decimal: Decimal): number {
    return decimal.toNumber();
}

/**
 * Formats a Decimal as Brazilian currency (R$)
 * @param decimal - The Decimal instance to format
 * @returns Formatted currency string
 */
export function formatCurrency(decimal: Decimal): string {
    return decimal.toFixed(2);
}

/**
 * Safely adds multiple Decimal values
 * @param values - Array of Decimal instances to add
 * @returns Sum as Decimal
 */
export function sumDecimals(...values: Decimal[]): Decimal {
    return values.reduce((acc, val) => acc.plus(val), new Decimal(0));
}

/**
 * Calculates percentage with decimal precision
 * @param part - The part value
 * @param total - The total value
 * @returns Percentage as Decimal (0-1 range, e.g., 0.608 for 60.8%)
 */
export function calculateRatio(part: Decimal, total: Decimal): Decimal {
    if (total.isZero() || total.lessThanOrEqualTo(0)) {
        return new Decimal(0);
    }
    return part.dividedBy(total);
}

/**
 * Formats a number as Brazilian currency string (e.g. "1.234,56")
 * @param value - The numeric value to format
 * @returns Formatted string
 */
export function formatCurrencyBR(value: number): string {
    if (value === null || value === undefined || isNaN(value)) {
        return '0,00';
    }
    return new Intl.NumberFormat('pt-BR', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    }).format(value);
}

/**
 * Parses a Brazilian currency string to a number
 * @param value - The string value to parse
 * @returns parsed number
 */
export function parseCurrencyBR(value: string): number {
    if (!value) return 0;
    
    // Case 1: Standard BR format (e.g. "1.234,56" or "1000,00" or "7500,21")
    if (value.includes(',')) {
        // Remove thousands separators (dots)
        const cleanDots = value.replace(/\./g, '');
        // Replace decimal separator (comma) with dot
        const standardFormat = cleanDots.replace(',', '.');
        const result = parseFloat(standardFormat);
        return isNaN(result) ? 0 : result;
    }
    
    // Case 2: Number with dot decimal separator and no commas (e.g. "1234.56" or "7500.21")
    // If there is exactly one dot, assume it's a decimal separator
    if ((value.match(/\./g) || []).length === 1) {
        // This handles the case where user types "7500.21" with dot
        const result = parseFloat(value);
        return isNaN(result) ? 0 : result;
    }

    // Case 3: No decimal separator or multiple dots (e.g. "10000" or "1.000.000")
    // Treat dots as thousands separators and remove them
    const cleanDots = value.replace(/\./g, '');
    const result = parseFloat(cleanDots);
    return isNaN(result) ? 0 : result;
}
