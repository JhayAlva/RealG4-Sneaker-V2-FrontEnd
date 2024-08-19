import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../interfaces/usuario.interface';
import { AuthStatus } from '../interfaces/auth-response.enum';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { RegistroResponse } from '../interfaces/registro-response';
import { LoginResponse } from '../interfaces/login-response.interface';
import { CheckTokenResponse } from '../interfaces/check-token';
import { UploadResponse } from '../../cliente/interfaces/upload-imagen-response';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl:string = environment.baseUrl;
  private http = inject(HttpClient);

  private _currentUser = signal<Usuario|null>(null);
  private _estadoUsuario = signal<AuthStatus>( AuthStatus.checking );

  //!Al mundo exterior
  public currentUser = computed( () => this._currentUser() );
  public estadoUsuario = computed( () => this._estadoUsuario() );

  private setAuthentication(user:Usuario,token:string):boolean{
    this._currentUser.set(user);
    this._estadoUsuario.set(AuthStatus.authenticated);
    localStorage.setItem('token',token);
    return true;
  }

  constructor() {
    this.checkAuthStatus().subscribe();
   }


  registroUsuario(nombre:string,apellidos:string,email:string,password:string):Observable<RegistroResponse>{
    const url = `${this.baseUrl}/auth/registro`;
    const body = {nombre,apellidos,email,password};

    return this.http.post<RegistroResponse>(url,body)
                    .pipe(
                      catchError(err => throwError( () => err.error.message)
                      )
                    );
  }

  loginUsuario(email:string,password:string):Observable<boolean>{

    const url = `${this.baseUrl}/auth/login`;
    const body ={email,password}

    return this.http.post<LoginResponse>(url,body)
               .pipe(
                  map( ({user,token}) => this.setAuthentication(user,token)),
                  //Todo:Manejo de errores
                  catchError( err => throwError( ()=> err.error.message )
                )
               );
  }

  uploadImagenUser(imagenBase64:string,email:string,id:string):Observable<boolean>{
    const url = `${this.baseUrl}/auth/uploadImagen`;
    const body ={imagenBase64,email,id}

    return this.http.post<UploadResponse>(url,body)
               .pipe(
                  map( ({user,token}) => this.setAuthentication(user,token)),
                  //Todo:Manejo de errores
                  catchError( err => throwError( ()=> err.error.message )
                )
               );
  }

  checkAuthStatus():Observable<boolean>{
    const url = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');
    if(!token){
      this.logout();
      return of(false);
    }
    const headers = new HttpHeaders().set('Authorization',`Bearer ${token}`);
    return this.http.get<CheckTokenResponse>(url,{headers})
                    .pipe(
                      map( ({user,token}) => this.setAuthentication(user,token)),
                      //error
                      catchError(()=> {
                        this._estadoUsuario.set(AuthStatus.notAuthenticated);
                        return of(false)
                      })
                    );
  }

  logout(){
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._estadoUsuario.set(AuthStatus.notAuthenticated);
  }

}
