import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
// import { ProjectService } from '../../services/project.service';
import { ProjectsService } from './projects.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 p-6 font-mono text-slate-300 relative z-10">
      <div class="max-w-3xl mx-auto">
        <div class="mb-6 flex items-center gap-2 text-green-400 text-sm">
          <span>❯</span> cd /var/www/portfolio/projects && nano
          {{ isEditMode() ? 'edit' : 'new' }}_project.json
        </div>

        <div
          class="bg-slate-900/50 border border-slate-800 rounded-xl p-8 backdrop-blur-md shadow-2xl"
        >
          <div class="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
            <h1 class="text-xl font-bold tracking-tight text-white">
              {{ isEditMode() ? 'Edit Project' : 'Deploy New Project' }}
            </h1>
          </div>

          <form [formGroup]="projectForm" (ngSubmit)="onSubmit()" class="space-y-5">
            <!-- Title -->
            <div class="space-y-2 group">
              <label class="text-xs font-bold tracking-wider text-slate-400"
                >TITLE (required):</label
              >
              <input
                formControlName="title"
                class="w-full bg-black/40 border border-slate-800 focus:border-green-500/50 rounded-lg px-3 py-2.5 outline-none text-sm text-slate-200 transition-colors"
                placeholder="e.g., EFI-System"
              />
            </div>

            <!-- Description -->
            <div class="space-y-2 group">
              <label class="text-xs font-bold tracking-wider text-slate-400"
                >DESCRIPTION (required):</label
              >
              <textarea
                formControlName="description"
                rows="3"
                class="w-full bg-black/40 border border-slate-800 focus:border-green-500/50 rounded-lg px-3 py-2.5 outline-none text-sm text-slate-200 transition-colors resize-none"
                placeholder="Brief summary of the architecture and purpose..."
              ></textarea>
            </div>

            <!-- Tech Stack -->
            <div class="space-y-2 group">
              <label class="text-xs font-bold tracking-wider text-slate-400"
                >TECH STACK (comma separated):</label
              >
              <input
                formControlName="techStack"
                class="w-full bg-black/40 border border-slate-800 focus:border-green-500/50 rounded-lg px-3 py-2.5 outline-none text-sm text-slate-200 transition-colors"
                placeholder="e.g., Angular, NestJS, MongoDB, TailwindCSS"
              />
            </div>

            <!-- URLs Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div class="space-y-2 group">
                <label class="text-xs font-bold tracking-wider text-slate-400">GITHUB URL:</label>
                <input
                  formControlName="githubUrl"
                  class="w-full bg-black/40 border border-slate-800 focus:border-green-500/50 rounded-lg px-3 py-2.5 outline-none text-sm text-slate-200 transition-colors"
                  placeholder="https://github.com/..."
                />
              </div>
              <div class="space-y-2 group">
                <label class="text-xs font-bold tracking-wider text-slate-400">LIVE URL:</label>
                <input
                  formControlName="liveUrl"
                  class="w-full bg-black/40 border border-slate-800 focus:border-green-500/50 rounded-lg px-3 py-2.5 outline-none text-sm text-slate-200 transition-colors"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div class="space-y-2 group">
              <label class="text-xs font-bold tracking-wider text-slate-400">IMAGE URL:</label>
              <input
                formControlName="imageUrl"
                class="w-full bg-black/40 border border-slate-800 focus:border-green-500/50 rounded-lg px-3 py-2.5 outline-none text-sm text-slate-200 transition-colors"
                placeholder="/img/projects/project1.png"
              />
            </div>

            <!-- Actions -->
            <div class="pt-6 flex items-center justify-between border-t border-slate-800">
              <a
                routerLink="/admin/dashboard"
                class="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                [ESC] Cancel
              </a>

              <button
                type="submit"
                [disabled]="projectForm.invalid || isSubmitting()"
                class="text-xs uppercase tracking-widest font-bold px-5 py-2.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <span>❯</span> ./commit.sh
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class Project implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private projectsService = inject(ProjectsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = signal(false);
  isSubmitting = signal(false);
  projectId: string | null = null;

  projectForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    techStack: [''],
    githubUrl: [''],
    liveUrl: [''],
    imageUrl: [''],
  });

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id');
    if (this.projectId) {
      this.isEditMode.set(true);
      this.loadProjectData(this.projectId);
    }
  }

  loadProjectData(id: string) {
    this.projectsService.getProject(id).subscribe({
      next: (project) => {
        this.projectForm.patchValue({
          title: project.title,
          description: project.description,
          techStack: project.techStack?.join(', ') || '',
          githubUrl: project.githubUrl || '',
          liveUrl: project.liveUrl || '',
          imageUrl: project.imageUrl || '',
        });
      },
      error: (err) => console.error('Failed to load project', err),
    });
  }

  onSubmit() {
    if (this.projectForm.invalid) return;
    this.isSubmitting.set(true);

    const formValue = this.projectForm.getRawValue();
    // Convert comma-separated string back to an array, trim whitespace, remove empty items
    const payload = {
      ...formValue,
      techStack: formValue.techStack
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
    };

    const request$ =
      this.isEditMode() && this.projectId
        ? this.projectsService.updateProject(this.projectId, payload)
        : this.projectsService.createProject(payload);

    request$.subscribe({
      next: () => this.router.navigate(['/admin/dashboard']),
      error: (err) => {
        console.error('Save failed', err);
        this.isSubmitting.set(false);
      },
    });
  }
}
