import { Component, OnInit, inject } from '@angular/core';
import { SupabaseService } from '../../core/supabase.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-splash',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './splash.component.html',
    styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {
    private router = inject(Router);
    private supabase = inject(SupabaseService);

    showConfigWarning = false;

    async ngOnInit() {
        if (environment.supabaseUrl.includes('YOUR_SUPABASE_URL')) {
            this.showConfigWarning = true;
            return;
        }

        // Minimum splash time
        await new Promise(resolve => setTimeout(resolve, 2000));

        const { data } = await this.supabase.session;
        if (data.session) {
            this.router.navigate(['/app/income']);
        } else {
            this.router.navigate(['/auth/login']);
        }
    }
}
