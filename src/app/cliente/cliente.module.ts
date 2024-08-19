import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteRoutingModule } from './cliente-routing.module';
import { PanelClienteComponent } from './pages/panel-cliente/panel-cliente.component';
import { MisComprasComponent } from './components/mis-compras/mis-compras.component';
import { MisDatosComponent } from './components/mis-datos/mis-datos.component';
import { MisOpinionesComponent } from './components/mis-opiniones/mis-opiniones.component';
import { MisDireccionesComponent } from './components/mis-direcciones/mis-direcciones.component';
import { MisFavoritosComponent } from './components/mis-favoritos/mis-favoritos.component';
import { PrimengModule } from '../primeng/primeng.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PanelClienteComponent,
    MisComprasComponent,
    MisDatosComponent,
    MisOpinionesComponent,
    MisDireccionesComponent,
    MisFavoritosComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClienteRoutingModule,
    PrimengModule
  ]
})
export class ClienteModule { }
