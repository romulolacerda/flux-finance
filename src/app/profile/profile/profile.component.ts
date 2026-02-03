import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../core/supabase.service';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../shared/components/input/input.component';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [InputComponent, FormsModule],
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
