import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JobApplicationService } from '../services/job-application.service';
import { JobApplication } from '../models/job-application.model';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar.component/navbar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-application-details',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FormsModule],
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.css']
})
export class ApplicationDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private jobService = inject(JobApplicationService);

  app: JobApplication | null = null;
  loading = true;
  isSaving = false; // Track saving state for the UI

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
      console.error('Error fetching details', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Updates the application document in Firestore
   */
  async saveApplication() {
    if (!this.app || !this.app.id) return;

    this.isSaving = true;
    try {
      await this.jobService.updateApplication(this.app.id, this.app);
      console.log('Application updated successfully');
    } catch (error) {
      console.error('Error updating application', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      this.isSaving = false;
    }
  }

  /**
   * Contacts Logic
   */
  addContact() {
    if (!this.app) return;

    // Initialize contacts array if it doesn't exist
    if (!this.app.contacts) {
      this.app.contacts = [];
    }

    // Add a blank contact object
    this.app.contacts.push({ name: '', role: '', email: '' });
  }

  removeContact(index: number) {
    if (this.app?.contacts) {
      this.app.contacts.splice(index, 1);
      // Optional: Auto-save after removing a contact
      this.saveApplication();
    }
  }

  formatDate(date: any) {
    return date?.toDate ? date.toDate() : date;
  }
}
