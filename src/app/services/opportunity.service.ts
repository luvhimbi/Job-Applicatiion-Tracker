import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {Opportunity} from '../models/opportunity.model';


@Injectable({
  providedIn: 'root'
})
export class OpportunityService {
  private firestore = inject(Firestore);
  private oppCollection = collection(this.firestore, 'opportunities');

  // Get all opportunities sorted by newest first
  getOpportunities(): Observable<Opportunity[]> {
    const q = query(this.oppCollection, orderBy('company', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Opportunity[]>;
  }

  // Used by the Seeder to push data
  async addOpportunity(op: Opportunity) {
    return addDoc(this.oppCollection, {
      ...op,
      createdAt: new Date()
    });
  }
}
