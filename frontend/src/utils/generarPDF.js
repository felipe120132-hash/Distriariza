import jsPDF from 'jspdf';
import { moneda } from './helpers.js';

const getBase64FromUrl = async (url) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

export const generarPDF = async (datos, items, totalCompra, pedidoId) => {
  const doc = new jsPDF();
  const azul = [26, 92, 255];
  const gris = [100, 100, 100];
  const negro = [15, 15, 15];

  // ── LOGO ──
  try {
    const logoBase64 = await getBase64FromUrl('/Logo.jpeg');
    doc.addImage(logoBase64, 'JPEG', 160, 6, 36, 26);
  } catch (e) {
    console.warn('No se pudo cargar el logo:', e);
  }

  // ── ENCABEZADO ──
  doc.setFillColor(...azul);
  doc.rect(0, 0, 210, 38, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Distribuciones Ariza', 14, 16);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('FISH ACCESSORIES', 14, 23);
  doc.setFontSize(10);
  doc.text(`Factura #${String(pedidoId).padStart(5, '0')}`, 14, 32);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-CO', { day:'2-digit', month:'long', year:'numeric' })}`, 100, 32);

  // ── DATOS DEL CLIENTE ──
  doc.setTextColor(...negro);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Datos del cliente', 14, 52);
  doc.setDrawColor(...azul);
  doc.setLineWidth(0.5);
  doc.line(14, 54, 100, 54);

  doc.setFontSize(10);
  const campos = [
    ['Nombre:',    datos.nombre    || datos.cliente_nombre    || '-'],
    ['Teléfono:',  datos.telefono  || datos.cliente_telefono  || '-'],
    ['Dirección:', datos.direccion || datos.cliente_direccion || '-'],
    ['Ciudad:',    datos.ciudad    || datos.cliente_ciudad    || '-'],
  ];
  campos.forEach(([label, valor], i) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...negro);
    doc.text(label, 14, 63 + i * 8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gris);
    doc.text(String(valor), 50, 63 + i * 8);
  });

  // ── TABLA DE PRODUCTOS ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...negro);
  doc.text('Productos', 14, 108);
  doc.setDrawColor(...azul);
  doc.line(14, 110, 196, 110);

  doc.setFillColor(240, 242, 255);
  doc.rect(14, 113, 182, 8, 'F');
  doc.setFontSize(9);
  doc.setTextColor(...negro);
  doc.setFont('helvetica', 'bold');
  doc.text('Producto',      16, 119);
  doc.text('Cant.',        130, 119);
  doc.text('Precio unit.', 148, 119);
  doc.text('Subtotal',     176, 119);

  let y = 130;
  items.forEach((item, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(250, 250, 252);
      doc.rect(14, y - 5, 182, 9, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...negro);
    const nombreItem = item.nombre.length > 40 ? item.nombre.substring(0, 40) + '…' : item.nombre;
    doc.text(nombreItem, 16, y);
    doc.text(String(item.cantidad), 134, y);
    doc.text(moneda(item.precio), 148, y);
    doc.text(moneda(item.precio * item.cantidad), 176, y);
    y += 10;
  });

  // ── TOTAL ──
  doc.setDrawColor(...azul);
  doc.line(14, y + 2, 196, y + 2);
  doc.setFillColor(...azul);
  doc.rect(140, y + 5, 56, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('TOTAL:', 143, y + 13);
  doc.text(moneda(totalCompra), 167, y + 13);

  // ── PIE ──
  doc.setTextColor(...gris);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Gracias por tu compra • Distribuciones Ariza • Fish Accessories', 105, 285, { align: 'center' });
  doc.text('distriariza.vercel.app', 105, 290, { align: 'center' });

  doc.save(`factura-ariza-${String(pedidoId).padStart(5, '0')}.pdf`);
};