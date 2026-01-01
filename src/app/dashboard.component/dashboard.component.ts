import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';

import { JobApplication, JobStatus } from '../models/job-application.model';
import { AuthService } from '../services/auth.service';
import { JobApplicationService } from '../services/job-application.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    RouterLink
  ]
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  protected applicationService = inject(JobApplicationService);

  // Signals for high-performance state management
  applications = signal<JobApplication[]>([]);
  userName = signal<string>('Explorer');
  isLoading = signal<boolean>(true);
  isLoggedIn = signal<boolean>(false);

  // --- NEW UI STATE ---
  currentView = signal<'grid' | 'table'>('grid');
  searchQuery = signal<string>('');

  // --- TOAST STATE ---
  showConfirmToast = signal<boolean>(false);
  showSuccessToast = signal<boolean>(false);
  pendingDeleteId = signal<string | null>(null);
  toastMessage = signal<string>('');

  ngOnInit(): void {
    this.initAuth();
  }

  private initAuth(): void {
    this.authService.userProfile$.subscribe({
      next: (profile) => {
        this.isLoggedIn.set(!!profile);
        if (profile) {
          this.userName.set(profile.displayName?.split(' ')[0] || 'Explorer');
          this.loadApplications();
        } else {
          this.isLoading.set(false);
        }
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadApplications(): void {
    this.isLoading.set(true);
    this.applicationService.getApplications()
      .pipe(
        map(apps => apps.map(app => ({
          ...app,
          applicationDate: this.formatFirebaseDate(app.applicationDate)
        })))
      )
      .subscribe({
        next: (apps) => {
          this.applications.set(apps);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Pipeline Error:', err);
          this.isLoading.set(false);
        }
      });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Applied': return 'bg-primary-subtle text-primary';
      case 'Interview': return 'bg-warning-subtle text-warning text-dark';
      case 'Offer': return 'bg-success-subtle text-success';
      case 'Rejected': return 'bg-danger-subtle text-danger';
      default: return 'bg-secondary-subtle text-secondary';
    }
  }

  // --- TRIGGER CONFIRMATION TOAST ---
  initiateDelete(id: string): void {
    this.pendingDeleteId.set(id);
    this.toastMessage.set('Are you sure you want to remove this application?');
    this.showConfirmToast.set(true);

    // Auto-hide confirmation toast after 5 seconds if no action taken
    setTimeout(() => this.showConfirmToast.set(false), 5000);
  }

  // --- ACTUAL DELETE ACTION ---
  async confirmDelete() {
    const id = this.pendingDeleteId();
    if (!id) return;

    try {
      this.showConfirmToast.set(false);
      await this.applicationService.deleteApplication(id);

      // Update local state
      this.applications.update(apps => apps.filter(a => a.id !== id));

      // Show Success Feedback
      this.toastMessage.set('Application successfully removed.');
      this.showSuccessToast.set(true);
      setTimeout(() => this.showSuccessToast.set(false), 3000);

      this.pendingDeleteId.set(null);
    } catch (error) {
      console.error('Action failed:', error);
      this.toastMessage.set('Error deleting application.');
    }
  }

  cancelDelete(): void {
    this.showConfirmToast.set(false);
    this.pendingDeleteId.set(null);
  }

  private formatFirebaseDate(date: any): Date {
    if (date && typeof date.toDate === 'function') {
      return date.toDate();
    }
    return date || new Date();
  }

  toggleView(view: 'grid' | 'table'): void {
    this.currentView.set(view);
  }
}
