import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../service/user/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = ''; 
  password: string = '';

  constructor(private router: Router, private userService: UserService) {}

  isPasswordVisible: boolean = false;

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  login() {
    const loginData = {
      username: this.username,
      password: this.password
    };

    if (loginData.username && loginData.password) {
      console.log(loginData);
      this.userService.login(loginData).subscribe({
        next: (data: any) => {
          console.log('Login successful', data);
          this.router.navigateByUrl('/initialPage'); 
        },
        error: (err) => {
          console.error('Login error:', err); 
        }
      });
    } else {
      console.error('Please enter both username and password.');
    }
  }
}