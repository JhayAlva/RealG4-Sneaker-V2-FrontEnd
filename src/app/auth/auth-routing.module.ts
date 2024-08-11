import { NgModule } from '@angular/core';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component'
import { RegistroPageComponent } from './pages/registro-page/registro-page.component';
import { PanelClienteComponent } from './pages/panel-cliente/panel-cliente.component';


const routes:Routes=[
  {
    path:'',
    component:AuthLayoutComponent,
    children:[
      {path:'login',component:LoginPageComponent},
      {path:'registro',component:RegistroPageComponent},
      {path:'panel-cliente',component:PanelClienteComponent},
      {path:'**',redirectTo:'login'}
    ]
  }
]
@NgModule({
  declarations: [],
  exports:[RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class AuthRoutingModule { }
