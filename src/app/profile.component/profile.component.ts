import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import {NavbarComponent} from '../navbar.component/navbar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  authService = inject(AuthService);

  // States for UI feedback
  isUpdating = false;
  successMessage = '';
  errorMessage = '';

  // We'll use this for the form
  userData = {
    displayName: ''
  };

  constructor() {
    this.authService.userProfile$.subscribe(user => {
      // Only assign if user is not null/undefined
      if (user && user.displayName) {
        this.userData.displayName = user.displayName;
      }
    });
  }

  async updateProfile() {
    if (!this.userData.displayName.trim()) {
      this.errorMessage = 'Display name cannot be empty.';
      return;
    }

    this.isUpdating = true;
    this.successMessage = '';
    this.errorMessage = '';

    try {
      // Call the service method we just created
      await this.authService.updateProfile(this.userData.displayName);

      this.successMessage = 'Profile updated successfully!';

      // Auto-hide success message after 3 seconds
      setTimeout(() => this.successMessage = '', 3000);
    } catch (error: any) {
      console.error(error);
      this.errorMessage = 'Failed to update profile. ' + (error.message || '');
    } finally {
      this.isUpdating = false;
    }
  }
}
