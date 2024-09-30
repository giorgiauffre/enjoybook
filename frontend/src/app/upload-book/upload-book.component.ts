import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../service/book/book.service';

@Component({
  selector: 'app-upload-book',
  templateUrl: './upload-book.component.html',
  styleUrls: ['./upload-book.component.css']
})
export class UploadBookComponent {
  title: string = '';
  author: string = '';
  genre: string = '';
  year: number | null = null;  
  language: string = '';
  description: string = '';
  errorMessages: string[] = []; 


  constructor(private router: Router, private bookService: BookService) {}

  public onSubmit() {
    const uploadBookData = {
      title: this.title,
      author: this.author,
      genre: this.genre,
      year: this.year,
      language: this.language,
      description: this.description,
    };

    this.errorMessages = [];

    if (this.isValid(uploadBookData)) {
      this.bookService.addBook(uploadBookData)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.router.navigateByUrl('/initialPage');  
            this.resetForm(); 
          },
          error: (err) => {
            console.error(err);
            alert('Error.');
          }
        });
    } else {
      alert(this.errorMessages.join('\n')); 
    }
}

  private isValid(data: any): boolean {
    let isValid = true;

    if (!data.title) {
        this.errorMessages.push('The title is required.');
        isValid = false;
    }
    if (!data.author) {
        this.errorMessages.push('The author is required.');
        isValid = false;
    }
    if (!data.genre) {
        this.errorMessages.push('The genre is required.');
        isValid = false;
    }
    if (data.year === null || data.year < 1000 || data.year > new Date().getFullYear()) {
        this.errorMessages.push('The year must be a valid number between 1000 and the current year.');
        isValid = false;
    }
    if (!data.language) {
        this.errorMessages.push('The language is required.');
        isValid = false;
    }
    if (!data.description) {
        this.errorMessages.push('The description is required.');
        isValid = false;
    }

    return isValid;
}


  private resetForm() {
    this.title = '';
    this.author = '';
    this.genre = '';
    this.year = null;
    this.language = '';
    this.description = '';
  }

  clickUpload() {
    this.onSubmit(); 
  }
}
