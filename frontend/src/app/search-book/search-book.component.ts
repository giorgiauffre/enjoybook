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
  showRead: boolean = false;  
  ownerInfo: any = null; 
  reviewInfo: any = null; 
  username: string; 

  constructor(private bookService: BookService) {} 


  ngOnInit() {
    this.bookService.getBookStatusChange().subscribe((updatedBook) => {
      if (updatedBook) {
        const index = this.books.findIndex(book => book.id === updatedBook.id);
        if (index !== -1) {
          this.books[index] = { ...updatedBook };  
        }
      }
    });
  }

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
    this.showRead = false; 
  }

  showContactInfo(book: any) {
    this.selectedBook = book; 
    this.showContact = true; 
    this.showReview = false; 
    this.showRead = false; 
}

  clickReadReview(book: any) {
    this.selectedBook = book; 
    this.showContact = false; 
    this.showReview = false; 
    this.showRead = true; 
  }

  submitReview() {
    const reviewData = {
      description: this.review,
      score: this.score,
      book_id: this.selectedBook.id,
      username: this.username  
    };

    this.bookService.addReview(this.selectedBook.id, reviewData).subscribe(() => {
      this.showReview = false;
      this.clickReadReview(this.selectedBook);
    });
  }
}
