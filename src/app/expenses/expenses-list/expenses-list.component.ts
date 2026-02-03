import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExpensesService } from '../expenses.service';
import { CalculatorService } from '../../summary/calculator.service';

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

    ngOnInit() {
        this.expensesService.loadExpenses();
    }

    deleteBill(id: string) {
        if (confirm('Tem certeza que deseja remover esta conta?')) {
            this.expensesService.deleteExpense(id);
        }
    }
}
