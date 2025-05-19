import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TiendaRoutingModule } from './tienda-routing.module';
import { PrimengModule } from '../primeng/primeng.module';
import { TiendaLayoutComponent } from './layouts/tienda-layout.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { CarouselProductosComponent } from './components/carousel-productos/carousel-productos.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { MostrarProductoPageComponent } from './pages/mostrar-producto-page/mostrar-producto-page.component';
import { FormsModule } from '@angular/forms';
import { MostrarCategoriasComponent } from './pages/mostrar-categorias/mostrar-categorias.component';
import { InformacionComponent } from './pages/informacion/informacion.component';
import { NoticiasComponent } from './pages/noticias/noticias.component';
import { VerificacionComponent } from './pages/verificacion/verificacion.component';
import { PedidoComponent } from './pages/pedido/pedido.component';
import { MinidetallesPedidoComponent } from './components/minidetalles-pedido/minidetalles-pedido.component';
import { MiniCambiarTallaComponent } from './components/mini-cambiar-talla/mini-cambiar-talla.component';
import { MiniMetodoPagoComponent } from './components/mini-metodo-pago/mini-metodo-pago.component';
import { PedidoFinalizadoComponent } from './pages/pedido-finalizado/pedido-finalizado.component';
import { FilterPrincipalPipe } from './pipes/FilterPrincipal.pipe';

@NgModule({
  declarations: [
    TiendaLayoutComponent,
    HomePageComponent,
    CarouselComponent,
    CarouselProductosComponent,
    SearchBarComponent,
    MostrarProductoPageComponent,
    MostrarCategoriasComponent,
    InformacionComponent,
    NoticiasComponent,
    VerificacionComponent,
    PedidoComponent,
    MinidetallesPedidoComponent,
    MiniCambiarTallaComponent,
    MiniMetodoPagoComponent,
    PedidoFinalizadoComponent,
    FilterPrincipalPipe
  ],
  imports: [
    CommonModule,
    PrimengModule,
    FormsModule,
    TiendaRoutingModule
  ]
})
export class TiendaModule { }
