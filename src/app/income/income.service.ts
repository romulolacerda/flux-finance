import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from '../core/supabase.service';
import { Income } from '../shared/interfaces/income.interface';

@Injectable({
    providedIn: 'root'
})
export class IncomeService {
    private supabase = inject(SupabaseService);

    incomes = signal<Income[]>([]);

    async loadIncomes() {
        const { data, error } = await this.supabase.client
            .from('income')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error loading income', error);
            return;
        }

        this.incomes.set(data || []);
    }

    async saveIncome(income: Income) {
        const user = await this.supabase.user;
        if (!user.data.user) return;

        const { data, error } = await this.supabase.client
            .from('income')
            .upsert({
                ...income,
                user_id: user.data.user.id
            })
            .select()
            .single();

        if (error) {
            console.error('Error saving income', error);
            return;
        }

        this.incomes.update(current => {
            const index = current.findIndex(i => i.id === data.id);
            if (index >= 0) {
                const updated = [...current];
                updated[index] = data;
                return updated;
            }
            return [...current, data];
        });
    }

    async updateIncome(id: string, data: Partial<Income>) {
        const user = await this.supabase.user;
        if (!user.data.user) return;

        const { data: updated, error } = await this.supabase.client
            .from('income')
            .update(data)
            .eq('id', id)
            .eq('user_id', user.data.user.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating income', error);
            return;
        }

        this.incomes.update(current => {
            const index = current.findIndex(i => i.id === id);
            if (index >= 0) {
                const updatedList = [...current];
                updatedList[index] = updated;
                return updatedList;
            }
            return current;
        });
    }

    async deleteIncome(id: string) {
        const { error } = await this.supabase.client
            .from('income')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting income', error);
            return;
        }

        this.incomes.update(current => current.filter(i => i.id !== id));
    }
}
