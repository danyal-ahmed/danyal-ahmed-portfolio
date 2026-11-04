import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-home-editor',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  template: `
    <div class="bg-slate-900/50 border border-slate-800 rounded-xl p-6 relative z-10 font-mono">
      <div class="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <h2 class="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
          <span class="text-green-400">#</span> Edit Home Content
        </h2>
        <div class="text-xs text-slate-500">~/portfolio/home_config.json</div>
      </div>

      @if (isLoading()) {
        <div class="py-12 text-center text-slate-500 animate-pulse">
          Reading configuration file...
        </div>
      } @else {
        <form [formGroup]="contentForm" (ngSubmit)="onSubmit()" class="space-y-6 max-w-3xl">
          <div class="space-y-2 group">
            <label class="text-xs font-bold tracking-wider text-slate-400">HEADLINE:</label>
            <input
              formControlName="headline"
              class="w-full bg-black/40 border border-slate-800 focus:border-green-500/50 rounded-lg px-3 py-2.5 outline-none text-sm text-slate-200 transition-colors"
            />
          </div>

          <div class="space-y-2 group">
            <label class="text-xs font-bold tracking-wider text-slate-400"
              >SUBHEADLINE / ROLES:</label
            >
            <input
              formControlName="subheadline"
              class="w-full bg-black/40 border border-slate-800 focus:border-green-500/50 rounded-lg px-3 py-2.5 outline-none text-sm text-slate-200 transition-colors"
            />
          </div>

          <div class="space-y-2 group">
            <label class="text-xs font-bold tracking-wider text-slate-400">AVAILABLE TO:</label>
            <input
              formControlName="availableTo"
              placeholder="e.g. New Opportunities"
              class="w-full bg-black/40 border border-slate-800 focus:border-green-500/50 rounded-lg px-3 py-2.5 outline-none text-sm text-slate-200 transition-colors"
            />
          </div>

          <div class="space-y-2 group">
            <label class="text-xs font-bold tracking-wider text-slate-400">MAIN DESCRIPTION:</label>
            <textarea
              formControlName="description"
              rows="6"
              class="w-full bg-black/40 border border-slate-800 focus:border-green-500/50 rounded-lg px-3 py-2.5 outline-none text-sm text-slate-200 transition-colors resize-none"
            ></textarea>
          </div>

          <div class="pt-4 flex items-center justify-between border-t border-slate-800">
            <span
              class="text-xs"
              [ngClass]="saveStatus() === 'success' ? 'text-green-400' : 'text-slate-500'"
            >
              {{
                saveStatus() === 'success'
                  ? '✓ Changes written to disk'
                  : 'Awaiting modifications...'
              }}
            </span>

            <button
              type="submit"
              [disabled]="contentForm.invalid || isSubmitting()"
              class="text-xs uppercase tracking-widest font-bold px-6 py-3 rounded-md bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <span>❯</span> {{ isSubmitting() ? 'Executing...' : 'Save Configuration' }}
            </button>
          </div>
        </form>
      }
    </div>
  `,
})
export class HomeEditor implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/home-content';

  isLoading = signal(true);
  isSubmitting = signal(false);
  saveStatus = signal<'idle' | 'success' | 'error'>('idle');

  contentForm = this.fb.group({
    headline: ['', Validators.required],
    subheadline: ['', Validators.required],
    availableTo: ['', Validators.required],
    description: ['', Validators.required],
  });

  ngOnInit() {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (data) => {
        this.contentForm.patchValue(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load content', err);
        this.isLoading.set(false);
      },
    });
  }

  onSubmit() {
    if (this.contentForm.invalid) return;

    this.isSubmitting.set(true);
    this.saveStatus.set('idle');

    this.http.put(this.apiUrl, this.contentForm.getRawValue()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.saveStatus.set('success');
        setTimeout(() => this.saveStatus.set('idle'), 3000);
      },
      error: (err) => {
        console.error('Update failed', err);
        this.isSubmitting.set(false);
        this.saveStatus.set('error');
      },
    });
  }
}
