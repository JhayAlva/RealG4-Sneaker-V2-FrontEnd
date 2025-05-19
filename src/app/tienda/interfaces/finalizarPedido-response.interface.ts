import { IDatosPago } from "./datosPago.interface";
import { IPedido } from "./pedido.interface";

export interface FinalizarPedidoResp{
  pedido:IPedido,
  datosPago:IDatosPago,
  metodoPago:string,
  approvalUrl?: string | undefined
}
