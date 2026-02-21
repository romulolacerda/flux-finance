import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IncomeService } from '../income.service';
import { CalculatorService } from '../../summary/calculator.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { toDecimal, calculateRatio, fromDecimal } from '../../shared/utils/decimal-utils';
import { AlertService } from '../../shared/services/alert.service';
import { BrlCurrencyPipe } from '../../shared/pipes/brl-currency.pipe';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
    selector: 'app-income',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonComponent, InputComponent, BrlCurrencyPipe, HeaderComponent],
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
            // When service data loads, update internal values
            this.incomeA = this.calcService.personA().amount;
            this.incomeB = this.calcService.personB().amount;
        });
    }

    ngOnInit() {
        this.incomeService.loadIncomes();
    }

    async save() {
        // Person A name now comes from CalculatorService which delegates to ProfileService
        await this.incomeService.saveIncome({
            id: this.calcService.personA().id,
            name: this.calcService.personA().name,
            amount: this.incomeA
        });

        // Person B name
        await this.incomeService.saveIncome({
            id: this.calcService.personB().id,
            name: this.calcService.personB().name,
            amount: this.incomeB
        });

        this.alertService.success('Renda salva com sucesso!');
        this.router.navigate(['/app/expenses']);
    }
}
