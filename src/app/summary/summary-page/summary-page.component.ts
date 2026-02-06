import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorService } from '../calculator.service';
import { IncomeService } from '../../income/income.service';
import { ExpensesService } from '../../expenses/expenses.service';
import { AlertService } from '../../shared/services/alert.service';
import { BrlCurrencyPipe } from '../../shared/pipes/brl-currency.pipe';

@Component({
    selector: 'app-summary-page',
    standalone: true,
    imports: [CommonModule, BrlCurrencyPipe],
    templateUrl: './summary-page.component.html',
    styleUrls: ['./summary-page.component.scss']
})
export class SummaryPageComponent implements OnInit {
    calcService = inject(CalculatorService);
    private incomeService = inject(IncomeService);
    private expensesService = inject(ExpensesService);
    private alertService = inject(AlertService);

    ngOnInit() {
        // Load fresh data from Supabase when summary page is accessed
        this.incomeService.loadIncomes();

        this.expensesService.loadExpenses(
            this.expensesService.selectedMonth(),
            this.expensesService.selectedYear()
        );
    }

    markAsPaid() {
        this.alertService.success('Contas marcadas como pagas!');
    }
}
