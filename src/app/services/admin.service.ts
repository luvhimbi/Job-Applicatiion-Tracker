import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, deleteDoc, setDoc, addDoc, getDoc } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { User } from '../models/user.model';
import { CareerRole } from '../models/carear-path.model';
import { Opportunity } from '../models/opportunity.model';
import { JobSource } from '../models/job-source.model';

export interface AdminStats {
  totalUsers: number;
  totalCareerPaths: number;
  totalOpportunities: number;
  totalJobSources: number;
  recentUsers: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private firestore = inject(Firestore);

  /**
   * Get all users
   */
  getAllUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'uid' }) as Observable<User[]>;
  }

  /**
   * Get all career paths
   */
  getAllCareerPaths(): Observable<CareerRole[]> {
    const pathsRef = collection(this.firestore, 'career-paths');
    return collectionData(pathsRef, { idField: 'id' }) as Observable<CareerRole[]>;
  }

  /**
   * Get all opportunities
   */
  getAllOpportunities(): Observable<Opportunity[]> {
    const oppsRef = collection(this.firestore, 'opportunities');
    return collectionData(oppsRef, { idField: 'id' }) as Observable<Opportunity[]>;
  }

  /**
   * Get all job sources
   */
  getAllJobSources(): Observable<(JobSource & { id: string })[]> {
    const sourcesRef = collection(this.firestore, 'discovery');
    return collectionData(sourcesRef, { idField: 'id' }) as Observable<(JobSource & { id: string })[]>;
  }

  /**
   * Get admin statistics
   */
  getStats(): Observable<AdminStats> {
    return combineLatest([
      this.getAllUsers().pipe(map(users => users.length)),
      this.getAllCareerPaths().pipe(map(paths => paths.length)),
      this.getAllOpportunities().pipe(map(opps => opps.length)),
      this.getAllJobSources().pipe(map(sources => sources.length)),
      this.getRecentUsers(7).pipe(map(users => users.length))
    ]).pipe(
      map(([totalUsers, totalCareerPaths, totalOpportunities, totalJobSources, recentUsers]) => ({
        totalUsers: totalUsers || 0,
        totalCareerPaths: totalCareerPaths || 0,
        totalOpportunities: totalOpportunities || 0,
        totalJobSources: totalJobSources || 0,
        recentUsers: recentUsers || 0
      }))
    );
  }

  /**
   * Get recent users
   */
  getRecentUsers(days: number = 7): Observable<User[]> {
    const usersRef = collection(this.firestore, 'users');
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return this.getAllUsers().pipe(
      map(users => users.filter(user => {
        const userDate = user.createdAt instanceof Date ? user.createdAt : new Date(user.createdAt);
        return userDate >= cutoffDate;
      }))
    );
  }

  /**
   * Update user role
   */
  async updateUserRole(uid: string, role: 'user' | 'admin'): Promise<void> {
    const userRef = doc(this.firestore, 'users', uid);
    await updateDoc(userRef, { role });
  }

  /**
   * Delete user
   */
  async deleteUser(uid: string): Promise<void> {
    const userRef = doc(this.firestore, 'users', uid);
    await deleteDoc(userRef);
  }

  /* ================= CAREER PATHS MANAGEMENT ================= */

  /**
   * Create career path
   */
  async createCareerPath(path: CareerRole): Promise<void> {
    const pathsRef = collection(this.firestore, 'career-paths');
    await addDoc(pathsRef, path);
  }

  /**
   * Update career path
   */
  async updateCareerPath(id: string, path: Partial<CareerRole>): Promise<void> {
    const pathRef = doc(this.firestore, 'career-paths', id);
    await updateDoc(pathRef, path);
  }

  /**
   * Delete career path
   */
  async deleteCareerPath(id: string): Promise<void> {
    const pathRef = doc(this.firestore, 'career-paths', id);
    await deleteDoc(pathRef);
  }

  /**
   * Get career path by ID
   */
  async getCareerPathById(id: string): Promise<CareerRole | null> {
    const pathRef = doc(this.firestore, 'career-paths', id);
    const snapshot = await getDoc(pathRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as CareerRole;
    }
    return null;
  }

  /* ================= OPPORTUNITIES MANAGEMENT ================= */

  /**
   * Create opportunity
   */
  async createOpportunity(opportunity: Opportunity): Promise<void> {
    const oppsRef = collection(this.firestore, 'opportunities');
    await addDoc(oppsRef, opportunity);
  }

  /**
   * Update opportunity
   */
  async updateOpportunity(id: string, opportunity: Partial<Opportunity>): Promise<void> {
    const oppRef = doc(this.firestore, 'opportunities', id);
    await updateDoc(oppRef, opportunity);
  }

  /**
   * Delete opportunity
   */
  async deleteOpportunity(id: string): Promise<void> {
    const oppRef = doc(this.firestore, 'opportunities', id);
    await deleteDoc(oppRef);
  }

  /**
   * Get opportunity by ID
   */
  async getOpportunityById(id: string): Promise<Opportunity | null> {
    const oppRef = doc(this.firestore, 'opportunities', id);
    const snapshot = await getDoc(oppRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Opportunity;
    }
    return null;
  }

  /* ================= JOB SOURCES MANAGEMENT ================= */

  /**
   * Create job source
   */
  async createJobSource(source: JobSource): Promise<void> {
    const sourcesRef = collection(this.firestore, 'discovery');
    await addDoc(sourcesRef, source);
  }

  /**
   * Update job source
   */
  async updateJobSource(id: string, source: Partial<JobSource>): Promise<void> {
    const sourceRef = doc(this.firestore, 'discovery', id);
    // Remove id from update data if present
    const updateData = { ...source };
    delete (updateData as any).id;
    await updateDoc(sourceRef, updateData);
  }

  /**
   * Delete job source
   */
  async deleteJobSource(id: string): Promise<void> {
    const sourceRef = doc(this.firestore, 'discovery', id);
    await deleteDoc(sourceRef);
  }

  /**
   * Create or update job source (using slug-based ID)
   */
  async saveJobSource(source: JobSource): Promise<void> {
    // Create slug from name (matching the pattern from job-application.service)
    const slugId = source.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const sourceRef = doc(this.firestore, 'discovery', slugId);
    const sourceData = { ...source };
    delete (sourceData as any).id;
    await setDoc(sourceRef, sourceData);
  }

  /**
   * Get job source by ID
   */
  async getJobSourceById(id: string): Promise<JobSource | null> {
    const sourceRef = doc(this.firestore, 'discovery', id);
    const snapshot = await getDoc(sourceRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      return { id: snapshot.id, ...data } as JobSource;
    }
    return null;
  }
}

