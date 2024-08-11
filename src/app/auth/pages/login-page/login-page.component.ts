import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from'sweetalert2';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  public formLogin:FormGroup=this.fb.group({
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required,Validators.minLength(6)]]
  })

  constructor(private authSvc:AuthService,
            private router:Router,
            private fb:FormBuilder){}

  login(){
    const {email, password} = this.formLogin.value;
    this.authSvc.loginUsuario(email,password)
        .subscribe({
          next: () => this.router.navigateByUrl('/es-Es/home'),
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

}
