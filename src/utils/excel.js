// src/utils/excel.js
import * as XLSX from 'xlsx';

/**
 * Universal Excel eksport
 * @param {Object} opts
 * @param {Array}  opts.columns   - [{ header, dataKey }]
 * @param {Array}  opts.rows      - [{ dataKey: value }]
 * @param {string} opts.fileName  - 'hisobot.xlsx'
 * @param {string} opts.sheetName - 'Hisobot'
 * @param {Object} opts.meta      - { 'Tashkilot': 'ABC MChJ', ... } (sarlavha tepasida)
 * @param {string} opts.title     - Katta sarlavha
 * @param {string} opts.subtitle  - Kichik sarlavha
 */
export function exportExcel({
  columns = [],
  rows = [],
  fileName = 'hisobot.xlsx',
  sheetName = 'Hisobot',
  meta = null,
  title = '',
  subtitle = '',
}) {
  const aoa = [];

  // Sarlavha qatorlari
  if (title) {
    aoa.push([title]);
    aoa.push([]);
  }
  if (subtitle) {
    aoa.push([subtitle]);
    aoa.push([]);
  }
  if (meta && typeof meta === 'object') {
    Object.entries(meta).forEach(([k, v]) => aoa.push([k, String(v)]));
    aoa.push([]);
  }

  // Jadval sarlavhasi
  aoa.push(columns.map((c) => c.header));

  // Jadval qatorlari
  rows.forEach((row) => {
    aoa.push(columns.map((c) => row[c.dataKey] ?? ''));
  });

  // Sana pastda
  aoa.push([]);
  aoa.push([`Sana: ${new Date().toLocaleDateString('uz-UZ')}`]);

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // Ustun kengliklari
  ws['!cols'] = columns.map((c) => ({
    wch: Math.max(14, (c.header || '').length + 4),
  }));

  // Birlashtirilgan kataklar (sarlavha markazda)
  const merges = [];
  if (title) merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: Math.max(0, columns.length - 1) } });
  if (subtitle) {
    const r = title ? 2 : 0;
    merges.push({ s: { r, c: 0 }, e: { r, c: Math.max(0, columns.length - 1) } });
  }
  if (merges.length) ws['!merges'] = merges;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, fileName);
}