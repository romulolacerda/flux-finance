import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { RemindersService } from '../../services/reminders.service';
import { ModalService } from '../../shared/services/modal.service';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-reminders-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reminders-form.component.html'
})
export class RemindersFormComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  remindersService = inject(RemindersService);
  modalService = inject(ModalService);
  alertService = inject(AlertService);

  form: FormGroup;
  editId: string | null = null;
  saving = false;

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      due_day: [1, [Validators.required, Validators.min(1), Validators.max(31)]],
      amount: [null],
      recurrence_type: ['mensal', Validators.required],
      end_date: [null]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.editId = params.get('id');
      if (this.editId) {
        const item = this.remindersService.reminders().find(r => r.id === this.editId);
        if (item) {
          this.form.patchValue(item);
        } else {
          // Fallback if accessed via direct URL before data loaded
          this.remindersService.loadReminders().then(() => {
            const reItem = this.remindersService.reminders().find(r => r.id === this.editId);
            if(reItem) this.form.patchValue(reItem);
          });
        }
      }
    });
  }

  async submit() {
    if (this.form.invalid) return;
    this.saving = true;

    try {
      if (this.editId) {
        await this.remindersService.updateReminder(this.editId, this.form.value);
        this.alertService.success('Lembrete atualizado com sucesso!');
      } else {
        await this.remindersService.createReminder(this.form.value);
        this.alertService.success('Lembrete criado com sucesso!');
      }
      this.router.navigate(['/app/reminders']);
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar lembrete.');
    } finally {
      this.saving = false;
    }
  }

  async deleteReminder() {
    if (!this.editId) return;
    
    const confirmed = await this.modalService.openConfirm({
        title: 'Remover Lembrete',
        message: 'Tem certeza que deseja remover este lembrete?',
        confirmText: 'Remover',
        cancelText: 'Cancelar'
    });

    if (confirmed) {
      this.saving = true;
      try {
        await this.remindersService.deleteReminder(this.editId);
        this.alertService.delete('Lembrete removido com sucesso!');
        this.router.navigate(['/app/reminders']);
      } catch (e) {
        console.error(e);
        alert('Erro ao excluir lembrete.');
      } finally {
        this.saving = false;
      }
    }
  }
}
