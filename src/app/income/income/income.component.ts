import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IncomeService } from '../income.service';
import { CalculatorService } from '../../summary/calculator.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';

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
    router = inject(Router);

    incomeA = 0;
    incomeB = 0;

    get currentTotal() {
        return Number(this.incomeA || 0) + Number(this.incomeB || 0);
    }

    get ratioA() {
        const total = this.currentTotal;
        return total > 0 ? Number(this.incomeA || 0) / total : 0;
    }

    get ratioB() {
        const total = this.currentTotal;
        return total > 0 ? Number(this.incomeB || 0) / total : 0;
    }

    constructor() {
        effect(() => {
            this.incomeA = this.calcService.personA().amount;
            this.incomeB = this.calcService.personB().amount;
        });
    }

    ngOnInit() {
        this.incomeService.loadIncomes();
    }

    save() {
        // Save Person A
        this.incomeService.saveIncome({
            id: this.calcService.personA().id,
            name: this.calcService.personA().name || 'Pessoa A',
            amount: this.incomeA
        });

        // Save Person B
        this.incomeService.saveIncome({
            id: this.calcService.personB().id,
            name: this.calcService.personB().name || 'Pessoa B',
            amount: this.incomeB
        });

        this.router.navigate(['/app/expenses']);
    }
}
