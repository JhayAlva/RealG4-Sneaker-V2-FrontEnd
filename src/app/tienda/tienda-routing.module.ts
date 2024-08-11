import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TiendaLayoutComponent } from './layouts/tienda-layout.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { MostrarProductoPageComponent } from './pages/mostrar-producto-page/mostrar-producto-page.component';
import { MostrarCategoriasComponent } from './pages/mostrar-categorias/mostrar-categorias.component';

  const routes:Routes=[
    {
      path:'',
      component:TiendaLayoutComponent,
      children:[
        {path:'home',component:HomePageComponent},
        {path:'mostrar-producto/:id',component:MostrarProductoPageComponent},
        {path:'productos/:path',component:MostrarCategoriasComponent},
        {path:'**',redirectTo:'home'}
      ]
    }
  ]

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class TiendaRoutingModule { }
