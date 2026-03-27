import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SupabaseService } from '../../core/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-more',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './more.component.html'
})
export class MoreComponent {
  supabaseService = inject(SupabaseService);
  private router = inject(Router);

  logout() {
    this.supabaseService.signOut().then(() => {
      this.router.navigate(['/auth/login']);
    });
  }
}
