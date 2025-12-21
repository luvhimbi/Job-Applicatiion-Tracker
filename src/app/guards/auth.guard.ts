import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
;
import { map, switchMap } from 'rxjs/operators';
import {AuthService} from '../services/auth.service';

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authReady$.pipe(
    switchMap(() => authService.userProfile$),
    map(user => {
      if (!user) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};
