import { Component } from '@angular/core';
import { BookService } from '../service/book/book.service';
import { UserService } from '../service/user/user.service'; 

@Component({
  selector: 'app-search-book',
  templateUrl: './search-book.component.html',
  styleUrls: ['./search-book.component.css']
})
export class SearchBookComponent {
  searchQuery: string = '';  
  books: any[] = [];         
  selectedBook: any = null;  
  score: any = 0;
  review: string = '';     
  showContact: boolean = false; 
  showReview: boolean = false;  
  ownerInfo: any = null; 

  constructor(private bookService: BookService) {} 

  searchBooks() {
    if (this.searchQuery.trim() === '') { 
      this.books = []; 
      return; 
    }

    this.bookService.searchBooks(this.searchQuery).subscribe((data) => {
      this.books = data; 
    });
  }
  
  openReviewModal(book: any) {
    this.selectedBook = book; 
    this.showReview = true;   
    this.showContact = false; 
  }

  showContactInfo(book: any) {
    this.selectedBook = book; 
    this.showContact = true; 
    this.showReview = false; 
}

// aggiungere la funzione retrieve info by username
=======
clickReadReview(book: any) {
  this.selectedBook = book; 
  this.showContact = false; 
  this.showReview = false; 
  this.showRead = true; 
}

  
    
>>>>>>> eb5072bcc9de5ad2cad322b53dbd6627b591f063

  submitReview() {
    const reviewData = {
      description : this.review,
      score: this.score,
      book_id: this.selectedBook.id
    };

    this.bookService.addReview(this.selectedBook.id, reviewData).subscribe(() => {
      this.showReview = false; 
    });
  }
}
