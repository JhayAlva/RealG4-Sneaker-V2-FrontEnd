import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProducto } from '../../interfaces/producto.interface';
import { TiendaService } from '../../services/tienda.service';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrl: './noticias.component.css'
})
export class NoticiasComponent implements OnInit {

  public productos:Array<IProducto>=[];
  public responsiveOptions: any[] | undefined;

  constructor( private router:Router,private tiendaSvc:TiendaService){}

  async ngOnInit(){
    this.responsiveOptions = [
      {
          breakpoint: '1200px',
          numVisible: 3,
          numScroll: 1
      },
      {
          breakpoint: '820px',
          numVisible: 2,
          numScroll: 1
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
    ];

    await this.tiendaSvc.RecuperarProductosJordan11('').then(productos=>{
      this.productos=productos
    });


  }


  MostrarDetallesProducto(id:string){
    this.router.navigate(['/es-Es/mostrar-producto/', id]);
    //this.router.navigateByUrl(`/Tienda/MostrarProducto?codproducto=${this.producto.codArticulo}`);
  }

}
