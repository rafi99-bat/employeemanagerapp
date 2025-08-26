import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import jwtDecode from 'jwt-decode'; // npm install jwt-decode

interface JwtPayload {
  sub: string;       // username
  role: string;      // role from backend
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/auth/login`, { username, password })
      .pipe(
        map(res => {
          sessionStorage.setItem('token', res.token);
          return true;
        })
      );
  }

  register(username: string, password: string) {
    return this.http.post(`${this.baseUrl}/users/create`, null, {
      params: { username, password },
      responseType: 'text'
    });
  }

  getToken(): string {
    return sessionStorage.getItem('token') || '';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  getRole(): string {
    const token = this.getToken();
    if (!token) return '';
    const payload = jwtDecode<JwtPayload>(token);
    return payload.role;
  }

  getUsername(): string {
    const token = this.getToken();
    if (!token) return '';
    const payload = jwtDecode<JwtPayload>(token);
    return payload.sub;
  }
}
