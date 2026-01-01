import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar.component/navbar.component';
import { CareerService } from '../services/career.service';

import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import {CareerRole} from '../models/carear-path.model';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {
  private careerService = inject(CareerService);

  // Filter State
  private searchSubject = new BehaviorSubject<string>('');
  private industrySubject = new BehaviorSubject<string>('All');

  // Industry categories for the filter pills
  industries = ['All', 'Tech', 'Finance', 'Data', 'Retail'];

  filteredRoles$!: Observable<CareerRole[]>;
  currentIndustry$ = this.industrySubject.asObservable();

  ngOnInit() {
    const allRoles$ = this.careerService.getRoles();

    this.filteredRoles$ = combineLatest([
      allRoles$,
      this.searchSubject.asObservable(),
      this.industrySubject.asObservable()
    ]).pipe(
      map(([roles, search, industry]) => {
        return roles.filter(role => {
          const matchesSearch = role.title.toLowerCase().includes(search.toLowerCase()) ||
            role.description.toLowerCase().includes(search.toLowerCase());
          const matchesIndustry = industry === 'All' || role.industry === industry;
          return matchesSearch && matchesIndustry;
        });
      })
    );
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  setIndustry(industry: string) {
    this.industrySubject.next(industry);
  }
}
