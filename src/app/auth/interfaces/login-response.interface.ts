import { Usuario } from "./usuario.interface";

export interface LoginResponse {
  user:  Usuario;
  token: string;
}
