export const REGIONS = [
  'Toshkent shahri', 'Toshkent viloyati', 'Samarqand', 'Buxoro',
  'Farg‘ona', 'Andijon', 'Namangan', 'Qashqadaryo', 'Surxondaryo',
  'Jizzax', 'Sirdaryo', 'Navoiy', 'Xorazm', 'Qoraqalpog‘iston'
];

export const WASTE_TYPES = [
  'Ishlatilgan moy', 'Batareya', 'Kimyoviy chiqindi', 'Lyuminestsent lampa',
  'Tibbiy chiqindi', 'Elektr jihozlar', 'Bo‘yoq qoldiqlari', 'Pestitsidlar'
];

export const WASTE_CLASSES = ['I', 'II', 'III', 'IV', 'V'];

export const UNITS = ['tonna', 'kg', 'litr', 'dona'];

export const WASTE_STATUS = ['Faol', 'Nofaol'];

export const DEMO_USERS = [
  {
    id: 'u1', login: 'korxona', password: '123456',
    name: 'Aziz Karimov', role: 'company', roleLabel: 'Korxona mas’ul xodimi',
    organization: 'ABC MChJ', stir: '123456789', region: 'Toshkent shahri'
  },
  {
    id: 'u2', login: 'mintaqa', password: '123456',
    name: 'Dilshod Rahimov', role: 'regional', roleLabel: 'Mintaqaviy boshqarma xodimi',
    organization: 'Toshkent mintaqaviy boshqarma', region: 'Toshkent shahri'
  },
  {
    id: 'u3', login: 'direksiya', password: '123456',
    name: 'O. Hazratqulov', role: 'directorate', roleLabel: 'Direksiya mutaxassisi',
    organization: 'Xavfli chiqindilarni boshqarish direksiyasi', region: 'Toshkent shahri'
  },
  {
    id: 'u4', login: 'admin', password: '123456',
    name: 'Sardor Adminov', role: 'admin', roleLabel: 'Tizim administratori',
    organization: 'Direksiya IT', region: 'Toshkent shahri'
  }
];

export const INITIAL_WASTES = [
  { id: 'w1', name: 'Ishlatilgan moy', type: 'Ishlatilgan moy', wasteClass: 'II', source: 'Ishlab chiqarish', unit: 'tonna', storage: '1-ombor', status: 'Faol' },
  { id: 'w2', name: 'Batareya', type: 'Batareya', wasteClass: 'II', source: 'Ombor', unit: 'dona', storage: '2-ombor', status: 'Faol' },
  { id: 'w3', name: 'Kimyoviy chiqindi', type: 'Kimyoviy chiqindi', wasteClass: 'III', source: 'Sex', unit: 'kg', storage: '3-ombor', status: 'Faol' },
];

export const INITIAL_QUARTERLY = [
  { id: 'q1', year: 2026, quarter: 1, wasteName: 'Ishlatilgan moy', wasteClass: 'II',
    opening: 10, generated: 20, recycled: 5, neutralized: 3, handedOver: 7, stored: 2,
    closing: 13, status: 'accepted', submittedAt: '2026-04-10' },
  { id: 'q2', year: 2026, quarter: 2, wasteName: 'Ishlatilgan moy', wasteClass: 'II',
    opening: 13, generated: 18, recycled: 6, neutralized: 2, handedOver: 8, stored: 3,
    closing: 12, status: 'accepted', submittedAt: '2026-07-08' },
  { id: 'q3', year: 2026, quarter: 3, wasteName: 'Ishlatilgan moy', wasteClass: 'II',
    opening: 12, generated: 22, recycled: 7, neutralized: 2, handedOver: 6, stored: 4,
    closing: 15, status: 'under_review', submittedAt: '2026-10-05' },
  { id: 'q4', year: 2026, quarter: 4, wasteName: 'Ishlatilgan moy', wasteClass: 'II',
    opening: 15, generated: 0, recycled: 0, neutralized: 0, handedOver: 0, stored: 0,
    closing: 15, status: 'pending' }
];

export const INITIAL_DOCUMENTS = [
  { id: 'd1', name: 'Qabul qilish-topshirish dalolatnomasi.pdf', type: 'Dalolatnoma', size: '245 KB', date: '2026-10-01' },
  { id: 'd2', name: 'Qayta ishlash dalolatnomasi.pdf', type: 'Dalolatnoma', size: '180 KB', date: '2026-10-02' },
  { id: 'd3', name: 'Shartnoma 2026-045.pdf', type: 'Shartnoma', size: '520 KB', date: '2026-09-15' },
  { id: 'd4', name: 'Laboratoriya xulosasi Q3.pdf', type: 'Laboratoriya', size: '310 KB', date: '2026-09-28' }
];

export const INITIAL_NOTIFICATIONS = [
  { id: 'n1', type: 'warning', title: 'Hisobot muddati yaqinlashmoqda', text: 'Q4 hisobotini topshirish muddati 2026-01-15 gacha.', date: '2026-09-10', read: false },
  { id: 'n2', type: 'success', title: 'Hisobot qabul qilindi', text: 'Q2 hisobotingiz mintaqaviy boshqarma tomonidan qabul qilindi.', date: '2026-07-08', read: true },
  { id: 'n3', type: 'info', title: 'Tizim yangilandi', text: 'Yangi versiya: 1.4.0 — xarita moduli qo‘shildi.', date: '2026-09-01', read: true }
];

export const MOCK_COMPANIES = [
  { id: 'c1', name: 'ABC MChJ', stir: '123456789', region: 'Toshkent shahri', district: 'Yunusobod', wasteTotal: 125, reportsSubmitted: 3, reportsTotal: 4, status: 'active' },
  { id: 'c2', name: 'XYZ MChJ', stir: '987654321', region: 'Samarqand', district: 'Samarqand sh.', wasteTotal: 84, reportsSubmitted: 2, reportsTotal: 4, status: 'overdue' },
  { id: 'c3', name: 'DEF MChJ', stir: '555666777', region: 'Farg‘ona', district: 'Farg‘ona sh.', wasteTotal: 210, reportsSubmitted: 4, reportsTotal: 4, status: 'active' },
  { id: 'c4', name: 'GHI MChJ', stir: '111222333', region: 'Buxoro', district: 'Buxoro sh.', wasteTotal: 47, reportsSubmitted: 1, reportsTotal: 4, status: 'pending' },
  { id: 'c5', name: 'JKL MChJ', stir: '999888777', region: 'Andijon', district: 'Andijon sh.', wasteTotal: 132, reportsSubmitted: 3, reportsTotal: 4, status: 'active' },
  { id: 'c6', name: 'MNO MChJ', stir: '444555666', region: 'Namangan', district: 'Namangan sh.', wasteTotal: 76, reportsSubmitted: 2, reportsTotal: 4, status: 'active' }
];

export const STATUS_LABELS = {
  draft: { label: 'Qoralama', color: 'gray' },
  submitted: { label: 'Taqdim etildi', color: 'blue' },
  under_review: { label: 'Ko‘rib chiqilmoqda', color: 'orange' },
  returned: { label: 'Qaytarildi', color: 'red' },
  resubmitted: { label: 'Qayta taqdim etildi', color: 'purple' },
  accepted: { label: 'Qabul qilindi', color: 'green' },
  approved: { label: 'Tasdiqlandi', color: 'green' },
  pending: { label: 'Kutilmoqda', color: 'gray' }
};

export const roleMenu = {
  company: [
    { to: '/', icon: '🏠', label: 'Dashboard' },
    { to: '/profile', icon: '🏢', label: 'Korxona profili' },
    { to: '/wastes', icon: '♻️', label: 'Chiqindilar' },
    { to: '/quarterly', icon: '📊', label: 'Choraklik hisobot' },
    { to: '/annual', icon: '📅', label: 'Yillik hisobot' },
    { to: '/documents', icon: '📎', label: 'Hujjatlar' },
    { to: '/notifications', icon: '🔔', label: 'Bildirishnomalar' },
  ],
  regional: [
    { to: '/', icon: '🏠', label: 'Dashboard' },
    { to: '/regional/reports', icon: '📋', label: 'Hisobotlar' },
    { to: '/notifications', icon: '🔔', label: 'Bildirishnomalar' },
  ],
  directorate: [
    { to: '/', icon: '🏠', label: 'Dashboard' },
    { to: '/directorate/companies', icon: '🏢', label: 'Korxonalar' },
    { to: '/directorate/analytics', icon: '📈', label: 'Analitika' },
    { to: '/notifications', icon: '🔔', label: 'Bildirishnomalar' },
  ],
  admin: [
    { to: '/', icon: '🏠', label: 'Dashboard' },
    { to: '/admin', icon: '⚙️', label: 'Admin panel' },
    { to: '/notifications', icon: '🔔', label: 'Bildirishnomalar' },
  ]
};