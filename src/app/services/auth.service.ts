/*import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string, role: string): Observable<boolean> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${username}:${password}`)
    });

    const url = `http://localhost:8080/auth/login?role=${role}`;

    return this.http.get(url, { headers, responseType: 'text' }).pipe(
      map(() => {
        sessionStorage.setItem('authHeader', headers.get('Authorization')!);
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('role', role);
        return true;
      })
    );
  }

  register(username: string, password: string, role: string): Observable<string> {
    const url = `${this.baseUrl}/users/create`;
    return this.http.post(url, null, {
      params: { username, password, role },
      responseType: 'text'
    });
  }


  getAuthHeader(): string {
    return sessionStorage.getItem('authHeader') || '';
  }

  getRole(): string {
    return sessionStorage.getItem('role') || '';
  }

  getUsername(): string {
    return sessionStorage.getItem('username') || '';
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('authHeader');
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}*/

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

  login(username: string, password: string, role: string) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/auth/login`, { username, password, role })
      .pipe(
        map(res => {
          sessionStorage.setItem('token', res.token);
          return true;
        })
      );
  }

  register(username: string, password: string, role: string) {
    return this.http.post(`${this.baseUrl}/users/create`, null, {
      params: { username, password, role },
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
