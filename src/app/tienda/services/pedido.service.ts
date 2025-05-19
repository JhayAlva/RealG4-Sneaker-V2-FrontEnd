import { computed, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IProducto } from '../interfaces/producto.interface';
import { IPedido } from '../interfaces/pedido.interface';
import { AuthService } from '../../auth/services/auth.service';
import { IDireccion } from '../../auth/interfaces/direccion.interface';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  //Hacer el pedido
  private itemsPedido$:BehaviorSubject<Array<{productoItem:IProducto,cantidadItem:number}>> = new BehaviorSubject<Array<{productoItem:IProducto,cantidadItem:number}>>([]);

  private _items:Array<{productoItem:IProducto,cantidadItem:number}>=[];

  private pedido:IPedido | null = null;

  public usuario=computed( () => this.authSvc.currentUser());

  constructor(private authSvc:AuthService) {
    this.itemsPedido$.subscribe((itemsEnObs:Array<{productoItem:IProducto,cantidadItem:number}>)=>this._items = itemsEnObs);
  }

  guardarPedido(pedido: IPedido): void {
    this.pedido = pedido;
  }

  // Obtiene el pedido almacenado en el servicio
  obtenerPedido(): IPedido | null {
    return this.pedido;
  }

  // Vacía el pedido almacenado en el servicio
  vaciarPedido(): void {
    this.pedido = null;
  }

  public VaciarCesta():void {
    this._items=[];
    this.itemsPedido$.next(this._items);
  }

  public GetItemsPedido$():Observable<Array<{productoItem:IProducto,cantidadItem:number}>>{
    return this.itemsPedido$.asObservable();
  }

  public GetItemsPedido():Array<{productoItem:IProducto,cantidadItem:number}>{
    return this._items;
  }

  public añadirItemPedido(item:{productoItem:IProducto,cantidadItem:number},operacion:string):void{
    console.log('estoy añadiendo un producto en servico pedidoservice...',item,operacion);
    let _posItem:number = this._items.findIndex((elem,pos,arr)=>elem.productoItem._id == item.productoItem._id);

    if(operacion == 'añadir'){
      if(_posItem != -1){
        this._items[_posItem].cantidadItem += item.cantidadItem;
      }else{
        this._items.push(item);
      }
    }

    this.itemsPedido$.next(this._items);
  }

  public CalcularSubtotal(tallaSelecionada:string):number{
    return this._items.reduce((acum,item)=>{
      const _variacion = item.productoItem.variaciones.find(varacion=>varacion.talla == tallaSelecionada);
      if(_variacion){
        return acum + (_variacion.precio + item.cantidadItem);
      }else{
        return acum + item.productoItem.precioRetail
      }
    },0);
  }

  public GastosEnvio(tallaSelecionada:string,direccionSelected?:IDireccion):number{

    let _dirEnvio:IDireccion| undefined  = this.usuario()?.direcciones.filter((direc:IDireccion)=>direc.direcPrincipal == true)[0];

    let _subtotal:number= this.CalcularSubtotal(tallaSelecionada);
    let _gastosenvio:number=0;

    let direccionEnvio = direccionSelected || _dirEnvio
    console.log('direcEnvio******',direccionEnvio);
    if (direccionEnvio === undefined) {
      // Manejar el caso en que _dirEnvio es undefined
      // Por ejemplo, puedes asignar un valor por defecto o lanzar un error.
      console.log('Hubo un error al intentar seleccionar las direcciones');
    } else {
      // _dirEnvio es seguro de usar como IDireccion aquí.
      if(_subtotal>100){
        switch(direccionEnvio.provincia.CPRO){
          case '51':
          case '52':
            _gastosenvio=25;
            break;

          case '35':
          case '38':
            _gastosenvio=35;
            break;

          default:
            _gastosenvio=15;
            break;
        }
      }
      console.log('los gastos de envio*******', _gastosenvio);
    }
    return _gastosenvio;
  }

  public CalcularTotal(tallaSelecionada:string):number{
    return this.CalcularSubtotal(tallaSelecionada) + this.GastosEnvio(tallaSelecionada);
  }





}
