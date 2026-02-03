import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-2 w-full">
        @if (label) {
            <label class="text-slate-700 text-sm font-bold flex items-center gap-2 mb-1">
                @if (icon) { <span class="material-symbols-outlined text-primary-600">{{icon}}</span> }
                {{ label }}
            </label>
        }
        
        <ng-content></ng-content>

        @if (error) {
            <span class="text-red-500 text-xs font-semibold animate-slide-down flex items-center gap-1 mt-1">
                <span class="material-symbols-outlined text-sm">error</span>
                {{ error }}
            </span>
        }
    </div>
  `
})
export class FormFieldComponent {
  @Input() label = '';
  @Input() icon = '';
  @Input() error: string | null = null;
}
