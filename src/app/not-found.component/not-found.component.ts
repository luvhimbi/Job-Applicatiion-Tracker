import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './not-found.component.html',
  styles: [`
    .error-code {
      font-size: 8rem;
      font-weight: 800;
      line-height: 1;
      background: linear-gradient(to right, #212529, #6c757d);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  `]
})
export class NotFoundComponent {
  private authService = inject(AuthService);
  
  isLoggedIn$: Observable<boolean> = this.authService.userProfile$.pipe(
    map(user => !!user)
  );
}
