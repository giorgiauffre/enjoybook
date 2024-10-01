import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogLogoutComponent } from '../confirm-dialog-logout/confirm-dialog-logout.component';

@Component({
  selector: 'app-initial-page',
  templateUrl: './initial-page.component.html',
  styleUrl: './initial-page.component.css'
})
export class InitialPageComponent {

  constructor(private router: Router, public dialog: MatDialog) {}


  goToHome() {
    const dialogRef = this.dialog.open(ConfirmDialogLogoutComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        sessionStorage.clear;
        this.router.navigateByUrl('/');
      }
    });
  }

  goToUploadBook(){
    this.router.navigateByUrl('uploadBook');
  }

  goToSearchBook(){
    this.router.navigateByUrl('searchBook');
  }

  goToListBook(){
    this.router.navigateByUrl('listBook');
  }

  goToUserProfile(){
    this.router.navigateByUrl('userProfile');
  }

  goToBookingHistory(){
    this.router.navigateByUrl('bookingHistory');
  }


}
