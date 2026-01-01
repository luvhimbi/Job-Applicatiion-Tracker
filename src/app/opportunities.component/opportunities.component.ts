import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpportunityService} from '../services/opportunity.service';
import {Opportunity} from '../models/opportunity.model';
import { ExternalLinkService } from '../services/external-link.service';

@Component({
  selector: 'app-opportunities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './opportunities.component.html',
  styleUrls: ['./opportunities.component.css']
})
export class OpportunitiesComponent implements OnInit {
  private oppService = inject(OpportunityService);
  private externalLinkService = inject(ExternalLinkService);

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

  openExternalLink(url: string, title?: string, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    this.externalLinkService.requestConfirmation(
      url,
      title || 'Leaving JobTracker',
      'You are about to visit an external website to view this opportunity.'
    ).subscribe(proceed => {
      if (proceed && url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  }
}
