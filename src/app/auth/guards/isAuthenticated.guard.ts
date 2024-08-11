import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces/auth-response.enum';
import { inject } from '@angular/core';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authSvc = inject(AuthService);
  const router=inject(Router);
  if( authSvc.estadoUsuario() === AuthStatus.authenticated) return true;
  // if( authSvc.estadoUsuario() === AuthStatus.checking) return false;

  // const url = state.url;
  // localStorage.setItem('path',url);
  router.navigateByUrl('/auth/login');
  return false;
};
