import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar.component/navbar.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.css']
})
export class HelpCenterComponent {
  categories = [
    {
      title: 'Getting Started',
      description: 'Learn how to set up your profile and track your first job application.',
      icon: 'bi bi-rocket-takeoff',
      slug: 'getting-started' // 👈 This must match the URL parameter
    },
    {
      title: 'Managing Pipeline',
      description: 'Deep dive into interview stages, moving cards, and adding recruiter notes.',
      icon: 'bi bi-kanban',
      slug: 'managing-pipeline'
    },
    {
      title: 'Account & Privacy',
      description: 'Manage your password, data exports, and security settings.',
      icon: 'bi bi-shield-lock',
      slug: 'account-privacy'
    }
  ];

  faqs = [
    {
      question: 'How do I move an application to the "Interview" stage?',
      answer: 'Go to your Dashboard, click the "Update Status" button on the application card, and select "Interview" from the dropdown. Your pipeline statistics will update automatically.'
    },
    {
      question: 'Can I export my job tracking data?',
      answer: 'Currently, data export is a feature in our roadmap. For now, all data is securely stored in your personal Firestore database.'
    },
    {
      question: 'What happens when I delete my account?',
      answer: 'Deleting your account permanently removes your profile and all associated job applications from our database. This action cannot be undone.'
    }
  ];
}
