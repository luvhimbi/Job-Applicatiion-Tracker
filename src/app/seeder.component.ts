import { Component, inject } from '@angular/core';
import {Opportunity, OpportunityService} from './services/opportunity.service';


@Component({
  selector: 'app-seeder',
  standalone: true,
  template: `
    <div class="p-5 text-center">
      <button (click)="seedDatabase()" class="btn btn-primary">
        Seed Firebase Data
      </button>
      <p class="mt-2 small text-muted">Check console for progress</p>
    </div>
  `
})
export class SeederComponent {
  private oppService = inject(OpportunityService);

  private seedData: Opportunity[] = [
    { company: 'Geeks4learning', title: 'Software', type: 'Learnership', description: 'Combined work-study program for high-potential youth.', window: 'All year around', link: 'https://fnb.co.za/careers' }
  ];

  async seedDatabase() {
    console.log('Starting seed...');
    for (const op of this.seedData) {
      await this.oppService.addOpportunity(op);
      console.log(`Added: ${op.company}`);
    }
    alert('Firebase has been seeded successfully!');
  }
}
