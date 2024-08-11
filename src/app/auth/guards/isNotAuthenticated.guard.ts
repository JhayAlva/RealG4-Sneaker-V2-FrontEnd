import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { AuthStatus } from '../interfaces/auth-response.enum';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authSvc = inject(AuthService);
  const router=inject(Router);

  //la del profesor
  if( authSvc.estadoUsuario() === AuthStatus.authenticated){
    router.navigateByUrl('/panel-cliente');
    return false;
  }

  return true;

  //mi solucion
  // if( authSvc.estadoUsuario() === AuthStatus.notAuthenticated) return true;

  // router.navigateByUrl('/dashboard');
  // return false;
};
