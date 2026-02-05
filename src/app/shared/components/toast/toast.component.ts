import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast } from '../../services/alert.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
    @Input({ required: true }) toast!: Toast;
    @Output() close = new EventEmitter<void>();

    onClose() {
        this.close.emit();
    }
}
