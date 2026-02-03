import { Injectable, signal, computed } from '@angular/core';

export interface Bill {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: Date;
  icon: string;
  iconColor: string;
}

export interface User {
  name: string;
  email: string;
  since: string;
}

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  // Income State
  personAIncome = signal<number>(5200);
  personBIncome = signal<number>(3800);
  personAName = signal<string>('Ana');
  personBName = signal<string>('João');

  // Computed Income State
  totalIncome = computed(() => this.personAIncome() + this.personBIncome());
  ratioA = computed(() => this.totalIncome() > 0 ? this.personAIncome() / this.totalIncome() : 0.5);
  ratioB = computed(() => this.totalIncome() > 0 ? this.personBIncome() / this.totalIncome() : 0.5);

  // Bills State
  bills = signal<Bill[]>([
    { id: '1', name: 'Aluguel', amount: 1200.00, category: 'Moradia', date: new Date(), icon: 'house', iconColor: 'text-primary-600 bg-indigo-50' },
    { id: '2', name: 'Eletricidade', amount: 145.50, category: 'Utilidades', date: new Date(), icon: 'bolt', iconColor: 'text-amber-500 bg-amber-50' },
    { id: '3', name: 'Netflix', amount: 15.90, category: 'Assinaturas', date: new Date(), icon: 'live_tv', iconColor: 'text-red-500 bg-red-50' },
    { id: '4', name: 'Internet', amount: 50.00, category: 'Utilidades', date: new Date(), icon: 'wifi', iconColor: 'text-sky-500 bg-sky-50' },
    { id: '5', name: 'Seguro Carro', amount: 120.00, category: 'Seguros', date: new Date(), icon: 'directions_car', iconColor: 'text-emerald-500 bg-emerald-50' },
  ]);

  totalBills = computed(() => this.bills().reduce((acc, bill) => acc + bill.amount, 0));

  // User State
  currentUser = signal<User>({
    name: 'João Silva',
    email: 'usuario@exemplo.com',
    since: '2023'
  });

  addBill(bill: Omit<Bill, 'id' | 'icon' | 'iconColor'>) {
    const newBill: Bill = {
      ...bill,
      id: crypto.randomUUID(),
      icon: this.getIconForCategory(bill.category),
      iconColor: this.getColorForCategory(bill.category)
    };
    this.bills.update(bills => [newBill, ...bills]);
  }

  removeBill(id: string) {
    this.bills.update(bills => bills.filter(b => b.id !== id));
  }

  updateIncome(incomeA: number, incomeB: number) {
    this.personAIncome.set(incomeA);
    this.personBIncome.set(incomeB);
  }

  private getIconForCategory(cat: string): string {
    const map: Record<string, string> = {
      'Moradia': 'house',
      'Supermercado': 'shopping_cart',
      'Transporte': 'directions_bus',
      'Lazer': 'theater_comedy',
      'Saúde': 'local_hospital',
      'Assinaturas': 'live_tv',
      'Utilidades': 'bolt',
      'Seguros': 'shield'
    };
    return map[cat] || 'receipt';
  }

  private getColorForCategory(cat: string): string {
    const map: Record<string, string> = {
      'Moradia': 'text-primary-600 bg-indigo-50',
      'Supermercado': 'text-green-600 bg-green-50',
      'Transporte': 'text-blue-600 bg-blue-50',
      'Lazer': 'text-purple-600 bg-purple-50',
      'Saúde': 'text-red-600 bg-red-50',
      'Assinaturas': 'text-pink-600 bg-pink-50',
      'Utilidades': 'text-amber-600 bg-amber-50',
      'Seguros': 'text-teal-600 bg-teal-50'
    };
    return map[cat] || 'text-gray-600 bg-gray-50';
  }
}