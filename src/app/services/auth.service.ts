import { Injectable, inject } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword, deleteUser,
  signInWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  docData,
  updateDoc, collection, query, where, getDocs, writeBatch, deleteDoc
} from '@angular/fire/firestore';
import { Observable, of, from } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  /**
   * 🔑 CRITICAL
   * Resolves ONLY when Firebase finishes restoring the session
   */
  readonly authReady$: Observable<void> =
    from(this.auth.authStateReady());

  /**
   * ✅ Cached user profile
   * Emits AFTER auth hydration
   */
  readonly userProfile$: Observable<User | null> = authState(this.auth).pipe(
    switchMap(fUser => {
      if (!fUser) return of(null);

      const userRef = doc(this.firestore, 'users', fUser.uid);
      return docData(userRef) as Observable<User>;
    }),
    shareReplay(1)
  );

  /* ================= AUTH ACTIONS ================= */

  async register(
    email: string,
    password: string,
    displayName: string
  ): Promise<void> {

    const credential =
      await createUserWithEmailAndPassword(this.auth, email, password);

    if (!credential.user) {
      throw new Error('User creation failed');
    }

    const userDoc: User = {
      uid: credential.user.uid,
      email: email.toLowerCase(),
      displayName,
      createdAt: new Date()
    };

    const userRef =
      doc(this.firestore, 'users', credential.user.uid);

    await setDoc(userRef, userDoc);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  async updateProfile(newName: string): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    const userRef =
      doc(this.firestore, 'users', currentUser.uid);

    await updateDoc(userRef, { displayName: newName });
  }

  async deleteAccount(): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('No authenticated user found.');

    const uid = currentUser.uid;

    try {
      // 1. Delete all user's job applications first
      const appsRef = collection(this.firestore, 'applications');
      const q = query(appsRef, where('userId', '==', uid));
      const querySnapshot = await getDocs(q);

      const batch = writeBatch(this.firestore);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      // 2. Delete the user profile document
      const userRef = doc(this.firestore, 'users', uid);
      await deleteDoc(userRef);

      // 3. Delete the Firebase Auth user
      // Note: Firebase may require "Recent Login" to perform this.
      // If it fails, the user needs to log in again and retry.
      await deleteUser(currentUser);

    } catch (error: any) {
      console.error('Delete Account Error:', error);
      if (error.code === 'auth/requires-recent-login') {
        throw new Error('For security reasons, please log in again before deleting your account.');
      }
      throw error;
    }
  }
}
