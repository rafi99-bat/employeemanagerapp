import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Religion {
  id?: number;
  name: string;
}

export interface Employee {
  id?: number;
  name: string;
  email: string;
  jobTitle: string;
  phone: string;
  imageUrl: string;
  religion?: Religion;
  employeeCode?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8080/employee';

  constructor(private http: HttpClient, private auth: AuthService) { }

  private getHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.auth.getToken()}`,
        'Content-Type': 'application/json'
      })
    };
  }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/all`, this.getHeaders());
  }

  addEmployee(emp: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/add`, emp, this.getHeaders());
  }

  updateEmployee(emp: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/update`, emp, this.getHeaders());
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, this.getHeaders());
  }

  // employee.service.ts
  uploadEmployeeImage(employeeId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.auth.getToken()}`
    });

    return this.http.post(
      `${this.apiUrl}/image/upload/${employeeId}`,
      formData,
      { headers, responseType: 'text' }
    );
  }

}
