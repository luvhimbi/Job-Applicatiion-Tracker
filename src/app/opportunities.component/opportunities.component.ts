import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpportunityService, Opportunity } from '../services/opportunity.service';

@Component({
  selector: 'app-opportunities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './opportunities.component.html',
  styleUrls: ['./opportunities.component.css']
})
export class OpportunitiesComponent implements OnInit {
  private oppService = inject(OpportunityService);

  // State
  activeTab = signal<string>('all');
  allOpportunities = signal<Opportunity[]>([]);
  isLoading = signal<boolean>(true);

  // Computed filter logic
  filteredOpportunities = computed(() => {
    const type = this.activeTab();
    const data = this.allOpportunities();
    if (type === 'all') return data;
    return data.filter(op => op.type.toLowerCase() === type);
  });

  ngOnInit() {
    this.oppService.getOpportunities().subscribe(data => {
      this.allOpportunities.set(data);
      this.isLoading.set(false);
    });
  }

  setTab(tab: string) {
    this.activeTab.set(tab);
  }
}
