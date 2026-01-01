import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { JobApplicationService } from '../services/job-application.service';
import { JobApplication } from '../models/job-application.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-application',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-application.component.html',
  styles: [`
    .form-control.ng-invalid.ng-touched { border-color: #dc3545 !important; }
  `]
})
export class AddApplicationComponent implements OnInit {
  private applicationService = inject(JobApplicationService);
  private router = inject(Router);

  newApplication: JobApplication = this.getResetObject();

  commonCompanies: string[] = [
    'Amazon', 'Google', 'Microsoft', 'Standard Bank', 'First National Bank (FNB)',
    'Absa Group', 'Nedbank', 'Capitec', 'MTN', 'Vodacom',
    'Old Mutual', 'Sanlam', 'Discovery', 'Multichoice', 'Takealot',
    'OfferZen', 'Entelect', 'BBD', 'Derivco', 'Capgemini', 'Accenture', 'Geeks4learning',
    'reverside'
  ].sort();

  isLoading = true;
  isSubmitting = false;
  showInfo = false;

  // Regex: Requires at least one letter, allows spaces/hyphens (prevents "123")
  textPattern = "^(?=.*[a-zA-Z]).+$";

  @Output() applicationAdded = new EventEmitter<void>();

  ngOnInit() {
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
      const company = this.newApplication.companyName.trim();
      const title = this.newApplication.jobTitle.trim();

      // 1. DUPLICATION CHECK
      const existingApps = await firstValueFrom(this.applicationService.getApplications());
      const isDuplicate = existingApps.some(app =>
        app.companyName.toLowerCase() === company.toLowerCase() &&
        app.jobTitle.toLowerCase() === title.toLowerCase()
      );

      if (isDuplicate) {
        Swal.fire({
          title: 'Duplicate Entry',
          text: `You already have an active application for "${title}" at ${company}.`,
          icon: 'warning',
          confirmButtonColor: '#212529'
        });
        this.isSubmitting = false;
        return;
      }

      // 2. SAVE APPLICATION
      this.newApplication.companyName = company;
      await this.applicationService.create(this.newApplication);

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
      this.router.navigate(['/']);

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
