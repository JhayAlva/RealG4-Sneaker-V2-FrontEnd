import { Component, EventEmitter, Input, OnInit, output, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mini-cambiar-talla',
  templateUrl: './mini-cambiar-talla.component.html',
  styleUrl: './mini-cambiar-talla.component.css'
})
export class MiniCambiarTallaComponent{

  @Input()
  public variaciones!:Array<any>;
  @Output()
  public variacionesModificadas:EventEmitter<{precio:number,talla:string}> = new EventEmitter<{precio:number,talla:string}>;

  @Output()
  public volverAPrincipal:EventEmitter<string> = new EventEmitter<string>();

  @Input()
  public idProducto!:string;

  public selectedSize!:string;
  public selectedPrice!:number;

  constructor(private router:Router){}

  SeleccionarVariacion(size: any,precio:any) {
    this.selectedSize = size;
    this.selectedPrice = precio;
    this.variacionesModificadas.emit({precio:this.selectedPrice,talla:this.selectedSize});
  }

  Atras(){
    this.volverAPrincipal.emit();
  }

}
