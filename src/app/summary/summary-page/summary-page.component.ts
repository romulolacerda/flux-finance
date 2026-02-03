import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorService } from '../calculator.service';
import { IncomeService } from '../../income/income.service';
import { ExpensesService } from '../../expenses/expenses.service';

@Component({
    selector: 'app-summary-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './summary-page.component.html',
    styleUrls: ['./summary-page.component.scss']
})
export class SummaryPageComponent implements OnInit {
    calcService = inject(CalculatorService);
    private incomeService = inject(IncomeService);
    private expensesService = inject(ExpensesService);

    ngOnInit() {
        // Load fresh data from Supabase when summary page is accessed
        this.incomeService.loadIncomes();
        this.expensesService.loadExpenses();
    }
}
