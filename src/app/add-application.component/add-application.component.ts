import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { JobApplicationService } from '../services/job-application.service';
import { JobApplication } from '../models/job-application.model';
import { NgIf } from '@angular/common';
import { NavbarComponent } from '../navbar.component/navbar.component';
import { Router } from '@angular/router'; // 👈 Inject Router
import Swal from 'sweetalert2'; // 👈 Inject SweetAlert2

@Component({
  selector: 'app-add-application',
  standalone: true,
  imports: [FormsModule, NgIf, NavbarComponent],
  templateUrl: './add-application.component.html'
})
export class AddApplicationComponent implements OnInit {
  private applicationService = inject(JobApplicationService);
  private router = inject(Router);

  newApplication: JobApplication = this.getResetObject();

  // UI States
  isLoading = true; // 👈 Page initialization state
  isSubmitting = false;
  showInfo = false;

  @Output() applicationAdded = new EventEmitter<void>();

  ngOnInit() {
    // Simulate a brief load for smooth UI entry
    setTimeout(() => {
      this.isLoading = false;
    }, 600);
  }

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

    try {
      await this.applicationService.create(this.newApplication);

      // SweetAlert Success Toast
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });

      await Toast.fire({
        icon: 'success',
        title: 'Application tracked!'
      });

      this.applicationAdded.emit();
      this.router.navigate(['/']); // 👈 Redirect to Dashboard

    } catch (error: any) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to save application. Please try again.',
        icon: 'error',
        confirmButtonColor: '#212529'
      });
    } finally {
      this.isSubmitting = false;
    }
  }
}
