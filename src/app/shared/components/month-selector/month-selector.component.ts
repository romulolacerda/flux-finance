import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent, SelectOption } from '../select/select.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-month-selector',
  standalone: true,
  imports: [CommonModule, SelectComponent, ReactiveFormsModule],
  templateUrl: './month-selector.component.html',
  styleUrls: ['./month-selector.component.scss']
})
export class MonthSelectorComponent {
  @Input() selectedMonth: number = new Date().getMonth() + 1;
  @Input() selectedYear: number = new Date().getFullYear();
  @Input() availableYears: number[] = [new Date().getFullYear()];

  @Output() monthChange = new EventEmitter<number>();
  @Output() yearChange = new EventEmitter<number>();

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  months = [
    { value: 1, label: 'Jan' },
    { value: 2, label: 'Fev' },
    { value: 3, label: 'Mar' },
    { value: 4, label: 'Abr' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' },
    { value: 8, label: 'Ago' },
    { value: 9, label: 'Set' },
    { value: 10, label: 'Out' },
    { value: 11, label: 'Nov' },
    { value: 12, label: 'Dez' }
  ];

  yearControl = new FormControl(new Date().getFullYear());

  // Drag State
  isDown = false;
  startX = 0;
  scrollLeft = 0;

  get yearOptions(): SelectOption[] {
    return this.availableYears.map(y => ({ label: y.toString(), value: y }));
  }

  ngOnChanges() {
    if (this.yearControl.value !== this.selectedYear) {
        this.yearControl.setValue(this.selectedYear, { emitEvent: false });
    }
  }

  ngOnInit() {
    this.yearControl.valueChanges.subscribe(val => {
        if (val) this.yearChange.emit(val);
    });
  }

  selectMonth(m: number) {
    // Only select if not dragging (optional check, but button click usually fires anyway)
    this.monthChange.emit(m);
  }

  // Drag Handlers
  onMouseDown(e: MouseEvent) {
    this.isDown = true;
    this.startX = e.pageX - this.scrollContainer.nativeElement.offsetLeft;
    this.scrollLeft = this.scrollContainer.nativeElement.scrollLeft;
  }

  onMouseLeave() {
    this.isDown = false;
  }

  onMouseUp() {
    this.isDown = false;
  }

  onMouseMove(e: MouseEvent) {
    if (!this.isDown) return;
    e.preventDefault();
    const x = e.pageX - this.scrollContainer.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 1.5; // Scroll-fast
    this.scrollContainer.nativeElement.scrollLeft = this.scrollLeft - walk;
  }
}
