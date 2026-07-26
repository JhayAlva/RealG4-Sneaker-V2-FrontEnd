import { Component, ElementRef, HostListener, OnInit, ViewChild, computed } from '@angular/core';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { TiendaService } from '../services/tienda.service';
import { ICategoria } from '../interfaces/categoria.interface';
import { Menubar } from 'primeng/menubar';

interface CategoriaNode {
  categoria: ICategoria;
  children: CategoriaNode[];
  parent?: CategoriaNode;
}

@Component({
  selector: 'app-tienda-layout',
  templateUrl: './tienda-layout.component.html',
  styleUrl: './tienda-layout.component.css'
})
export class TiendaLayoutComponent implements OnInit {

  @ViewChild('mainMenubar') private mainMenubar?: Menubar;
  @ViewChild('layoutHeader') private layoutHeader?: ElementRef<HTMLElement>;

  menuItems: MenuItem[] = [];

  public usuario=computed( () => this.authSvc.currentUser());

  constructor(private authSvc:AuthService,
              private tiendaSvc:TiendaService,
              private router:Router ){}

  @HostListener('document:click', ['$event'])
  closeMenuOnOutsideClick(event: MouseEvent): void {
    const target = event.target as Node | null;

    if (target && !this.layoutHeader?.nativeElement.contains(target)) {
      this.closeMenu(event);
    }
  }

  async ngOnInit() {
      this.menuItems = this.buildMenuItems();

      try {
        const categorias = await this.tiendaSvc.getCategorias();
        this.menuItems = this.buildMenuItems(categorias);
      } catch (error) {
        console.error('No se pudieron recuperar las categorias', error);
      }
  }

  private buildMenuItems(categorias: ICategoria[] = []): MenuItem[] {
      const productosItems = this.buildProductosMenuItems(categorias);

      return [
        {
          label: 'Noticias',
          icon: 'pi pi-book',
          command:(event: MenuItemCommandEvent)=>{
            this.navigateTo('/es-Es/noticias', event.originalEvent);
          }
        },
        {
          label: 'Informacion',
          icon: 'pi pi-info',
          command:(event: MenuItemCommandEvent)=>{
            this.navigateTo('/es-Es/informacion', event.originalEvent);
          }
        },
        {
          label: 'Verificación',
          icon: 'pi pi-check',
          command:(event: MenuItemCommandEvent)=>{
            this.navigateTo('/es-Es/verificacion', event.originalEvent);
          }
        },
        {
          label: 'Productos',
          icon: 'pi pi-tags',
          items: productosItems.length
            ? productosItems
            : [{ label: 'Cargando categorias', icon: 'pi pi-spin pi-spinner', disabled: true }]
        }
      ];
  }

  private buildProductosMenuItems(categorias: ICategoria[]): MenuItem[] {
    const nodes = this.buildCategoriaTree(categorias);

    return nodes
      .flatMap(node => this.nodeToMenuItems(node))
      .sort((a, b) => this.compareLabels(a.label, b.label));
  }

  private buildCategoriaTree(categorias: ICategoria[]): CategoriaNode[] {
    const nodeByPath = new Map<string, CategoriaNode>();

    categorias
      .filter(categoria => this.isCategoriaUsable(categoria))
      .forEach(categoria => {
        nodeByPath.set(categoria.path.trim(), {
          categoria: {
            nombre: categoria.nombre.trim(),
            path: categoria.path.trim()
          },
          children: []
        });
      });

    const roots: CategoriaNode[] = [];

    nodeByPath.forEach(node => {
      const parentPath = this.getParentPath(node.categoria.path);
      const parent = parentPath ? nodeByPath.get(parentPath) : undefined;

      if (parent) {
        node.parent = parent;
        parent.children.push(node);
        return;
      }

      roots.push(node);
    });

    this.sortCategoriaNodes(roots);
    return roots;
  }

  private nodeToMenuItems(node: CategoriaNode): MenuItem[] {
    const childItems = node.children
      .flatMap(child => this.nodeToMenuItems(child))
      .sort((a, b) => this.compareLabels(a.label, b.label));

    if (this.isInternalCategoria(node) && childItems.length) {
      return childItems;
    }

    const label = this.getCategoriaLabel(node);
    const item: MenuItem = {
      label,
      icon: this.getCategoriaIcon(node.categoria),
      command: (event: MenuItemCommandEvent) => {
        this.navigateTo(['/es-Es/productos', node.categoria.path], event.originalEvent);
      }
    };

    if (childItems.length) {
      item.items = [
        {
          label: `Ver todo ${label}`,
          icon: 'pi pi-list',
          command: (event: MenuItemCommandEvent) => {
            this.navigateTo(['/es-Es/productos', node.categoria.path], event.originalEvent);
          }
        },
        ...childItems
      ];

      return [item];
    }

    return [item];
  }

  private isCategoriaUsable(categoria: ICategoria): boolean {
    const nombre = categoria.nombre?.trim();
    const path = categoria.path?.trim();

    if (!nombre || !path) return false;

    return /^\d+(?:-\d+)*$/.test(path);
  }

  private isInternalCategoria(node: CategoriaNode): boolean {
    const parentIsNumeric = node.parent ? this.isNumericLabel(node.parent.categoria.nombre) : true;

    return this.isNumericLabel(node.categoria.nombre) && parentIsNumeric && node.children.length > 0;
  }

  private getCategoriaLabel(node: CategoriaNode): string {
    const nombre = node.categoria.nombre.trim();

    if (this.isNumericLabel(nombre) && this.hasSneakerRetroContext(node)) {
      return `Retro ${nombre}`;
    }

    return nombre;
  }

  private hasSneakerRetroContext(node: CategoriaNode): boolean {
    let current = node.parent;

    while (current) {
      const nombre = current.categoria.nombre.toLowerCase();

      if (nombre.includes('jordan') || nombre.includes('nike')) {
        return true;
      }

      current = current.parent;
    }

    return false;
  }

  private isNumericLabel(value: string): boolean {
    return /^\d+$/.test(value.trim());
  }

  private getParentPath(path: string): string | null {
    const parts = path.split('-');

    if (parts.length <= 1) return null;

    parts.pop();
    return parts.join('-');
  }

  private sortCategoriaNodes(nodes: CategoriaNode[]): void {
    nodes.sort((a, b) => this.compareCategoriaNodes(a, b));
    nodes.forEach(node => this.sortCategoriaNodes(node.children));
  }

  private compareCategoriaNodes(a: CategoriaNode, b: CategoriaNode): number {
    const labelCompare = this.compareLabels(this.getCategoriaLabel(a), this.getCategoriaLabel(b));

    if (labelCompare !== 0) return labelCompare;

    return this.comparePaths(a.categoria.path, b.categoria.path);
  }

  private compareLabels(a = '', b = ''): number {
    return a.localeCompare(b, 'es', { numeric: true, sensitivity: 'base' });
  }

  private comparePaths(a: string, b: string): number {
    const aParts = a.split('-').map(Number);
    const bParts = b.split('-').map(Number);
    const maxLength = Math.max(aParts.length, bParts.length);

    for (let i = 0; i < maxLength; i++) {
      const diff = (aParts[i] ?? 0) - (bParts[i] ?? 0);

      if (diff !== 0) return diff;
    }

    return 0;
  }

  private getCategoriaIcon(categoria: ICategoria): string {
    const nombre = categoria.nombre.toLowerCase();

    if (nombre.includes('ps') || nombre.includes('playstation')) return 'pi pi-desktop';
    if (nombre.includes('accessor')) return 'pi pi-briefcase';
    if (nombre.includes('camiseta') || nombre.includes('sudadera') || nombre.includes('hoodie')) return 'pi pi-star';

    return 'pi pi-shopping-bag';
  }

  private navigateTo(route: string | unknown[], event?: Event): void {
    this.closeMenu(event);

    if (Array.isArray(route)) {
      this.router.navigate(route).finally(() => this.closeMenu());
      return;
    }

    this.router.navigateByUrl(route).finally(() => this.closeMenu());
  }

  private closeMenu(event?: Event): void {
    const menubar = this.mainMenubar;

    if (!menubar) return;

    menubar.hide(event, true);
    menubar.activeItemPath.set([]);
    menubar.focusedItemInfo.set({});
    menubar.mobileActive = false;

    setTimeout(() => {
      menubar.hide(undefined, true);
      menubar.activeItemPath.set([]);
      menubar.mobileActive = false;
    });
  }

  logout(){
    this.authSvc.logout();
  }
}
