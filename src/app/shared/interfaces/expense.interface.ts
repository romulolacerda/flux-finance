// 1. Exact DB Schema Matches
// ----------------------------

export interface Expense {
    // Columns from 'expenses' table
    id: string;
    user_id: string;
    name: string;
    amount?: number | null; // Nullable in DB (null for installment parents)
    category: string;
    date: Date;             // timestamp with time zone in DB
    created_at: Date;
    created_date?: Date | null;
    
    // Installment specific columns (nullable)
    is_installment?: boolean | null;
    due_month?: number | null;
    due_year?: number | null;
    installment_total?: number | null;
    total_amount?: number | null;

    // UI-Only fields (not in expenses table)
    // We keep them optional to allow strict DB mapping to work, but populate them for UI
    icon?: string;
    iconColor?: string;
    current_installment?: number;
    paid?: boolean;
}

export interface ExpenseInstallment {
    // Columns from 'expense_installments' table
    id: string;
    expense_id: string;
    user_id: string;
    installment_number: number;
    installment_total: number;
    amount: number;
    due_month: number;
    due_year: number;
    paid?: boolean | null;
    created_at: Date;
}

// 2. Strict Payload Types for Inserts
// -----------------------------------

/**
 * Payload for Regular Expense (is_installment = false)
 * MUST have amount.
 * MUST NOT have total_amount, installment_total.
 */
export interface RegularExpensePayload {
    user_id: string;
    name: string;
    category: string;
    date: string;         // ISO string for timestamp
    created_at: string;
    created_date: string;
    
    is_installment: false;
    amount: number;
    due_month: number;
    due_year: number;

    // Forbidden fields for regular
    total_amount?: never;
    installment_total?: never;
}

/**
 * Payload for Installment Parent (is_installment = true)
 * MUST have total_amount, installment_total.
 * MUST NOT have amount.
 */
export interface InstallmentParentPayload {
    user_id: string;
    name: string;
    category: string;
    date: string;
    created_at: string;
    created_date: string;

    is_installment: true;
    total_amount: number;
    installment_total: number;
    due_month?: number; // Optional on parent depending on logic, but usually we track start
    due_year?: number;

    // Forbidden fields for parent
    amount?: never; 
}

/**
 * Payload for Installment Child
 * MUST have amount, expense_id.
 */
export interface InstallmentChildPayload {
    expense_id: string;
    user_id: string;
    installment_number: number;
    installment_total: number;
    amount: number;
    due_month: number;
    due_year: number;
    paid: boolean;
    created_at?: string; 
}

