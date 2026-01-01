import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIf
  ],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  displayName = '';
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;
  isSuccess = false;

  constructor(private authService: AuthService, private router: Router) {}

  async register() {
    // Safety check: ensure loading only starts if data is present
    if (!this.email || !this.password || !this.displayName) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.isSuccess = false;

    try {
      await this.authService.register(this.email, this.password, this.displayName);
      this.isSuccess = true;

      // Delay redirect slightly so user sees the success state
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1500);

    } catch (error: any) {
      // Logic to handle Firebase/Backend errors (e.g., Email already in use)
      this.errorMessage = error.message || 'Registration failed. Please try again.';
      this.isLoading = false;
    } finally {
      if (!this.isSuccess) {
        this.isLoading = false;
      }
    }
  }
}
