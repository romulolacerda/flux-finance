import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav
        class="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] h-20 flex justify-around items-center px-4 safe-bottom transition-all">

        <!-- Income -->
        <a routerLink="/app/income" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}"
            class="group flex flex-col items-center justify-center gap-1 w-16 cursor-pointer touch-manipulation">
            <!-- Pill -->
            <div class="h-8 px-5 rounded-full flex items-center justify-center transition-all duration-300 group-[.active]:bg-primary-100 group-[.active]:text-primary-700 text-slate-400">
                <span class="material-symbols-outlined text-2xl transition-all duration-300"
                    [class.filled]="isActive('/app/income')">payments</span>
            </div>
            <!-- Label -->
            <span class="text-[10px] font-bold transition-colors duration-300 group-[.active]:text-primary-700 text-slate-400">
                Renda
            </span>
        </a>

        <!-- Expenses -->
        <a routerLink="/app/expenses" routerLinkActive="active"
            class="group flex flex-col items-center justify-center gap-1 w-16 cursor-pointer touch-manipulation">
            <div class="h-8 px-5 rounded-full flex items-center justify-center transition-all duration-300 group-[.active]:bg-primary-100 group-[.active]:text-primary-700 text-slate-400">
                <span class="material-symbols-outlined text-2xl transition-all duration-300"
                    [class.filled]="isActive('/app/expenses')">receipt_long</span>
            </div>
            <span class="text-[10px] font-bold transition-colors duration-300 group-[.active]:text-primary-700 text-slate-400">
                Contas
            </span>
        </a>

        <!-- Summary -->
        <a routerLink="/app/summary" routerLinkActive="active"
            class="group flex flex-col items-center justify-center gap-1 w-16 cursor-pointer touch-manipulation">
            <div class="h-8 px-5 rounded-full flex items-center justify-center transition-all duration-300 group-[.active]:bg-primary-100 group-[.active]:text-primary-700 text-slate-400">
                <span class="material-symbols-outlined text-2xl transition-all duration-300"
                    [class.filled]="isActive('/app/summary')">pie_chart</span>
            </div>
            <span class="text-[10px] font-bold transition-colors duration-300 group-[.active]:text-primary-700 text-slate-400">
                Resumo
            </span>
        </a>

        <!-- Profile -->
        <a routerLink="/app/profile" routerLinkActive="active"
            class="group flex flex-col items-center justify-center gap-1 w-16 cursor-pointer touch-manipulation">
            <div class="h-8 px-5 rounded-full flex items-center justify-center transition-all duration-300 group-[.active]:bg-primary-100 group-[.active]:text-primary-700 text-slate-400">
                <span class="material-symbols-outlined text-2xl transition-all duration-300"
                    [class.filled]="isActive('/app/profile')">person</span>
            </div>
            <span class="text-[10px] font-bold transition-colors duration-300 group-[.active]:text-primary-700 text-slate-400">
                Perfil
            </span>
        </a>

    </nav>
  `
})
export class BottomNavComponent {
  private router = inject(Router);

  isActive(url: string): boolean {
    return this.router.isActive(url, {
      paths: 'subset',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }
}
