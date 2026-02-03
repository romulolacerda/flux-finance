import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../core/supabase.service';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, InputComponent, ButtonComponent],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    private router = inject(Router);
    private supabase = inject(SupabaseService);

    loading = false;
    errorMessage: string | null = null;

    // Explicitly typed form group for better type checking
    loginForm = new FormGroup({
        email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
        password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
    });

    async onSubmit() {
        if (this.loginForm.valid) {
            this.loading = true;
            this.errorMessage = null;
            try {
                const { error } = await this.supabase.signIn(
                    this.loginForm.getRawValue().email,
                    this.loginForm.getRawValue().password
                );
                if (error) throw error;
                this.router.navigate(['/app/income']);
            } catch (error: any) {
                this.errorMessage = error.message || 'Erro ao entrar. Tente novamente.';
            } finally {
                this.loading = false;
            }
        } else {
            this.loginForm.markAllAsTouched();
        }
    }
}
