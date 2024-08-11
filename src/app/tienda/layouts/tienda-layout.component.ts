import { Component, OnInit, computed } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../auth/services/auth.service';
import { Usuario } from '../../auth/interfaces/usuario.interface';
@Component({
  selector: 'app-tienda-layout',
  templateUrl: './tienda-layout.component.html',
  styleUrl: './tienda-layout.component.css'
})
export class TiendaLayoutComponent implements OnInit {

  menuItems: MenuItem[] = [];

  public usuario=computed( () => this.authSvc.currentUser());

  constructor(private authSvc:AuthService ){}

  ngOnInit() {
      this.menuItems = [
          {
              label: 'Noticias',
              icon: 'pi pi-book',
          },
          {
              label: 'Informacion',
              icon: 'pi pi-info',
          },
          {
              label:'Verificación',
              icon:'pi pi-check'
          }
      ];
  }

  logout(){
    this.authSvc.logout();
  }
}
