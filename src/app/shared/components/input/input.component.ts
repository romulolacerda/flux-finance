import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';

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
    @Input() type: 'text' | 'email' | 'password' | 'number' = 'text';
    @Input() placeholder = '';
    @Input() icon = '';
    @Input() prefix = '';
    @Input() error: string | null = null;
    @Input() showPasswordToggle = false;

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
        return this.type;
    }

    writeValue(value: any): void {
        this.value = value;
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

    onInput(event: Event) {
        const input = event.target as HTMLInputElement;
        let val: any = input.value;

        if (this.type === 'number') {
            val = val === '' ? 0 : Number(val);
        }

        this.value = val;
        this.onChange(val);
        this.onTouch();
    }
}
