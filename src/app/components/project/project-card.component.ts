import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
// Adjust this path to wherever your service actually lives
import { ProjectsService } from '../../admin/projects/projects.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-card.component.html',
})
export class ProjectCardComponent implements OnInit {
  private projectsService = inject(ProjectsService);

  // Use any[] or the specific Project interface from your service
  projects = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.projectsService.getProjects().subscribe({
      next: (data) => {
        this.projects.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load projects', err);
        this.isLoading.set(false);
      },
    });
  }
}
