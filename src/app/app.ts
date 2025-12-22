import { Component, inject, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouterOutlet } from '@angular/router';

import {NavbarComponent} from './navbar.component/navbar.component';
import {FooterComponent} from './footer.component/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterOutlet],
  templateUrl: './app.html'
})
export class App implements OnInit {
  private router = inject(Router);
  isPageLoading = false;

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isPageLoading = true;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        // We use a small timeout to prevent "flickering" on very fast transitions
        setTimeout(() => {
          this.isPageLoading = false;
        }, 400);
      }
    });
  }
}
