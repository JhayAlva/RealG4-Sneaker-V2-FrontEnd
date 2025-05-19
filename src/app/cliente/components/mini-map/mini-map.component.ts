import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Map,Marker } from 'mapbox-gl';

@Component({
  selector: 'app-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrl: './mini-map.component.css'
})
export class MiniMapComponent {
  @Input() lngLat?: [number, number];
  @ViewChild('map') divMap?: ElementRef;

  ngAfterViewInit() {
    if( !this.divMap?.nativeElement ) throw "Map Div not found";
    if( !this.lngLat ) throw "LngLat can't be null";

    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));

    const map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLat,
      zoom: 14,
      interactive: false
    });

    new Marker({color})
      .setLngLat( this.lngLat )
      .addTo( map )

  }


}
