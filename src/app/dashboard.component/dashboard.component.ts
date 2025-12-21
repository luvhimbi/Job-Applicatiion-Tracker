import { Component, OnInit, inject } from '@angular/core';
import { JobApplication, JobStatus } from '../models/job-application.model'; // Import JobStatus
import { AuthService } from '../services/auth.service';
import { JobApplicationService } from '../services/job-application.service';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common'; // Added NgIf
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer.component/footer.component';
import { NavbarComponent } from '../navbar.component/navbar.component';
import { AddApplicationComponent } from '../add-application.component/add-application.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true, // Ensure standalone is present if using imports
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    NavbarComponent,
    DatePipe,
    NgClass,
    RouterLink
  ]
})
export class DashboardComponent implements OnInit {
  // Use inject for a cleaner constructor
  private authService = inject(AuthService);
  protected applicationService = inject(JobApplicationService);

  applications: JobApplication[] = [];
  userName: string | undefined = '';

  ngOnInit(): void {
    // Reactive way to get the user's name
    this.authService.userProfile$.subscribe(profile => {
      if (profile) this.userName = profile.displayName;
    });

    this.loadApplications();
  }

  loadApplications() {
    this.applicationService.getApplications().subscribe({
      next: (apps) => {
        this.applications = apps;
      },
      error: (err) => console.error('Error loading applications:', err)
    });
  }
  getStatusBadgeClass(status: string): string {
    // Returns the specific class name based on the lowercase status
    return 'bg-' + status.toLowerCase();
  }
  getCountByStatus(status: string): number {
    return this.applications.filter(app => app.status === status).length;
  }

  // FIX: Added JobStatus type cast to resolve TS2322
  async updateStatus(id: string, newStatus: string) {
    try {
      // FIX: Changed updateApplication to update (matches your Service)
      await this.applicationService.updateApplication(id, {
        status: newStatus as JobStatus
      });
    } catch (error) {
      console.error('Update failed', error);
    }
  }

  async deleteApp(id: string) {
    if (confirm('Are you sure you want to delete this application?')) {
      try {
        // FIX: Changed deleteApplication to delete (matches your Service)
        await this.applicationService.deleteApplication(id);
      } catch (error) {
        console.error('Delete failed', error);
      }
    }
  }

  logout() {
    this.authService.logout();
  }

  formatFirebaseDate(date: any): Date | any {
    // If it's a Firestore Timestamp, convert it to a JS Date
    if (date && typeof date.toDate === 'function') {
      return date.toDate();
    }
    // Otherwise, return it as is (standard Date or string)
    return date;
  }
}
