import { Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import {CareerService} from './services/career.service';
import {CareerRole} from './models/carear-path.model';

@Component({
  selector: 'app-seed-careers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-5 text-center">
      <button (click)="runSeeder()" [disabled]="isSeeding" class="btn btn-dark">
        {{ isSeeding ? 'Populating Careers...' : 'Seed Career Intelligence Data' }}
      </button>
      <p class="mt-3 text-muted">{{ message }}</p>
    </div>
  `
})
export class SeedCareersComponent {
  private careerService = inject(CareerService);
  isSeeding = false;
  message = '';

  private saCareerData: CareerRole[] = [
    // 1. FULL STACK DEVELOPER
    {
      id: 'full-stack-developer',
      title: 'Full-Stack Developer',
      industry: 'Tech',
      salaryRange: 'R450,000 - R950,000',
      description: 'Building end-to-end web applications for retail and financial platforms.',
      whoShouldApply: ['Problem solvers who enjoy both UI design and server logic.', 'Graduates with a CS degree or self-taught devs.', 'Ideal for firms like Takealot, Luno, or OfferZen.'],
      dayInLife: 'Morning stand-ups, coding new features in Angular/React, and managing APIs in Node.js or .NET.',
      skillsNeeded: ['Angular/React', 'Node.js/.NET', 'SQL', 'Git', 'Cloud Fundamentals']
    },
    // 2. BUSINESS ANALYST
    {
      id: 'business-analyst-banking',
      title: 'Business Analyst (Banking)',
      industry: 'Finance',
      salaryRange: 'R500,000 - R850,000',
      description: 'Translating complex banking business needs into technical requirements.',
      whoShouldApply: ['Excellent communicators who bridge business and IT.', 'Individuals with strong analytical skills.', 'Ideal for Fintech space at FNB or Standard Bank.'],
      dayInLife: 'Facilitating workshops with stakeholders and documenting system requirements (User Stories).',
      skillsNeeded: ['SQL', 'Jira', 'Process Mapping (BPMN)', 'Stakeholder Management']
    },
    // 3. DATA SCIENTIST
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      industry: 'Data',
      salaryRange: 'R600,000 - R1,200,000',
      description: 'Using machine learning to predict customer behavior and credit risk.',
      whoShouldApply: ['Math-heavy backgrounds (Stats, Actuarial Science).', 'People who find patterns in massive datasets.', 'Crucial for Discovery or Capitec for credit scoring.'],
      dayInLife: 'Cleaning datasets, building predictive models in Python, and visualizing findings for executives.',
      skillsNeeded: ['Python', 'Machine Learning', 'Statistics', 'PowerBI/Tableau']
    },
    // 4. CLOUD ENGINEER (Infrastructure)
    {
      id: 'cloud-engineer',
      title: 'Cloud Engineer',
      industry: 'Tech',
      salaryRange: 'R550,000 - R1,100,000',
      description: 'Designing and managing cloud infrastructure on AWS, Azure, or Google Cloud.',
      whoShouldApply: ['Engineers who prefer automation over manual server management.', 'People interested in high-scale system reliability.'],
      dayInLife: 'Managing CI/CD pipelines, scaling server clusters, and ensuring security protocols are met.',
      skillsNeeded: ['AWS/Azure', 'Terraform', 'Docker', 'Kubernetes', 'Linux']
    },
    // 5. UX/UI DESIGNER
    {
      id: 'ux-ui-designer',
      title: 'UX/UI Designer',
      industry: 'Tech',
      salaryRange: 'R350,000 - R750,000',
      description: 'Designing intuitive digital experiences for web and mobile apps.',
      whoShouldApply: ['Creative thinkers with an eye for detail.', 'People obsessed with how users interact with technology.'],
      dayInLife: 'Creating wireframes, conducting user testing sessions, and building high-fidelity prototypes.',
      skillsNeeded: ['Figma/Adobe XD', 'User Research', 'Prototyping', 'Visual Design']
    },
    // 6. CYBERSECURITY ANALYST
    {
      id: 'cybersecurity-analyst',
      title: 'Cybersecurity Analyst',
      industry: 'Finance',
      salaryRange: 'R500,000 - R1,000,000',
      description: 'Protecting corporate networks and sensitive financial data from breaches.',
      whoShouldApply: ['Detail-oriented people who enjoy "playing detective".', 'Those interested in digital ethics and defense.'],
      dayInLife: 'Monitoring network traffic for threats, performing vulnerability scans, and responding to incidents.',
      skillsNeeded: ['Network Security', 'Ethical Hacking', 'SIEM Tools', 'Compliance']
    },
    // 7. PRODUCT MANAGER
    {
      id: 'product-manager',
      title: 'Product Manager',
      industry: 'Retail',
      salaryRange: 'R600,000 - R1,150,000',
      description: 'Leading the strategy and roadmap for a digital product or service.',
      whoShouldApply: ['Natural leaders who can prioritize competing tasks.', 'People who want to own the "Why" behind a product.'],
      dayInLife: 'Defining product features, analyzing market trends, and collaborating with engineering teams.',
      skillsNeeded: ['Agile/Scrum', 'Market Research', 'Roadmapping', 'Data Analytics']
    },
    // 8. DEVOPS ENGINEER
    {
      id: 'devops-engineer',
      title: 'DevOps Engineer',
      industry: 'Tech',
      salaryRange: 'R650,000 - R1,200,000',
      description: 'Bridging the gap between software development and IT operations.',
      whoShouldApply: ['Software engineers who love the "Ops" side of things.', 'People who enjoy automating repetitive tasks.'],
      dayInLife: 'Building automated deployment scripts and improving system observability.',
      skillsNeeded: ['Jenkins', 'Python/Bash', 'Ansible', 'Monitoring Tools']
    },
    // 9. FINANCIAL ACCOUNTANT
    {
      id: 'financial-accountant',
      title: 'Financial Accountant',
      industry: 'Finance',
      salaryRange: 'R400,000 - R750,000',
      description: 'Managing financial records, tax compliance, and financial reporting.',
      whoShouldApply: ['Highly organized individuals with a BCom degree.', 'People who enjoy working with numbers and regulations.'],
      dayInLife: 'Preparing balance sheets, reconciling bank statements, and assisting with audits.',
      skillsNeeded: ['IFRS', 'Excel/SAP', 'Taxation', 'Auditing']
    },
    // 10. QA AUTOMATION ENGINEER
    {
      id: 'qa-automation-engineer',
      title: 'QA Automation Engineer',
      industry: 'Tech',
      salaryRange: 'R400,000 - R800,000',
      description: 'Ensuring software quality through automated testing scripts.',
      whoShouldApply: ['People who are good at "breaking" things to fix them.', 'Those who want to code but focus on quality assurance.'],
      dayInLife: 'Writing Selenium or Playwright scripts and performing regression testing.',
      skillsNeeded: ['Selenium', 'Java/JavaScript', 'Testing Frameworks', 'API Testing']
    },
    // 11. E-COMMERCE MANAGER
    {
      id: 'ecommerce-manager',
      title: 'E-Commerce Manager',
      industry: 'Retail',
      salaryRange: 'R450,000 - R900,000',
      description: 'Driving sales and optimizing user journeys for online stores.',
      whoShouldApply: ['Marketers with a technical edge.', 'People who enjoy retail dynamics in the digital age.'],
      dayInLife: 'Analyzing conversion rates, managing product listings, and optimizing SEO.',
      skillsNeeded: ['Google Analytics', 'SEO/SEM', 'Conversion Optimization', 'CMS Management']
    },
    // 12. SYSTEMS ARCHITECT
    {
      id: 'systems-architect',
      title: 'Systems Architect',
      industry: 'Tech',
      salaryRange: 'R900,000 - R1,600,000',
      description: 'Designing high-level structures for complex software systems.',
      whoShouldApply: ['Experienced developers looking to move into high-level design.', 'Strategic thinkers who understand system trade-offs.'],
      dayInLife: 'Drafting architectural blueprints, choosing tech stacks, and mentoring senior devs.',
      skillsNeeded: ['System Design', 'Microservices', 'Enterprise Patterns', 'Leadership']
    }
  ];

  async runSeeder() {
    this.isSeeding = true;
    try {
      for (const role of this.saCareerData) {
        await this.careerService.seedRole(role);
      }
      this.message = 'Successfully seeded Career Intelligence!';
    } catch (e) {
      this.message = 'Error seeding data.';
    } finally {
      this.isSeeding = false;
    }
  }
}
