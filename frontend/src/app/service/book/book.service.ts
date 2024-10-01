import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor() { }

  private bookStatusChange = new BehaviorSubject<any>(null);

  httpClient = inject(HttpClient);
  baseUrl = 'http://localhost:5001';

  getHeaders() {
    let headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
    });
    return headers;
  }

  addBook(bookData: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/books`, bookData, { headers: this.getHeaders() });
  }

  getBooks(owner_id: any): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/books?owner_id=${owner_id}`, { headers: this.getHeaders() });
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

  getReviews(bookId: any): Observable<any> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/books/${bookId}/reviews`, { headers: this.getHeaders() });
  }
 
  notifyStatusChange(book: any) {
    this.bookStatusChange.next(book);
  }

  getBookStatusChange(): Observable<any> {
    return this.bookStatusChange.asObservable();
  }

}
