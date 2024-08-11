import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroPageComponent } from './pages/registro-page/registro-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { PrimengModule } from '../primeng/primeng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PanelClienteComponent } from './pages/panel-cliente/panel-cliente.component';


@NgModule({
  declarations: [
    AuthLayoutComponent,
    RegistroPageComponent,
    LoginPageComponent,
    PanelClienteComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    ReactiveFormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
