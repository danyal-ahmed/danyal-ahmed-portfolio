import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section
      class="min-h-[85vh] flex flex-col justify-center max-w-5xl mx-auto p-6 sm:p-12 font-mono relative z-10"
    >
      @if (isLoading()) {
        <div class="text-slate-500 animate-pulse flex items-center gap-3">
          <span class="inline-block h-2 w-2 bg-green-500 rounded-full"></span>
          Executing boot sequence...
        </div>
      } @else if (content()) {
        <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <!-- Terminal Prompt -->
          <div class="flex items-center gap-2 text-green-400 text-sm mb-6">
            <span>❯</span> whoami
          </div>

          <!-- Dynamic Headline -->
          <h1 class="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-100 tracking-tight">
            {{ content().headline }}
          </h1>

          <!-- Dynamic Subheadline -->
          <h2 class="text-xl sm:text-2xl md:text-3xl text-indigo-400 font-semibold mt-4">
            {{ content().subheadline }}
          </h2>

          <!-- Dynamic Description -->
          <p class="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mt-8">
            {{ content().description }}
          </p>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-4 pt-10 mt-10 border-t border-slate-800/80">
            <a
              routerLink="/projects"
              class="group flex items-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-6 py-3 rounded-md hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all font-bold tracking-widest text-sm uppercase"
            >
              <span>View Projects</span>
              <span class="group-hover:translate-x-1 transition-transform">→</span>
            </a>

            <a
              routerLink="/contact"
              class="bg-slate-800/50 text-slate-300 border border-slate-700 px-6 py-3 rounded-md hover:bg-slate-700 hover:text-white transition-all font-bold tracking-widest text-sm uppercase"
            >
              Initiate Contact
            </a>
          </div>
        </div>
      }
    </section>
  `,
})
export class Home implements OnInit {
  private http = inject(HttpClient);

  content = signal<any>(null);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    // Fetch the public singleton record
    this.http.get('http://localhost:3000/api/home-content').subscribe({
      next: (data) => {
        this.content.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load home content', err);
        this.isLoading.set(false);
      },
    });
  }
}
