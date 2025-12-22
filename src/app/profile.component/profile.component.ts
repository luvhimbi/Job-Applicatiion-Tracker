import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar.component/navbar.component';
import Swal from 'sweetalert2'; // 👈 Import SweetAlert2

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  authService = inject(AuthService);
  router = inject(Router);

  isUpdating = false;
  successMessage = '';
  userData = { displayName: '' };

  constructor() {
    this.authService.userProfile$.subscribe(user => {
      if (user) {
        // Use the Nullish Coalescing operator (??) to provide a fallback
        this.userData.displayName = user.displayName ?? '';
      }
    });
  }

  async updateProfile() {
    if (!this.userData.displayName.trim()) return;
    this.isUpdating = true;
    try {
      await this.authService.updateProfile(this.userData.displayName);
      this.successMessage = 'Profile updated successfully!';
      setTimeout(() => this.successMessage = '', 3000);
    } catch (error) {
      console.error(error);
    } finally {
      this.isUpdating = false;
    }
  }

  // 🗑️ SweetAlert2 Delete Confirmation
  showDeleteConfirm() {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action is irreversible. All your job applications and data will be permanently deleted.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545', // Danger color
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-4 shadow-lg border-0',
        confirmButton: 'btn btn-danger px-4 py-2 fw-bold rounded-2',
        cancelButton: 'btn btn-light px-4 py-2 fw-bold rounded-2'
      },
      buttonsStyling: false
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.performDelete();
      }
    });
  }

  private async performDelete() {
    // Show a loading alert
    Swal.fire({
      title: 'Deleting account...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      await this.authService.deleteAccount();

      // Success Alert
      await Swal.fire({
        title: 'Deleted!',
        text: 'Your account has been removed.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      this.router.navigate(['/register']);
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'Could not delete account. You may need to log in again.',
        icon: 'error',
        confirmButtonColor: '#212529'
      });
    }
  }
}
