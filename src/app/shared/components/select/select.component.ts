import { Component, Input, Output, EventEmitter, forwardRef, HostListener, ElementRef, ViewChild, TemplateRef, ViewContainerRef, EmbeddedViewRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
    label: string;
    value: any;
    icon?: string;
}

@Component({
    selector: 'app-select',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectComponent),
            multi: true
        }
    ]
})
export class SelectComponent implements ControlValueAccessor, OnDestroy {
    @Input() label = '';
    @Input() placeholder = 'Select an option';
    @Input() options: SelectOption[] = [];
    @Input() error: string | null = null;
    @Input() icon = '';

    @ViewChild('dropdownTemplate') dropdownTemplate!: TemplateRef<any>;

    isOpen = false;
    value: any = null;
    isDisabled = false;
    
    private viewRef: EmbeddedViewRef<any> | null = null;

    onChange = (_: any) => { };
    onTouch = () => { };

    constructor(private elementRef: ElementRef, private vcr: ViewContainerRef) {}

    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event) {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        let clickedInDropdown = false;
        
        if (this.viewRef) {
            this.viewRef.rootNodes.forEach(node => {
                if (node.contains && node.contains(event.target)) {
                    clickedInDropdown = true;
                }
            });
        }

        if (!clickedInside && !clickedInDropdown) {
            this.close();
        }
    }

    @HostListener('window:resize')
    onResize() {
        if (this.isOpen) {
            this.updatePosition();
        }
    }

    @HostListener('window:scroll')
    onScroll() {
        if (this.isOpen) {
             // Optional: Close on scroll or update position. Closing is safer for MVP.
             // But if scrolling inside the modal? The window scroll event might not fire for inner scroll.
             // We'll stick to updating position if we could catch it, but close is fine.
             // Actually, fixed position stays, so we might not need to do anything if window scrolls.
             // But if the trigger moves (e.g. valid scroll), the dropdown detaches.
             this.updatePosition();
        }
    }

    toggleDropdown() {
        if (this.isDisabled) return;
        
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.viewRef = this.vcr.createEmbeddedView(this.dropdownTemplate);
        this.viewRef.rootNodes.forEach(node => {
            document.body.appendChild(node);
            if (node instanceof HTMLElement) {
                this.updatePosition();
            }
        });
        this.onTouch();
    }

    close() {
        this.isOpen = false;
        if (this.viewRef) {
            this.viewRef.destroy();
            this.viewRef = null;
        }
    }

    updatePosition() {
        if (!this.viewRef) return;
        
        const rect = this.elementRef.nativeElement.querySelector('button')?.getBoundingClientRect();
        if (!rect) return;

        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = 320; // Expected average max height
        
        const renderAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

        this.viewRef.rootNodes.forEach(node => {
            if (node instanceof HTMLElement) {
                node.style.position = 'fixed';
                node.style.left = `${rect.left}px`;
                node.style.width = `${rect.width}px`;
                node.style.zIndex = '100000';
                
                const availableHeight = Math.max(150, renderAbove ? spaceAbove - 16 : spaceBelow - 16);
                node.style.maxHeight = `min(50vh, ${availableHeight}px)`;

                if (renderAbove) {
                    node.style.bottom = `${window.innerHeight - rect.top + 8}px`;
                    node.style.top = 'auto';
                    node.classList.remove('origin-top');
                    node.classList.add('origin-bottom');
                } else {
                    node.style.top = `${rect.bottom + 8}px`;
                    node.style.bottom = 'auto';
                    node.classList.remove('origin-bottom');
                    node.classList.add('origin-top');
                }
            }
        });
    }

    selectOption(option: SelectOption) {
        this.value = option.value;
        this.onChange(this.value);
        this.close();
    }

    get selectedOption() {
        return this.options.find(opt => opt.value === this.value);
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

    ngOnDestroy() {
        this.close();
    }
}
