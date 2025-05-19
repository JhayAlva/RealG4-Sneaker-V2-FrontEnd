import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Feature } from '../../../auth/interfaces/places';

@Component({
  selector: 'app-result-bar',
  templateUrl: './result-bar.component.html',
  styleUrl: './result-bar.component.css'
})
export class ResultBarComponent {

  @Output()
  obtenerDireccionCompleta:EventEmitter<[[number,number],string]> = new EventEmitter<[[number,number],string]>();

  constructor(private authSvc:AuthService){}

  get places(){
    return this.authSvc.places;
  }

  obtenerInfoDirec(place:Feature){
    let nombreDirec = place.text;
    const[lng,lat] = place.geometry.coordinates
    this.obtenerDireccionCompleta.emit([[lng,lat],nombreDirec]);
    this.authSvc.deletePlaces();
  }

}
