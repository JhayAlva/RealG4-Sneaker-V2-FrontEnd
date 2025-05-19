import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelClienteComponent } from './pages/panel-cliente/panel-cliente.component';
import { LayoutClienteComponent } from './layout/layout-cliente/layout-cliente.component';

const routes: Routes = [
  {path:'',component:LayoutClienteComponent,
   children:[
    { path:'panel-usuario', component:PanelClienteComponent },
    { path:'**',redirectTo:'panel-usuario' }
   ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule { }
