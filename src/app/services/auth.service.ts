import { Injectable, inject } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  docData,
  updateDoc
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
}
