import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Flickity from 'flickity';

@Component({
  selector: 'tienda-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements AfterViewInit {
  @ViewChild('carousel', { static: false })
  public carousel!: ElementRef;
  public flkty?: Flickity;

  ngAfterViewInit(): void {
   this.flkty = new Flickity(this.carousel.nativeElement, {
      contain:true,
      cellAlign: 'left',
      pageDots: false,
      autoPlay: 3500
    });
  }



}
