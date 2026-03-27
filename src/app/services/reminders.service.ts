import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from '../core/supabase.service';

export interface Reminder {
  id?: string;
  user_id?: string;
  name: string;
  due_day: number;
  amount?: number | null;
  recurrence_type?: string;
  end_date?: string | null;
  paid_months?: string[];
  is_active?: boolean;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RemindersService {
  private supabaseService = inject(SupabaseService);
  
  // Signal para manter os lembretes em cache e atualizar a UI rapidamente
  reminders = signal<Reminder[]>([]);

  // Carrega todos os lembretes ativos do usuário logado
  async loadReminders(): Promise<void> {
    const user = this.supabaseService.currentUser();
    if (!user) return;

    try {
      const { data, error } = await this.supabaseService.client
        .from('reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('due_day', { ascending: true });

      if (error) throw error;
      
      // Converte o JSONB back para Array de strings caso venha diferente
      const typedData = (data || []).map(r => ({
        ...r,
        paid_months: Array.isArray(r.paid_months) ? r.paid_months : []
      }));

      this.reminders.set(typedData);
    } catch (error) {
      console.error('Erro ao carregar lembretes:', error);
    }
  }

  // Cria um novo lembrete
  async createReminder(reminder: Reminder): Promise<void> {
    const user = this.supabaseService.currentUser();
    if (!user) return;

    try {
      const { data, error } = await this.supabaseService.client
        .from('reminders')
        .insert([{ ...reminder, user_id: user.id, paid_months: [] }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        // Atualiza o signal adicionando o novo item e reordenando localmente
        const updated = [...this.reminders(), data].sort((a, b) => a.due_day - b.due_day);
        this.reminders.set(updated);
      }
    } catch (error) {
      console.error('Erro ao criar lembrete:', error);
      throw error;
    }
  }

  // Atualiza um lembrete (Ex: marcar como pago adicionando na array paid_months)
  async updateReminder(id: string, updates: Partial<Reminder>): Promise<void> {
    try {
      const { data, error } = await this.supabaseService.client
        .from('reminders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const updatedList = this.reminders().map(r => r.id === id ? { ...r, ...data } : r);
        this.reminders.set(updatedList);
      }
    } catch (error) {
      console.error('Erro ao atualizar lembrete:', error);
      throw error;
    }
  }

  // Deleta um lembrete
  async deleteReminder(id: string): Promise<void> {
    try {
      const { error } = await this.supabaseService.client
        .from('reminders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      this.reminders.set(this.reminders().filter(r => r.id !== id));
    } catch (error) {
      console.error('Erro ao deletar lembrete:', error);
      throw error;
    }
  }

  // Toggle de Pagamento mensal
  async togglePaymentForMonth(reminder: Reminder, yearMonth: string): Promise<void> {
    if (!reminder.id) return;
    
    const paidMonths = reminder.paid_months || [];
    const isPaid = paidMonths.includes(yearMonth);
    
    // Se está pago, remove. Se não está pago, adiciona.
    const newPaidMonths = isPaid 
      ? paidMonths.filter(m => m !== yearMonth) 
      : [...paidMonths, yearMonth];

    await this.updateReminder(reminder.id, { paid_months: newPaidMonths });
  }
}
