import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExpensesService } from '../expenses.service';
import { CalculatorService } from '../../summary/calculator.service';
import { AlertService } from '../../shared/services/alert.service';
import { ModalService } from '../../shared/services/modal.service';

@Component({
    selector: 'app-expenses-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './expenses-list.component.html',
    styleUrls: ['./expenses-list.component.scss']
})
export class ExpensesListComponent implements OnInit {
    expensesService = inject(ExpensesService);
    calcService = inject(CalculatorService);
    alertService = inject(AlertService);
    modalService = inject(ModalService);

    ngOnInit() {
        this.expensesService.loadExpenses();
    }

    async deleteBill(id: string) {
        const confirmed = await this.modalService.openConfirm({
            title: 'Remover conta',
            message: 'Tem certeza que deseja remover esta conta?',
            confirmText: 'Remover',
            cancelText: 'Cancelar'
        });

        if (confirmed) {
            await this.expensesService.deleteExpense(id);
            this.alertService.delete('Conta removida com sucesso!');
        }
    }
}
