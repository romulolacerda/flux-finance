import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';
import { ModalContainerComponent } from './shared/components/modal-container/modal-container.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, ToastContainerComponent, ModalContainerComponent],
    template: `
        <router-outlet></router-outlet>
        <app-toast-container></app-toast-container>
        <app-modal-container></app-modal-container>
    `
})
export class AppComponent { }
