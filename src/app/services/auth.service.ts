import { Injectable, inject } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  deleteUser, sendEmailVerification, sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  docData,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  deleteDoc,
  serverTimestamp
} from '@angular/fire/firestore';
import { Observable, of, from, firstValueFrom } from 'rxjs';
import { switchMap, shareReplay, take, map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly firestore = inject(Firestore);

  /**
   * 🔑 Authentication State Ready
   * Used in guards/resolvers to wait for Firebase to initialize.
   */
  readonly authReady$: Observable<void> = from(this.auth.authStateReady());

  /**
   * ✅ User Profile Stream
   * Combines Auth state with Firestore data.
   */
  readonly userProfile$: Observable<User | null> = authState(this.auth).pipe(
    switchMap((fUser) => {
      if (!fUser) return of(null);
      const userRef = doc(this.firestore, 'users', fUser.uid);
      // Use docData with idField to ensure the UID is always part of the object
      return docData(userRef) as Observable<User>;
    }),
    shareReplay(1) // Prevents multiple Firestore subscriptions
  );

  /**
   * ⚡ Helper to check login status
   */
  readonly isAuthenticated$: Observable<boolean> = this.userProfile$.pipe(
    map(user => !!user)
  );

  /* ================= AUTH ACTIONS ================= */

  async register(email: string, password: string, displayName: string): Promise<void> {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);

      const userDoc: User = {
        uid: credential.user.uid,
        email: email.toLowerCase().trim(),
        displayName: displayName.trim(),
        // Use serverTimestamp for better consistency across timezones
        createdAt: new Date()
      };

      const userRef = doc(this.firestore, 'users', credential.user.uid);
      await setDoc(userRef, userDoc);
    } catch (error) {
      this.handleError(error);
    }
  }

  async login(email: string, password: string) {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  async updateProfile(newName: string): Promise<void> {
    const user = await firstValueFrom(this.userProfile$.pipe(take(1)));
    if (!user) throw new Error('No authenticated user');

    const userRef = doc(this.firestore, 'users', user.uid);
    await updateDoc(userRef, { displayName: newName.trim() });
  }

  async deleteAccount(): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('No authenticated user found.');

    const uid = currentUser.uid;

    try {
      // 1. Batch delete all user data (Scalable approach)
      await this.deleteAllUserApplications(uid);

      // 2. Delete Firestore Profile
      const userRef = doc(this.firestore, 'users', uid);
      await deleteDoc(userRef);

      // 3. Delete Auth User
      await deleteUser(currentUser);
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        throw new Error('Security: Please log in again before deleting your account.');
      }
      this.handleError(error);
    }
  }

  /* ================= PRIVATE HELPERS ================= */

  /**
   * Internal helper to clean up sub-collections via batches
   */
  private async deleteAllUserApplications(uid: string): Promise<void> {
    const appsRef = collection(this.firestore, 'applications');
    const q = query(appsRef, where('userId', '==', uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return;

    const batch = writeBatch(this.firestore);
    querySnapshot.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      this.handleError(error);
    }
  }

  async verifyEmail() {
    const user = this.auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
    }
  }

  private handleError(error: any): never {
    console.error('AuthService Error:', error);
    // You could integrate a Toast Service here
    throw error;
  }
  async sendResetEmail(email: string): Promise<void> {
    try {
      // The second argument is optional ActionCodeSettings if you wanted
      // to force a specific redirect URL via code, but it's better
      // to set it in the Firebase Console Templates.
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      this.handleError(error);
    }
  }
}
