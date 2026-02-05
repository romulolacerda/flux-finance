import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmOptions } from '../../services/modal.service';

@Component({
    selector: 'app-confirm-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
    @Input({ required: true }) options!: ConfirmOptions;
    @Output() resolve = new EventEmitter<boolean>();

    confirm() {
        this.resolve.emit(true);
    }

    cancel() {
        this.resolve.emit(false);
    }
}
