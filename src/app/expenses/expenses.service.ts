import { Injectable, inject, signal, computed } from '@angular/core';
import Decimal from 'decimal.js';
import { SupabaseService } from '../core/supabase.service';
import { 
    Expense, 
    RegularExpensePayload, 
    InstallmentParentPayload, 
    InstallmentChildPayload 
} from '../shared/interfaces/expense.interface';
import { toDecimal, sumDecimals, fromDecimal } from '../shared/utils/decimal-utils';

@Injectable({
    providedIn: 'root'
})
export class ExpensesService {
    private supabase = inject(SupabaseService);

    // Navigation State
    selectedMonth = signal<number>(new Date().getMonth() + 1); // 1-12
    selectedYear = signal<number>(new Date().getFullYear());

    expenses = signal<Expense[]>([]);

    // Use Decimal for precise summation of expenses
    totalExpenses = computed(() => {
        const decimals = this.expenses().map(e => toDecimal(e.amount || 0));
        return fromDecimal(sumDecimals(...decimals));
    });

    async loadExpenses(month: number, year: number) {
        // 1. Fetch regular single-time expenses for this month
        const regularPromise = this.supabase.client
            .from('expenses')
            .select('*')
            .eq('is_installment', false)
            .eq('due_month', month)
            .eq('due_year', year)
            .order('created_at', { ascending: false });

        // 2. Fetch installments due this month
        // We join with the parent 'expenses' table to get name, category, etc.
        const installmentsPromise = this.supabase.client
            .from('expense_installments')
            .select('*, expenses!inner(name, category)')
            .eq('due_month', month)
            .eq('due_year', year);

        const [regularResult, installmentsResult] = await Promise.all([
            regularPromise,
            installmentsPromise
        ]);

        if (regularResult.error) console.error('Error loading regular expenses', regularResult.error);
        if (installmentsResult.error) console.error('Error loading installments', installmentsResult.error);

        const regular = regularResult.data || [];
        const installments = installmentsResult.data || [];

        // Map regular expenses to interface (standard)
        const mappedRegular: Expense[] = regular.map(e => ({
            id: e.id,
            user_id: e.user_id,
            name: e.name,
            amount: Number(e.amount),
            category: e.category,
            date: e.created_date ? new Date(e.created_date) : new Date(e.created_at),
            created_at: new Date(e.created_at),
            created_date: e.created_date ? new Date(e.created_date) : null,
            
            is_installment: false,
            due_month: e.due_month,
            due_year: e.due_year,
            
            // Map UI fields
            icon: this.getIconForCategory(e.category),
            iconColor: this.getColorForCategory(e.category)
        }));

        // Map installments to Expense interface for display
        const mappedInstallments: Expense[] = installments.map((i: any) => {
            const parent = i.expenses; // joined data
            // Construct a date for display based on due_month/year if needed, 
            // but we'll stick to created_at or construct a "due date"
            const dueDate = new Date(i.due_year, i.due_month - 1, 1); 

            return {
                id: i.id, // ID of the installment row (child)
                user_id: i.user_id,
                name: parent?.name || 'Parcela Desconhecida',
                amount: Number(i.amount), // The installment value 
                category: parent?.category || 'Outros',
                
                // For sorting/display, we might want the date it falls on
                date: dueDate,
                created_at: new Date(i.created_at),
                created_date: null,

                is_installment: true,
                current_installment: i.installment_number,
                installment_total: i.installment_total,
                total_amount: 0, // Not needed for monthly view per strict rule
                paid: i.paid,

                // We store the parent ID implicitly if needed, but 'id' is child ID here.
                // To delete, we need to know it's a child.
                
                icon: this.getIconForCategory(parent?.category),
                iconColor: this.getColorForCategory(parent?.category),
            };
        });

        // Combine and sort
        const combined = [...mappedRegular, ...mappedInstallments].sort((a, b) => {
            return (b.date?.getTime() || 0) - (a.date?.getTime() || 0);
        });

        this.expenses.set(combined);
    }

    async addExpense(expenseData: Partial<Expense> & { due_month: number, due_year: number }) {
        const user = await this.supabase.user;
        if (!user.data.user) return;
        const userId = user.data.user.id;
        const nowIso = new Date().toISOString();

        if (expenseData.is_installment) {
            // === INSTALLMENT FLOW ===
            const total = expenseData.total_amount || 0;
            const count = expenseData.installment_total || 2; // default to 2 if missing, but UI should enforce
            
            // 1. Calculate precise installment amount
            const totalDec = toDecimal(total);
            const valDec = totalDec.div(count);
            // 2 decimal places
            const installmentValue = Number(valDec.toFixed(2));

            // 2. Prepare Parent Payload (Strict Type: InstallmentParentPayload)
            const parentPayload: InstallmentParentPayload = {
                user_id: userId,
                name: expenseData.name || 'Nova Despesa',
                category: expenseData.category || 'Outros',
                date: expenseData.date?.toISOString() || nowIso,
                created_at: nowIso,
                created_date: expenseData.date?.toISOString() || nowIso,
                
                is_installment: true,
                total_amount: total,
                installment_total: count,
                due_month: expenseData.due_month,
                due_year: expenseData.due_year
                // amount is implicitly undefined/never
            };

            // 3. Insert Parent
            const { data: parent, error: parentError } = await this.supabase.client
                .from('expenses')
                .insert(parentPayload)
                .select()
                .single();

            if (parentError || !parent) {
                console.error('Error creating parent expense', parentError);
                return;
            }

            // 4. Generate Children (Strict Type: InstallmentChildPayload[])
            const installmentsToInsert: InstallmentChildPayload[] = [];
            let currentMonth = expenseData.due_month;
            let currentYear = expenseData.due_year;

            for (let i = 1; i <= count; i++) {
                installmentsToInsert.push({
                    expense_id: parent.id,
                    user_id: userId,
                    installment_number: i,
                    installment_total: count,
                    amount: installmentValue,
                    due_month: currentMonth,
                    due_year: currentYear,
                    paid: false,
                    created_at: nowIso
                });

                // Increment Month logic
                currentMonth++;
                if (currentMonth > 12) {
                    currentMonth = 1;
                    currentYear++;
                }
            }

            // 5. Batch Insert Children
            const { error: batchError } = await this.supabase.client
                .from('expense_installments')
                .insert(installmentsToInsert);

            if (batchError) {
                console.error('Error creating installments', batchError);
                // In a perfect world, we would rollback db transaction here.
                // Supabase doesn't support easy frontend transactions yet without RPC.
                // For now, we assume integrity or add cleanup logic if needed.
            }

        } else {
            // === REGULAR FLOW ===
            // Strict Type: RegularExpensePayload
            const payload: RegularExpensePayload = {
                user_id: userId,
                name: expenseData.name || 'Nova Despesa',
                category: expenseData.category || 'Outros',
                date: expenseData.date?.toISOString() || nowIso,
                created_at: nowIso,
                created_date: expenseData.date?.toISOString() || nowIso, // DB expects timestamp

                is_installment: false,
                amount: expenseData.amount || 0,
                due_month: expenseData.due_month,
                due_year: expenseData.due_year
                // total_amount, installment_total are never
            };

            const { error } = await this.supabase.client
                .from('expenses')
                .insert(payload);

            if (error) console.error('Error adding expense', error);
        }

        // Reload
        await this.loadExpenses(this.selectedMonth(), this.selectedYear());
    }

    async deleteExpense(id: string, isInstallment: boolean = false) {
        let idToDelete = id;
        let table = 'expenses';
        let deletionConfirmed = true;

        if (isInstallment) {
            // We are deleting a child line item.
            // Requirement: "Supabase must cascade delete children"
            // So we must delete the PARENT expense.
            
            // 1. Find the parent ID
            const { data } = await this.supabase.client
                .from('expense_installments')
                .select('expense_id')
                .eq('id', id)
                .single();
            
            if (data && data.expense_id) {
                idToDelete = data.expense_id; // Switch to parent ID
                table = 'expenses';           // Switch to parent table
            } else {
                console.error('Could not find parent for installment deletion. Child ID:', id);
                deletionConfirmed = false;
            }
        }

        if (deletionConfirmed) {
            const { error } = await this.supabase.client
                .from(table)
                .delete()
                .eq('id', idToDelete);

            if (error) {
                console.error('Error deleting expense', error);
                return;
            }
        }

        await this.loadExpenses(this.selectedMonth(), this.selectedYear());
    }

    async getAvailableYears() {
        // Simple query to get years from expenses table
        const { data } = await this.supabase.client
            .from('expenses')
            .select('due_year')
            .order('due_year', { ascending: true });
        
        if (!data) return [new Date().getFullYear()];
        
        const years = new Set(data.map(d => d.due_year).filter(y => !!y));
        const current = new Date().getFullYear();
        years.add(current);
        
        return Array.from(years).sort();
    }

    private getIconForCategory(cat: string): string {
        const map: Record<string, string> = {
            'Moradia': 'house',
            'Supermercado': 'shopping_cart',
            'Transporte': 'directions_bus',
            'Lazer': 'theater_comedy',
            'Saúde': 'local_hospital',
            'Assinaturas': 'live_tv',
            'Utilidades': 'bolt',
            'Seguros': 'shield'
        };
        return map[cat] || 'receipt';
    }

    private getColorForCategory(cat: string): string {
        const map: Record<string, string> = {
            'Moradia': 'text-primary-600 bg-indigo-50',
            'Supermercado': 'text-green-600 bg-green-50',
            'Transporte': 'text-blue-600 bg-blue-50',
            'Lazer': 'text-purple-600 bg-purple-50',
            'Saúde': 'text-red-600 bg-red-50',
            'Assinaturas': 'text-pink-600 bg-pink-50',
            'Utilidades': 'text-amber-600 bg-amber-50',
            'Seguros': 'text-teal-600 bg-teal-50'
        };
        return map[cat] || 'text-gray-600 bg-gray-50';
    }
}

