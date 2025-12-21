import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp, setDoc, getDoc
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { JobApplication } from '../models/job-application.model';
import { Observable } from 'rxjs';
import {JobSource} from '../models/job-source.model';

@Injectable({ providedIn: 'root' })
export class JobApplicationService {

  private firestore = inject(Firestore);
  private auth = inject(Auth);

  private get jobsCollection() {
    return collection(this.firestore, 'jobs');
  }

  /* ================= CREATE ================= */

  async create(app: JobApplication): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not logged in');

    await addDoc(this.jobsCollection, {
      companyName: app.companyName,
      jobTitle: app.jobTitle,
      status: app.status ?? 'Applied',
      location: app.location ?? '',
      notes: app.notes ?? '',
      applicationDate: app.applicationDate ?? new Date(),

      // 🔒 NEVER OPTIONAL
      userId: user.uid,
      createdAt: serverTimestamp()
    });
  }

  /* ================= READ ================= */

  getApplications(): Observable<JobApplication[]> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not logged in');

    const q = query(
      this.jobsCollection,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    return collectionData(q, { idField: 'id' }) as Observable<JobApplication[]>;
  }

  /* ================= UPDATE (FIXED) ================= */

  async updateApplication(
    id: string,
    data: Partial<JobApplication>
  ): Promise<void> {

    const docRef = doc(this.firestore, 'jobs', id);

    // 🔥 STRIP undefined values (CRITICAL)
    const safeData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );

    // 🔒 NEVER allow these fields to be touched
    delete (safeData as any).userId;
    delete (safeData as any).createdAt;

    await updateDoc(docRef, safeData);
  }

  /* ================= DELETE ================= */

  async deleteApplication(id: string): Promise<void> {
    const docRef = doc(this.firestore, 'jobs', id);
    await deleteDoc(docRef);
  }

  getDiscoverySources(): Observable<JobSource[]> {
    const discoveryRef = collection(this.firestore, 'discovery');
    return collectionData(discoveryRef) as Observable<JobSource[]>;
  }
  async addDiscoverySource(source: JobSource): Promise<void> {
    // 1. Create a "Slug" from the name (e.g., "Remote OK" -> "remote-ok")
    const slugId = source.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-')  // Replace spaces/underscores with hyphens
      .replace(/^-+|-+$/g, '');  // Trim hyphens from start/end

    // 2. Reference the document using that slug
    const docRef = doc(this.firestore, 'discovery', slugId);

    // 3. Use setDoc. If 'remote-ok' exists, it updates; if not, it creates.
    await setDoc(docRef, source);
  }
  async getById(id: string): Promise<JobApplication | null> {
    const docRef = doc(this.firestore, 'jobs', id);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as JobApplication;
    }
    return null;
  }
}
