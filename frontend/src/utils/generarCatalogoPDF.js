import { jsPDF } from 'jspdf';
import { moneda } from './helpers.js';

export const generarCatalogoPDF = (productos) => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Catálogo de Productos', 105, 20, null, null, 'center');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Distribuciones Ariza', 105, 28, null, null, 'center');

  doc.setFontSize(10);
  doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 105, 34, null, null, 'center');

  doc.setLineWidth(0.5);
  doc.line(20, 38, 190, 38);

  let y = 48;
  
  // Agrupar por categoría
  const categorias = [...new Set(productos.map(p => p.categoria_nombre))];

  categorias.forEach(cat => {
    // Verificar si necesitamos nueva página para el título de categoría
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 92, 255); // Color azul acento
    doc.text(cat || 'Sin Categoría', 20, y);
    y += 8;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    const prods = productos.filter(p => p.categoria_nombre === cat);
    prods.forEach(p => {
      // Verificar espacio para el producto
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      
      const stockTxt = p.stock > 0 ? `Stock: ${p.stock}` : 'Agotado';
      doc.text(`• ${p.nombre}`, 25, y);
      doc.text(`${moneda(p.precio)} - ${stockTxt}`, 140, y);
      y += 6;
    });

    y += 4; // Espacio extra después de cada categoría
  });

  doc.save('Catalogo_Distriariza.pdf');
};
