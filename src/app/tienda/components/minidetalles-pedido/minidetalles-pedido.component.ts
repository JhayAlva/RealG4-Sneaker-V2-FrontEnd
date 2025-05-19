import { Component, computed, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IDatosPago } from '../../interfaces/datosPago.interface';
import { IDireccion } from '../../../auth/interfaces/direccion.interface';
import { PedidoService } from '../../services/pedido.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { IPedido } from '../../interfaces/pedido.interface';
import { TiendaService } from '../../services/tienda.service';
import Swal from'sweetalert2';
@Component({
  selector: 'app-minidetalles-pedido',
  templateUrl: './minidetalles-pedido.component.html',
  styleUrl: './minidetalles-pedido.component.css'
})
export class MinidetallesPedidoComponent implements OnInit {

  @Input()
  public datosPago!:IDatosPago;

  @Input()
  public metodoPago!:string;

  @Input()
  public sizeSelected!:string;

  @Input()
  public priceSelected!:number;

  @Input()
  public idProducto!:string;

  @Output()
  public cambiarModal:EventEmitter<string> = new EventEmitter<string>();

  public subtotal:number=0;

  public total:number=0;

  public gastosEnvio:number=0;

  public usuario= computed( () => this.authSvc.currentUser());

  public selectedDireccion!: IDireccion;

  constructor(private pedidoSvc:PedidoService,
              private tiendaSvc:TiendaService,
              private authSvc:AuthService,
              private router:Router,
  ){}

  ngOnInit(): void {
    this.subtotal= this.pedidoSvc.CalcularSubtotal(this.sizeSelected);
    this.total = this.pedidoSvc.CalcularTotal(this.sizeSelected);
    this.gastosEnvio = this.pedidoSvc.GastosEnvio(this.sizeSelected);
  }

  obtenerValueBoton(event:any):void{
    this.cambiarModal.emit(event.target.value);
  }

  truncarNumeroTarjeta(numeroTarjeta: string): string {
    if (numeroTarjeta && numeroTarjeta.length >= 4) {
      return '**** **** **** ' + numeroTarjeta.slice(-4);
    }
    return numeroTarjeta;
  }

  seleccionarDireccion(direccion: IDireccion){
    this.selectedDireccion = direccion;
    this.gastosEnvio = this.pedidoSvc.GastosEnvio(this.sizeSelected,this.selectedDireccion);
  }

  FinalizarPedido(){

    const usuario = this.usuario();
    if(usuario && usuario._id){
      let _newPedido:IPedido={
        _id:'',
        idCliente: usuario._id,
        estadoPedido: 'En preparacion',
        tallaSeleccionado:this.sizeSelected,
        precioSeleccionado:this.priceSelected,
        subtotalPedido:this.subtotal,
        gastosEnvio:this.gastosEnvio,
        totalPedido:this.total,
        direccionEnvio:this.selectedDireccion._id,
        fechaPedido: new Date(Date.now()),
        elementosPedido:this.pedidoSvc.GetItemsPedido()
      }

      this.pedidoSvc.vaciarPedido();
      this.pedidoSvc.guardarPedido(_newPedido);

      this.tiendaSvc.FinalizarPedido(_newPedido,this.datosPago,this.metodoPago)
                    .subscribe({
                      next:() => this.finalizado(),
                      error:(mensaje)=>{
                        const Toast = Swal.mixin({
                          toast: true,
                          showConfirmButton: false,
                          timerProgressBar: true,
                          position: "top-end",
                          timer: 3000
                        });

                        Toast.fire({
                          icon: "error",
                          title: mensaje,
                        });
                      }
                    })

    }else{
      console.log('Hubo un error con el id del usuario');
    }
  }

  finalizado(){
    if(this.metodoPago == 'tarjeta'){
      Swal.fire("Success","El pago con tarjeta se ha hecho correctamente","success").then(()=>{
        this.router.navigate(['/es-Es/pedido-finalizado/', this.idProducto],{
          queryParams: {
            talla: this.sizeSelected, // valor de la talla
            precio: this.priceSelected,// valor del precio
          }
        });
      })
    }else{
      console.log('Se le redirigue a paypal')
    }
  }

  Cancelar(){
    console.log('Valor del id producto: ',this.idProducto);
    this.router.navigate(['/es-Es/mostrar-producto/', this.idProducto]);
  }
}
