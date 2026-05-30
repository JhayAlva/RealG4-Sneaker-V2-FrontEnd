import { Component, computed, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrl: './mis-datos.component.css'
})
export class MisDatosComponent {

  public usuarioLogeado = computed(() => this.authSvc.currentUser());
  public dias: Array<number> = Array.from({ length: 31 }, (_, pos) => pos + 1);
  public meses: Array<string> = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  public anios: Array<number> = Array.from(
    { length: new Date().getFullYear() - 1933 },
    (_, pos) => pos + 1934
  );

  public formIniciopanel:FormGroup = this.fb.group({
    email: [{value: this.usuarioLogeado()?.email,disabled:true},[Validators.required,Validators.email]],
    nombre:[this.usuarioLogeado()?.nombre,[Validators.required,Validators.minLength(3)]],
    apellidos:[this.usuarioLogeado()?.apellidos,[Validators.required,Validators.minLength(3)]],
    telefono:['',[Validators.required,Validators.pattern('^[0-9]{3}\\s?([0-9]{2}\\s?){3}$')]],
    password:['',[Validators.required,Validators.minLength(6)]],
    newpassword:['',[Validators.required,Validators.minLength(6)]],
    dia:['',[Validators.required]],
    mes:['',[Validators.required]],
    anio:['',[Validators.required]]
  });

  constructor(private fb:FormBuilder,private authSvc:AuthService){}

  UpdateDatosCliente(){

  }

}
