import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IProducto } from '../../interfaces/producto.interface';
import { Subscription } from 'rxjs';
import { TiendaService } from '../../services/tienda.service';
import Flickity from 'flickity';

@Component({
  selector: 'tienda-carousel-productos',
  templateUrl: './carousel-productos.component.html',
  styleUrl: './carousel-productos.component.css'
})
export class CarouselProductosComponent implements AfterViewInit, OnDestroy  {

  public productosList:IProducto[]=[];
  public destructionSus$?:Subscription;

  // @ViewChild('carouselProducto', { static: false })
  // public carousel!: ElementRef;
  // public flkty?: Flickity;

  constructor(private tiendaSvc:TiendaService){}

  ngAfterViewInit(): void {
    this.cargarProductos();
  }

  ngOnDestroy(): void {
    this.destructionSus$?.unsubscribe();
  }

  cargarProductos() {
    this.destructionSus$ = this.tiendaSvc.getProductosXNumeroVentas().subscribe(
      resp => {
        this.productosList = resp;
        console.log('Productos recuperados: ', this.productosList);
      });
  }

  // initFlickity() {
  //   console.log('entro aqui');
  //   return this.flkty = new Flickity(this.carousel!.nativeElement, {
  //     cellAlign: 'left',
  //     freeScroll: true,
  //     wrapAround: true,
  //     draggable:true,
  //     prevNextButtons: false,
  //     pageDots: false,
  //   });
  // }

}
