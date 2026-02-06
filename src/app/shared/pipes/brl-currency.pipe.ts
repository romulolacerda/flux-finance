import { Pipe, PipeTransform } from '@angular/core';
import { formatarParaBRL } from '../utils/currency-utils';

@Pipe({
    name: 'brlCurrency',
    standalone: true
})
export class BrlCurrencyPipe implements PipeTransform {
    transform(value: number | null | undefined): string {
        return formatarParaBRL(value);
    }
}
