import { Component, computed, ViewChild } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { ModalDireccionComponent } from '../modal-direccion/modal-direccion.component';
import { IDireccion } from '../../../auth/interfaces/direccion.interface';
import { Usuario } from '../../../auth/interfaces/usuario.interface';
import Swal from'sweetalert2';
@Component({
  selector: 'app-mis-direcciones',
  templateUrl: './mis-direcciones.component.html',
  styleUrl: './mis-direcciones.component.css'
})
export class MisDireccionesComponent {
  public mostrarModalDireccion:boolean = false;
  @ViewChild('formModalDirec')
  public formModalDirec!:ModalDireccionComponent;
  public page: number = 0;
  public usuarioLogeado=computed(() => this.authSvc.currentUser());
  constructor(private authSvc:AuthService){
    console.log(this.usuarioLogeado());
  }

  async OperarDireccion(datos:[IDireccion,string]){



    if(datos[1]=='modificar'){
      this.formModalDirec.direc=datos[0];
      this.formModalDirec.operacion = 'modificar';
      this.ShowModal();
    }else if(datos[1]=='crear'){
      this.formModalDirec.direc=this.createEmptyDirec();
      this.formModalDirec.operacion = 'crear';
      this.ShowModal();
    }else{
      //Aca se borrara
      const usuarioId = this.usuarioLogeado()?._id;
      if (usuarioId) {
        this.authSvc.operarDirecciones(datos[0], 'borrar', usuarioId)
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
      } else {

      }
    }

  }


  createEmptyDirec(): IDireccion {
    return {
      _id: '',
      calle: '',
      cp: 0,
      provincia: {
        CCOM: '',
        CPRO: '',
        PRO: '',
      },
      municipio: {
        CMUM: '',
        CPRO: '',
        CUN: '',
        DMUN50: '',
      },
      pais: '',
      datosEnvio: {
        nombre: '',
        apellidos: '',
        nifcif: '',
        telefono: '',
      },
      direcPrincipal: false,
      alias: '',
      longitudAndLatitud:[0,0]
    };
  }

  RefrescaDatos(datoscli:Usuario){
    console.log('datos actualizados: ',datoscli); //<--- datos del cliente q vienen del modal direcciones de envio cuando se crea/modifica direccion
  }

  ShowModal(){
    this.mostrarModalDireccion = true;
  }

  HideModal(){
    this.mostrarModalDireccion = false;
  }

  onPageChange(event: any) {
    this.page = event.page;
  }

}
