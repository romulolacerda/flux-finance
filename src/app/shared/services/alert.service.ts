import { Injectable, signal } from '@angular/core';

export interface Toast {
    id: string;
    type: 'success' | 'delete';
    message: string;
    duration?: number;
}

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    toasts = signal<Toast[]>([]);

    success(message: string, duration: number = 3000) {
        this.addToast('success', message, duration);
    }

    delete(message: string, duration: number = 3000) {
        this.addToast('delete', message, duration);
    }

    remove(id: string) {
        this.toasts.update(current => current.filter(t => t.id !== id));
    }

    private addToast(type: 'success' | 'delete', message: string, duration: number) {
        const id = crypto.randomUUID();
        const toast: Toast = { id, type, message, duration };
        
        this.toasts.update(current => [...current, toast]);

        if (duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, duration);
        }
    }
}
