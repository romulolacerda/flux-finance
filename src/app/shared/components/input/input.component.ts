import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { formatarParaBRL, parseBRL } from '../../utils/currency-utils';

@Component({
    selector: 'app-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true
        }
    ]
})
export class InputComponent implements ControlValueAccessor {
    @Input() label = '';
    @Input() type: 'text' | 'email' | 'password' | 'number' | 'currency' = 'text';
    @Input() placeholder = '';
    @Input() icon = '';
    @Input() prefix = '';
    @Input() error: string | null = null;
    @Input() showPasswordToggle = false;

    @Output() focusEvent = new EventEmitter<void>();
    @Output() blurEvent = new EventEmitter<void>();

    value: any = '';
    isDisabled = false;
    isPasswordVisible = false;

    @Input() set disabled(value: boolean) {
        this.setDisabledState(value);
    }

    onChange = (_: any) => { };
    onTouch = () => { };

    togglePassword() {
        this.isPasswordVisible = !this.isPasswordVisible;
    }

    get inputType() {
        if (this.showPasswordToggle) {
            return this.isPasswordVisible ? 'text' : 'password';
        }
        if (this.type === 'currency' || this.type === 'number') {
            return 'text'; // Use text strictly for proper decimal mobile keyboard handling
        }
        return this.type;
    }

    get inputMode() {
        if (this.type === 'currency' || this.type === 'number') {
            return 'decimal'; // Triggers keyboard with , and . on iOS and Android
        }
        if (this.type === 'email') return 'email';
        return 'text';
    }

    writeValue(value: any): void {
        if (this.type === 'currency' && (typeof value === 'number' || value === null)) {
            // If it's the first load or model update, format it to BRL string
            // But if value is '' (empty form reset), keep it empty
             this.value = (value === null || value === '' || value === undefined) ? '' : formatarParaBRL(value);
        } else {
            this.value = value;
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    onFocus() {
        this.focusEvent.emit();
    }

    onBlur() {
        this.onTouch();
        // Re-format on blur to ensure beautiful presentation (e.g. user typed "1000", becomes "R$ 1.000,00")
        if (this.type === 'currency' && this.value) {
            const numericVal = parseBRL(this.value.toString());
            this.value = formatarParaBRL(numericVal);
        }
        this.blurEvent.emit();
    }

    onInput(event: Event) {
        const input = event.target as HTMLInputElement;
        let val: any = input.value;

        if (this.type === 'number') {
            const normalized = typeof val === 'string' ? val.replace(',', '.') : val;
            val = normalized === '' ? 0 : Number(normalized);
             this.value = val;
             this.onChange(val);
        } else if (this.type === 'currency') {
            // For currency, we keep the string in 'this.value' (UI),
            // but we emit a NUMBER to 'this.onChange' (Model)
            this.value = val;
            const numericVal = parseBRL(val);
            this.onChange(numericVal);
        } else {
            this.value = val;
            this.onChange(val);
        }
        
        this.onTouch();
    }
}
