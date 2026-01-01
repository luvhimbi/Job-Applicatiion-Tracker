import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService, AdminStats } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { CareerRole } from '../models/carear-path.model';
import { Opportunity } from '../models/opportunity.model';
import { JobSource } from '../models/job-source.model';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private authService = inject(AuthService);

  stats = signal<AdminStats | null>(null);
  isLoading = signal<boolean>(true);
  currentUser$: Observable<User | null> = this.authService.userProfile$;
  
  users$: Observable<User[]> = this.adminService.getAllUsers();
  careerPaths$: Observable<CareerRole[]> = this.adminService.getAllCareerPaths();
  opportunities$: Observable<Opportunity[]> = this.adminService.getAllOpportunities();
  jobSources$: Observable<(JobSource & { id: string })[]> = this.adminService.getAllJobSources();
  
  // Debug: Log data to console
  ngOnInit() {
    this.loadStats();
    
    // Debug subscriptions to check if data is loading
    this.careerPaths$.subscribe(paths => {
      console.log('Career Paths loaded:', paths.length, paths);
    });
    
    this.jobSources$.subscribe(sources => {
      console.log('Job Sources loaded:', sources.length, sources);
    });
    
    this.opportunities$.subscribe(opps => {
      console.log('Opportunities loaded:', opps.length, opps);
    });
  }
  
  selectedTab = signal<'overview' | 'users' | 'career-paths' | 'opportunities' | 'discovery'>('overview');
  
  // Form states
  showCareerPathForm = signal<boolean>(false);
  showOpportunityForm = signal<boolean>(false);
  showJobSourceForm = signal<boolean>(false);
  
  editingCareerPath = signal<CareerRole | null>(null);
  editingOpportunity = signal<Opportunity | null>(null);
  editingJobSource = signal<JobSource | null>(null);

  // Form models
  careerPathForm: Partial<CareerRole> = {};
  opportunityForm: Partial<Opportunity> = {};
  jobSourceForm: Partial<JobSource> = {};


  async loadStats() {
    this.isLoading.set(true);
    try {
      const stats = await firstValueFrom(this.adminService.getStats());
      this.stats.set(stats);
    } catch (error) {
      console.error('Error loading stats:', error);
      // Set default stats on error
      this.stats.set({
        totalUsers: 0,
        totalCareerPaths: 0,
        totalOpportunities: 0,
        totalJobSources: 0,
        recentUsers: 0
      });
    } finally {
      this.isLoading.set(false);
    }
  }

  setTab(tab: 'overview' | 'users' | 'career-paths' | 'opportunities' | 'discovery') {
    this.selectedTab.set(tab);
    this.closeAllForms();
  }

  async updateUserRole(uid: string, role: 'user' | 'admin') {
    try {
      await this.adminService.updateUserRole(uid, role);
      alert(`User role updated to ${role}`);
      this.loadStats();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  }

  async deleteUser(uid: string) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    try {
      await this.adminService.deleteUser(uid);
      alert('User deleted successfully');
      this.loadStats();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  }

  /* ================= CAREER PATHS ================= */

  openCareerPathForm(path?: CareerRole) {
    if (path) {
      this.editingCareerPath.set(path);
      this.careerPathForm = { ...path };
    } else {
      this.editingCareerPath.set(null);
      this.careerPathForm = {
        title: '',
        industry: 'Tech',
        salaryRange: '',
        description: '',
        whoShouldApply: [],
        dayInLife: '',
        skillsNeeded: []
      };
    }
    this.showCareerPathForm.set(true);
  }

  async saveCareerPath() {
    try {
      if (this.editingCareerPath()) {
        await this.adminService.updateCareerPath(this.editingCareerPath()!.id, this.careerPathForm);
        alert('Career path updated successfully');
      } else {
        await this.adminService.createCareerPath(this.careerPathForm as CareerRole);
        alert('Career path created successfully');
      }
      this.closeAllForms();
      this.loadStats();
    } catch (error) {
      console.error('Error saving career path:', error);
      alert('Failed to save career path');
    }
  }

  async deleteCareerPath(id: string) {
    if (!confirm('Are you sure you want to delete this career path?')) {
      return;
    }
    try {
      await this.adminService.deleteCareerPath(id);
      alert('Career path deleted successfully');
      this.loadStats();
    } catch (error) {
      console.error('Error deleting career path:', error);
      alert('Failed to delete career path');
    }
  }

  /* ================= OPPORTUNITIES ================= */

  openOpportunityForm(opp?: Opportunity) {
    if (opp) {
      this.editingOpportunity.set(opp);
      this.opportunityForm = { ...opp };
    } else {
      this.editingOpportunity.set(null);
      this.opportunityForm = {
        company: '',
        title: '',
        type: 'Internship',
        description: '',
        window: '',
        link: ''
      };
    }
    this.showOpportunityForm.set(true);
  }

  async saveOpportunity() {
    try {
      if (this.editingOpportunity()?.id) {
        await this.adminService.updateOpportunity(this.editingOpportunity()!.id!, this.opportunityForm);
        alert('Opportunity updated successfully');
      } else {
        await this.adminService.createOpportunity(this.opportunityForm as Opportunity);
        alert('Opportunity created successfully');
      }
      this.closeAllForms();
      this.loadStats();
    } catch (error) {
      console.error('Error saving opportunity:', error);
      alert('Failed to save opportunity');
    }
  }

  async deleteOpportunity(id: string) {
    if (!confirm('Are you sure you want to delete this opportunity?')) {
      return;
    }
    try {
      await this.adminService.deleteOpportunity(id);
      alert('Opportunity deleted successfully');
      this.loadStats();
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      alert('Failed to delete opportunity');
    }
  }

  /* ================= JOB SOURCES ================= */

  openJobSourceForm(source?: JobSource) {
    if (source) {
      this.editingJobSource.set(source);
      this.jobSourceForm = { ...source };
    } else {
      this.editingJobSource.set(null);
      this.jobSourceForm = {
        name: '',
        description: '',
        url: '',
        icon: 'bi-link-45deg',
        category: 'General',
        color: '#1976d2'
      };
    }
    this.showJobSourceForm.set(true);
  }

  async saveJobSource() {
    try {
      if (this.editingJobSource()?.id) {
        await this.adminService.updateJobSource(this.editingJobSource()!.id!, this.jobSourceForm);
        alert('Job source updated successfully');
      } else {
        await this.adminService.saveJobSource(this.jobSourceForm as JobSource);
        alert('Job source created successfully');
      }
      this.closeAllForms();
      this.loadStats();
    } catch (error) {
      console.error('Error saving job source:', error);
      alert('Failed to save job source');
    }
  }

  async deleteJobSource(id: string) {
    if (!confirm('Are you sure you want to delete this job source?')) {
      return;
    }
    try {
      await this.adminService.deleteJobSource(id);
      alert('Job source deleted successfully');
      this.loadStats();
    } catch (error) {
      console.error('Error deleting job source:', error);
      alert('Failed to delete job source');
    }
  }

  closeAllForms() {
    this.showCareerPathForm.set(false);
    this.showOpportunityForm.set(false);
    this.showJobSourceForm.set(false);
    this.editingCareerPath.set(null);
    this.editingOpportunity.set(null);
    this.editingJobSource.set(null);
    this.careerPathForm = {};
    this.opportunityForm = {};
    this.jobSourceForm = {};
  }

  formatDate(date: any): string {
    if (!date) return 'N/A';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  // Helper to convert string to array for skills/whoShouldApply
  stringToArray(str: string): string[] {
    return str.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }

  arrayToString(arr: string[]): string {
    return arr ? arr.join(', ') : '';
  }
}
