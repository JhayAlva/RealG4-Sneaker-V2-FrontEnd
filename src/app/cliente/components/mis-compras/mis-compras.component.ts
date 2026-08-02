import { Component, computed } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { IPedido } from '../../../tienda/interfaces/pedido.interface';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import { IDireccion } from '../../../auth/interfaces/direccion.interface';

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

  constructor(private authSvc: AuthService, private router: Router) {
    const usuario = this.usuarioLogeado();
    if (usuario?._id) {
      this.recuperarPedidos(usuario);
    }
  }

  async recuperarPedidos(usuario: any) {
    this.isLoading = true;
    try {
      this.pedidos = await this.authSvc.recuperarPedidosUsuario(usuario._id);
    } catch (error) {
      console.error('Error al recuperar pedidos:', error);
    } finally {
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

  async descargarPdf(pedido: IPedido) {
    console.log('Generando PDF para el pedido:', pedido);
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 18;
    const facturaId = pedido._id || 'sin_id';
    const usuario = this.usuarioLogeado();
    const logo = await this.obtenerImagenBase64('assets/images/logo-realg.png');
    let y = 18;

    doc.setFillColor(18, 18, 18);
    doc.rect(0, 0, pageWidth, 42, 'F');

    if (logo) {
      doc.addImage(logo, 'PNG', margin, 9, 24, 24);
    }

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('REALG4', logo ? margin + 30 : margin, 19);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Factura de compra', logo ? margin + 30 : margin, 28);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('Gracias por tu compra', pageWidth - margin, 22, { align: 'right' });

    y = 56;
    doc.setTextColor(28, 28, 28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Datos del pedido', margin, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`N. factura: ${facturaId}`, margin, y);
    doc.text(`Estado: ${pedido.estadoPedido || '-'}`, 118, y);
    y += 7;
    doc.text(`Fecha: ${this.formatearFecha(pedido.fechaPedido)}`, margin, y);
    doc.text(`Facturado a: ${usuario?.email || '-'}`, 118, y);
    y += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Direccion de envio', margin, y);
    y += 7;
    doc.setFont('helvetica', 'normal');

    const direccion = typeof pedido.direccionEnvio === 'string'
      ? usuario?.direcciones?.find((dir: IDireccion) => String(dir._id) === pedido.direccionEnvio)
      : pedido.direccionEnvio;

    const nombreCompleto = [direccion?.datosEnvio?.nombre, direccion?.datosEnvio?.apellidos].filter(Boolean).join(' ');
    const municipioProvincia = [direccion?.municipio?.DMUN50, direccion?.provincia?.PRO].filter(Boolean).join(', ');
    const cpPais = [direccion?.cp, direccion?.pais].filter(Boolean).join(' - ');
    const direccionLineas: string[] = [
      nombreCompleto,
      direccion?.calle,
      [cpPais, municipioProvincia].filter(Boolean).join(' | '),
      direccion?.datosEnvio?.telefono ? `Telefono: ${direccion.datosEnvio.telefono}` : '',
      direccion?.datosEnvio?.nifcif ? `NIF/CIF: ${direccion.datosEnvio.nifcif}` : '',
      !direccion && pedido.direccionEnvio ? `Referencia direccion: ${pedido.direccionEnvio}` : ''
    ]
      .map((linea) => String(linea || '').trim())
      .filter((linea) => linea.length > 0);

    direccionLineas.forEach((linea) => {
      const lineasPdf = doc.splitTextToSize(linea, pageWidth - margin * 2);
      doc.text(lineasPdf, margin, y);
      y += lineasPdf.length * 5.5;
    });
    y += 6;

    doc.setDrawColor(225, 225, 225);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Detalles de tu pedido', margin, y);
    y += 9;

    doc.setFontSize(10);
    doc.text('Producto', margin, y);
    doc.text('Talla', 102, y);
    doc.text('Cant.', 128, y);
    doc.text('Precio', 150, y);
    doc.text('Total', pageWidth - margin, y, { align: 'right' });
    y += 5;
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    doc.setFont('helvetica', 'normal');

    pedido.elementosPedido.forEach((item) => {
      if (y > pageHeight - 42) {
        doc.addPage();
        y = 22;
      }

      const nombre = item.productoItem?.nombre || 'Producto';
      const cantidad = item.cantidadItem || 1;
      const precio = pedido.precioSeleccionado || item.productoItem?.precioRetail || 0;
      const totalLinea = precio * cantidad;
      const nombreLineas = doc.splitTextToSize(nombre, 78);

      doc.text(nombreLineas, margin, y);
      doc.text(String(pedido.tallaSeleccionado || '-'), 102, y);
      doc.text(String(cantidad), 128, y);
      doc.text(this.formatearMoneda(precio), 150, y);
      doc.text(this.formatearMoneda(totalLinea), pageWidth - margin, y, { align: 'right' });

      y += Math.max(nombreLineas.length * 5.5, 9);
    });

    y += 4;
    doc.line(margin, y, pageWidth - margin, y);
    y += 9;

    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal', 132, y);
    doc.text(this.formatearMoneda(pedido.subtotalPedido), pageWidth - margin, y, { align: 'right' });
    y += 7;
    doc.text('Gastos de envio', 132, y);
    doc.text(this.formatearMoneda(pedido.gastosEnvio), pageWidth - margin, y, { align: 'right' });
    y += 9;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Total', 132, y);
    doc.text(this.formatearMoneda(pedido.totalPedido), pageWidth - margin, y, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(110, 110, 110);
    doc.text('REALG4 Sneakers - Documento generado automaticamente desde tu panel de cliente.', margin, pageHeight - 12);

    doc.save(`pedido_${facturaId}.pdf`);
  }

  private async obtenerImagenBase64(url: string): Promise<string | null> {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('No se pudo cargar el logo del PDF:', error);
      return null;
    }
  }

  private formatearFecha(fecha: Date): string {
    if (!fecha) {
      return '-';
    }

    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(fecha));
  }

  private formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(valor || 0);
  }

  onPageChange(event: any) {
    this.page = event.page;
  }

  comprarDeNuevo(idProducto: String) {
    this.router.navigate(['/es-Es/mostrar-producto', idProducto]);
  }

}





