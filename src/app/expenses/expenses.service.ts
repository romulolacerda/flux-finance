import { Injectable, inject, signal, computed } from '@angular/core';
import Decimal from 'decimal.js';
import { SupabaseService } from '../core/supabase.service';
import { Expense } from '../shared/interfaces/expense.interface';
import { toDecimal, sumDecimals, fromDecimal } from '../shared/utils/decimal-utils';

@Injectable({
    providedIn: 'root'
})
export class ExpensesService {
    private supabase = inject(SupabaseService);

    expenses = signal<Expense[]>([]);

    // Use Decimal for precise summation of expenses
    totalExpenses = computed(() => {
        const decimals = this.expenses().map(e => toDecimal(e.amount));
        return fromDecimal(sumDecimals(...decimals));
    });

    async loadExpenses() {
        const { data, error } = await this.supabase.client
            .from('expenses')
            .select('*')
            .order('date', { ascending: false });

        if (error) {
            console.error('Error loading expenses', error);
            return;
        }

        // Map icons/colors based on category
        const mapped = (data || []).map(e => ({
            ...e,
            icon: this.getIconForCategory(e.category),
            iconColor: this.getColorForCategory(e.category)
        }));

        this.expenses.set(mapped);
    }

    async addExpense(expense: Omit<Expense, 'id' | 'user_id'>) {
        const user = await this.supabase.user;
        if (!user.data.user) return;

        const { data, error } = await this.supabase.client
            .from('expenses')
            .insert({
                ...expense,
                user_id: user.data.user.id
            })
            .select()
            .single();

        if (error) {
            console.error('Error adding expense', error);
            return;
        }

        const newExpense = {
            ...data,
            icon: this.getIconForCategory(data.category),
            iconColor: this.getColorForCategory(data.category)
        };

        this.expenses.update(curr => [newExpense, ...curr]);
    }

    async updateExpense(id: string, data: Partial<Expense>) {
        const user = await this.supabase.user;
        if (!user.data.user) return;

        const { data: updated, error } = await this.supabase.client
            .from('expenses')
            .update(data)
            .eq('id', id)
            .eq('user_id', user.data.user.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating expense', error);
            return;
        }

        const updatedExpense = {
            ...updated,
            icon: this.getIconForCategory(updated.category),
            iconColor: this.getColorForCategory(updated.category)
        };

        this.expenses.update(curr => {
            const index = curr.findIndex(e => e.id === id);
            if (index >= 0) {
                const updatedList = [...curr];
                updatedList[index] = updatedExpense;
                return updatedList;
            }
            return curr;
        });
    }

    async deleteExpense(id: string) {
        const { error } = await this.supabase.client
            .from('expenses')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting expense', error);
            return;
        }

        this.expenses.update(curr => curr.filter(e => e.id !== id));
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
