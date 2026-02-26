import { Injectable, inject, computed } from '@angular/core';
import Decimal from 'decimal.js';
import { ProfileService } from '../profile/profile.service';
import { IncomeService } from '../income/income.service';
import { ExpensesService } from '../expenses/expenses.service';
import { toDecimal, calculateRatio, fromDecimal } from '../shared/utils/decimal-utils';

@Injectable({
    providedIn: 'root'
})
export class CalculatorService {
    private incomeService = inject(IncomeService);
    private expensesService = inject(ExpensesService);
    private profileService = inject(ProfileService);

    // Computeds
    personA = computed(() => {
        const inc = this.incomeService.incomes()[0];
        const profile = this.profileService.profile();
        // Convert to Decimal for precise calculations
        const amount = toDecimal(inc?.amount);
        return { 
            id: inc?.id,
            name: profile?.person_a_name ?? 'Pessoa A', 
            amount: fromDecimal(amount) // Return as number for compatibility
        };
    });

    personB = computed(() => {
        const inc = this.incomeService.incomes()[1];
        const profile = this.profileService.profile();
        const amount = toDecimal(inc?.amount);
        return { 
            id: inc?.id, 
            name: profile?.person_b_name ?? 'Pessoa B', 
            amount: fromDecimal(amount)
        };
    });

    totalIncome = computed(() => {
        const a = toDecimal(this.personA().amount);
        const b = toDecimal(this.personB().amount);
        // Use Decimal addition for precision
        return fromDecimal(a.plus(b));
    });

    ratioA = computed(() => {
        const total = toDecimal(this.totalIncome());
        const partA = toDecimal(this.personA().amount);
        // Use Decimal division for precise ratio calculation
        const ratio = calculateRatio(partA, total);
        // Round to 1 decimal place percentage (e.g., 60.6%) for calculation
        // This ensures the calculation matches the displayed percentage
        return fromDecimal(ratio.times(100).toDecimalPlaces(1).dividedBy(100));
    });

    ratioB = computed(() => {
        const total = toDecimal(this.totalIncome());
        const partB = toDecimal(this.personB().amount);
        const ratio = calculateRatio(partB, total);
        // Round to 1 decimal place percentage (e.g., 39.4%)
        return fromDecimal(ratio.times(100).toDecimalPlaces(1).dividedBy(100));
    });

    totalExpenses = this.expensesService.totalExpenses;

    // Specific shares - using Decimal multiplication for precision
    shareA = computed(() => {
        const expenses = this.expensesService.expenses();
        
        let sharedTotal = toDecimal(0);
        let individualTotalA = toDecimal(0);

        for (const exp of expenses) {
            const amount = toDecimal(exp.amount || 0);
            if (exp.individual) {
                if (exp.responsible === 'A') {
                    individualTotalA = individualTotalA.plus(amount);
                }
            } else {
                sharedTotal = sharedTotal.plus(amount);
            }
        }

        const ratio = toDecimal(this.ratioA());
        const sharedShare = sharedTotal.times(ratio);
        return fromDecimal(sharedShare.plus(individualTotalA));
    });

    shareB = computed(() => {
        const expenses = this.expensesService.expenses();
        
        let sharedTotal = toDecimal(0);
        let individualTotalB = toDecimal(0);

        for (const exp of expenses) {
            const amount = toDecimal(exp.amount || 0);
            if (exp.individual) {
                if (exp.responsible === 'B') {
                    individualTotalB = individualTotalB.plus(amount);
                }
            } else {
                sharedTotal = sharedTotal.plus(amount);
            }
        }

        const ratio = toDecimal(this.ratioB());
        const sharedShare = sharedTotal.times(ratio);
        return fromDecimal(sharedShare.plus(individualTotalB));
    });
}
