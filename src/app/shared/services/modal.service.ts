import { Injectable, signal } from '@angular/core';

export interface ConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    activeModal = signal<ConfirmOptions | null>(null);
    private resolveRef: ((value: boolean) => void) | null = null;

    openConfirm(options: ConfirmOptions): Promise<boolean> {
        this.activeModal.set(options);
        return new Promise<boolean>((resolve) => {
            this.resolveRef = resolve;
        });
    }

    resolve(result: boolean) {
        if (this.resolveRef) {
            this.resolveRef(result);
            this.resolveRef = null;
        }
        this.activeModal.set(null);
    }
}
