// src/data/orgUnits.js
// Tashkilot tuzilmasi: markaziy apparat va hududiy filiallar

export const ORG_UNITS = [
  {
    id: 'central',
    name: 'Markaziy apparat',
    type: 'central',
    icon: 'building',
    children: [
      { id: 'c-dir', name: 'Direksiya' },
      { id: 'c-yur', name: 'Yuridik bo‘lim' },
      { id: 'c-bux', name: 'Buxgalteriya bo‘limi' },
      { id: 'c-it', name: 'IT va raqamlashtirish bo‘limi' },
      { id: 'c-hr', name: 'Inson resurslari bo‘limi' },
      { id: 'c-xavf', name: 'Xavfli chiqindilar bo‘limi' },
    ],
  },
  {
    id: 'tsh',
    name: 'Toshkent shahar',
    type: 'region',
    children: [
      { id: 'tsh-yun', name: 'Yunusobod tuman filiali' },
      { id: 'tsh-chi', name: 'Chilonzor tuman filiali' },
      { id: 'tsh-mir', name: 'Mirzo Ulug‘bek tuman filiali' },
      { id: 'tsh-yak', name: 'Yakkasaroy tuman filiali' },
      { id: 'tsh-uch', name: 'Uchtepa tuman filiali' },
    ],
  },
  {
    id: 'tshv',
    name: 'Toshkent viloyati',
    type: 'region',
    children: [
      { id: 'tshv-ang', name: 'Angren shahar filiali' },
      { id: 'tshv-chi', name: 'Chirchiq shahar filiali' },
      { id: 'tshv-zan', name: 'Zangiota tuman filiali' },
      { id: 'tshv-bek', name: 'Bekobod tuman filiali' },
    ],
  },
  {
    id: 'sam',
    name: 'Samarqand viloyati',
    type: 'region',
    children: [
      { id: 'sam-sam', name: 'Samarqand shahar filiali' },
      { id: 'sam-kat', name: 'Kattaqo‘rg‘on filiali' },
      { id: 'sam-urg', name: 'Urgut tuman filiali' },
      { id: 'sam-jom', name: 'Jomboy tuman filiali' },
    ],
  },
  {
    id: 'bux',
    name: 'Buxoro viloyati',
    type: 'region',
    children: [
      { id: 'bux-bux', name: 'Buxoro shahar filiali' },
      { id: 'bux-gij', name: 'G‘ijduvon tuman filiali' },
      { id: 'bux-kog', name: 'Kogon shahar filiali' },
    ],
  },
  {
    id: 'far',
    name: 'Farg‘ona viloyati',
    type: 'region',
    children: [
      { id: 'far-far', name: 'Farg‘ona shahar filiali' },
      { id: 'far-qoq', name: 'Qo‘qon shahar filiali' },
      { id: 'far-mar', name: 'Marg‘ilon shahar filiali' },
    ],
  },
  {
    id: 'and',
    name: 'Andijon viloyati',
    type: 'region',
    children: [
      { id: 'and-and', name: 'Andijon shahar filiali' },
      { id: 'and-asa', name: 'Asaka tuman filiali' },
    ],
  },
  {
    id: 'nam',
    name: 'Namangan viloyati',
    type: 'region',
    children: [
      { id: 'nam-nam', name: 'Namangan shahar filiali' },
      { id: 'nam-chu', name: 'Chust tuman filiali' },
    ],
  },
  {
    id: 'qash',
    name: 'Qashqadaryo viloyati',
    type: 'region',
    children: [
      { id: 'qash-qar', name: 'Qarshi shahar filiali' },
      { id: 'qash-sha', name: 'Shahrisabz filiali' },
    ],
  },
  {
    id: 'sur',
    name: 'Surxondaryo viloyati',
    type: 'region',
    children: [
      { id: 'sur-ter', name: 'Termiz shahar filiali' },
      { id: 'sur-den', name: 'Denov tuman filiali' },
    ],
  },
  {
    id: 'jiz',
    name: 'Jizzax viloyati',
    type: 'region',
    children: [
      { id: 'jiz-jiz', name: 'Jizzax shahar filiali' },
    ],
  },
  {
    id: 'sir',
    name: 'Sirdaryo viloyati',
    type: 'region',
    children: [
      { id: 'sir-gul', name: 'Guliston shahar filiali' },
    ],
  },
  {
    id: 'nav',
    name: 'Navoiy viloyati',
    type: 'region',
    children: [
      { id: 'nav-nav', name: 'Navoiy shahar filiali' },
      { id: 'nav-zar', name: 'Zarafshon shahar filiali' },
    ],
  },
  {
    id: 'xor',
    name: 'Xorazm viloyati',
    type: 'region',
    children: [
      { id: 'xor-urg', name: 'Urganch shahar filiali' },
      { id: 'xor-xiv', name: 'Xiva shahar filiali' },
    ],
  },
  {
    id: 'qqr',
    name: 'Qoraqalpog‘iston Respublikasi',
    type: 'region',
    children: [
      { id: 'qqr-nuk', name: 'Nukus shahar filiali' },
      { id: 'qqr-xuj', name: 'Xo‘jayli tuman filiali' },
    ],
  },
];

// Barcha bo'limlarni flat ko'rinishda olish
export function getAllUnits() {
  const out = [];
  ORG_UNITS.forEach((u) => {
    u.children.forEach((c) =>
      out.push({ id: c.id, name: c.name, region: u.name, regionId: u.id })
    );
  });
  return out;
}

// ID bo'yicha to'liq nom
export function unitFullName(id) {
  for (const u of ORG_UNITS) {
    for (const c of u.children) {
      if (c.id === id) return `${u.name} · ${c.name}`;
    }
  }
  return id;
}