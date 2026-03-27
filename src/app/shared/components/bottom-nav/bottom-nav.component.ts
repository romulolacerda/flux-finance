import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav
        class="fixed bottom-0 left-0 w-full z-40 bg-white/90 backdrop-blur-md border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-all safe-bottom"
        style="padding-bottom: env(safe-area-inset-bottom);">
        
        <div class="flex justify-between items-center h-20 px-2 sm:px-6">
            <!-- Left Container -->
            <div class="flex flex-1 justify-around">
                <!-- Income -->
                <a routerLink="/app/income" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}"
                    class="group flex flex-col items-center justify-center gap-1 w-16 h-14 cursor-pointer touch-manipulation">
                    <div class="h-8 px-5 rounded-full flex items-center justify-center transition-all duration-300 group-[.active]:bg-primary-100 group-[.active]:text-primary-700 text-slate-400">
                        <span class="material-symbols-outlined text-2xl transition-all duration-300"
                            [class.filled]="isActive('/app/income')">payments</span>
                    </div>
                    <span class="text-[10px] font-bold transition-colors duration-300 group-[.active]:text-primary-700 text-slate-400">
                        Renda
                    </span>
                </a>

                <!-- Expenses -->
                <a routerLink="/app/expenses" routerLinkActive="active"
                    class="group flex flex-col items-center justify-center gap-1 w-16 h-14 cursor-pointer touch-manipulation">
                    <div class="h-8 px-5 rounded-full flex items-center justify-center transition-all duration-300 group-[.active]:bg-primary-100 group-[.active]:text-primary-700 text-slate-400">
                        <span class="material-symbols-outlined text-2xl transition-all duration-300"
                            [class.filled]="isActive('/app/expenses')">receipt_long</span>
                    </div>
                    <span class="text-[10px] font-bold transition-colors duration-300 group-[.active]:text-primary-700 text-slate-400">
                        Contas
                    </span>
                </a>
            </div>

            <!-- Central Spacer to prevent layout shift -->
            <div class="w-16 sm:w-20 flex-shrink-0 md:hidden"></div>

            <!-- Right Container -->
            <div class="flex flex-1 justify-around">
                <!-- Summary -->
                <a routerLink="/app/summary" routerLinkActive="active"
                    class="group flex flex-col items-center justify-center gap-1 w-16 h-14 cursor-pointer touch-manipulation">
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
                    class="group flex flex-col items-center justify-center gap-1 w-16 h-14 cursor-pointer touch-manipulation">
                    <div class="h-8 px-5 rounded-full flex items-center justify-center transition-all duration-300 group-[.active]:bg-primary-100 group-[.active]:text-primary-700 text-slate-400">
                        <span class="material-symbols-outlined text-2xl transition-all duration-300"
                            [class.filled]="isActive('/app/profile')">person</span>
                    </div>
                    <span class="text-[10px] font-bold transition-colors duration-300 group-[.active]:text-primary-700 text-slate-400">
                        Perfil
                    </span>
                </a>
            </div>
        </div>

        <!-- Independent Central FAB (Mobile Only) -->
        <button class="md:hidden absolute left-1/2 -translate-x-1/2 -top-6 z-50 w-14 h-14 bg-success text-white rounded-full flex items-center justify-center shadow-lg shadow-success/40 active:scale-95 transition-transform touch-manipulation" aria-label="Adicionar Conta" routerLink="/app/expenses/add">
            <span class="material-symbols-outlined text-3xl font-bold">add</span>
        </button>
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
