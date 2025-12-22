import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar.component/navbar.component';

@Component({
  selector: 'app-help-article',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
  templateUrl: './help-article.component.html'
})
export class HelpArticleComponent implements OnInit {
  private route = inject(ActivatedRoute);

  article: any = {};

  // Mock database of articles
  private articlesDB: any = {
    'getting-started': {
      title: 'Getting Started with JobTracker',
      category: 'Basics',
      icon: 'bi bi-rocket-takeoff',
      content: `
        <p id="intro">Welcome to JobTracker! Our platform is designed to take the stress out of your job search by centralizing all your applications in one high-performance dashboard.</p>

        <h5 class="fw-bold text-dark mt-4" id="steps">1. Create your first application</h5>
        <p>Click the <strong>"Add New"</strong> button in the navbar. Fill in the company name, job title, and location. Don't worry about being perfect; you can edit these details later.</p>

        <h5 class="fw-bold text-dark mt-4">2. Understand Statuses</h5>
        <ul>
          <li><strong>Applied:</strong> You've sent your CV but haven't heard back.</li>
          <li><strong>Interview:</strong> You've secured a meeting!</li>
          <li><strong>Offer:</strong> Congratulations! Use the notes to compare packages.</li>
        </ul>

        <h5 class="fw-bold text-dark mt-4" id="tips">Pro Tip</h5>
        <p class="bg-warning bg-opacity-10 p-3 rounded border-start border-warning border-4">
          Always add the <strong>Job Posting Link</strong> in the notes field. Recruiters often take down postings once they start interviewing, and you'll want to refer back to the requirements!
        </p>
      `
    },
    'managing-pipeline': {
      title: 'Managing your Pipeline',
      category: 'Workflow',
      icon: 'bi bi-kanban',
      content: `<p>Detailed guide on managing your job search workflow...</p>`
    }
  };

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.article = this.articlesDB[slug || 'getting-started'] || this.articlesDB['getting-started'];
  }
}
