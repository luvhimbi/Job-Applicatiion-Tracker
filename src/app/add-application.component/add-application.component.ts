import { Component, EventEmitter, Output } from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {JobApplicationService} from '../services/job-application.service';
import {JobApplication} from '../models/job-application.model';
import {NgIf} from '@angular/common';
import {NavbarComponent} from '../navbar.component/navbar.component';


@Component({
  selector: 'app-add-application',
  imports: [
    FormsModule,
    NgIf,
    NavbarComponent
  ],
  templateUrl: './add-application.component.html'
})
export class AddApplicationComponent {
  newApplication: JobApplication = this.getResetObject();

  // UI State
  isSubmitting = false;
  isSuccess = false;
  errorMessage = '';

  @Output() applicationAdded = new EventEmitter<void>();

  constructor(private applicationService: JobApplicationService) {}

  private getResetObject(): JobApplication {
    return {
      companyName: '',
      jobTitle: '',
      status: 'Applied',
      applicationDate: new Date(),
      location: '',
      notes: '',
      createdAt: new Date()
    };
  }

  async addApplication(form: NgForm) {
    if (form.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    this.isSuccess = false;

    try {
      await this.applicationService.create(this.newApplication);

      this.isSuccess = true;
      this.applicationAdded.emit();
      form.resetForm(this.getResetObject());

      // Auto-hide success message after 4 seconds
      setTimeout(() => this.isSuccess = false, 4000);

    } catch (error: any) {
      console.error('Error adding application:', error);
      // Map Firebase errors to human-readable messages
      if (error.code === 'permission-denied') {
        this.errorMessage = "Access denied. Please check if you're logged in.";
      } else {
        this.errorMessage = "Something went wrong. Please try again later.";
      }
    } finally {
      this.isSubmitting = false;
    }
  }
}
