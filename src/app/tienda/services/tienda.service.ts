import { FinalizarPedidoResp } from './../interfaces/finalizarPedido-response.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProducto } from '../interfaces/producto.interface';
import { environment } from '../../../environments/environments';
import { Observable, catchError, delay, lastValueFrom, map, tap, throwError } from 'rxjs';
import { IPedido } from '../interfaces/pedido.interface';
import { IDatosPago } from '../interfaces/datosPago.interface';
import { ICategoria } from '../interfaces/categoria.interface';

@Injectable({
  providedIn: 'root'
})
export class TiendaService {
  private readonly baseUrl:string = environment.baseUrl;

  public resultProductos:IProducto[]=[];
  public isLoadingProductos:boolean = false;
  private activeSearchQuery:string = '';

  constructor(private http:HttpClient) { }

  getProductosXNumeroVentas():Observable<IProducto[]>{
    return this.http.get<IProducto[]>(`${this.baseUrl}/tienda/top-tres-zapas`);
  }

  getProductoById(id:string){
    return this.http.get<IProducto>(`${this.baseUrl}/tienda/${id}`);
  }

  clearProductosSearch(){
    this.activeSearchQuery = '';
    this.resultProductos = [];
    this.isLoadingProductos = false;
  }

  getProductosByQuery(query:string){
    const normalizedQuery = query.trim();

    if(normalizedQuery.length === 0){
      this.clearProductosSearch();
      return;
    }else{
      this.activeSearchQuery = normalizedQuery;
      this.isLoadingProductos=true;
      this.resultProductos=[];
      const params = new HttpParams().set('query',normalizedQuery);
      this.http.get<IProducto[]>(`${this.baseUrl}/tienda/search`,{params})
          .subscribe({
            next: resp=>{
              if(this.activeSearchQuery !== normalizedQuery) return;

              this.isLoadingProductos=false;
              this.resultProductos = resp;
            },
            error: () => {
              if(this.activeSearchQuery !== normalizedQuery) return;

              this.resultProductos=[];
              this.isLoadingProductos=false;
            }
          });
    }
  }

  getProductosByPath(path:string){
    if(path.length === 0){
      this.resultProductos = [];
      this.isLoadingProductos=false;
    }else{
      this.isLoadingProductos = true;
      const params = new HttpParams().set('path',path);
      this.http.get<IProducto[]>(`${this.baseUrl}/tienda/productosByPath`,{params})
             .subscribe(resp =>{
              this.isLoadingProductos = false;
              this.resultProductos = resp;
             })
    }
  }

  getCategorias():Promise<Array<ICategoria>>{
    const url = `${this.baseUrl}/tienda/GetCategoias`;
    return lastValueFrom(this.http.get<Array<ICategoria>>(url));
  }


  RecuperarProductosJordan11(path:String):Promise<Array<IProducto>>{
    return lastValueFrom(
      this.http.get<Array<IProducto>>(`${this.baseUrl}/tienda/RecuperarProductosJordan11?path=${path}`)
    );
  }

  FinalizarPedido(newPedido:IPedido,datosPago:IDatosPago,metodoPago:string):Observable<FinalizarPedidoResp>{

    const url =`${this.baseUrl}/auth/FinalizarPedidoCliente`;
    const body = {newPedido,datosPago,metodoPago};
    return this.http.post<FinalizarPedidoResp>(url,body)
                    .pipe(
                      tap(resp =>{
                        if (resp.approvalUrl) {
                          // Redirigir al usuario a la URL de aprobación de PayPal
                          window.location.href = resp.approvalUrl;
                        }
                      }),
                      catchError( err => throwError( ()=> err.error.message ))
                    )
  }

  getPedidoCliente(idPedido:string):Promise<IPedido>{
    return lastValueFrom(
      this.http.get<IPedido>(`${this.baseUrl}/auth/GetPedidoCliente/${idPedido}`)
    );
  }

  // deleteProductos(){
  //   this.resultProductos=[];
  // }

}
