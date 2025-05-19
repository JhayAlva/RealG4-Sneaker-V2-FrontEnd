import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TiendaLayoutComponent } from './layouts/tienda-layout.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { MostrarProductoPageComponent } from './pages/mostrar-producto-page/mostrar-producto-page.component';
import { MostrarCategoriasComponent } from './pages/mostrar-categorias/mostrar-categorias.component';
import { NoticiasComponent } from './pages/noticias/noticias.component';
import { InformacionComponent } from './pages/informacion/informacion.component';
import { VerificacionComponent } from './pages/verificacion/verificacion.component';
import { PedidoComponent } from './pages/pedido/pedido.component';
import { PedidoFinalizadoComponent } from './pages/pedido-finalizado/pedido-finalizado.component';

  const routes:Routes=[
    {
      path:'',
      component:TiendaLayoutComponent,
      children:[
        {path:'home',component:HomePageComponent},
        {path:'mostrar-producto/:id',component:MostrarProductoPageComponent},
        {path:'productos/:path',component:MostrarCategoriasComponent},
        {path:'pedido/:id',component:PedidoComponent},
        {path:'pedido-finalizado/:idPedido',component:PedidoFinalizadoComponent},
        {path:'noticias',component:NoticiasComponent},
        {path:'informacion',component:InformacionComponent},
        {path:'verificacion',component:VerificacionComponent},
        {path:'**',redirectTo:'home'}
      ]
    }
  ]

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class TiendaRoutingModule { }
