// src/app/admin/login/login.component.ts
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <!-- 1. Removed bg-slate-950, added relative z-10 -->
    <div class="min-h-screen flex flex-col items-center justify-center p-4 font-mono relative z-10">
      <div
        class="w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden"
      >
        <!-- Header -->
        <div class="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
          <div class="flex gap-1.5">
            <span class="w-3 h-3 rounded-full bg-red-500/90"></span>
            <span class="w-3 h-3 rounded-full bg-yellow-500/90"></span>
            <span class="w-3 h-3 rounded-full bg-green-500/90"></span>
          </div>
          <span class="text-sm text-slate-400">~/akkila-os/auth.sh</span>
        </div>

        <div class="text-green-400 text-sm mb-6 flex items-center gap-2">
          <span>❯</span> sudo su admin
        </div>

        <!-- Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="space-y-2 group">
            <label class="text-sm font-bold tracking-wider text-slate-400">
              [sudo] password for admin:
            </label>
            <div
              class="flex items-center gap-2 bg-black/40 border border-slate-800 group-focus-within:border-green-500/50 rounded-lg px-3 py-2.5 transition-colors"
            >
              <span class="text-slate-500">🔑</span>
              <input
                type="password"
                formControlName="password"
                class="w-full bg-transparent text-slate-200 outline-none text-sm tracking-widest font-sans"
                autocomplete="current-password"
                autofocus
              />
            </div>
            @if (hasError) {
              <span class="text-[11px] text-red-400/90 block mt-2"
                >ERR_ACCESS_DENIED: Incorrect credentials</span
              >
            }
          </div>

          <div class="pt-4 flex items-center gap-4">
            <span class="text-green-400 font-bold text-sm">❯</span>
            <button
              type="submit"
              [disabled]="loginForm.invalid"
              class="text-xs uppercase tracking-widest font-bold px-5 py-2.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              ./authenticate.sh
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class AdminLogin {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  hasError = false;
  loginForm = this.fb.group({
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const password = this.loginForm.getRawValue().password;

      const credentials = {
        email: 'admin@portfolio.com',
        password: password,
      };

      this.authService.login(credentials).subscribe({
        next: () => {
          this.hasError = false;
          this.router.navigate(['/admin/dashboard']);
        },
        error: () => {
          this.hasError = true;
          this.loginForm.reset();
        },
      });
    }
  }
}
