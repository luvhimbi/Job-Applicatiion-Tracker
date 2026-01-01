import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth, confirmPasswordReset, verifyPasswordResetCode, applyActionCode } from '@angular/fire/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auth-action',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container py-5 mt-5">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="card border-0 shadow-sm p-4 text-center">

            <div *ngIf="isLoading">
              <div class="spinner-border text-primary mb-3"></div>
              <p>Verifying request...</p>
            </div>

            <div *ngIf="!isLoading && mode === 'resetPassword'">
              <i class="bi bi-shield-lock text-primary display-4 mb-3"></i>
              <h3 class="fw-bold">New Password</h3>
              <p class="text-muted small">Enter a strong password for your account.</p>

              <input type="password" class="form-control mb-3" placeholder="New Password" [(ngModel)]="newPassword">
              <button class="btn btn-primary w-100 py-2 fw-bold" (click)="handleResetPassword()">
                Update Password
              </button>
            </div>

            <div *ngIf="!isLoading && mode === 'verifyEmail'">
              <i class="bi bi-patch-check text-success display-4 mb-3"></i>
              <h3 class="fw-bold">Email Verified!</h3>
              <p class="text-muted">Your email has been confirmed. You can now access all features.</p>
              <a routerLink="/login" class="btn btn-dark w-100">Go to Login</a>
            </div>

          </div>
        </div>
      </div>
    </div>
  `
})
export class AuthActionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(Auth);

  mode = ''; // resetPassword, verifyEmail, etc.
  actionCode = '';
  newPassword = '';
  isLoading = true;

  async ngOnInit() {
    // 1. Capture the parameters from the URL
    this.mode = this.route.snapshot.queryParams['mode'];
    this.actionCode = this.route.snapshot.queryParams['oobCode'];

    if (!this.actionCode) {
      this.router.navigate(['/login']);
      return;
    }

    // 2. Handle the specific mode
    try {
      if (this.mode === 'verifyEmail') {
        await applyActionCode(this.auth, this.actionCode);
        this.isLoading = false;
      } else if (this.mode === 'resetPassword') {
        // Pre-verify that the reset code is still valid
        await verifyPasswordResetCode(this.auth, this.actionCode);
        this.isLoading = false;
      }
    } catch (error) {
      Swal.fire('Error', 'Link expired or invalid.', 'error');
      this.router.navigate(['/login']);
    }
  }

  async handleResetPassword() {
    if (this.newPassword.length < 6) {
      Swal.fire('Weak Password', 'Minimum 6 characters required.', 'warning');
      return;
    }

    try {
      await confirmPasswordReset(this.auth, this.actionCode, this.newPassword);
      await Swal.fire('Success', 'Password updated! Please login.', 'success');
      this.router.navigate(['/login']);
    } catch (error) {
      Swal.fire('Error', 'Failed to reset password.', 'error');
    }
  }
}
