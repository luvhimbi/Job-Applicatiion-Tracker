import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true, // Assuming Angular 14+ standalone component
  imports: [
    FormsModule,
    RouterLink,CommonModule
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {
  }

  async login() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      // 1. Await the Firebase login
      await this.authService.login(this.email, this.password);

      // 2. Navigate immediately to the root (Dashboard)
      // The Navbar's async pipe will pick up the new user state automatically
      await this.router.navigate(['/']);

    } catch (error: any) {
      console.error(error);
      this.errorMessage = 'Invalid email or password. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async openForgotPassword() {
    const {value: email} = await Swal.fire({
      title: 'Reset Password',
      input: 'email',
      inputLabel: 'Enter your registered email address',
      inputPlaceholder: 'email@example.com',
      showCancelButton: true,
      confirmButtonText: 'Send Reset Link',
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#6c757d',
      inputValidator: (value) => {
        if (!value) {
          return 'Please enter a valid email!';
        }
        return null;
      }
    });

    if (email) {
      try {
        await this.authService.sendResetEmail(email);
        Swal.fire({
          icon: 'success',
          title: 'Check your inbox',
          text: 'A password reset link has been sent to ' + email,
          confirmButtonColor: '#0d6efd',
        });
      } catch (error: any) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'We couldn’t find an account with that email.',
          confirmButtonColor: '#212529',
        });
      }
    }
  }
}

