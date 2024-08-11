import { Usuario } from "./usuario.interface";

export interface RegistroResponse{
  user:Usuario,
  token:string,
}
