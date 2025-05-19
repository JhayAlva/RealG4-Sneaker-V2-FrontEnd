import { IMunicipio } from "./municipio.interface"
import { IProvincia } from "./provincia.interface"

export interface IDireccion{
  _id:string,
  calle:string,
  cp:number,
  pais:string,
  provincia:IProvincia,
  municipio:IMunicipio,
  direcPrincipal:boolean,
  datosEnvio:{
    nombre:string,
    apellidos:string,
    nifcif:string,
    telefono:string
  },
  alias:string
  longitudAndLatitud:[number,number]
}
