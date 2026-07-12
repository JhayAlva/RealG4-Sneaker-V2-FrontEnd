import { Component, computed, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDireccion } from '../../../auth/interfaces/direccion.interface';
import { IProvincia } from '../../../auth/interfaces/provincia.interface';
import { IMunicipio } from '../../../auth/interfaces/municipio.interface';
import { Usuario } from '../../../auth/interfaces/usuario.interface';
import { AuthService } from '../../../auth/services/auth.service';
import Swal from'sweetalert2';
@Component({
  selector: 'app-modal-direccion',
  templateUrl: './modal-direccion.component.html',
  styleUrl: './modal-direccion.component.css'
})
export class ModalDireccionComponent implements OnInit {

  public usuarioLogeado=computed(() => this.authSvc.currentUser());

  public esPrincipal!:boolean;

  public direc!:IDireccion;

  public coordenadas:[number,number];

  public formdireccion:FormGroup = this.fb.group({
    nombre:[this.direc?.datosEnvio.nombre||'',[Validators.required]],
    apellidos:[this.direc?.datosEnvio.apellidos || '',[Validators.required]],
    nif:[this.direc?.datosEnvio.nifcif || '',[Validators.required]],
    telefono:[this.direc?.datosEnvio.telefono || '', [Validators.required]],

    calle:[this.direc?.calle || '' , [Validators.required]],
    cp:[this.direc?.cp || '', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
    pais:[this.direc?.pais || 'España'],
    provincia:[0],
    municipio:[0],
    esprincipal:[false,[Validators.required]]
  });

  private debounceTimer?:NodeJS.Timeout;
  public listaProvincias!:Array<IProvincia>
  public listaMunicipios!:Array<IMunicipio>
  private _operacion:string='crear'
  public get operacion():string { return this._operacion; }
  public set operacion(value:string){
    if(value =='modificar') this.PrecargaValores();
    this._operacion=value;
  }


  //Eventos
  @Output()
  public cerrarModalEvent = new EventEmitter<void>();
  @Output()
  public addEditDirecEvent: EventEmitter<Usuario>= new EventEmitter<Usuario>();

  constructor(private fb:FormBuilder,private authSvc:AuthService){

  }

  async ngOnInit() {
    this.listaProvincias = await this.authSvc.getProvincias();
  }

  PrecargaValores(){
    //este metodo solo se ejecuta si el valor de la prop.'operacion' vale 'modificar'


    this.formdireccion.controls['calle'].setValue(this.direc?.calle);
    this.formdireccion.controls['cp'].setValue(this.direc?.cp);
    this.formdireccion.controls['pais'].setValue(this.direc?.pais);
    this.formdireccion.controls['nombre'].setValue(this.direc?.datosEnvio.nombre);
    this.formdireccion.controls['apellidos'].setValue(this.direc?.datosEnvio.apellidos);
    this.formdireccion.controls['nif'].setValue(this.direc?.datosEnvio.nifcif);
    this.formdireccion.controls['telefono'].setValue(this.direc?.datosEnvio.telefono);
    this.formdireccion.controls['provincia'].setValue(this.direc?.provincia.PRO);
    this.formdireccion.controls['municipio'].setValue(this.direc?.municipio.DMUN50);
    if (this.direc?.direcPrincipal == true) {
      this.formdireccion.controls['esprincipal']?.setValue("true");
    } else {
      this.formdireccion.controls['esprincipal']?.setValue("false");
    }

  }

  OnQueryChange(query:string){
    if(this.debounceTimer) clearTimeout(this.debounceTimer);

    const terminoBusqueda = query.trim();
    if (terminoBusqueda.length < 2) {
      this.authSvc.deletePlaces();
      return;
    }

    this.debounceTimer = setTimeout(()=>{
      this.authSvc.buscarDireccion(terminoBusqueda);
    },350)
  }

  infoDireccion(datos:[[number,number],string]){
    this.coordenadas = datos[0];
    this.formdireccion.controls['calle'].setValue(datos[1]);
  }

  OperarDireccion(){
    const codPostal = parseInt(this.formdireccion.controls['cp'].value,10);
    if(this.formdireccion.controls['esprincipal'].value == "true"){
      this.esPrincipal = true
    }else{
      this.esPrincipal = false;
    }

    let _direccion:IDireccion = {
      _id:this.direc?._id || '',
      calle: this.formdireccion.controls['calle'].value,
      cp:codPostal,
      pais:this.formdireccion.controls['pais'].value,
      provincia:{
        CCOM:'',
        CPRO: this.formdireccion.controls['provincia'].value.split('-')[0],
        PRO: this.formdireccion.controls['provincia'].value.split('-')[1]
      },
      municipio:{
        CUN:'',
        CPRO:this.formdireccion.controls['provincia'].value.split('-')[0],
        CMUM:this.formdireccion.controls['municipio'].value.split('-')[0],
        DMUN50:this.formdireccion.controls['municipio'].value.split('-')[1]
      },
      alias:'',
      direcPrincipal:this.esPrincipal,
      datosEnvio: {
        nombre: this.formdireccion.controls['nombre'].value,
        apellidos: this.formdireccion.controls['apellidos'].value,
        nifcif: this.formdireccion.controls['nif'].value,
        telefono: this.formdireccion.controls['telefono'].value,
      },
      longitudAndLatitud:this.coordenadas
    }
    const usuarioId = this.usuarioLogeado()?._id;
    if (usuarioId) {
      this.authSvc.operarDirecciones(_direccion, this.operacion, usuarioId)
      .subscribe(
        {
          next:()=> this.HideModal(),
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
        }
      );
    }else{

    }


  }

  async RecuperaMunicipios(ev:any){

    this.listaMunicipios=await this.authSvc.getMunicipios(ev.target.value.split('-')[0])
  }


  HideModal(){
    this.cerrarModalEvent.emit();
  }

}
