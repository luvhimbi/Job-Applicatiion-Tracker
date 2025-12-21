import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-register',
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
  isLoading = false; // Add this
  isSuccess = false; // Add this to show a success message

  constructor(private authService: AuthService, private router: Router) {}

  async register() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.authService.register(this.email, this.password, this.displayName);
      this.isSuccess = true;
      // Delay redirect slightly so user sees the success state
      setTimeout(() => this.router.navigate(['/']), 1500);
    } catch (error: any) {
      this.errorMessage = error.message || 'Registration failed.';
    } finally {
      this.isLoading = false;
    }
  }
}
