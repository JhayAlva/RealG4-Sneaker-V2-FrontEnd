import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TiendaService } from '../../services/tienda.service';
import { IProducto } from '../../interfaces/producto.interface';

@Component({
  selector: 'app-mostrar-categorias',
  templateUrl: './mostrar-categorias.component.html',
  styleUrl: './mostrar-categorias.component.css'
})
export class MostrarCategoriasComponent {
  public listaProductos!:Array<IProducto>[];
  public page:number = 0;
  public rows:number = 6;

  constructor(private acticatedRoute: ActivatedRoute,
              private tiendaSvc:TiendaService){

              this.acticatedRoute.paramMap.subscribe(
                async(parametros:ParamMap)=>{
                  let _pathCategoria = parametros.get('path')!;
                  console.log('La categoria de los productos...', _pathCategoria);
                  await this.tiendaSvc.getProductosByPath(_pathCategoria);
                }
              );
  }

  get isLoadingProductos(){
    return this.tiendaSvc.isLoadingProductos;
  }

  get productosResultado(){
    return this.tiendaSvc.resultProductos;
  }

  onPageChange(event: any) {
    this.page = event.page;
  }

}
