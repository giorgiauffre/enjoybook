import { Component, OnInit } from '@angular/core';
import { BookService } from '../service/book/book.service';

@Component({
  selector: 'app-list-book',
  templateUrl: './list-book.component.html',
  styleUrls: ['./list-book.component.css']
})
export class ListBookComponent implements OnInit {
  books: any[] = []; 
  currentBook: any; 
  isEditing: boolean = false; 

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.fetchData(); 
  }

  fetchData() {
    let owner_id = localStorage.getItem("username");
    this.bookService.getBooks(owner_id).subscribe(
      (response) => {
        this.books = response; 
        console.log(this.books); 
      },
      (error) => {
        console.error('Error fetching data:', error); 
      }
    );
  }

  deleteBook(bookId: number) {
    if (confirm('Are you sure you want to delete this book?')) { 
      this.bookService.deleteBook(bookId).subscribe(
        () => {
          this.books = this.books.filter(book => book.id !== bookId); 
          console.log('Book deleted successfully'); 
        },
        (error) => {
          console.error('Error deleting book:', error); 
        }
      );
    }
  }

  openEditModal(book: any) {
    this.currentBook = { ...book }; 
    this.isEditing = true; 
  }

  closeEditModal() {
    this.isEditing = false; 
  }

  updateBook() {
    this.bookService.updateBook(this.currentBook.id, this.currentBook).subscribe(
      () => {
        const index = this.books.findIndex(book => book.id === this.currentBook.id);
        if (index !== -1) {
          this.books[index] = this.currentBook;
        }
        console.log('Book updated successfully'); 
        this.closeEditModal(); 
      },
      (error) => {
        console.error('Error updating book:', error); 
      }
    );
  }
  clickAvailable(book: any) {
    book.status = 'Available'; 
    this.bookService.updateBook(book.id, book).subscribe(
      () => {
        console.log('Book marked as Available');
        this.bookService.notifyStatusChange(book); 
      },
      (error) => {
        console.error('Error updating status:', error);
      }
    );
  }
  
  clickNotAvailable(book: any) {
    book.status = 'Not Available'; 
    this.bookService.updateBook(book.id, book).subscribe(
      () => {
        console.log('Book marked as Not Available');
        this.bookService.notifyStatusChange(book); 
      },
      (error) => {
        console.error('Error updating status:', error);
      }
    );
  }
  

}
