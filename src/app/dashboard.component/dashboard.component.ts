import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';

import { JobApplication, JobStatus } from '../models/job-application.model';
import { AuthService } from '../services/auth.service';
import { JobApplicationService } from '../services/job-application.service';
import { NavbarComponent } from '../navbar.component/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    RouterLink,
    NavbarComponent
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

  ngOnInit(): void {
    this.initAuth();
  }

  private initAuth(): void {
    this.authService.userProfile$.subscribe({
      next: (profile) => {
        this.isLoggedIn.set(!!profile);
        if (profile) {
          // Extracts first name to make the greeting warm and personal
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
          // Pre-processing dates to JS Objects for the Angular DatePipe
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
    const s = status?.toLowerCase();
    return `status-badge-soft bg-${s}`;
  }

  async deleteApp(id: string) {
    if (!confirm('Remove this application from your journey?')) return;
    try {
      await this.applicationService.deleteApplication(id);
      // Optimistic Update: UI responds instantly before DB confirms
      this.applications.update(apps => apps.filter(a => a.id !== id));
    } catch (error) {
      console.error('Action failed:', error);
    }
  }

  private formatFirebaseDate(date: any): Date {
    if (date && typeof date.toDate === 'function') {
      return date.toDate();
    }
    return date || new Date();
  }
}
