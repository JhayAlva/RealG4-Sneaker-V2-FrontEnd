import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { TiendaService } from '../../services/tienda.service';
import { IProducto } from '../../interfaces/producto.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent{

}
