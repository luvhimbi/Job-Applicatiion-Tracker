import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {AsyncPipe, CommonModule} from '@angular/common';
import Swal from 'sweetalert2'; // 👈 Import SweetAlert2

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  imports: [
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    CommonModule
  ],
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  /**
   * 🚪 Logout with SweetAlert2 Confirmation
   */
  async logout() {
    Swal.fire({
      title: 'Sign Out?',
      text: 'Are you sure you want to end your session?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#212529', // Matching your dark button theme
      cancelButtonColor: '#f8f9fa',
      confirmButtonText: 'Yes, Sign Out',
      cancelButtonText: 'Stay logged in',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-4 shadow-lg border-0',
        confirmButton: 'btn btn-dark px-4 py-2 small fw-bold rounded-2 ms-2',
        cancelButton: 'btn btn-light px-4 py-2 small fw-bold rounded-2 text-muted'
      },
      buttonsStyling: false
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.performLogout();
      }
    });
  }

  private async performLogout() {
    try {
      await this.authService.logout();

      // Optional: Show a quick "Success" toast
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });

      await Toast.fire({
        icon: 'success',
        title: 'Signed out successfully'
      });

      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong while signing out.',
        confirmButtonColor: '#212529'
      });
    }
  }
}
