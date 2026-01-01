import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ExternalLinkConfirmation {
  url: string;
  title?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExternalLinkService {
  private confirmationSubject = new Subject<ExternalLinkConfirmation>();
  private responseSubject = new Subject<boolean>();

  /**
   * Request confirmation before opening an external link
   */
  requestConfirmation(url: string, title?: string, description?: string): Observable<boolean> {
    // Create a new subject for this specific request
    const responseSubject = new Subject<boolean>();
    
    // Show the modal
    this.confirmationSubject.next({ url, title, description });
    
    // Return the response observable
    return new Observable(observer => {
      const subscription = this.responseSubject.subscribe(proceed => {
        observer.next(proceed);
        observer.complete();
        subscription.unsubscribe();
      });
    });
  }

  /**
   * Get confirmation requests
   */
  getConfirmationRequests(): Observable<ExternalLinkConfirmation> {
    return this.confirmationSubject.asObservable();
  }

  /**
   * Respond to confirmation (true = proceed, false = cancel)
   */
  respond(proceed: boolean): void {
    this.responseSubject.next(proceed);
  }
}

