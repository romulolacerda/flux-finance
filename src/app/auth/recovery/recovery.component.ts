import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../core/supabase.service';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
    selector: 'app-recovery',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, InputComponent, ButtonComponent],
    templateUrl: './recovery.component.html',
    styleUrls: ['./recovery.component.scss']
})
export class RecoveryComponent {
    private supabase = inject(SupabaseService);

    loading = false;
    message: string | null = null;
    errorMessage: string | null = null;

    form = new FormGroup({
        email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] })
    });

    async onSubmit() {
        if (this.form.valid) {
            this.loading = true;
            this.message = null;
            this.errorMessage = null;
            try {
                const { error } = await this.supabase.resetPassword(this.form.getRawValue().email);
                if (error) throw error;
                this.message = 'Email de recuperação enviado!';
            } catch (error: any) {
                this.errorMessage = error.message || 'Erro ao enviar email.';
            } finally {
                this.loading = false;
            }
        } else {
            this.form.markAllAsTouched();
        }
    }
}
