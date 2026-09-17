// src/data/mockData.js

// ============ HUDUDLAR ============
export const REGIONS = [
  'Toshkent shahri', 'Toshkent viloyati', 'Samarqand', 'Buxoro',
  'Farg‘ona', 'Andijon', 'Namangan', 'Qashqadaryo', 'Surxondaryo',
  'Jizzax', 'Sirdaryo', 'Navoiy', 'Xorazm', 'Qoraqalpog‘iston',
];

// ============ CHIQINDI TURLARI ============
export const WASTE_TYPES = [
  'Ishlatilgan moy', 'Batareya', 'Kimyoviy chiqindi',
  'Lyuminestsent lampa', 'Tibbiy chiqindi', 'Elektr jihozlar',
  'Bo‘yoq qoldiqlari', 'Pestitsidlar',
];

// ============ XAVFLILIK SINFLARI ============
export const WASTE_CLASSES = ['I', 'II', 'III', 'IV', 'V'];

// ============ O‘LCHOV BIRLIKLARI ============
export const UNITS = ['tonna', 'kg', 'litr', 'dona'];

// ============ CHIQINDI HOLATI ============
export const WASTE_STATUS = ['Faol', 'Nofaol'];

// ============ FOYDALANUVCHILAR (demo) ============
export const DEMO_USERS = [
  {
    id: 'u1', login: 'korxona', password: '123456',
    name: 'Aziz Karimov', role: 'company',
    roleLabel: 'Korxona mas’ul xodimi',
    organization: 'ABC MChJ', stir: '123456789',
    region: 'Toshkent shahri', status: 'active',
  },
  {
    id: 'u2', login: 'mintaqa', password: '123456',
    name: 'Dilshod Rahimov', role: 'regional',
    roleLabel: 'Mintaqaviy boshqarma xodimi',
    organization: 'Toshkent mintaqaviy boshqarma',
    region: 'Toshkent shahri', status: 'active',
  },
  {
    id: 'u3', login: 'direksiya', password: '123456',
    name: 'O. Hazratqulov', role: 'directorate',
    roleLabel: 'Direksiya mutaxassisi',
    organization: 'Xavfli chiqindilarni boshqarish direksiyasi',
    region: 'Toshkent shahri', status: 'active',
  },
  {
    id: 'u4', login: 'admin', password: '123456',
    name: 'Sardor Adminov', role: 'admin',
    roleLabel: 'Tizim administratori',
    organization: 'Direksiya IT',
    region: 'Toshkent shahri', status: 'active',
  },
];

// ============ KORXONALAR (mock) ============
export const MOCK_COMPANIES = [
  { id: 'c1', name: 'ABC MChJ', stir: '123456789', region: 'Toshkent shahri', district: 'Yunusobod', wasteTotal: 125, reportsSubmitted: 3, reportsTotal: 4, status: 'active' },
  { id: 'c2', name: 'XYZ MChJ', stir: '987654321', region: 'Samarqand', district: 'Samarqand sh.', wasteTotal: 84, reportsSubmitted: 2, reportsTotal: 4, status: 'overdue' },
  { id: 'c3', name: 'DEF MChJ', stir: '555666777', region: 'Farg‘ona', district: 'Farg‘ona sh.', wasteTotal: 210, reportsSubmitted: 4, reportsTotal: 4, status: 'active' },
  { id: 'c4', name: 'GHI MChJ', stir: '111222333', region: 'Buxoro', district: 'Buxoro sh.', wasteTotal: 47, reportsSubmitted: 1, reportsTotal: 4, status: 'pending' },
  { id: 'c5', name: 'JKL MChJ', stir: '999888777', region: 'Andijon', district: 'Andijon sh.', wasteTotal: 132, reportsSubmitted: 3, reportsTotal: 4, status: 'active' },
  { id: 'c6', name: 'MNO MChJ', stir: '444555666', region: 'Namangan', district: 'Namangan sh.', wasteTotal: 76, reportsSubmitted: 2, reportsTotal: 4, status: 'active' },
  { id: 'c7', name: 'PQR MChJ', stir: '777888999', region: 'Qashqadaryo', district: 'Qarshi sh.', wasteTotal: 58, reportsSubmitted: 3, reportsTotal: 4, status: 'active' },
  { id: 'c8', name: 'STU MChJ', stir: '222333444', region: 'Xorazm', district: 'Urganch sh.', wasteTotal: 41, reportsSubmitted: 0, reportsTotal: 4, status: 'overdue' },
];

// ============ CHIQINDILAR (boshlang‘ich) ============
export const INITIAL_WASTES = [
  { id: 'w1', name: 'Ishlatilgan moy', type: 'Ishlatilgan moy', wasteClass: 'II', source: 'Ishlab chiqarish', unit: 'tonna', storage: '1-ombor', status: 'Faol' },
  { id: 'w2', name: 'Batareya', type: 'Batareya', wasteClass: 'II', source: 'Ombor', unit: 'dona', storage: '2-ombor', status: 'Faol' },
  { id: 'w3', name: 'Kimyoviy chiqindi', type: 'Kimyoviy chiqindi', wasteClass: 'III', source: 'Sex', unit: 'kg', storage: '3-ombor', status: 'Faol' },
];

// ============ CHORAKLIK HISOBOTLAR (boshlang‘ich) ============
export const INITIAL_QUARTERLY = [
  { id: 'q1', year: 2026, quarter: 1, wasteName: 'Ishlatilgan moy', wasteClass: 'II',
    opening: 10, generated: 20, recycled: 5, neutralized: 3, handedOver: 7, stored: 2,
    status: 'accepted', submittedAt: '2026-04-10' },
  { id: 'q2', year: 2026, quarter: 2, wasteName: 'Ishlatilgan moy', wasteClass: 'II',
    opening: 13, generated: 18, recycled: 6, neutralized: 2, handedOver: 8, stored: 3,
    status: 'accepted', submittedAt: '2026-07-08' },
  { id: 'q3', year: 2026, quarter: 3, wasteName: 'Ishlatilgan moy', wasteClass: 'II',
    opening: 12, generated: 22, recycled: 7, neutralized: 2, handedOver: 6, stored: 4,
    status: 'under_review', submittedAt: '2026-10-05' },
  { id: 'q4', year: 2026, quarter: 4, wasteName: 'Ishlatilgan moy', wasteClass: 'II',
    opening: 15, generated: 0, recycled: 0, neutralized: 0, handedOver: 0, stored: 0,
    status: 'pending' },
];

// ============ HUJJATLAR (boshlang‘ich) ============
export const INITIAL_DOCUMENTS = [
  { id: 'd1', name: 'Qabul qilish-topshirish dalolatnomasi.pdf', type: 'Dalolatnoma', size: '245 KB', date: '2026-10-01' },
  { id: 'd2', name: 'Qayta ishlash dalolatnomasi.pdf', type: 'Dalolatnoma', size: '180 KB', date: '2026-10-02' },
  { id: 'd3', name: 'Shartnoma 2026-045.pdf', type: 'Shartnoma', size: '520 KB', date: '2026-09-15' },
  { id: 'd4', name: 'Laboratoriya xulosasi Q3.pdf', type: 'Laboratoriya', size: '310 KB', date: '2026-09-28' },
];

// ============ BILDIRISHNOMALAR (boshlang‘ich) ============
export const INITIAL_NOTIFICATIONS = [
  { id: 'n1', type: 'warning', title: 'Hisobot muddati yaqinlashmoqda', text: 'Q4 hisobotini topshirish muddati 2027-01-15 gacha.', date: '2026-09-10', read: false },
  { id: 'n2', type: 'success', title: 'Hisobot qabul qilindi', text: 'Q2 hisobotingiz mintaqaviy boshqarma tomonidan qabul qilindi.', date: '2026-07-08', read: true },
  { id: 'n3', type: 'info', title: 'Tizim yangilandi', text: 'Yangi versiya: 1.4.0 — xarita moduli qo‘shildi.', date: '2026-09-01', read: true },
];

// ============ STATUS YORLIQLARI ============
export const STATUS_LABELS = {
  draft: { label: 'Qoralama', color: 'gray' },
  submitted: { label: 'Taqdim etildi', color: 'blue' },
  under_review: { label: 'Ko‘rib chiqilmoqda', color: 'orange' },
  returned: { label: 'Qaytarildi', color: 'red' },
  resubmitted: { label: 'Qayta taqdim etildi', color: 'purple' },
  accepted: { label: 'Qabul qilindi', color: 'green' },
  approved: { label: 'Tasdiqlandi', color: 'green' },
  pending: { label: 'Kutilmoqda', color: 'gray' },
};

// ============ FAYL STATUSLARI ============
export const FILE_STATUS = {
  draft: { label: 'Qoralama', color: 'gray', icon: 'file' },
  submitted: { label: 'Tekshiruvda', color: 'orange', icon: 'fileClock' },
  approved: { label: 'Tasdiqlangan', color: 'green', icon: 'fileCheck' },
  returned: { label: 'Qaytarilgan', color: 'red', icon: 'return' },
};

// ============ MENYU (rol bo‘yicha) ============
export const roleMenu = {
  company: [
    { to: '/', icon: 'dashboard', label: 'Dashboard', shortLabel: 'Asosiy' },
    { to: '/profile', icon: 'building', label: 'Korxona profili', shortLabel: 'Profil' },
    { to: '/wastes', icon: 'recycle', label: 'Chiqindilar', shortLabel: 'Chiqindi' },
    { to: '/quarterly', icon: 'clipboard', label: 'Choraklik hisobot', shortLabel: 'Chorak' },
    { to: '/annual', icon: 'calendar', label: 'Yillik hisobot', shortLabel: 'Yillik' },
    { to: '/documents', icon: 'paperclip', label: 'Hujjatlar', shortLabel: 'Hujjat' },
    { to: '/notifications', icon: 'bell', label: 'Bildirishnomalar', shortLabel: 'Xabar' },
  ],
  regional: [
    { to: '/', icon: 'dashboard', label: 'Dashboard', shortLabel: 'Asosiy' },
    { to: '/regional/reports', icon: 'clipboard', label: 'Hisobotlar', shortLabel: 'Hisobot' },
    { to: '/regional/files', icon: 'paperclip', label: 'Kelgan fayllar', shortLabel: 'Fayllar' },
    { to: '/documents', icon: 'file', label: 'Hujjatlar', shortLabel: 'Hujjat' },
    { to: '/notifications', icon: 'bell', label: 'Bildirishnomalar', shortLabel: 'Xabar' },
  ],
  directorate: [
    { to: '/', icon: 'dashboard', label: 'Dashboard', shortLabel: 'Asosiy' },
    { to: '/directorate/companies', icon: 'building', label: 'Korxonalar', shortLabel: 'Korxona' },
    { to: '/directorate/files', icon: 'paperclip', label: 'Barcha fayllar', shortLabel: 'Fayllar' },
    { to: '/documents', icon: 'file', label: 'Hujjatlar', shortLabel: 'Hujjat' },
    { to: '/directorate/analytics', icon: 'chart', label: 'Analitika', shortLabel: 'Analitika' },
    { to: '/notifications', icon: 'bell', label: 'Bildirishnomalar', shortLabel: 'Xabar' },
  ],
  admin: [
    { to: '/', icon: 'dashboard', label: 'Dashboard', shortLabel: 'Asosiy' },
    { to: '/admin', icon: 'settings', label: 'Admin panel', shortLabel: 'Admin' },
    { to: '/documents', icon: 'file', label: 'Hujjatlar', shortLabel: 'Hujjat' },
    { to: '/notifications', icon: 'bell', label: 'Bildirishnomalar', shortLabel: 'Xabar' },
  ],
};