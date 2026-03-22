import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly tokenKey = 'auth_token';

  // Prywatne sygnały — mutowalne tylko wewnątrz
  private _token = signal<string | null>(localStorage.getItem(this.tokenKey));

  // Publiczne — tylko do odczytu
  readonly token = this._token.asReadonly();

  readonly currentUser = computed(() => {
    const token = this._token();
    return token ? this.decodeToken(token) : null;
  });

  readonly isLoggedIn = computed(() => !!this.currentUser());
  readonly isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');
  readonly userRole = computed(() => this.currentUser()?.role ?? null);

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this._token.set(token);
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
    this._token.set(null);
  }

  private decodeToken(token: string): { email: string; role: string } | null {
    try {
      // JWT payload to base64 — nie wymaga żadnej biblioteki
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }
}
