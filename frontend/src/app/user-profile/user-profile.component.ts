import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
    user: any = {}; 
    isEditing: boolean = false; 
    currentUser: any = {}; 

    constructor(private userService: UserService, private router: Router) {}

    ngOnInit() {
        const username = localStorage.getItem('username'); 
        if (username) {
            this.userService.getDetails(username).subscribe(
                (data) => {
                    this.user = data; 
                },
                (error) => {
                    console.error("Error fetching user details", error);
                }
            );
        } else {
            console.error("No username found in local storage");
        }
    }

    openEditModal() {
        this.currentUser = { ...this.user }; 
        this.isEditing = true; 
    }

    closeEditModal() {
        this.isEditing = false; 
    }

    updateUser() {
        const username = this.user.username; 
        if (!username) {
            console.error("Username is undefined!");
            return; 
        }
        this.userService.updateUserInfo(username, this.currentUser).subscribe(
            () => {
                this.user = { ...this.currentUser }; 
                this.closeEditModal(); 
            },
            (error) => {
                console.error("Error updating user details", error);
            }
        );
    }
    
    deleteUser() {
        const confirmation = confirm("Are you sure you want to delete your account?");
        if (confirmation) {
            const username = this.user.username;
            this.userService.deleteUser(username).subscribe(
                () => {
                    console.log("User deleted successfully");
                    this.router.navigateByUrl('/initialPage');
                },
                (error) => {
                    console.error("Error deleting user", error);
                }
            );
        }
    }
}
