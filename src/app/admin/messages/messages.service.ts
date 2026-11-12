import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface Message {
  _id: string;
  name: string;
  email: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminMessagesService {
  private http = inject(HttpClient);
   private apiUrl = `${environment.apiUrl}/api/contact`;

  getMessages(): Observable<Message[]> {
    // Automatically uses your auth.interceptor.ts
    return this.http.get<Message[]>(this.apiUrl);
  }

  deleteMessage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateReadStatus(id: string, isRead: boolean): Observable<Message> {
    return this.http.patch<Message>(`${this.apiUrl}/${id}/read`, { isRead });
  }
}
