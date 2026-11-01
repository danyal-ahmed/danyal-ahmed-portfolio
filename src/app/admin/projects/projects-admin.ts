import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectsService } from './projects.service'; // Adjust path if necessary

@Component({
  selector: 'app-projects-admin',
  standalone: true,
  imports: [RouterLink], // Required for the Add/Edit routing to work
  template: `
    <div class="bg-slate-900/50 border border-slate-800 rounded-xl p-6 ">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-white flex items-center gap-3">
          <span class="text-green-400">#</span> Manage Projects
        </h2>
        <!-- 1. Wired up Add New button -->
        <button
          routerLink="/admin/projects/new"
          class="bg-green-500/10 text-green-400 border border-green-500/30 px-4 py-2 rounded text-sm hover:bg-green-500/20 transition-colors"
        >
          + Add New Project
        </button>
      </div>

      <!-- Data Table -->
      <div class="overflow-x-auto rounded-lg border border-slate-800">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead
            class="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-xs"
          >
            <tr>
              <th class="p-4">Project Name</th>
              <th class="p-4">Status</th>
              <th class="p-4">Tech Stack</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/50">
            @if (projects().length === 0) {
              <tr>
                <td colspan="4" class="p-4 text-center text-slate-500">
                  No projects found. Deploy one!
                </td>
              </tr>
            } @else {
              <!-- 2. Replaced Mock Loop with actual data -->
              @for (project of projects(); track project._id) {
                <tr class="hover:bg-slate-800/30 transition-colors">
                  <td class="p-4 font-medium text-slate-200">{{ project.title }}</td>
                  <td class="p-4">
                    <span
                      class="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs border border-green-500/20"
                    >
                      Production
                    </span>
                  </td>
                  <td class="p-4 text-slate-400">
                    {{ project.techStack?.join(', ') || 'None' }}
                  </td>
                  <td class="p-4 text-right space-x-3">
                    <!-- 3. Wired up Edit and Delete buttons -->
                    <a
                      [routerLink]="['/admin/projects/edit', project._id]"
                      class="text-blue-400 hover:text-blue-300 cursor-pointer"
                      >Edit</a
                    >
                    <button
                      (click)="deleteProject(project._id)"
                      class="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ProjectsAdmin implements OnInit {
  private projectsService = inject(ProjectsService);
  projects = signal<any[]>([]);

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectsService.getProjects().subscribe({
      next: (data) => this.projects.set(data),
      error: (err) => console.error('Failed to load projects', err),
    });
  }

  deleteProject(id: string) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectsService.deleteProject(id).subscribe({
        next: () => {
          // Remove the deleted project from the signal so the UI updates instantly
          this.projects.update((current) => current.filter((p) => p._id !== id));
        },
        error: (err) => console.error('Delete failed', err),
      });
    }
  }
}
