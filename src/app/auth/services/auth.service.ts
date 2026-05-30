import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../interfaces/usuario.interface';
import { AuthStatus } from '../interfaces/auth-response.enum';
import { Observable, catchError, lastValueFrom, map, of, throwError } from 'rxjs';
import { RegistroResponse } from '../interfaces/registro-response';
import { LoginResponse } from '../interfaces/login-response.interface';
import { CheckTokenResponse } from '../interfaces/check-token';
import { UploadResponse } from '../../cliente/interfaces/upload-imagen-response';
import { IProvincia } from '../interfaces/provincia.interface';
import { IMunicipio } from '../interfaces/municipio.interface';
import { IDireccion } from '../interfaces/direccion.interface';
import { IPedido } from '../../tienda/interfaces/pedido.interface';
import { IPdf } from '../../cliente/interfaces/imgPdf.interface';
import { Feature, PlacesResponse } from '../interfaces/places';


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

  public places:Feature[]=[];

  private setAuthentication(user:Usuario,token:string):boolean{
    this._currentUser.set(user);
    this._estadoUsuario.set(AuthStatus.authenticated);
    console.log('estado del usuario', this.estadoUsuario());
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

  buscarDireccion(direccion: string){
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(direccion)}.json`;
    const params = {
      access_token: environment.apiKey,
      language:'es',
      limit: '5',
      bbox: '-9.392883,36.000000,3.188988,43.747582'
    };
    return this.http.get<PlacesResponse>(url, { params })
    .subscribe(resp=>{
      this.places = resp.features

    })
  }

  deletePlaces(){
    this.places=[];
  }

  operarDirecciones(direccion:IDireccion, operacion:string, usuarioId:string):Observable<boolean>{
    const url = `${this.baseUrl}/auth/OperarDirecciones`;
    const body = {direccion,operacion,usuarioId};

    return this.http.post<LoginResponse>(url,body)
                    .pipe(
                      map(({user,token})=> this.setAuthentication(user,token)),
                      catchError(err => throwError(()=> err.error.message))
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

  getProvincias():Promise<Array<IProvincia>>{
    const url=`${this.baseUrl}/auth/GetProvincias`;
    return lastValueFrom(this.http.get<Array<IProvincia>>(url));
  }

  getMunicipios(codprov:number):Promise<Array<IMunicipio>>{
    const url = `${this.baseUrl}/auth/GetMunicipio?codprov=${codprov}`;
    return lastValueFrom(this.http.get<Array<IMunicipio>>(url));
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

  recuperarPedidosUsuario(idUsuario:string):Promise<Array<IPedido>>{
    const url = `${this.baseUrl}/auth/GetPedidosUsuario?codusuario=${idUsuario}`;
    return lastValueFrom(this.http.get<Array<IPedido>>(url));
  }

  getImgPdf(){
    return this.http.get<any>('assets/configJson/pdfImagen.json')
    .toPromise()
    .then(res=><IPdf[]>res.imagenBase64)
    .then(data=> {return data});
  }

  logout(){
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._estadoUsuario.set(AuthStatus.notAuthenticated);
  }

}
