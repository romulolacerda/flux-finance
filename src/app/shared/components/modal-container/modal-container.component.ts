import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
    selector: 'app-modal-container',
    standalone: true,
    imports: [CommonModule, ConfirmModalComponent],
    template: `
        @if (modalService.activeModal(); as options) {
            <app-confirm-modal 
                [options]="options" 
                (resolve)="modalService.resolve($event)">
            </app-confirm-modal>
        }
    `
})
export class ModalContainerComponent {
    modalService = inject(ModalService);
}
