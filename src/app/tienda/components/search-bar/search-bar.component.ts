import { Component } from '@angular/core';
import { TiendaService } from '../../services/tienda.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'tienda-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

  private debounceTimer?:NodeJS.Timeout;

  constructor(private tiendaSvc:TiendaService,
              private confirmationService: ConfirmationService){}

  get isLoadingProductos(){
    return this.tiendaSvc.isLoadingProductos;
  }

  get productosResultado(){
    return this.tiendaSvc.resultProductos;
  }

  onQueryChange(value:string,event:Event){
    if(this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      if(value.length == 0){
        throw new Error('No se encontro nada');
      }

      this.tiendaSvc.getProductosByQuery(value);
    }, 350);
    this.confirm(event);
  }

  confirm(event: Event) {
    if (!event || !event.target) {
      return; // Salir si el evento está vacío
    }
   setTimeout(()=>{this.confirmationService.confirm({
    target: event.target as EventTarget,
    acceptButtonStyleClass:'none',
    acceptVisible:false,
    rejectVisible: false,
    });},900)
}

}
