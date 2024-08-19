import { Component, computed, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import Swal from'sweetalert2';
@Component({
  selector: 'app-panel-cliente',
  templateUrl: './panel-cliente.component.html',
  styleUrl: './panel-cliente.component.css'
})
export class PanelClienteComponent implements OnInit {

  //Subir foto perfil usuario
  public imgSrc: string = '/images/defaultAvatar.webp';
  private _fichImagen!: File;
  @ViewChild
    ('btnUploadImagen') btnUploadImagen!: ElementRef;


  public cambiarComponente: String = "misdatos";
  public usuario = computed(() => this.authSvc.currentUser());

  constructor(private renderer2: Renderer2,
    private route: ActivatedRoute,
    private authSvc: AuthService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const componente = params['componente'];

      // Lógica para cambiar el componente según el valor de 'componente'
      if (componente === 'favoritos') {
        this.cambiarComponente = 'favoritos';
      } else {
        this.cambiarComponente = 'misdatos';
      }
    });
  }

  public PrevisualizarImagen(inputimagen: any) {
    this._fichImagen = inputimagen.files[0] as File;
    let _lector: FileReader = new FileReader();

    _lector.addEventListener('load', ev => {

      console.log(ev.target!.result);
      const usuario = this.usuario();
      if (usuario) {
        usuario.avatar = '';  // Si usuario es válido, establece la propiedad avatar
      }else{
        console.error('El usuario es null o undefined.');
      }
      this.imgSrc = ev.target!.result as string;
      this.renderer2.removeAttribute(this.btnUploadImagen.nativeElement, 'disabled');

    });

    _lector.readAsDataURL(this._fichImagen);
  }

  public async UploadImagen() {
    try {
        //subir la foto a la base de datos
        const usuario = this.usuario();
        if (usuario && usuario._id) {
             await this.authSvc.uploadImagenUser(this.imgSrc, usuario.email, usuario._id).subscribe({
              next:()=> this.renderer2.setAttribute(this.btnUploadImagen.nativeElement,'disabled','true'),
              error: (mensaje) =>{
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
            });

        } else {
          // Manejo del caso en que usuario o usuario._id son indefinidos
          console.error('El usuario o el ID del usuario no están definidos');
        }
    } catch (error) {
        console.log('error en subida imagen...',error);
    }

  }


  CambiarContenido(seccion:String){
    this.cambiarComponente = seccion;
  }



}
