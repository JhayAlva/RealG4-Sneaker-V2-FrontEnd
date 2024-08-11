export interface IProducto{
  _id:String;
  nombre:string;
  estilo:String;
  color:String;
  precioRetail:number;
  variaciones:Array<{
    talla:String;
    precio:number;
  }>
  fechaLanzamiento:Date,
  categoria:String,
  imagenes:Array<String>,
  paresVendidos:number,
  valoracionGeneral?:number,
  opiniones?:number,
  ultimaVenta:number,
}
