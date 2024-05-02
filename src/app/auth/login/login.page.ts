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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  onLogin(logInForm: NgForm) {
    console.log(logInForm);
    if (logInForm.valid) {
      this.authService.logIn(logInForm.value).subscribe({
        next: (resData) => {
          console.log('Login successful');
          console.log(resData);
          this.loginError = '';
          this.router.navigateByUrl('home');
        },
        error: (error) => {
          console.log('Login failed');
          console.log(error);
          if (error.error.error.message === 'INVALID_LOGIN_CREDENTIALS') {
            this.loginError = 'Invalid email or password.';
          } else {
            this.loginError = 'Unknown login error.';
          }
        },
      });
    }
  }
}
