import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import {CareerRole} from '../models/carear-path.model';


@Injectable({
  providedIn: 'root'
})
export class CareerService {
  private firestore = inject(Firestore);
  private rolesCollection = collection(this.firestore, 'career-paths');

  // Fetch all roles for the directory
  getRoles(): Observable<CareerRole[]> {
    return collectionData(this.rolesCollection, { idField: 'id' }) as Observable<CareerRole[]>;
  }

  // Fetch a single role by its ID
  async getRoleById(id: string): Promise<CareerRole | null> {
    const docRef = doc(this.firestore, 'career-paths', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as CareerRole) : null;
  }

  // Used by the seeder to populate data
  async seedRole(role: CareerRole): Promise<void> {
    const docRef = doc(this.firestore, 'career-paths', role.id);
    return setDoc(docRef, role);
  }
}
