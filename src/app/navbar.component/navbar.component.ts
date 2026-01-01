import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';

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

  // --- TOAST STATE SIGNALS ---
  showLogoutConfirm = signal<boolean>(false);
  showLogoutSuccess = signal<boolean>(false);

  /**
   * 🚪 Trigger the confirmation toast at the top
   */
  logout() {
    this.showLogoutConfirm.set(true);
    // Auto-hide the confirmation after 6 seconds if ignored
    setTimeout(() => this.showLogoutConfirm.set(false), 6000);
  }

  /**
   * ✅ Perform the actual logout
   */
  async confirmLogout() {
    try {
      this.showLogoutConfirm.set(false);
      await this.authService.logout();

      // Show success toast briefly at the top before navigating
      this.showLogoutSuccess.set(true);

      setTimeout(() => {
        this.showLogoutSuccess.set(false);
        this.router.navigate(['/login']);
      }, 500);

    } catch (error) {
      console.error('Logout failed', error);
      this.showLogoutConfirm.set(false);
    }
  }

  cancelLogout() {
    this.showLogoutConfirm.set(false);
  }
}
