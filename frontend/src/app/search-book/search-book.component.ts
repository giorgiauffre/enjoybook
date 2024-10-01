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
  showContactInfo: boolean = false; 
  showAddReview: boolean = false;  
  showReviewList: boolean = false;  
  ownerInfo: any ;
  reviews: any;
  user_id: any;


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
  
  addReviewModal(book: any) {
    this.selectedBook = book; 
    this.showAddReview = true;   
    this.showContactInfo = false; 
    this.showReviewList = false; 
  }

  contactInfoModal(book: any) {
    this.selectedBook = book; 
    this.showContactInfo = true; 
    this.showAddReview = false; 
    this.showReviewList = false; 
}

  reviewListModal(book: any) {
    this.selectedBook = book; 
    this.showContactInfo = false; 
    this.showAddReview = false; 
    this.showReviewList = true; 

    this.bookService.getReviews(this.selectedBook.id).subscribe(
      (response) => {
        this.reviews = response; 
        console.log(this.books); 
      },
      (error) => {
        console.error('Error inserting review:', error); 
      }
    );
  }

  submitReview() {
    const reviewData = {
      description: this.review,
      score: this.score,
      book_id: this.selectedBook.id,
      username: localStorage.getItem('username')
    };

    this.bookService.addReview(this.selectedBook.id, reviewData).subscribe(() => {
      this.review = ''; 
      this.showAddReview = false;
    });
  }
}
