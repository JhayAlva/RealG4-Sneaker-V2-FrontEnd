import { IProducto } from "./producto.interface";

export interface IPedido{
  _id?:string;
  idCliente:string;
  estadoPedido:string;
  tallaSeleccionado:string;
  precioSeleccionado:number;
  subtotalPedido:number;
  gastosEnvio:number;
  totalPedido:number;
  direccionEnvio:string;
  fechaPedido:Date;
  elementosPedido:Array<{
    productoItem:IProducto,
    cantidadItem:number
  }>}
