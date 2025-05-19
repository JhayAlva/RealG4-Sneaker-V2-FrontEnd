import { Pipe, type PipeTransform } from '@angular/core';
import { IDireccion } from '../../auth/interfaces/direccion.interface';

@Pipe({
  name: 'filterPrincipal',
  standalone: false,
})
export class FilterPrincipalPipe implements PipeTransform {

  transform(direcciones: IDireccion[]): IDireccion[] {
    if (!direcciones) return [];
    return direcciones.filter(direccion => direccion.direcPrincipal === true);
  }

}
