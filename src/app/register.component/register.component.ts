import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import {NavbarComponent} from '../navbar.component/navbar.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIf,
    NavbarComponent
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
      // Extract error message from service
      this.errorMessage = error.message || 'Registration failed. Please try again.';
      // We set isLoading to false here so they can fix the form and retry
      this.isLoading = false;
    } finally {
      // If successful, we keep isLoading true to prevent double-clicks
      // during the 1.5s redirect delay. If failed, we already set it to false above.
      if (!this.isSuccess) {
        this.isLoading = false;
      }
    }
  }
}
