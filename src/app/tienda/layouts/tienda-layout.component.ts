import { Component, OnInit, computed } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../auth/services/auth.service';
import { Usuario } from '../../auth/interfaces/usuario.interface';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tienda-layout',
  templateUrl: './tienda-layout.component.html',
  styleUrl: './tienda-layout.component.css'
})
export class TiendaLayoutComponent implements OnInit {

  menuItems: MenuItem[] = [];

  public usuario=computed( () => this.authSvc.currentUser());

  constructor(private authSvc:AuthService,private router:Router ){}

  ngOnInit() {
      this.menuItems = [
        {
          label: 'Noticias',
          icon: 'pi pi-book',
          command:()=>{
            this.router.navigateByUrl('/es-Es/noticias');
          }
        },
        {
          label: 'Informacion',
          icon: 'pi pi-info',
          command:()=>{
            this.router.navigateByUrl('/es-Es/informacion');
          }
        },
        {
          label: 'Verificación',
          icon: 'pi pi-check',
          command:()=>{
            this.router.navigateByUrl('/es-Es/verificacion');
          }
        }
      ];
  }

  logout(){
    this.authSvc.logout();
  }
}
