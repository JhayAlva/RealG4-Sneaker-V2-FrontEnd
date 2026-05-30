import { Component, OnInit } from '@angular/core';
import { IDireccion } from '../../../auth/interfaces/direccion.interface';
import { IProducto } from '../../interfaces/producto.interface';
import { map, Observable } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { IDatosPago } from '../../interfaces/datosPago.interface';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.css'
})
export class PedidoComponent implements OnInit {

  public direccionesPrincipales:IDireccion[] = [];
  public metodoDePago!:string;
  public items$!:Observable<Array<{productoItem: IProducto, cantidadItem:number}>>;
  public cambiarModal:string="principal";
  public priceSeleted!:number;
  public tallaSelected!:string;
  public datosPago!:IDatosPago;
  public operacion!:string;
  public idProducto?:string;
  public variacionesA!:Array<any>;

  constructor(private activatedRoute:ActivatedRoute,
              private pedidoSvc:PedidoService){
                this.recuperarDatosUrl();
  }


  async ngOnInit(){
    this.items$ = this.pedidoSvc.GetItemsPedido$();
    this.getVariacionesProductos();
  }


  recuperarDatosUrl(){
    this.activatedRoute
        .paramMap
        .subscribe(
          async(params:ParamMap)=>{
            let _idProducto = params.get('id')

            if (_idProducto !== null) {
              this.idProducto = _idProducto;

          } else {

          }
          }
        );

    this.activatedRoute
        .queryParams
        .subscribe(queryParam=>{
          const _size = queryParam['talla'];
          this.tallaSelected = _size;
        });

    this.activatedRoute
        .queryParams
        .subscribe(queryParam=>{
          const _price = queryParam['precio'];
          this.priceSeleted = _price;
        })
  }

  getVariacionesProductos(){
    this.items$.pipe(
      map((items: any[]) => {
        // Utiliza el operador map para extraer las variaciones de cada elemento
        this.variacionesA = items.map(item => item.productoItem.variaciones);
      })
    ).subscribe(() => {
      // En este punto, variaciones contendrá un array de arrays de variaciones

    });


  }


  ModificarTalla(event:{ precio: number; talla: string }):any{
    let precioActualizado = event.precio;
    let tallaActualizado = event.talla;

    this.priceSeleted = precioActualizado;
    this.tallaSelected = tallaActualizado;
    this.cambiarModal = "principal";
  }

  CambiarModalEvent(valor:string):any{
    this.cambiarModal = valor.valueOf();

  }

  MetodoPago(metodo:string){
    this.metodoDePago = metodo.valueOf();

  }

  GetDatosPago(datos:IDatosPago){
    this.datosPago = datos;
  }

  public async OperarDireccion(datos:[IDireccion,String]) {


    if (datos[1]=='modificar') {
        //abrir modal para modificar...pasandole datos direccion a modificar  OJO!!! CON EL ORDEN EN
        //Q PASAS LAS VARIABLES PUBLICAS DEL MODAL, 1º EL OBJETO DIRECCION Y DESPUES LA OPERACION, SINO TE SALDRA UNDEFINNED...
        // this.direccionModi=datos[0];
        this.operacion='modificar';

        this.cambiarModal= "direccion";

    } else {
      //

    }
  }

}
