import { IPedido } from "../../tienda/interfaces/pedido.interface";
import { IDireccion } from "./direccion.interface";

export interface Usuario{
  _id?:string,
  email:string,
  nombre:string,
  apellidos:string,
  password:string,
  avatar?:string,
  isActive?:boolean,
  direcciones:Array<IDireccion>
  pedidos:Array<IPedido>
}
