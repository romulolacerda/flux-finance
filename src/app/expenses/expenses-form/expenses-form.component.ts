import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExpensesService } from '../expenses.service';
import { InputComponent } from '../../shared/components/input/input.component';
import { SelectComponent, SelectOption } from '../../shared/components/select/select.component';

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

    form = new FormGroup({
        name: new FormControl('', Validators.required),
        amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
        category: new FormControl('Utilidades', Validators.required)
        // Note: Date fields (month/year) seem visual only in original form or mapped to date?
        // Original code didn't map month/year to form control. It just had them in HTML without binding?
        // Let's check the HTML again.
        // trace: <select ...> <option>Outubro</option> ... </select> (No formControlName)
        // So they were doing nothing? Or maybe I missed it.
        // Using view_file output from step 68: line 70-74 and 82-86 have NO formControlName.
        // So functionality-wise they were dummy fields. I will keep them as dummy or ignore them.
        // But to make them look good I should use app-select.
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

    submit() {
        if (this.form.valid) {
            this.expensesService.addExpense({
                name: this.form.value.name!,
                amount: this.form.value.amount!,
                category: this.form.value.category!,
                date: new Date() // Date logic was existing only as new Date(), ignoring month/year selects
            });
            this.router.navigate(['/app/expenses']);
        }
    }
}
