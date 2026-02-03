import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./splash/splash/splash.component').then(m => m.SplashComponent)
  },
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'sign-up', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) },
      { path: 'recovery', loadComponent: () => import('./auth/recovery/recovery.component').then(m => m.RecoveryComponent) },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: 'income', loadComponent: () => import('./income/income/income.component').then(m => m.IncomeComponent) },
      { path: 'expenses', loadComponent: () => import('./expenses/expenses-list/expenses-list.component').then(m => m.ExpensesListComponent) },
      { path: 'expenses/add', loadComponent: () => import('./expenses/expenses-form/expenses-form.component').then(m => m.ExpensesFormComponent) },
      { path: 'summary', loadComponent: () => import('./summary/summary-page/summary-page.component').then(m => m.SummaryPageComponent) },
      { path: 'profile', loadComponent: () => import('./profile/profile/profile.component').then(m => m.ProfileComponent) },
      { path: '', redirectTo: 'income', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];