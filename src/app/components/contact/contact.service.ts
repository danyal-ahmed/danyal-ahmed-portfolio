import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface ContactPayload {
  name: string;
  email: string;
  content: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/api/contact`;

  sendMessage(payload: ContactPayload): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
}
