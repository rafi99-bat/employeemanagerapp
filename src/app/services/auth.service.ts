import { HttpClient, HttpHeaders } from '@angular/common/http';
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
}
