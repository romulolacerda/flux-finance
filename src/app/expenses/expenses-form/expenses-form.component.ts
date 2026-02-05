import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExpensesService } from '../expenses.service';
import { InputComponent } from '../../shared/components/input/input.component';
import { SelectComponent, SelectOption } from '../../shared/components/select/select.component';
import { AlertService } from '../../shared/services/alert.service';

@Component({
    selector: 'app-expenses-form',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, InputComponent, SelectComponent],
    templateUrl: './expenses-form.component.html',
    styleUrls: ['./expenses-form.component.scss']
})
export class ExpensesFormComponent {
    expensesService = inject(ExpensesService);
    router = inject(Router);
    alertService = inject(AlertService);

    form = new FormGroup({
        name: new FormControl('', Validators.required),
        amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
        category: new FormControl('Utilidades', Validators.required)
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
        { label: 'Outubro', value: 'Outubro' },
        { label: 'Novembro', value: 'Novembro' }
    ];

    years: SelectOption[] = [
        { label: '2024', value: '2024' },
        { label: '2025', value: '2025' }
    ];

    async submit() {
        if (this.form.valid) {
            await this.expensesService.addExpense({
                name: this.form.value.name!,
                amount: this.form.value.amount!,
                category: this.form.value.category!,
                date: new Date()
            });
            this.alertService.success('Conta salva com sucesso!');
            this.router.navigate(['/app/expenses']);
        }
    }
}
