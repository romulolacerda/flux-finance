import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { ModalService } from '../../shared/services/modal.service';
import { RemindersService } from '../../services/reminders.service';
import { filter } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [RouterOutlet, BottomNavComponent],
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    private router = inject(Router);
    private modalService = inject(ModalService);
    private remindersService = inject(RemindersService);

    ngOnInit() {
        this.checkReminders();
    }

    async checkReminders() {
        await this.remindersService.loadReminders();
        const reminders = this.remindersService.reminders();
        
        const d = new Date();
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const today = d.getDate();

        const dueToday = reminders.filter(r => 
            r.due_day === today && !(r.paid_months || []).includes(ym)
        );

        if (dueToday.length > 0) {
            setTimeout(() => {
                alert(`Lembrete Pratio:\nVocê tem ${dueToday.length} conta(s) vencendo hoje!\n\n` + dueToday.map(r => `• ${r.name}`).join('\n'));
                
                if ('Notification' in window && Notification.permission !== 'denied') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            new Notification('Contas a Pagar', {
                                body: `Você tem ${dueToday.length} conta(s) vencendo hoje!`,
                                icon: '/assets/icons/icon-192x192.png'
                            });
                        }
                    });
                }
            }, 1000);
        }
    }

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
        if (url.includes('/expenses/add') || url.includes('/reminders/add') || url.includes('/reminders/edit')) return false;

        return true;
    });
}
