/* import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  constructor() { }


  httpClient = inject(HttpClient);
  baseUrl = 'http://localhost:5002';

  private getHeaders() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    const token = localStorage.getItem('jwtToken');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  public login(data: any) {
    const headers = this.getHeaders();
    return this.httpClient.post(this.baseUrl + '/login', data, { headers: headers }).pipe(
      tap((response: any) => {
        localStorage.setItem('jwtToken', response.access_token);
        localStorage.setItem('refreshToken', response.refresh_token);  
        localStorage.setItem('username', data.username); 
      })
    );
  }
} */

  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { Injectable, inject } from '@angular/core';
  import { Router } from '@angular/router';
  import { tap } from 'rxjs/operators';
  import { Observable } from 'rxjs';
  
  @Injectable({
    providedIn: 'root'
  })
  export class LoanService {
  
    httpClient = inject(HttpClient);
    router = inject(Router); 
    baseUrl = 'http://localhost:5002'; 
  
    constructor() { }
  
    private getHeaders(): HttpHeaders {
      let headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
      const token = this.getToken();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  
    login(data: any): Observable<any> {
      const headers = this.getHeaders();
      return this.httpClient.post(`${this.baseUrl}/login`, data, { headers: headers }).pipe(
        tap((response: any) => {
          this.setSession(response); 
        })
      );
    }
  
    private setSession(authResult: any): void {
      localStorage.setItem('jwtToken', authResult.access_token);
      localStorage.setItem('refreshToken', authResult.refresh_token);
      localStorage.setItem('username', authResult.username); 
    }
  
    logout(): void {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('username');
      this.router.navigate(['/home']); 
    }
  
    isLoggedIn(): boolean {
      return !!this.getToken();
    }
  
    getToken(): string | null {
      return localStorage.getItem('jwtToken');
    }
  
    getUsername(): string | null {
      return localStorage.getItem('username');
    }
  
    refreshToken(): Observable<any> {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        return this.httpClient.post(`${this.baseUrl}/refresh-token`, { refresh_token: refreshToken }, { headers: this.getHeaders() }).pipe(
          tap((response: any) => {
            localStorage.setItem('jwtToken', response.access_token); 
          })
        );
      } else {
        throw new Error('No refresh token found');
      }
    }
  }
  