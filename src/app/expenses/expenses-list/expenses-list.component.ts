import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExpensesService } from '../expenses.service';
import { CalculatorService } from '../../summary/calculator.service';
import { AlertService } from '../../shared/services/alert.service';
import { ModalService } from '../../shared/services/modal.service';
import { MonthSelectorComponent } from '../../shared/components/month-selector/month-selector.component';
import { BrlCurrencyPipe } from '../../shared/pipes/brl-currency.pipe';

@Component({
    selector: 'app-expenses-list',
    standalone: true,
    imports: [CommonModule, RouterLink, MonthSelectorComponent, BrlCurrencyPipe],
    templateUrl: './expenses-list.component.html',
    styleUrls: ['./expenses-list.component.scss']
})
export class ExpensesListComponent implements OnInit {
    expensesService = inject(ExpensesService);
    calcService = inject(CalculatorService);
    alertService = inject(AlertService);
    modalService = inject(ModalService);

    availableYears: number[] = [new Date().getFullYear()];

    constructor() {
        // React to changes if needed, but manual load on select is safer regarding async
    }

    async ngOnInit() {
        this.availableYears = await this.expensesService.getAvailableYears();
        this.loadData();
    }

    loadData() {
        this.expensesService.loadExpenses(
            this.expensesService.selectedMonth(),
            this.expensesService.selectedYear()
        );
    }

    onMonthChange(month: number) {
        this.expensesService.selectedMonth.set(month);
        this.loadData();
    }

    onYearChange(year: number) {
        this.expensesService.selectedYear.set(year);
        this.loadData();
    }

    async deleteBill(id: string, isInstallment: boolean = false) {
        const title = isInstallment ? 'Remover despesa parcelada' : 'Remover conta';
        const msg = isInstallment 
            ? 'Esta é uma despesa parcelada. Ao remover, todas as parcelas serão excluídas. Deseja continuar?'
            : 'Tem certeza que deseja remover esta conta?';

        const confirmed = await this.modalService.openConfirm({
            title: title,
            message: msg,
            confirmText: 'Remover',
            cancelText: 'Cancelar'
        });

        if (confirmed) {
            await this.expensesService.deleteExpense(id, isInstallment);
            this.alertService.delete('Conta removida com sucesso!');
        }
    }
}

