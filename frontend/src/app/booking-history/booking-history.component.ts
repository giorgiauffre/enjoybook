import { Component } from '@angular/core';
import { LoanService } from '../service/loan/loan.service';

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrl: './booking-history.component.css'
})
export class BookingHistoryComponent {

  constructor(private loanService: LoanService){}
  loans: any;

  ngOnInit() {
    this.fetchData(); 
  }

  fetchData() {
    let user = localStorage.getItem("username");
    this.loanService.getLoans(user).subscribe(
      (response) => {
        this.loans = response; 
        console.log(this.loans); 
      },
      (error) => {
        console.error('Error fetching data:', error); 
      }
    );
  }
}
