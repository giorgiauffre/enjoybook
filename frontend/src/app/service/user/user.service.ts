import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  httpClient = inject(HttpClient)
  baseUrl = 'http://localhost:5000'

  public signup(data: any) {
    let headers = this.getHeaders();
    return this.httpClient.post(this.baseUrl + '/register', data, {headers: headers});
  }
  
  public login(data: any) {
    let headers = this.getHeaders();
    return this.httpClient.post(this.baseUrl + '/login', data, {headers: headers}).pipe(
      tap((response: any) => {
        this.setSession(response); 
      })
    );
  }

  public updateUserInfo(username: string, data: any) {
    let headers = this.getHeaders();
    return this.httpClient.put(`${this.baseUrl}/user/${username}`, data, { headers: headers });
  }
  
  public deleteUser(username: string) {
    let headers = this.getHeaders();
    return this.httpClient.delete(`${this.baseUrl}/user/${username}`, { headers: headers });
  }

  getDetails(username: string) {
    let headers = this.getHeaders();
    return this.httpClient.get(`${this.baseUrl}/user/${username}`, { headers: headers });
  }

  public addReview(data: any) {
    let headers = this.getHeaders();
    return this.httpClient.post(this.baseUrl + '/review', data, {headers: headers});
  }

  public getReviewList(data: any) {
    let headers = this.getHeaders();
    return this.httpClient.get(this.baseUrl + '/reviews/{userId}', {headers: headers});
  }

  getHeaders() {
    let headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` 
    });
    return headers;
  }

  private setSession(authResult: any): void {
    localStorage.setItem('jwtToken', authResult.access_token);
    localStorage.setItem('username', authResult.username); 
  }

 
}
