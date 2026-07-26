import { Component } from '@angular/core';
import { TiendaService } from '../../services/tienda.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'tienda-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

  private debounceTimer?:ReturnType<typeof setTimeout>;

  constructor(private tiendaSvc:TiendaService,
              private confirmationService: ConfirmationService){}

  get isLoadingProductos(){
    return this.tiendaSvc.isLoadingProductos;
  }

  get productosResultado(){
    return this.tiendaSvc.resultProductos;
  }

  onQueryChange(value:string,event:Event){
    const query = value.trim();

    if(this.debounceTimer) clearTimeout(this.debounceTimer);

    if(query.length === 0){
      this.tiendaSvc.clearProductosSearch();
      this.confirmationService.close();
      return;
    }

    this.debounceTimer = setTimeout(() => {
      this.tiendaSvc.getProductosByQuery(query);
      this.confirm(event);
    }, 350);
  }

  confirm(event: Event) {
    if (!event || !event.target) {
      return; // Salir si el evento está vacío
    }
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      acceptButtonStyleClass:'none',
      acceptVisible:false,
      rejectVisible: false,
    });
}

}
