import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../core/supabase.service';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../shared/components/input/input.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [InputComponent, FormsModule, HeaderComponent],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
    supabaseService = inject(SupabaseService);
    router = inject(Router);

    async logout() {
        await this.supabaseService.signOut();
        this.router.navigate(['/auth/login']);
    }
}
