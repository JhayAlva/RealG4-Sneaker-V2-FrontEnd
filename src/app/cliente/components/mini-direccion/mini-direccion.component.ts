import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IDireccion } from '../../../auth/interfaces/direccion.interface';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-mini-direccion',
  templateUrl: './mini-direccion.component.html',
  styleUrl: './mini-direccion.component.css'
})
export class MiniDireccionComponent implements OnInit {
  @Input()direcMostrar!:IDireccion;
  @Output()operarDireccion:EventEmitter<[IDireccion,string]>= new EventEmitter<[IDireccion,string]>();

  public items!: MenuItem[];

  ngOnInit() {
    this.items = [
      {
        label:'Borrar',
        icon: 'pi pi-trash',
        command: () => {
           this.BorrarDireccion();
        }
    },
    {
      icon: 'pi pi-pencil',
      label:'Modificar',
      command: () => {
          this.ModificarDireccion();
      }
    }
    ]
  }

  BorrarDireccion():void {
    this.operarDireccion.emit( [ this.direcMostrar, 'eliminar' ] );
  }

  ModificarDireccion():void {
    this.operarDireccion.emit( [ this.direcMostrar, 'modificar' ] );
  }

}
