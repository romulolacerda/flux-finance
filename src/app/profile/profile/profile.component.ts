import { Component, inject, effect } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../core/supabase.service';
import { ProfileService } from '../profile.service';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../shared/components/input/input.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AlertService } from '../../shared/services/alert.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [InputComponent, FormsModule, HeaderComponent, ButtonComponent],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
    supabaseService = inject(SupabaseService);
    profileService = inject(ProfileService);
    alertService = inject(AlertService);
    router = inject(Router);

    personA = '';
    personB = '';
    saving = false;

    constructor() {
        effect(() => {
            const profile = this.profileService.profile();
            if (profile) {
                this.personA = profile.person_a_name;
                this.personB = profile.person_b_name;
            }
        });
    }

    async saveProfile() {
        if (!this.personA || !this.personB) {
            this.alertService.delete('Os nomes não podem estar vazios.');
            return;
        }

        const user = this.supabaseService.currentUser();
        if (!user) return;

        this.saving = true;
        try {
            await this.profileService.saveProfile(user.id, this.personA, this.personB);
            this.alertService.success('Nomes atualizados com sucesso!');
        } catch (error) {
            this.alertService.delete('Erro ao atualizar nomes.');
        } finally {
            this.saving = false;
        }
    }

    async logout() {
        await this.supabaseService.signOut();
        this.router.navigate(['/auth/login']);
    }
}
