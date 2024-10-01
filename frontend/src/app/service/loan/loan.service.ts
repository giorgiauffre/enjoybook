
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

}
