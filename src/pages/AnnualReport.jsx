import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { Card, Badge, Button } from '../components/UI.jsx';
import { exportPDF } from '../utils/pdf.js';
import { exportExcel } from '../utils/excel.js';
import { Printer, FileDown, FileSpreadsheet } from 'lucide-react';

export default function AnnualReport() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    setReports(JSON.parse(localStorage.getItem('crm_quarterly') || '[]'));
  }, []);

  const annual = reports.reduce((acc, r) => {
    const key = r.wasteName;
    if (!acc[key]) {
      acc[key] = {
        name: key,
        wasteClass: r.wasteClass,
        opening: 0,
        generated: 0,
        recycled: 0,
        neutralized: 0,
        handedOver: 0,
        stored: 0,
      };
    }
    acc[key].opening = r.opening;
    acc[key].generated += Number(r.generated) || 0;
    acc[key].recycled += Number(r.recycled) || 0;
    acc[key].neutralized += Number(r.neutralized) || 0;
    acc[key].handedOver += Number(r.handedOver) || 0;
    acc[key].stored += Number(r.stored) || 0;
    return acc;
  }, {});

  const list = Object.values(annual);

  const columns = [
    { header: 'Chiqindi', dataKey: 'name' },
    { header: 'Sinf', dataKey: 'wasteClass' },
    { header: 'Yil boshida', dataKey: 'opening' },
    { header: 'Hosil bo\'ldi', dataKey: 'generated' },
    { header: 'Qayta ishlandi', dataKey: 'recycled' },
    { header: 'Zararsizlantirildi', dataKey: 'neutralized' },
    { header: 'Topshirildi', dataKey: 'handedOver' },
    { header: 'Saqlangan', dataKey: 'stored' },
    { header: 'Yil oxiri', dataKey: 'closing' },
  ];

  const buildRows = () =>
    list.map((w) => {
      const closing =
        w.opening + w.generated - w.recycled - w.neutralized - w.handedOver - w.stored;
      return {
        name: w.name,
        wasteClass: w.wasteClass,
        opening: w.opening.toFixed(1),
        generated: w.generated.toFixed(1),
        recycled: w.recycled.toFixed(1),
        neutralized: w.neutralized.toFixed(1),
        handedOver: w.handedOver.toFixed(1),
        stored: w.stored.toFixed(1),
        closing: closing.toFixed(1),
      };
    });

  const handleExportPDF = () => {
    exportPDF({
      title: 'Yillik hisobot · 2026',
      subtitle: 'Xavfli chiqindilarni hosil qiluvchi tashkilotlar hisoboti',
      columns,
      rows: buildRows(),
      fileName: `Yillik-hisobot-2026-${new Date().toISOString().slice(0, 10)}.pdf`,
      orientation: 'portrait',
      meta: {
        'Tashkilot': 'ABC MChJ',
        'STIR': '123456789',
        'Hudud': 'Toshkent shahri',
        'Davr': '2026-yil (to\'liq)',
      },
      signature: {
        show: true,
        director: 'A. Karimov',
        accountant: 'O. Xolto‘raev',
      },
    });
  };

  const handleExportExcel = () => {
    exportExcel({
      title: 'Yillik hisobot · 2026',
      subtitle: 'Xavfli chiqindilarni hosil qiluvchi tashkilotlar hisoboti',
      columns,
      rows: buildRows(),
      fileName: `Yillik-hisobot-2026-${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: 'Yillik hisobot',
      meta: {
        'Tashkilot': 'ABC MChJ',
        'STIR': '123456789',
        'Hudud': 'Toshkent shahri',
        'Davr': '2026-yil',
      },
    });
  };

  return (
    <Layout
      title="Yillik hisobot · 2026"
      subtitle="Choraklik ma’lumotlardan avtomatik shakllangan"
      actions={
        <>
          <Button variant="secondary" size="sm" onClick={() => window.print()}>
            <Printer size={15} /> PDF ko‘rish
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExportPDF}>
            <FileDown size={15} /> PDF yuklash
          </Button>
          <Button size="sm" onClick={handleExportExcel}>
            <FileSpreadsheet size={15} /> Excel yuklash
          </Button>
        </>
      }
    >
      <div className="table-wrap mb-4">
        <table>
          <thead>
            <tr>
              <th>Chiqindi</th>
              <th>Sinf</th>
              <th>Yil boshida</th>
              <th>Hosil bo‘ldi</th>
              <th>Qayta ishlandi</th>
              <th>Zararsiz.</th>
              <th>Topshirildi</th>
              <th>Saqlangan</th>
              <th>Yil oxiri</th>
            </tr>
          </thead>
          <tbody>
            {list.map((w) => {
              const closing =
                w.opening + w.generated - w.recycled - w.neutralized - w.handedOver - w.stored;
              return (
                <tr key={w.name}>
                  <td><b>{w.name}</b></td>
                  <td><Badge color="orange">{w.wasteClass}</Badge></td>
                  <td className="mono">{w.opening}</td>
                  <td className="mono">{w.generated}</td>
                  <td className="mono">{w.recycled}</td>
                  <td className="mono">{w.neutralized}</td>
                  <td className="mono">{w.handedOver}</td>
                  <td className="mono">{w.stored}</td>
                  <td className="mono"><b>{closing.toFixed(1)}</b></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Card>
        <div className="card-title">Yillik tasdiqlash</div>
        <div className="muted mb-3">
          Hisobotni tasdiqlash uchun E-IMZO orqali imzolang. Imzolovchi shaxs va vaqt tizimda saqlanadi.
        </div>
        <div className="row" style={{ flexWrap: 'wrap' }}>
          <Button variant="secondary">📎 Hujjatlarni biriktirish</Button>
          <Button variant="secondary">✅ Tasdiqlash</Button>
          <Button>🔐 E-IMZO bilan imzolash</Button>
        </div>
      </Card>
    </Layout>
  );
}