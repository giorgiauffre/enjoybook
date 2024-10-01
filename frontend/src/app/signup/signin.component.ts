import { Component } from '@angular/core';
import { UserService } from '../service/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  name: string;
  surname: string;
  address: string;
  telephone: string;
  socialMedia: string;
  email: string;
  username: string;
  password: string;

  constructor(private router: Router, private userService: UserService) {

  }

  isPasswordVisible: boolean = false;


  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  public onSubmit() {

    const signupData = {
      name : this.name, 
      surname: this.surname, 
      address: this.address, 
      telephone: this.telephone,
      social_media: this.socialMedia,
      email: this.email, 
      username: this.username,
      password: this.password
    };
    
    //validare i campi
    if (signupData != null) {
      console.log(signupData);
      this.userService.signup(signupData)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.router.navigateByUrl('/login');
          },
          error: (err) => console.log(err)
        });
    }
  }
}
