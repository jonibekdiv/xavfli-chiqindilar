// src/utils/pdf.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Universal PDF eksport
 * @param {Object} opts
 * @param {string} opts.title          - Sarlavha
 * @param {string} opts.subtitle       - Kichik sarlavha
 * @param {Array}  opts.columns        - [{ header, dataKey }]
 * @param {Array}  opts.rows           - [{ dataKey: value, ... }]
 * @param {string} opts.fileName       - Fayl nomi (.pdf)
 * @param {Object} opts.meta           - Qo'shimcha kalit-qiymat juftlari
 * @param {string} opts.orientation    - 'portrait' | 'landscape'
 * @param {Object} opts.signature      - { director, accountant, show }
 */
export function exportPDF({
  title = 'Hisobot',
  subtitle = '',
  columns = [],
  rows = [],
  fileName = 'hisobot.pdf',
  meta = null,
  orientation = 'portrait',
  signature = null,
}) {
  const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ===== HEADER =====
  doc.setFillColor(0, 122, 255);
  doc.rect(0, 0, pageWidth, 4, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(title, 14, 18);

  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(subtitle, 14, 25);
  }

  // Sana
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  const dateStr = new Date().toLocaleDateString('uz-UZ');
  doc.text(`Sana: ${dateStr}`, pageWidth - 14, 18, { align: 'right' });

  // Tashkilot nomi
  doc.setFontSize(9);
  doc.text('Xavfli chiqindilarni boshqarish direksiyasi', pageWidth - 14, 25, {
    align: 'right',
  });

  doc.setDrawColor(220, 220, 220);
  doc.line(14, 30, pageWidth - 14, 30);

  // ===== META =====
  let startY = 38;
  if (meta && typeof meta === 'object' && Object.keys(meta).length > 0) {
    doc.setFontSize(10);
    Object.entries(meta).forEach(([key, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text(`${key}:`, 14, startY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 30, 30);
      doc.text(String(value), 60, startY);

      startY += 6;
    });
    startY += 4;
  }

  // ===== TABLE =====
  autoTable(doc, {
    startY,
    head: [columns.map((c) => c.header)],
    body: rows.map((row) => columns.map((c) => row[c.dataKey] ?? '')),
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: 2.5,
      lineColor: [230, 230, 230],
      lineWidth: 0.1,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [0, 122, 255],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'center',
    },
    alternateRowStyles: { fillColor: [248, 248, 250] },
    bodyStyles: { textColor: [40, 40, 40] },
    margin: { top: 30, left: 12, right: 12, bottom: 20 },
    didDrawPage: () => {
      const pageCount = doc.internal.getNumberOfPages();
      const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Xavfli chiqindilar platformasi · ${currentPage}/${pageCount}`,
        pageWidth / 2,
        pageHeight - 8,
        { align: 'center' }
      );
    },
  });

  // ===== IMZO BLOKI =====
  if (signature && signature.show !== false) {
    const finalY = (doc.lastAutoTable?.finalY || startY) + 12;
    const needSpace = 40;
    const pageBottom = pageHeight - 20;

    // Agar joy yetmasa — yangi sahifa
    if (finalY + needSpace > pageBottom) {
      doc.addPage();
    }

    const sigY = finalY + needSpace > pageBottom ? 40 : finalY;

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);

    // Sarlavha
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text('TASDIQLASH', 14, sigY);

    doc.setLineWidth(0.2);
    doc.line(14, sigY + 2, 70, sigY + 2);

    // Direktor
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);

    const col1X = 14;
    const col2X = pageWidth / 2 + 10;

    doc.text('Direktor:', col1X, sigY + 12);
    doc.text('_______________________', col1X, sigY + 18);

    doc.setFontSize(8.5);
    doc.setTextColor(120, 120, 120);
    doc.text(
      signature.director || 'F.I.Sh.',
      col1X,
      sigY + 24
    );

    // Bosh buxgalter
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);
    doc.text('Bosh buxgalter:', col2X, sigY + 12);
    doc.text('_______________________', col2X, sigY + 18);

    doc.setFontSize(8.5);
    doc.setTextColor(120, 120, 120);
    doc.text(
      signature.accountant || 'F.I.Sh.',
      col2X,
      sigY + 24
    );

    // M.O'.
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 80);
    doc.text("M.O'. (muhr o'rni)", col1X, sigY + 34);
  }

  doc.save(fileName);
}

/**
 * Ko'p bo'limli PDF
 */
export function exportPDFMultiSection({
  title,
  subtitle,
  sections = [],
  fileName = 'hisobot.pdf',
  orientation = 'portrait',
}) {
  const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFillColor(0, 122, 255);
  doc.rect(0, 0, pageWidth, 4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(title, 14, 18);

  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(subtitle, 14, 25);
  }

  doc.setDrawColor(220, 220, 220);
  doc.line(14, 30, pageWidth - 14, 30);

  let y = 38;
  sections.forEach((sec) => {
    if (sec.heading) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(sec.heading, 14, y);
      y += 6;
    }
    if (sec.text) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      const lines = doc.splitTextToSize(sec.text, pageWidth - 28);
      doc.text(lines, 14, y);
      y += lines.length * 5 + 4;
    }
    if (sec.table) {
      autoTable(doc, {
        startY: y,
        head: [sec.table.columns.map((c) => c.header)],
        body: sec.table.rows.map((r) =>
          sec.table.columns.map((c) => r[c.dataKey] ?? '')
        ),
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [0, 122, 255], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [248, 248, 250] },
        margin: { left: 14, right: 14 },
      });
      y = doc.lastAutoTable.finalY + 10;
    }
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Xavfli chiqindilar platformasi · ${i}/${pageCount}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  doc.save(fileName);
}