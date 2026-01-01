import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar.component/navbar.component';
import { JobSource } from '../models/job-source.model';
import { JobApplicationService } from '../services/job-application.service';
import { ExternalLinkService } from '../services/external-link.service';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-job-discovery',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './job-discovery.component.html',
  styleUrls: ['./job-discovery.component.css']
})
export class JobDiscoveryComponent implements OnInit {
  private jobService = inject(JobApplicationService);
  private externalLinkService = inject(ExternalLinkService);

  categories = ['All', 'General', 'Tech', 'Remote', 'Design', 'Finance', 'Health'];

  // State Subjects
  private filterSubject = new BehaviorSubject<string>('All');
  private searchSubject = new BehaviorSubject<string>('');
  private pageSubject = new BehaviorSubject<number>(1);

  selectedCategory$ = this.filterSubject.asObservable();
  searchTerm$ = this.searchSubject.asObservable();
  currentPage$ = this.pageSubject.asObservable();

  pageSize = 6;
  filteredSources$: Observable<JobSource[]> | undefined;
  totalItems = 0;

  ngOnInit() {
    const allSources$ = this.jobService.getDiscoverySources();

    this.filteredSources$ = combineLatest([
      allSources$,
      this.selectedCategory$,
      this.searchTerm$,
      this.currentPage$
    ]).pipe(
      map(([sources, category, search, page]) => {
        // 1. Filter by Category and Search Term
        const processed = sources.filter(s => {
          const matchesCat = category === 'All' || s.category === category;
          const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.description.toLowerCase().includes(search.toLowerCase());
          return matchesCat && matchesSearch;
        });

        this.totalItems = processed.length;

        // 2. Apply Pagination (Slice the array)
        const start = (page - 1) * this.pageSize;
        return processed.slice(start, start + this.pageSize);
      })
    );
  }

  setFilter(category: string) {
    this.filterSubject.next(category);
    this.pageSubject.next(1); // Reset to page 1 on filter change
  }

  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchSubject.next(val);
    this.pageSubject.next(1); // Reset to page 1 on search
  }

  setPage(page: number) {
    this.pageSubject.next(page);
    window.scrollTo(0, 0); // Scroll to top when changing page
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
  prevPage() {
    const current = this.pageSubject.value; // Access the current value of the BehaviorSubject
    if (current > 1) {
      this.setPage(current - 1);
    }
  }

  nextPage() {
    const current = this.pageSubject.value;
    if (current < this.totalPages) {
      this.setPage(current + 1);
    }
  }
  openSource(url: string, sourceName?: string) {
    this.externalLinkService.requestConfirmation(
      url,
      'Leaving JobTracker',
      sourceName ? `You are about to visit ${sourceName} to explore job opportunities.` : 'You are about to visit an external website to explore job opportunities.'
    ).subscribe(proceed => {
      if (proceed && url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  }
}
