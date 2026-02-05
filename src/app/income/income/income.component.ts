import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Decimal from 'decimal.js';
import { IncomeService } from '../income.service';
import { CalculatorService } from '../../summary/calculator.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { toDecimal, calculateRatio, fromDecimal, formatCurrencyBR, parseCurrencyBR } from '../../shared/utils/decimal-utils';
import { AlertService } from '../../shared/services/alert.service';

@Component({
    selector: 'app-income',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonComponent, InputComponent],
    templateUrl: './income.component.html',
    styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {
    incomeService = inject(IncomeService);
    calcService = inject(CalculatorService);
    alertService = inject(AlertService);
    router = inject(Router);

    // Internal numeric values
    incomeA = 0;
    incomeB = 0;

    // Display values for inputs
    incomeADisplay = '0,00';
    incomeBDisplay = '0,00';

    get currentTotal() {
        const a = toDecimal(this.incomeA || 0);
        const b = toDecimal(this.incomeB || 0);
        return fromDecimal(a.plus(b));
    }

    get ratioA() {
        const total = toDecimal(this.currentTotal);
        const partA = toDecimal(this.incomeA || 0);
        return fromDecimal(calculateRatio(partA, total));
    }

    get ratioB() {
        const total = toDecimal(this.currentTotal);
        const partB = toDecimal(this.incomeB || 0);
        return fromDecimal(calculateRatio(partB, total));
    }

    constructor() {
        effect(() => {
            // When service data loads, update internal and display values
            this.incomeA = this.calcService.personA().amount;
            this.incomeB = this.calcService.personB().amount;
            
            this.incomeADisplay = formatCurrencyBR(this.incomeA);
            this.incomeBDisplay = formatCurrencyBR(this.incomeB);
        });
    }

    handleFocus(person: 'A' | 'B') {
        if (person === 'A') {
            // On focus, show raw number for editing, or empty if 0
            // Replace dot with comma to match BR format expectation
            this.incomeADisplay = this.incomeA === 0 ? '' : this.incomeA.toString().replace('.', ',');
        } else {
            this.incomeBDisplay = this.incomeB === 0 ? '' : this.incomeB.toString().replace('.', ',');
        }
    }

    handleBlur(person: 'A' | 'B') {
        if (person === 'A') {
            // Parse input string to number
            this.incomeA = parseCurrencyBR(this.incomeADisplay);
            // Re-format display
            this.incomeADisplay = formatCurrencyBR(this.incomeA);
        } else {
            this.incomeB = parseCurrencyBR(this.incomeBDisplay);
            this.incomeBDisplay = formatCurrencyBR(this.incomeB);
        }
    }

    onInputChange(value: string, person: 'A' | 'B') {
        // 1. Remove invalid characters (loops over string, keeping only numbers, comma, dot)
        let sanitized = value.replace(/[^0-9,.]/g, '');

        // 2. Replace dots with commas (for Brazil standard)
        sanitized = sanitized.replace(/\./g, ',');

        // 3. Update the display value
        if (person === 'A') {
            this.incomeADisplay = sanitized;
        } else {
            this.incomeBDisplay = sanitized;
        }
    }

    ngOnInit() {
        this.incomeService.loadIncomes();
    }

    async save() {
        // Save Person A
        await this.incomeService.saveIncome({
            id: this.calcService.personA().id,
            name: this.calcService.personA().name || 'Pessoa A',
            amount: this.incomeA
        });

        // Save Person B
        await this.incomeService.saveIncome({
            id: this.calcService.personB().id,
            name: this.calcService.personB().name || 'Pessoa B',
            amount: this.incomeB
        });

        this.alertService.success('Renda salva com sucesso!');
        this.router.navigate(['/app/expenses']);
    }
}
