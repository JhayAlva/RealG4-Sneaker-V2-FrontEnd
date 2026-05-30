import { Component, computed, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { IPedido } from '../../../tienda/interfaces/pedido.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-compras',
  templateUrl: './mis-compras.component.html',
  styleUrl: './mis-compras.component.css'
})
export class MisComprasComponent {

  public usuarioLogeado = computed(() => this.authSvc.currentUser());
  public pedidos: Array<IPedido> = [];
  public page: number = 0;
  public isLoading: boolean = true;
  // public imgPdf!: IPdf[];
  constructor(private authSvc: AuthService, private router: Router) {
    const usuario = this.usuarioLogeado();
    if (usuario?._id) {
      this.recuperarPedidos(usuario);
    } else {
      // Manejar el caso en el que el usuario no esté logeado o no tenga un ID válido

    }

    // this.authSvc.getImgPdf().then(img => {
    //   this.imgPdf = img
    // });
  }

  async recuperarPedidos(usuario: any) {
    // Activamos el spinner antes de realizar la llamada
    this.isLoading = true;
    try {
      // Recuperamos los pedidos del servicio
      this.pedidos = await this.authSvc.recuperarPedidosUsuario(usuario._id);

    } catch (error) {

      // Opcional: manejar el error y tal vez mostrar un mensaje de error al usuario
    } finally {
      // Desactivamos el spinner una vez que los pedidos se han recuperado
      this.isLoading = false;
    }
  }

  getSeverity(productEstado: string): any {
    switch (productEstado) {
      case 'Enviado':
        return 'success';

      case 'En preparacion':
        return 'warning';

      case 'Cancelado':
        return 'danger';

      default:
        return 'default';
    }
  }

  descargarPdf(pedido:IPedido){

  }

  // descargarPdf(pedido: IPedido) {
  //   const doc = new jsPDF();

  //   // Estilos
  //   const styles = {
  //     header: {
  //       fontSize: 18,
  //       fontStyle: 'bold',
  //       alignment: 'center'
  //     },
  //     subheader: {
  //       fontSize: 14,
  //       fontStyle: 'bold',
  //       marginBottom: 5
  //     },
  //     detalles: {
  //       fontSize: 14,
  //       marginBottom: 5
  //     }
  //   };

  //   const imagen = this.imgPdf;

  //   // Establecer el tamaño y la alineación del título
  //   doc.setFont('helvetica', 'bold');
  //   doc.setFontSize(styles.header.fontSize);
  //   doc.text('¡Gracias!', 105, 20, { align: 'center' });

  //   // Insertar imagen
  //   if (imagen) {
  //     doc.addImage(imagen, 'JPEG', 105 - 79 / 2, 25, 79, 79); // Centrado en el PDF (Ajuste el tamaño de la imagen según sea necesario)
  //   }

  //   // Continuar con el resto del contenido del PDF
  //   doc.setFont('helvetica', 'normal');
  //   doc.setFontSize(styles.subheader.fontSize);
  //   doc.text('Nº de Factura: ' + pedido._id, 20, 120);

  //   doc.setFontSize(styles.detalles.fontSize);
  //   doc.text('ID del pedido: ' + pedido._id, 20, 130);
  //   doc.text('Fecha del Pedido: ' + pedido.fechaPedido, 20, 140); // Usamos la función formatDate aquí
  //   doc.text('Facturado a: ' + this.usuarioLogeado()?.email , 20, 150);
  //   doc.text('Fuente: RealG4', 20, 160);

  //   // Detalles de los productos en la tabla
  //   let yPosition = 170; // Comienza debajo de los detalles previos
  //   doc.setFontSize(styles.subheader.fontSize);
  //   doc.text('Detalles de tu pedido:', 20, yPosition);
  //   yPosition += 10;

  //   // Título de la tabla
  //   doc.setFontSize(12);
  //   doc.text('Producto', 20, yPosition);
  //   doc.text('Cantidad', 100, yPosition);
  //   doc.text('Precio', 150, yPosition);
  //   yPosition += 10;

  //   // Llenado de la tabla con los productos
  //   pedido.elementosPedido.forEach((item, index) => {
  //     // Aquí usamos la imagen y datos de cada producto
  //     doc.text(item.productoItem.nombre, 20, yPosition);
  //     doc.text(item.cantidadItem.toString(), 100, yPosition);
  //     doc.text(pedido.precioSeleccionado + "€", 150, yPosition);

  //     // Verificar si el producto tiene una imagen
  //     let imagenProducto = item.productoItem.imagenes && item.productoItem.imagenes[0];
  //     console.log('Imagen recuperada: ' ,imagenProducto);
  //     if (imagenProducto && imagenProducto.startsWith('data:image')) {
  //       try {
  //         doc.addImage(imagenProducto, 'JPEG', 20, yPosition, 30, 30);
  //         yPosition += 35;
  //       } catch (error) {
  //         console.error('Error al agregar la imagen al PDF:', error);
  //       }
  //     } else {
  //       console.error('La imagen no es válida o no tiene el formato esperado.');
  //     }
  //   });

  //   // Total del pedido
  //   doc.setFontSize(styles.subheader.fontSize);
  //   doc.text('Total: ' + pedido.totalPedido + '€', 20, yPosition);

  //   // Guardar el PDF
  //   doc.save(`pedido_${pedido._id || 'sin_id'}.pdf`);
  // }

  onPageChange(event: any) {
    this.page = event.page;
  }

  comprarDeNuevo(idProducto: String) {

    this.router.navigate(['/es-Es/mostrar-producto', idProducto]);
  }

}
