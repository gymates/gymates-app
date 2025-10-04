import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { components } from '../shared/api-types';

type RegisterRequest = components['schemas']['RegisterRequest'];
type RegisterResponse = components['schemas']['RegisterResponse'];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>('/api/auth/register', payload);
  }
}
