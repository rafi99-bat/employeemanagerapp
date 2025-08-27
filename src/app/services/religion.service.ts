import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Religion } from './employee.service';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReligionService {
  private baseUrl = 'http://localhost:8080/religion';

  constructor(private http: HttpClient, private auth: AuthService) { }

  private getHeaders(): { headers: HttpHeaders } {
      return {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.auth.getToken()}`,
          'Content-Type': 'application/json'
        })
      };
    }

  getReligions(): Observable<Religion[]> {
    return this.http.get<Religion[]>(`${this.baseUrl}/all`, this.getHeaders());
  }

  addReligion(name: string): Observable<Religion> {
    return this.http.post<Religion>(`${this.baseUrl}/add`, name, this.getHeaders());
  }
}
