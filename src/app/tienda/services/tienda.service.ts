import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProducto } from '../interfaces/producto.interface';
import { environment } from '../../../environments/environments';
import { Observable, delay, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiendaService {
  private readonly baseUrl:string = environment.baseUrl;

  public resultProductos:IProducto[]=[];
  public isLoadingProductos:boolean = false;

  constructor(private http:HttpClient) { }

  getProductosXNumeroVentas():Observable<IProducto[]>{
    return this.http.get<IProducto[]>(`${this.baseUrl}/tienda/top-tres-zapas`);
  }

  getProductoById(id:string){
    return this.http.get<IProducto>(`${this.baseUrl}/tienda/${id}`);
  }

  getProductosByQuery(query:string){
    if(query.length === 0){
      this.resultProductos=[];
      this.isLoadingProductos=false;
      return;
    }else{
      this.isLoadingProductos=true;
      const params = new HttpParams().set('query',query);
      this.http.get<IProducto[]>(`${this.baseUrl}/tienda/search`,{params})
          .subscribe(resp=>{
            this.isLoadingProductos=false;
            this.resultProductos = resp;
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


  // deleteProductos(){
  //   this.resultProductos=[];
  // }

}
