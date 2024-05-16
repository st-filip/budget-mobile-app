import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginError: String = '';
  isLoading: Boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  onLogin(logInForm: NgForm) {
    this.isLoading = true;
    console.log(logInForm);
    if (logInForm.valid) {
      this.authService.logIn(logInForm.value).subscribe({
        next: (resData) => {
          console.log('Login successful');
          console.log(resData);
          this.loginError = '';
          this.router.navigateByUrl('home');
          this.isLoading = false;
        },
        error: (error) => {
          console.log('Login failed');
          console.log(error);
          const code = error.error.error.message;
          if (code === 'INVALID_LOGIN_CREDENTIALS') {
            this.loginError = 'Invalid email or password.';
          } else if (code === 'EMAIL_NOT_FOUND') {
            this.loginError = 'Email address could not be found.';
          } else if (code === 'INVALID_PASSWORD') {
            this.loginError = 'This password is not correct.';
          } else {
            this.loginError = 'Unknown login error.';
          }
          this.isLoading = false;
        },
      });
    }
  }
}
