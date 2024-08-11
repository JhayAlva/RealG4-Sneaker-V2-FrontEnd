import { AfterViewInit, Component, OnInit, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TiendaService } from '../../services/tienda.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, switchMap, tap } from 'rxjs';
import { IProducto } from '../../interfaces/producto.interface';
import { AuthStatus } from '../../../auth/interfaces/auth-response.enum';
import { AuthService } from '../../../auth/services/auth.service';
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
  public selectedImageIndex = 1;
  public producto= toSignal(
    this.route.params.pipe(
      switchMap(({id})=>this.tiendaSvc.getProductoById(id)),
      tap(producto=>{
        this.getSizeAndPrice(producto)
      })
    )
  );

  constructor(private authSvc:AuthService){}

  getSizeAndPrice(producto:IProducto){
    if (producto.variaciones && producto.variaciones.length > 0) {
      const primeraVariacion = producto.variaciones[0];
      this.selectedSize = primeraVariacion.talla;
      this.selectedPrice = primeraVariacion.precio;
    }else{
      this.selectedPrice = producto.precioRetail
    }
  }

  onSliderChange(event: any): void {
    console.log('Nuevo valor del deslizador:', event.value);
    this.selectedImageIndex = event.value;
    console.log('Índice de la imagen seleccionada:', this.selectedImageIndex);
  }

}
