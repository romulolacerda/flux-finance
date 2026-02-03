import { Injectable, inject, computed } from '@angular/core';
import { IncomeService } from '../income/income.service';
import { ExpensesService } from '../expenses/expenses.service';

@Injectable({
    providedIn: 'root'
})
export class CalculatorService {
    private incomeService = inject(IncomeService);
    private expensesService = inject(ExpensesService);

    // Computeds
    personA = computed(() => {
        const inc = this.incomeService.incomes()[0];
        // Ensure amount is strictly a number, treating null/undefined as 0
        const amount = inc?.amount ? Number(inc.amount) : 0;
        return { 
            id: inc?.id, // Keep ID for component compatibility
            name: inc?.name ?? 'Pessoa A', 
            amount: isNaN(amount) ? 0 : amount 
        };
    });

    personB = computed(() => {
        const inc = this.incomeService.incomes()[1];
        const amount = inc?.amount ? Number(inc.amount) : 0;
        return { 
            id: inc?.id, 
            name: inc?.name ?? 'Pessoa B', 
            amount: isNaN(amount) ? 0 : amount 
        };
    });

    totalIncome = computed(() => {
        const a = this.personA().amount;
        const b = this.personB().amount;
        return Number(a) + Number(b);
    });

    ratioA = computed(() => {
        const total = this.totalIncome();
        // Avoid division by zero
        if (!total || total <= 0) return 0;
        return this.personA().amount / total;
    });

    ratioB = computed(() => {
        const total = this.totalIncome();
        if (!total || total <= 0) return 0;
        return this.personB().amount / total;
    });

    totalExpenses = this.expensesService.totalExpenses;

    // Specific shares
    shareA = computed(() => this.totalExpenses() * this.ratioA());
    shareB = computed(() => this.totalExpenses() * this.ratioB());
}
