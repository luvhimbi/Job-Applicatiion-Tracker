import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobApplicationService } from '../services/job-application.service';
import { JobApplication } from '../models/job-application.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar.component/navbar.component';

@Component({
  selector: 'app-application-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './application-edit.component.html'
})
export class ApplicationEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jobService = inject(JobApplicationService);

  app: JobApplication | null = null;
  loading = true;
  isSaving = false;

  // Status options for the dropdown
  statuses = ['Applied', 'Interview', 'Offer', 'Rejected'];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchDetails(id);
    }
  }

  async fetchDetails(id: string) {
    try {
      this.app = await this.jobService.getById(id);
    } catch (error) {
      console.error('Error fetching application', error);
    } finally {
      this.loading = false;
    }
  }

  async updateApp() {
    if (!this.app || !this.app.id) return;
    this.isSaving = true;
    try {
      await this.jobService.updateApplication(this.app.id, this.app);
      // After saving, navigate back to the display page
      this.router.navigate(['/application', this.app.id]);
    } catch (error) {
      console.error('Update failed', error);
    } finally {
      this.isSaving = false;
    }
  }

  addContact() {
    if (!this.app) return;
    if (!this.app.contacts) this.app.contacts = [];
    this.app.contacts.push({ name: '', role: '', email: '' });
  }

  removeContact(index: number) {
    this.app?.contacts?.splice(index, 1);
  }
}
