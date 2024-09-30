import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor() { }

  httpClient = inject(HttpClient);
  baseUrl = 'http://localhost:5001';

  getHeaders(){
    let headers = new HttpHeaders();
    return headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  addBook(bookData: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.post<any>(`${this.baseUrl}/books`, bookData, { headers });
  }

  getBooks(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/books`, { headers: this.getHeaders() });
  }


  deleteBook(bookId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/books/${bookId}`, { headers: this.getHeaders() });
  }

 
  updateBook(bookId: number, bookData: any): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}/books/${bookId}`, bookData, { headers: this.getHeaders() });
  }


  searchBooks(query: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/search?q=${query}`, { headers: this.getHeaders() });
  }
  
  addReview(bookId: number, reviewData: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/books/${bookId}/reviews`, reviewData, { headers: this.getHeaders() });
  }
  
}
