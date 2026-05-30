import { Component } from '@angular/core';
import { IProducto } from '../../interfaces/producto.interface';
import { Observable } from 'rxjs';
import { PedidoService } from '../../services/pedido.service';
import { ActivatedRoute } from '@angular/router';
import { IPedido } from '../../interfaces/pedido.interface';
import { TiendaService } from '../../services/tienda.service';

@Component({
  selector: 'app-pedido-finalizado',
  templateUrl: './pedido-finalizado.component.html',
  styleUrl: './pedido-finalizado.component.css'
})
export class PedidoFinalizadoComponent {
  public pedidoRealizado:IPedido | null = null;
  public precioSeleted!: number;
  public tallaSelected!: string;
  public pedidoId!: string;

  constructor(private tiendaSvc: TiendaService, private activatedRoute: ActivatedRoute) {
    this.recuperarDatosUrl();
  }

  async ngOnInit() {
    this.pedidoId = this.activatedRoute.snapshot.paramMap.get('idPedido')!;

    this.pedidoRealizado = await this.tiendaSvc.getPedidoCliente(this.pedidoId);

  }

  recuperarDatosUrl() {
    this.activatedRoute
      .queryParams
      .subscribe(queryParam => {
        const _size = queryParam['talla'];
        this.tallaSelected = _size;
      });

    this.activatedRoute
      .queryParams
      .subscribe(queryParam => {
        const _price = queryParam['precio'];
        this.precioSeleted = _price;
      })
  }




}
