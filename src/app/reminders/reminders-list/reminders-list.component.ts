import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { RemindersService, Reminder } from '../../services/reminders.service';
import { ModalService } from '../../shared/services/modal.service';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-reminders-list',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, ButtonComponent],
  templateUrl: './reminders-list.component.html'
})
export class RemindersListComponent implements OnInit {
  remindersService = inject(RemindersService);
  router = inject(Router);
  modalService = inject(ModalService);
  alertService = inject(AlertService);

  ngOnInit() {
    this.remindersService.loadReminders();
  }

  getCurrentYearMonth(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  isPaid(reminder: Reminder): boolean {
    const ym = this.getCurrentYearMonth();
    return (reminder.paid_months || []).includes(ym);
  }

  isOverdue(reminder: Reminder): boolean {
    if (this.isPaid(reminder)) return false;
    const today = new Date().getDate();
    return today > reminder.due_day;
  }

  async togglePaid(reminder: Reminder, event: Event) {
    event.stopPropagation();
    await this.remindersService.togglePaymentForMonth(reminder, this.getCurrentYearMonth());
  }

  async deleteReminder(id: string, event: Event) {
    event.stopPropagation();
    
    const confirmed = await this.modalService.openConfirm({
        title: 'Remover Lembrete',
        message: 'Tem certeza que deseja remover este lembrete?',
        confirmText: 'Remover',
        cancelText: 'Cancelar'
    });

    if (confirmed) {
        await this.remindersService.deleteReminder(id);
        this.alertService.delete('Lembrete removido com sucesso!');
    }
  }
}
