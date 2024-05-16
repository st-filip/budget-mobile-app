import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerError: String = '';
  isLoading: Boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  onRegister(registerForm: NgForm) {
    this.isLoading = true;
    console.log(registerForm);
    if (registerForm.valid) {
      this.authService.register(registerForm.value).subscribe({
        next: (resData) => {
          console.log('Registration successful');
          console.log(resData);
          this.registerError = '';
          this.router.navigateByUrl('login');
          this.isLoading = false;
        },
        error: (error) => {
          console.log('Login failed');
          console.log(error);
          if (error.error.error.message === 'EMAIL_EXISTS') {
            this.registerError = 'This email has already been registered.';
          } else {
            this.registerError = 'Unknown register error.';
          }
          this.isLoading = false;
        },
      });
    }
  }
}
