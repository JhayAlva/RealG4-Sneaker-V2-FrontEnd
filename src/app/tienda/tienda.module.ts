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

@NgModule({
  declarations: [
    TiendaLayoutComponent,
    HomePageComponent,
    CarouselComponent,
    CarouselProductosComponent,
    SearchBarComponent,
    MostrarProductoPageComponent,
    MostrarCategoriasComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    FormsModule,
    TiendaRoutingModule
  ]
})
export class TiendaModule { }
