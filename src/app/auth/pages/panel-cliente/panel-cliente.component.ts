import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-panel-cliente',
  templateUrl: './panel-cliente.component.html',
  styleUrl: './panel-cliente.component.css'
})
export class PanelClienteComponent implements OnInit {
  public items!: MenuItem[];

  ngOnInit() {
    this.items = [
      { label: 'Perfil', icon: 'pi pi-user', command: () => this.scrollToSection('perfil') },
      { label: 'Direcciones', icon: 'pi pi-map-marker', command: () => this.scrollToSection('direcciones') },
      { label: 'Mis Compras', icon: 'pi pi-shopping-cart', command: () => this.scrollToSection('compras') },
      { label: 'Favoritos', icon: 'pi pi-heart', command: () => this.scrollToSection('favoritos') },
      { label: 'Configuración', icon: 'pi pi-cog', command: () => this.scrollToSection('configuracion') }
    ];
  }

  scrollToSection(section: string) {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

}
