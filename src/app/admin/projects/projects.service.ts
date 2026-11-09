import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateProjectDto = Omit<Project, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateProjectDto = Partial<CreateProjectDto>;

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private http = inject(HttpClient);
  // Matches your NestJS global /api prefix
  private apiUrl = `${environment.apiUrl}/api/projects`;

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  getProject(id: string): Observable<Project> {
    // sortBy=techStack&order=asc
    return this.http.get<Project>(`${this.apiUrl}/${id}&order=desc`);
  }

  createProject(project: CreateProjectDto): Observable<Project> {
    // The authInterceptor you built earlier will automatically attach the JWT to this request
    return this.http.post<Project>(this.apiUrl, project);
  }

  updateProject(id: string, project: UpdateProjectDto): Observable<Project> {
    // Automatically protected by authInterceptor
    return this.http.patch<Project>(`${this.apiUrl}/${id}`, project);
  }

  deleteProject(id: string): Observable<void> {
    // Automatically protected by authInterceptor
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
