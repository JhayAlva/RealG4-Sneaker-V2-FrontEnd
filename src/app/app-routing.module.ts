import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isNotAuthenticatedGuard } from './auth/guards/isNotAuthenticated.guard';
import { isAuthenticatedGuard } from './auth/guards/isAuthenticated.guard';

const routes: Routes = [
  {
    path:'auth',
    canActivate:[isNotAuthenticatedGuard],
    loadChildren:()=>import('./auth/auth.module').then(a=>a.AuthModule)
  },
  {
    path:'es-Es',
    loadChildren:()=>import('./tienda/tienda.module').then(t=>t.TiendaModule)
  },
  {
    path:'cliente',
    loadChildren:()=>import('./cliente/cliente.module').then(c=>c.ClienteModule)
  },
  {
    path:'**',
    redirectTo:'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
