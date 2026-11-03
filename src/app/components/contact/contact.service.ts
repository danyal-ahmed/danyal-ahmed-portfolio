import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactPayload {
  name: string;
  email: string;
  content: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/contact';

  sendMessage(payload: ContactPayload): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
}
