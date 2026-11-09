import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environment';

export interface timeLine {
  year: string;
  title: string;
  description: string;
}

export interface AboutContent {
  createdAt: string;
  updatedAt: string;
  intro: string;
  longerVersion: string;
  skills: string[];
  timeline: timeLine[];
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <article
      class="max-w-4xl mx-auto px-4 py-12 sm:py-20 text-white font-sans leading-relaxed border border-terminal-border bg-terminal-card rounded-xl relative z-10"
    >
      @if (isLoading()) {
        <div class="text-slate-500 animate-pulse text-center py-20 font-mono">
          Loading temporal data...
        </div>
      } @else if (content()) {
        <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-slate-100 mb-8 font-mono">
          <span class="text-green-400">#</span> Whoami
        </h1>

        <!-- Floating Image Container -->
        <div
          class="float-none sm:float-right mx-auto sm:mr-0 sm:ml-8 mb-8 sm:mb-4 w-48 h-48 sm:w-64 sm:h-64 relative group flex justify-center"
        >
          <div
            class="absolute inset-0 border border-slate-800 rounded-xl translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-300 ease-out z-0"
          ></div>
          <div
            class="absolute inset-0 border border-green-500/30 rounded-xl -translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"
          ></div>
          <div
            class="relative w-full h-full rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 z-10"
          >
            <img
              src="/images/my.jpg"
              alt="Danyal Ahmed"
              class="w-full h-full object-cover filter grayscale contrast-[1.05] group-hover:grayscale-0 transition-all duration-500 ease-in-out scale-100 group-hover:scale-105"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none"
            ></div>
            <div
              class="absolute inset-0 bg-green-500/5 mix-blend-color group-hover:bg-transparent transition-colors duration-300 pointer-events-none"
            ></div>
          </div>
        </div>

        <!-- Terminal Container -->
        <div class="terminal-container font-mono text-base mb-12">
          <!-- DYNAMIC INTRO -->
          <p
            class="text-bright mb-8 max-w-xl whitespace-pre-wrap"
            [innerHTML]="content()?.intro"
          ></p>

          <ul class="space-y-3 text-slate-400">
            <li>
              <span class="text-green-500 mr-2">&rarr; name</span
              ><span class="text-slate-200">Danyal Ahmed</span>
            </li>
            <li>
              <span class="text-green-500 mr-2">&rarr; role</span
              ><span class="text-slate-200">Senior Full Stack Developer</span>
            </li>
            <li>
              <span class="text-green-500 mr-2">&rarr; based in</span
              ><span class="text-slate-200"
                >Karachi, PK <span class="text-semi-bold text-bright">// GMT+5</span></span
              >
            </li>
            <li>
              <span class="text-green-500 mr-2">&rarr; status</span>
              <span class="text-slate-200 flex items-center gap-2 inline-flex">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Open to roles
              </span>
            </li>
          </ul>
        </div>

        <div class="clear-both"></div>

        <!-- SECTION 01: BIOGRAPHY -->
        <div class="max-w-5xl mx-auto text-bright font-sans mt-12 animate-fade-in">
          <div class="mb-12">
            <div class="flex items-center gap-3 font-mono tracking-widest mb-4">
              <span class="text-green-500 font-bold">01</span
              ><span class="uppercase">The Longer Version</span>
            </div>
            <h2 class="text-4xl md:text-5xl font-bold text-slate-100 tracking-tight">
              A bit about me
            </h2>
          </div>

          <!-- DYNAMIC LONGER VERSION -->
          <div
            class="md:columns-2 gap-x-16 text-base leading-relaxed mb-20 space-y-6 [&>p]:mb-6"
            [innerHTML]="content()?.longerVersion"
          ></div>
        </div>

        <!-- SECTION 03: TIMELINE -->
        <div
          class="max-w-5xl mx-auto text-slate-300 font-sans mt-16 animate-fade-in relative z-10 clear-both"
        >
          <div class="mb-16 border-b border-slate-800/60 pb-8">
            <div
              class="flex items-center gap-3 font-mono text-xs tracking-widest text-slate-500 mb-4"
            >
              <span class="text-green-500 font-bold">03</span
              ><span class="uppercase">How I Got Here</span>
            </div>
            <h2 class="text-4xl md:text-5xl font-bold text-slate-100 tracking-tight">
              The short timeline
            </h2>
          </div>

          <div class="relative max-w-4xl">
            <div
              class="absolute left-[3.25rem] md:left-[4.75rem] top-3 bottom-0 w-px bg-slate-800"
            ></div>
            <div class="space-y-12">
              <!-- DYNAMIC TIMELINE LOOP -->
              @for (item of content()?.timeline; track item.title) {
                <div class="relative flex gap-6 md:gap-10 items-start group">
                  <div
                    class="w-10 md:w-16 text-right font-mono text-sm text-slate-500 pt-0.5 shrink-0 transition-colors group-hover:text-slate-400"
                  >
                    {{ item.year }}
                  </div>
                  <div
                    class="relative z-10 w-2.5 h-2.5 rounded-full bg-green-500 ring-4 ring-slate-950 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.6)] group-hover:scale-125 transition-transform duration-300"
                  ></div>
                  <div class="flex-1">
                    <h3 class="text-base font-bold text-slate-200 mb-2 font-mono">
                      {{ item.title }}
                    </h3>
                    <p class="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
                      {{ item.description }}
                    </p>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- SECTION 04: CORE TECHNOLOGIES -->
        <div class="mt-20 pt-8 border-t border-slate-800/80 clear-both">
          <h2 class="text-xl font-bold text-slate-100 mb-6 font-mono">Core Technologies</h2>
          <ul class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm font-mono text-slate-400">
            <!-- DYNAMIC SKILLS LOOP -->
            @for (skill of content()?.skills; track skill) {
              <li
                class="flex items-center gap-2 hover:text-green-400 transition-colors cursor-default"
              >
                <span class="text-green-500">▹</span> {{ skill }}
              </li>
            }
          </ul>
        </div>
      }
    </article>
  `,
})
export class About implements OnInit {
  private http = inject(HttpClient);

  // Initialized with null to satisfy the strict type check
  content = signal<AboutContent | null>(null);
  timeline = signal<timeLine[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    // Typed generic applied to the HTTP request
    let apiUrl = `${environment.apiUrl}/api/about-content`;
    this.http.get<AboutContent>(apiUrl).subscribe({
      next: (data) => {
        const timeline = (data.timeline || []).sort((a, b) => {
          const yearA = parseInt(a.year, 10);
          const yearB = parseInt(b.year, 10);

          if (!isNaN(yearA) && !isNaN(yearB)) {
            return yearB - yearA;
          }

          return b.year.localeCompare(a.year);
        });

        const transformed = { ...data, timeline: timeline };
        this.content.set(transformed);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load about data', err);
        this.isLoading.set(false);
      },
    });
  }
}
