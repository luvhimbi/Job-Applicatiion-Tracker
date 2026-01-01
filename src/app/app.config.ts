import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp as initApp, provideFirebaseApp as provideApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { browserLocalPersistence, getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

// 1. Import App Check modules
import { provideAppCheck, initializeAppCheck, ReCaptchaV3Provider } from '@angular/fire/app-check';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // Firebase App Initialization
    provideApp(() => initApp(environment.firebase)),

    // 2. App Check Configuration for reCAPTCHA v3
    provideAppCheck(() => {
      // Enable Debug Provider for local development
      if (typeof self !== 'undefined' && (location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
        (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
      }

      // Using ReCaptchaV3Provider with your site key from environment
      const provider = new ReCaptchaV3Provider(environment.recaptchaSiteKey);

      return initializeAppCheck(undefined, {
        provider,
        isTokenAutoRefreshEnabled: true
      });
    }),

    provideAuth(() => {
      const auth = getAuth();
      auth.setPersistence(browserLocalPersistence);
      return auth;
    }),

    provideFirestore(() => getFirestore()),
  ]
};
