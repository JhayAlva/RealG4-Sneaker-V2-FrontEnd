import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from'sweetalert2';
import { Router } from '@angular/router';
import { ValidatorsService } from '../../services/validators.service';
@Component({
  selector: 'app-registro-page',
  templateUrl: './registro-page.component.html',
  styleUrl: './registro-page.component.css'
})
export class RegistroPageComponent {

  public formRegistro:FormGroup=this.fb.group({
    nombre:['',[Validators.required,Validators.minLength(3)]],
    apellidos:['',[Validators.required,Validators.minLength(3)]],
    email:['',[Validators.required, Validators.pattern(this.validadores.emailPattern)]],
    email2:['',[Validators.required,Validators.pattern(this.validadores.emailPattern)]],
    password:['',[Validators.required,Validators.minLength(6)]],
    password2:['',[Validators.required,Validators.minLength(6)]],
  },{
    validators:[
      this.validadores.isFieldOneEqualFieldTwo('email','email2'),
      this.validadores.isFieldOneEqualFieldTwo('password','password2'),
    ]
  })


  constructor(private authSvc:AuthService,
            private router:Router,
            private validadores:ValidatorsService,
            private fb:FormBuilder){}

registro(){
              this.authSvc.registroUsuario(this.formRegistro.controls['nombre'].value,
                                    this.formRegistro.controls['apellidos'].value,
                                    this.formRegistro.controls['email'].value,
                                    this.formRegistro.controls['password'].value)
                          .subscribe({
                            next:()=>{
                              Swal.fire("Success","Se ha registrado correctamente","success").then(()=>{
                                this.router.navigateByUrl('auth/login');
                              })
                            },
                            error: (mensaje) => {
                              // Swal.fire('Error',mensaje,'error');
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
}

isValidField(field:string){
  return this.validadores.isValidField(this.formRegistro,field);
}




}


