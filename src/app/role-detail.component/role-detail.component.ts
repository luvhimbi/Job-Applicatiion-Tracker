import {Component, inject} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CareerService} from '../services/career.service';
import {CareerRole} from '../models/carear-path.model';
import {NgForOf, NgIf} from '@angular/common';
import {NavbarComponent} from '../navbar.component/navbar.component';

@Component({
  selector: 'app-role-detail.component',
  imports: [
    RouterLink,
    NgIf,
    NgForOf,
    NavbarComponent
  ],
  templateUrl: './role-detail.component.html',
  styleUrl: './role-detail.component.css',
})
export class RoleDetailComponent {
  private route = inject(ActivatedRoute);
  private careerService = inject(CareerService);

  selectedRole: CareerRole | null = null;
  loading = true;

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.selectedRole = await this.careerService.getRoleById(id);
      this.loading = false;
    }
  }
}
