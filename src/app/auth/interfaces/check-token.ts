import { Usuario } from "./usuario.interface";

export interface CheckTokenResponse{
  user:Usuario,
  token:string;
}
