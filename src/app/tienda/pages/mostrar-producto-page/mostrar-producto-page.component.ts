import { AfterViewInit, Component, OnInit, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TiendaService } from '../../services/tienda.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, switchMap, tap } from 'rxjs';
import { IProducto } from '../../interfaces/producto.interface';
import { AuthStatus } from '../../../auth/interfaces/auth-response.enum';
import { AuthService } from '../../../auth/services/auth.service';
import { PedidoService } from '../../services/pedido.service';
@Component({
  selector: 'app-mostrar-producto-page',
  templateUrl: './mostrar-producto-page.component.html',
  styleUrl: './mostrar-producto-page.component.css'
})
export class MostrarProductoPageComponent{
  public usuario=computed( () => this.authSvc.currentUser());
  private route = inject(ActivatedRoute);
  private tiendaSvc = inject(TiendaService);
  public selectedPrice:number = 0;
  public selectedSize!:String;
  public cantidad:number = 1;
  public selectedImageIndex = 1;
  public isDropdownOpen = false;
  public productoPedido!:IProducto;
  public producto= toSignal(
    this.route.params.pipe(
      switchMap(({id})=>this.tiendaSvc.getProductoById(id)),
      tap(producto=>{
        this.getSizeAndPrice(producto)
        this.productoPedido = producto;
      })
    )
  );

  constructor(private authSvc:AuthService,
              private router:Router,
              private pedidoSvc:PedidoService){}

  getSizeAndPrice(producto:IProducto){
    if (producto.variaciones && producto.variaciones.length > 0) {
      const primeraVariacion = producto.variaciones[0];
      this.selectedSize = primeraVariacion.talla;
      this.selectedPrice = primeraVariacion.precio;
    }else{
      this.selectedPrice = producto.precioRetail
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectSize(size: any,precio:any) {
    this.selectedSize = size;
    this.selectedPrice = precio;
    this.isDropdownOpen = false;
  }

  onSliderChange(event: any): void {

    this.selectedImageIndex = event.value;

  }

  async hacerPedido(idProducto:String){



    this.pedidoSvc.VaciarCesta();
    this.pedidoSvc.añadirItemPedido({ productoItem: this.productoPedido, cantidadItem: this.cantidad }, 'añadir');
    this.router.navigate(['/es-Es/pedido/', idProducto], { queryParams: { talla: this.selectedSize , precio: this.selectedPrice } });
  }

}
