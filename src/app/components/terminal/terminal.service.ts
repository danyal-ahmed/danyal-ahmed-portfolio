import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface ChatResponse {
  reply: string;
}

@Injectable({
  providedIn: 'root',
})
export class TerminalService {
  private http = inject(HttpClient);

  // Ensure this matches your NestJS port and global prefix
  private apiUrl = `${environment.apiUrl}/api`;

  sendCommand(command: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.apiUrl}/terminal/execute`, { command });
  }
}
