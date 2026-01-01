import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalLinkService, ExternalLinkConfirmation } from '../services/external-link.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-external-link-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './external-link-modal.component.html',
  styleUrls: ['./external-link-modal.component.css']
})
export class ExternalLinkModalComponent implements OnInit, OnDestroy {
  private externalLinkService = inject(ExternalLinkService);
  private subscription?: Subscription;

  showModal = false;
  currentUrl = '';
  title = '';
  description = '';

  ngOnInit() {
    this.subscription = this.externalLinkService.getConfirmationRequests().subscribe(
      (confirmation: ExternalLinkConfirmation) => {
        this.currentUrl = confirmation.url;
        this.title = confirmation.title || 'Leaving JobTracker';
        this.description = confirmation.description || 'You are about to leave JobTracker and visit an external website.';
        this.showModal = true;
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
      }
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    document.body.style.overflow = '';
  }

  proceed() {
    this.externalLinkService.respond(true);
    this.close();
  }

  cancel() {
    this.externalLinkService.respond(false);
    this.close();
  }

  private close() {
    this.showModal = false;
    document.body.style.overflow = '';
    this.currentUrl = '';
    this.title = '';
    this.description = '';
  }

  proceedAndClose() {
    this.proceed();
  }
}

