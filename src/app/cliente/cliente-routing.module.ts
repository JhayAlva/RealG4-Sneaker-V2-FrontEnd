import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelClienteComponent } from './pages/panel-cliente/panel-cliente.component';

const routes: Routes = [
  { path:'panel-usuario', component:PanelClienteComponent },
  { path:'**',redirectTo:'panel-usuario' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule { }
