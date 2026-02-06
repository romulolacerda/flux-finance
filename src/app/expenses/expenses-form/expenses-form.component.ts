import { Component, inject, computed, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExpensesService } from '../expenses.service';
import { InputComponent } from '../../shared/components/input/input.component';
import { SelectComponent, SelectOption } from '../../shared/components/select/select.component';
import { AlertService } from '../../shared/services/alert.service';
import { toDecimal, fromDecimal } from '../../shared/utils/decimal-utils';
import { CommonModule } from '@angular/common';
import { BrlCurrencyPipe } from '../../shared/pipes/brl-currency.pipe';

@Component({
    selector: 'app-expenses-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, InputComponent, SelectComponent, BrlCurrencyPipe],
    templateUrl: './expenses-form.component.html',
    styleUrls: ['./expenses-form.component.scss']
})
export class ExpensesFormComponent {
    expensesService = inject(ExpensesService);
    router = inject(Router);
    alertService = inject(AlertService);

    // Current Date Defaults
    private now = new Date();
    currentYear = this.now.getFullYear();
    currentMonth = this.now.getMonth() + 1;

    form = new FormGroup({
        name: new FormControl('', Validators.required),
        amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
        category: new FormControl('Utilidades', Validators.required),
        // New Fields
        is_installment: new FormControl(false),
        installment_total: new FormControl<number | null>(null),
        // Date Fields
        month: new FormControl(this.currentMonth.toString(), Validators.required),
        year: new FormControl(this.currentYear.toString(), Validators.required)
    });

    categories: SelectOption[] = [
        { label: 'Casa & Moradia', value: 'Moradia', icon: 'home' },
        { label: 'Supermercado', value: 'Supermercado', icon: 'shopping_cart' },
        { label: 'Transporte', value: 'Transporte', icon: 'directions_car' },
        { label: 'Lazer', value: 'Lazer', icon: 'theater_comedy' },
        { label: 'Saúde', value: 'Saúde', icon: 'medical_services' },
        { label: 'Assinaturas e Serviços', value: 'Assinaturas', icon: 'subscriptions' },
        { label: 'Utilidades (Luz/Água/Net)', value: 'Utilidades', icon: 'bolt' },
        { label: 'Seguros', value: 'Seguros', icon: 'verified_user' }
    ];

    months: SelectOption[] = [
        { label: 'Janeiro', value: '1' },
        { label: 'Fevereiro', value: '2' },
        { label: 'Março', value: '3' },
        { label: 'Abril', value: '4' },
        { label: 'Maio', value: '5' },
        { label: 'Junho', value: '6' },
        { label: 'Julho', value: '7' },
        { label: 'Agosto', value: '8' },
        { label: 'Setembro', value: '9' },
        { label: 'Outubro', value: '10' },
        { label: 'Novembro', value: '11' },
        { label: 'Dezembro', value: '12' }
    ];

    years: SelectOption[] = [
        { label: (this.currentYear - 1).toString(), value: (this.currentYear - 1).toString() },
        { label: this.currentYear.toString(), value: this.currentYear.toString() },
        { label: (this.currentYear + 1).toString(), value: (this.currentYear + 1).toString() }
    ];

    // Computed for display
    calculatedInstallmentValue = signal<number>(0);

    constructor() {
        // React to changes
        this.form.valueChanges.subscribe(val => {
            if (val.is_installment && val.amount && val.installment_total) {
                const total = toDecimal(val.amount);
                const count = val.installment_total;
                if (count > 0) {
                    this.calculatedInstallmentValue.set(total.div(count).toNumber());
                } else {
                    this.calculatedInstallmentValue.set(0);
                }
            } else {
                this.calculatedInstallmentValue.set(0);
            }
        });
        
        // Setup toggle validation logic
        this.form.get('is_installment')?.valueChanges.subscribe(isInst => {
            const instControl = this.form.get('installment_total');
            if (isInst) {
                instControl?.setValidators([Validators.required, Validators.min(2)]);
            } else {
                instControl?.clearValidators();
                instControl?.setValue(null);
            }
            instControl?.updateValueAndValidity();
        });
    }

    async submit() {
        if (this.form.valid) {
            const vals = this.form.value;
            const dueMonth = parseInt(vals.month || this.currentMonth.toString());
            const dueYear = parseInt(vals.year || this.currentYear.toString());

            const payload: any = {
                name: vals.name!,
                category: vals.category!,
                due_month: dueMonth,
                due_year: dueYear,
                is_installment: !!vals.is_installment
            };

            if (vals.is_installment) {
                // AMOUNT field acts as TOTAL AMOUNT
                payload.total_amount = vals.amount!;
                payload.installment_total = vals.installment_total!;
                // computed installment value is handled by service
            } else {
                // AMOUNT field acts as MONTHLY AMOUNT
                payload.amount = vals.amount!;
            }

            await this.expensesService.addExpense(payload);
            
            this.alertService.success('Conta salva com sucesso!');
            this.router.navigate(['/app/expenses']);
        } else {
            this.form.markAllAsTouched();
        }
    }
}
