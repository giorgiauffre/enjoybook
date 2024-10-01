
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  
  constructor() { }

  httpClient = inject(HttpClient);
  baseUrl = 'http://localhost:5002';

  getHeaders() {
    let headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
    });
    return headers;
  }

  createLoan(loanData: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/loan`, loanData, { headers: this.getHeaders() });
  }
  
  getLoans(user: any): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/loans/${user}`, { headers: this.getHeaders() });
  }
}
