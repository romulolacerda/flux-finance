import { Component, inject, computed, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { ModalService } from '../../shared/services/modal.service';
import { filter } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [RouterOutlet, BottomNavComponent],
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
    private router = inject(Router);
    private modalService = inject(ModalService);

    isActive(path: string): boolean {
        return this.router.url.includes(path);
    }
    
    // Track current URL reactively
    private currentUrl = toSignal(
        this.router.events.pipe(
            filter(e => e instanceof NavigationEnd)
        ), 
        { initialValue: null }
    );

    // Compute visibility
    showBottomNav = computed(() => {
        // Trigger on URL change
        this.currentUrl(); 
        const url = this.router.url;
        
        // Hide if confirm modal is active
        if (this.modalService.activeModal()) return false;

        // Hide if on add expense page (full screen modal)
        if (url.includes('/expenses/add')) return false;

        return true;
    });
}
