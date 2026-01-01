import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import { filter, switchMap, take, timeout } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { authState } from '@angular/fire/auth';
import { Auth } from '@angular/fire/auth';
import { inject } from '@angular/core';
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
  private auth = inject(Auth);

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

      // 2. Wait for Firebase auth state to have a user
      await firstValueFrom(
        authState(this.auth).pipe(
          filter(user => user !== null),
          take(1),
          timeout(5000)
        )
      );

      // 3. Wait for user profile to load from Firestore
      // Use a fresh subscription to avoid cached null values
      const user = await firstValueFrom(
        this.authService.userProfile$.pipe(
          filter(u => u !== null),
          take(1),
          timeout(5000)
        )
      );

      if (!user) {
        throw new Error('Failed to load user profile');
      }

      // 4. Navigate to dashboard - use navigateByUrl for more reliable navigation
      await this.router.navigateByUrl('/', { skipLocationChange: false });

    } catch (error: any) {
      console.error('Login error:', error);
      if (error.name === 'TimeoutError') {
        this.errorMessage = 'Login successful but loading profile timed out. Please refresh.';
        // Still try to navigate
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      } else {
        this.errorMessage = 'Invalid email or password. Please try again.';
      }
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

