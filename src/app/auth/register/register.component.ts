import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../core/supabase.service';
import { ProfileService } from '../../profile/profile.service';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, InputComponent, ButtonComponent],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    private router = inject(Router);
    private supabase = inject(SupabaseService);
    private profileService = inject(ProfileService);

    loading = false;
    errorMessage: string | null = null;

    form = new FormGroup({
        email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
        password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
        confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        personA: new FormControl(''),
        personB: new FormControl('')
    });

    async onSubmit() {
        if (this.form.valid) {
            if (this.form.getRawValue().password !== this.form.getRawValue().confirmPassword) {
                this.errorMessage = 'Senhas não conferem.';
                return;
            }

            this.loading = true;
            this.errorMessage = null;
            try {
                const { data, error } = await this.supabase.signUp(
                    this.form.getRawValue().email,
                    this.form.getRawValue().password
                );
                if (error) throw error;
                
                // Save custom profile names if a user was created
                if (data?.user) {
                     await this.profileService.saveProfile(
                         data.user.id, 
                         this.form.getRawValue().personA || 'Pessoa A', 
                         this.form.getRawValue().personB || 'Pessoa B'
                     );
                }

                alert('Cadastro realizado! Verifique seu email para confirmar.');
                this.router.navigate(['/auth/login']);
            } catch (error: any) {
                this.errorMessage = error.message || 'Erro ao criar conta.';
            } finally {
                this.loading = false;
            }
        } else {
            this.form.markAllAsTouched();
        }
    }
}
