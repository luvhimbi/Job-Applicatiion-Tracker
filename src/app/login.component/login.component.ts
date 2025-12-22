import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import {NavbarComponent} from '../navbar.component/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true, // Assuming Angular 14+ standalone component
  imports: [
    FormsModule,
    RouterLink,
    NgIf,
    NavbarComponent
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

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
}
