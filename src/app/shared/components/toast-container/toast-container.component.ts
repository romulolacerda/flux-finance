import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';
import { ToastComponent } from '../toast/toast.component';

@Component({
    selector: 'app-toast-container',
    standalone: true,
    imports: [CommonModule, ToastComponent],
    template: `
        <div class="fixed top-4 right-4 z-[9999] flex flex-col items-end pointer-events-none">
            <!-- Container needs pointer-events-none so it doesn't block clicks on the page behind it -->
            <!-- Individual toasts need pointer-events-auto (handled in their own style usually, or we enforce it here) -->
            @for (toast of alertService.toasts(); track toast.id) {
                <div class="pointer-events-auto">
                    <app-toast [toast]="toast" (close)="alertService.remove(toast.id)"></app-toast>
                </div>
            }
        </div>
    `
})
export class ToastContainerComponent {
    alertService = inject(AlertService);
}
