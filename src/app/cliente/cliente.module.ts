import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
(mapboxgl as any).accessToken  = environment.apiKey;

import { ClienteRoutingModule } from './cliente-routing.module';
import { PanelClienteComponent } from './pages/panel-cliente/panel-cliente.component';
import { MisComprasComponent } from './components/mis-compras/mis-compras.component';
import { MisDatosComponent } from './components/mis-datos/mis-datos.component';
import { MisOpinionesComponent } from './components/mis-opiniones/mis-opiniones.component';
import { MisDireccionesComponent } from './components/mis-direcciones/mis-direcciones.component';
import { MisFavoritosComponent } from './components/mis-favoritos/mis-favoritos.component';
import { PrimengModule } from '../primeng/primeng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalDireccionComponent } from './components/modal-direccion/modal-direccion.component';
import { MiniDireccionComponent } from './components/mini-direccion/mini-direccion.component';
import { LayoutClienteComponent } from './layout/layout-cliente/layout-cliente.component';
import { MiniMapComponent } from './components/mini-map/mini-map.component';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environments';
import { ResultBarComponent } from './components/result-bar/result-bar.component';


@NgModule({
  declarations: [
    PanelClienteComponent,
    MisComprasComponent,
    MisDatosComponent,
    MisOpinionesComponent,
    MisDireccionesComponent,
    MisFavoritosComponent,
    ModalDireccionComponent,
    MiniDireccionComponent,
    LayoutClienteComponent,
    MiniMapComponent,
    ResultBarComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClienteRoutingModule,
    PrimengModule
  ]
})
export class ClienteModule { }
