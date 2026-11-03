import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from './contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-2xl mx-auto my-12 p-6 font-mono text-slate-300 relative z-10">
      <div class="space-y-2 mb-8 border-b border-slate-800 pb-4">
        <div class="flex items-center gap-2 text-green-400 text-sm">
          <span>❯</span> ./initiate_handshake.sh
        </div>
        <h1 class="text-3xl font-bold tracking-tight text-white">Establish Connection</h1>
      </div>

      <div
        class="bg-slate-900/50 border border-slate-800 rounded-xl p-8 backdrop-blur-md shadow-2xl"
      >
        @if (isSuccess()) {
          <div class="text-center py-12 space-y-4">
            <div class="text-green-400 text-4xl mb-4">✓</div>
            <h2 class="text-xl font-bold text-white">Transmission Successful</h2>
            <p class="text-slate-400">
              Your packet has been routed to my inbox. I will reply shortly.
            </p>
            <button
              (click)="resetForm()"
              class="mt-6 text-xs uppercase tracking-widest font-bold px-5 py-2.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-all"
            >
              Send Another
            </button>
          </div>
        } @else {
          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="space-y-2 group">
                <label class="text-xs font-bold tracking-wider text-slate-400"
                  >IDENTIFIER (Name):</label
                >
                <input
                  formControlName="name"
                  class="w-full bg-black/40 border border-slate-800 focus:border-green-500/50 rounded-lg px-3 py-2.5 outline-none text-sm text-slate-200 transition-colors"
                />
              </div>

              <div class="space-y-2 group">
                <label class="text-xs font-bold tracking-wider text-slate-400"
                  >RETURN ADDRESS (Email):</label
                >
                <input
                  formControlName="email"
                  type="email"
                  class="w-full bg-black/40 border border-slate-800 focus:border-green-500/50 rounded-lg px-3 py-2.5 outline-none text-sm text-slate-200 transition-colors"
                />
              </div>
            </div>

            <div class="space-y-2 group">
              <label class="text-xs font-bold tracking-wider text-slate-400"
                >PAYLOAD (Message):</label
              >
              <textarea
                formControlName="content"
                rows="5"
                class="w-full bg-black/40 border border-slate-800 focus:border-green-500/50 rounded-lg px-3 py-2.5 outline-none text-sm text-slate-200 transition-colors resize-none"
              ></textarea>
            </div>

            <div class="pt-4 flex items-center justify-end">
              <button
                type="submit"
                [disabled]="contactForm.invalid || isSubmitting()"
                class="text-xs uppercase tracking-widest font-bold px-6 py-3 rounded-md bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <span>❯</span> {{ isSubmitting() ? 'Transmitting...' : 'Send Message' }}
              </button>
            </div>
          </form>
        }
      </div>
    </div>
  `,
})
export class Contact {
  private fb = inject(NonNullableFormBuilder);
  private contactService = inject(ContactService);

  isSubmitting = signal(false);
  isSuccess = signal(false);

  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    content: ['', Validators.required],
  });

  onSubmit() {
    if (this.contactForm.invalid) return;
    this.isSubmitting.set(true);

    this.contactService.sendMessage(this.contactForm.getRawValue()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.isSuccess.set(true);
      },
      error: (err) => {
        console.error('Transmission failed', err);
        this.isSubmitting.set(false);
      },
    });
  }

  resetForm() {
    this.contactForm.reset();
    this.isSuccess.set(false);
  }
}
