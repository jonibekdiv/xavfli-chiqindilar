import Layout from '../components/Layout.jsx';
import { Card, Badge } from '../components/UI.jsx';

export default function CompanyProfile() {
  const rows = [
    ['Tashkilot nomi', 'ABC MChJ'],
    ['STIR', '123456789'],
    ['Yuridik manzil', 'Toshkent sh., Yunusobod tumani, Amir Temur ko‘chasi 15'],
    ['Hudud', 'Toshkent shahri'],
    ['Tuman', 'Yunusobod'],
    ['Faoliyat turi', 'Kimyo sanoati'],
    ['Rahbar F.I.Sh.', 'Aziz Karimov'],
    ['Mas’ul xodim', 'Dilnoza Yusupova'],
    ['Telefon', '+998 71 200 00 00'],
    ['E-mail', 'info@abc.uz'],
  ];

  return (
    <Layout title="Korxona profili" subtitle="Umumiy ma'lumotlar">
      <div className="grid grid-2">
        <Card>
          <div className="card-title">Tashkilot ma’lumotlari</div>
          <div className="list">
            {rows.map(([k, v]) => (
              <div key={k} className="list-item" style={{ cursor: 'default' }}>
                <div className="list-body">
                  <span>{k}</span>
                  <b>{v}</b>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card>
            <div className="card-title">Holat</div>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="muted">Faoliyat holati</span>
              <Badge color="green">Faol</Badge>
            </div>
            <div className="row mt-3" style={{ justifyContent: 'space-between' }}>
              <span className="muted">E-IMZO</span>
              <Badge color="blue">Ulangan</Badge>
            </div>
            <div className="row mt-3" style={{ justifyContent: 'space-between' }}>
              <span className="muted">Ro‘yxatdan o‘tgan</span>
              <b>2024-03-12</b>
            </div>
          </Card>
          <Card>
            <div className="card-title">Mas’ul shaxslar</div>
            <div className="list">
              <div className="list-item">
                <div className="user-avatar">AK</div>
                <div className="list-body">
                  <b>Aziz Karimov</b>
                  <span>Rahbar</span>
                </div>
              </div>
              <div className="list-item">
                <div className="user-avatar" style={{ background: 'linear-gradient(135deg,#34C759,#007AFF)' }}>DY</div>
                <div className="list-body">
                  <b>Dilnoza Yusupova</b>
                  <span>Mas’ul xodim</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}