import { Component } from '@angular/core';

import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink,
    NgIf
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  email = '';
  password = '';
  errorMessage = '';
  isLoading = false; // Add this
  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/']); // Redirect to applications page after login
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }
}
