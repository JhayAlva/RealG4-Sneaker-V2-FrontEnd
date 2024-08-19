import { Usuario } from "../../auth/interfaces/usuario.interface";

export interface UploadResponse{
  user:Usuario,
  codigo:number,
  token:string,
}
