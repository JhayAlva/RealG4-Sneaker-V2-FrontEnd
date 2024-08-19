import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrl: './mis-datos.component.css'
})
export class MisDatosComponent {
  public anioActual: number = new Date().getFullYear();
  public formIniciopanel:FormGroup = this.fb.group({
    email: ['',[Validators.required,Validators.email]],
    nombre:['',[Validators.required,Validators.minLength(3)]],
    apellidos:['',[Validators.required,Validators.minLength(3)]],
    telefono:['',[Validators.required,Validators.pattern('^[0-9]{3}\\s?([0-9]{2}\\s?){3}$')]],
    password:['',[Validators.required,Validators.minLength(6)]],
    dia:['',[Validators.required,Validators.minLength(1)]],
    mes:['',[Validators.required,Validators.minLength(1)]],
    anio:['',[Validators.required,Validators.minLength(1900), Validators.max(this.anioActual)]]
  });

  constructor(private fb:FormBuilder){}

  UpdateDatosCliente(){}

}
