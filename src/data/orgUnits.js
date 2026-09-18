// src/data/orgUnits.js

export const ORG_UNITS = [
  {
    id: 'central',
    name: 'Markaziy apparat',
    type: 'central',
    children: [
      {
        id: 'c-dir',
        name: 'Direksiya',
        staff: [
          { id: 'st-c-dir-1', name: 'O. Hazratqulov', position: 'Direktor' },
          { id: 'st-c-dir-2', name: 'S. Niyazov', position: 'Maslahatchi' },
          { id: 'st-c-dir-3', name: 'U. Berdimurodov', position: 'Yurist' },
        ],
      },
      {
        id: 'c-yur',
        name: 'Yuridik bo‘lim',
        staff: [
          { id: 'st-c-yur-1', name: 'U. Berdimurodov', position: 'Boshliq' },
          { id: 'st-c-yur-2', name: 'M. Saidov', position: 'Mutaxassis' },
        ],
      },
      {
        id: 'c-bux',
        name: 'Buxgalteriya bo‘limi',
        staff: [
          { id: 'st-c-bux-1', name: 'O. Xolto‘raev', position: 'Bosh buxgalter' },
          { id: 'st-c-bux-2', name: 'Z. Yusupova', position: 'Buxgalter' },
        ],
      },
      {
        id: 'c-it',
        name: 'IT va raqamlashtirish bo‘limi',
        staff: [
          { id: 'st-c-it-1', name: 'S. Adminov', position: 'Boshliq' },
          { id: 'st-c-it-2', name: 'B. Tursunov', position: 'Dasturchi' },
        ],
      },
      {
        id: 'c-hr',
        name: 'Inson resurslari bo‘limi',
        staff: [
          { id: 'st-c-hr-1', name: 'Sh. Abbasova', position: 'Boshliq' },
          { id: 'st-c-hr-2', name: 'N. Qodirova', position: 'Mutaxassis' },
        ],
      },
      {
        id: 'c-xavf',
        name: 'Xavfli chiqindilar bo‘limi',
        staff: [
          { id: 'st-c-xavf-1', name: 'D. Rahimov', position: 'Boshliq' },
          { id: 'st-c-xavf-2', name: 'A. Karimov', position: 'Mutaxassis' },
        ],
      },
    ],
  },
  {
    id: 'tsh',
    name: 'Toshkent shahar',
    type: 'region',
    children: [
      {
        id: 'tsh-yun',
        name: 'Yunusobod tuman filiali',
        staff: [
          { id: 'st-tsh-yun-1', name: 'A. Toshmatov', position: 'Boshliq' },
          { id: 'st-tsh-yun-2', name: 'D. Yusupova', position: 'Mutaxassis' },
          { id: 'st-tsh-yun-3', name: 'R. Nazarov', position: 'Inspektor' },
        ],
      },
      {
        id: 'tsh-chi',
        name: 'Chilonzor tuman filiali',
        staff: [
          { id: 'st-tsh-chi-1', name: 'B. Ergashev', position: 'Boshliq' },
          { id: 'st-tsh-chi-2', name: 'M. Xolmatova', position: 'Mutaxassis' },
        ],
      },
      {
        id: 'tsh-mir',
        name: 'Mirzo Ulug‘bek tuman filiali',
        staff: [
          { id: 'st-tsh-mir-1', name: 'K. Ismailov', position: 'Boshliq' },
          { id: 'st-tsh-mir-2', name: 'S. Karimova', position: 'Inspektor' },
        ],
      },
      {
        id: 'tsh-yak',
        name: 'Yakkasaroy tuman filiali',
        staff: [
          { id: 'st-tsh-yak-1', name: 'J. Rahimov', position: 'Boshliq' },
        ],
      },
      {
        id: 'tsh-uch',
        name: 'Uchtepa tuman filiali',
        staff: [
          { id: 'st-tsh-uch-1', name: 'N. Abdurahmonov', position: 'Boshliq' },
          { id: 'st-tsh-uch-2', name: 'G. Tosheva', position: 'Mutaxassis' },
        ],
      },
    ],
  },
  {
    id: 'tshv',
    name: 'Toshkent viloyati',
    type: 'region',
    children: [
      {
        id: 'tshv-ang',
        name: 'Angren shahar filiali',
        staff: [
          { id: 'st-tshv-ang-1', name: 'T. Yusupov', position: 'Boshliq' },
          { id: 'st-tshv-ang-2', name: 'L. Mirzaeva', position: 'Mutaxassis' },
        ],
      },
      {
        id: 'tshv-chi',
        name: 'Chirchiq shahar filiali',
        staff: [
          { id: 'st-tshv-chi-1', name: 'A. Sobirov', position: 'Boshliq' },
        ],
      },
      {
        id: 'tshv-zan',
        name: 'Zangiota tuman filiali',
        staff: [
          { id: 'st-tshv-zan-1', name: 'F. Qodirov', position: 'Boshliq' },
        ],
      },
      {
        id: 'tshv-bek',
        name: 'Bekobod tuman filiali',
        staff: [
          { id: 'st-tshv-bek-1', name: 'I. Ergashev', position: 'Boshliq' },
        ],
      },
    ],
  },
  {
    id: 'sam',
    name: 'Samarqand viloyati',
    type: 'region',
    children: [
      {
        id: 'sam-sam',
        name: 'Samarqand shahar filiali',
        staff: [
          { id: 'st-sam-sam-1', name: 'H. Norboyev', position: 'Boshliq' },
          { id: 'st-sam-sam-2', name: 'M. Tursunova', position: 'Mutaxassis' },
        ],
      },
      {
        id: 'sam-kat',
        name: 'Kattaqo‘rg‘on filiali',
        staff: [
          { id: 'st-sam-kat-1', name: 'R. Sharipov', position: 'Boshliq' },
        ],
      },
      {
        id: 'sam-urg',
        name: 'Urgut tuman filiali',
        staff: [
          { id: 'st-sam-urg-1', name: 'B. Eshonqulov', position: 'Boshliq' },
        ],
      },
      {
        id: 'sam-jom',
        name: 'Jomboy tuman filiali',
        staff: [
          { id: 'st-sam-jom-1', name: 'T. Xolov', position: 'Boshliq' },
        ],
      },
    ],
  },
  {
    id: 'bux',
    name: 'Buxoro viloyati',
    type: 'region',
    children: [
      {
        id: 'bux-bux',
        name: 'Buxoro shahar filiali',
        staff: [
          { id: 'st-bux-bux-1', name: 'S. Hamidov', position: 'Boshliq' },
          { id: 'st-bux-bux-2', name: 'L. Yusupova', position: 'Mutaxassis' },
        ],
      },
      {
        id: 'bux-gij',
        name: 'G‘ijduvon tuman filiali',
        staff: [
          { id: 'st-bux-gij-1', name: 'K. Farmonov', position: 'Boshliq' },
        ],
      },
      {
        id: 'bux-kog',
        name: 'Kogon shahar filiali',
        staff: [
          { id: 'st-bux-kog-1', name: 'J. Rahmonov', position: 'Boshliq' },
        ],
      },
    ],
  },
  {
    id: 'far',
    name: 'Farg‘ona viloyati',
    type: 'region',
    children: [
      {
        id: 'far-far',
        name: 'Farg‘ona shahar filiali',
        staff: [
          { id: 'st-far-far-1', name: 'A. Nazarov', position: 'Boshliq' },
          { id: 'st-far-far-2', name: 'Z. Rasulova', position: 'Mutaxassis' },
        ],
      },
      {
        id: 'far-qoq',
        name: 'Qo‘qon shahar filiali',
        staff: [
          { id: 'st-far-qoq-1', name: 'M. Sultonov', position: 'Boshliq' },
        ],
      },
      {
        id: 'far-mar',
        name: 'Marg‘ilon shahar filiali',
        staff: [
          { id: 'st-far-mar-1', name: 'D. Ismoilov', position: 'Boshliq' },
        ],
      },
    ],
  },
  {
    id: 'and',
    name: 'Andijon viloyati',
    type: 'region',
    children: [
      {
        id: 'and-and',
        name: 'Andijon shahar filiali',
        staff: [
          { id: 'st-and-and-1', name: 'S. Karimov', position: 'Boshliq' },
          { id: 'st-and-and-2', name: 'M. Ergasheva', position: 'Mutaxassis' },
        ],
      },
      {
        id: 'and-asa',
        name: 'Asaka tuman filiali',
        staff: [
          { id: 'st-and-asa-1', name: 'T. Yusupov', position: 'Boshliq' },
        ],
      },
    ],
  },
  {
    id: 'nam',
    name: 'Namangan viloyati',
    type: 'region',
    children: [
      {
        id: 'nam-nam',
        name: 'Namangan shahar filiali',
        staff: [
          { id: 'st-nam-nam-1', name: 'R. Sattorov', position: 'Boshliq' },
          { id: 'st-nam-nam-2', name: 'F. Umarova', position: 'Mutaxassis' },
        ],
      },
      {
        id: 'nam-chu',
        name: 'Chust tuman filiali',
        staff: [
          { id: 'st-nam-chu-1', name: 'H. Abdurahmonov', position: 'Boshliq' },
        ],
      },
    ],
  },
  {
    id: 'qash',
    name: 'Qashqadaryo viloyati',
    type: 'region',
    children: [
      {
        id: 'qash-qar',
        name: 'Qarshi shahar filiali',
        staff: [
          { id: 'st-qash-qar-1', name: 'N. Shukurov', position: 'Boshliq' },
        ],
      },
      {
        id: 'qash-sha',
        name: 'Shahrisabz filiali',
        staff: [
          { id: 'st-qash-sha-1', name: 'G. Boboyev', position: 'Boshliq' },
        ],
      },
    ],
  },
  {
    id: 'sur',
    name: 'Surxondaryo viloyati',
    type: 'region',
    children: [
      {
        id: 'sur-ter',
        name: 'Termiz shahar filiali',
        staff: [
          { id: 'st-sur-ter-1', name: 'B. Xolov', position: 'Boshliq' },
        ],
      },
      {
        id: 'sur-den',
        name: 'Denov tuman filiali',
        staff: [
          { id: 'st-sur-den-1', name: 'A. Qodirov', position: 'Boshliq' },
        ],
      },
    ],
  },
  {
    id: 'jiz',
    name: 'Jizzax viloyati',
    type: 'region',
    children: [
      {
        id: 'jiz-jiz',
        name: 'Jizzax shahar filiali',
        staff: [
          { id: 'st-jiz-jiz-1', name: 'S. Yusupov', position: 'Boshliq' },
        ],
      },
    ],
  },
  {
    id: 'sir',
    name: 'Sirdaryo viloyati',
    type: 'region',
    children: [
      {
        id: 'sir-gul',
        name: 'Guliston shahar filiali',
        staff: [
          { id: 'st-sir-gul-1', name: 'M. Rahmonov', position: 'Boshliq' },
        ],
      },
    ],
  },
  {
    id: 'nav',
    name: 'Navoiy viloyati',
    type: 'region',
    children: [
      {
        id: 'nav-nav',
        name: 'Navoiy shahar filiali',
        staff: [
          { id: 'st-nav-nav-1', name: 'K. Ismoilov', position: 'Boshliq' },
        ],
      },
      {
        id: 'nav-zar',
        name: 'Zarafshon shahar filiali',
        staff: [
          { id: 'st-nav-zar-1', name: 'D. Sharipov', position: 'Boshliq' },
        ],
      },
    ],
  },
  {
    id: 'xor',
    name: 'Xorazm viloyati',
    type: 'region',
    children: [
      {
        id: 'xor-urg',
        name: 'Urganch shahar filiali',
        staff: [
          { id: 'st-xor-urg-1', name: 'O. Matkarimov', position: 'Boshliq' },
        ],
      },
      {
        id: 'xor-xiv',
        name: 'Xiva shahar filiali',
        staff: [
          { id: 'st-xor-xiv-1', name: 'R. Xudoyberdiyev', position: 'Boshliq' },
        ],
      },
    ],
  },
  {
    id: 'qqr',
    name: 'Qoraqalpog‘iston Respublikasi',
    type: 'region',
    children: [
      {
        id: 'qqr-nuk',
        name: 'Nukus shahar filiali',
        staff: [
          { id: 'st-qqr-nuk-1', name: 'T. Sultonov', position: 'Boshliq' },
        ],
      },
      {
        id: 'qqr-xuj',
        name: 'Xo‘jayli tuman filiali',
        staff: [
          { id: 'st-qqr-xuj-1', name: 'B. Yusupov', position: 'Boshliq' },
        ],
      },
    ],
  },
];

// ====== YORDAMCHI FUNKSIYALAR ======

/** Barcha filiallarni olish (flat) */
export function getAllUnits() {
  const out = [];
  ORG_UNITS.forEach((u) => {
    u.children.forEach((c) =>
      out.push({ id: c.id, name: c.name, region: u.name, regionId: u.id })
    );
  });
  return out;
}

/** Filial topish (id bo'yicha) */
export function findUnit(id) {
  for (const u of ORG_UNITS) {
    const c = u.children.find((x) => x.id === id);
    if (c) return { region: u, unit: c };
  }
  return null;
}

/** Xodim topish (id bo'yicha) */
export function findStaff(id) {
  for (const u of ORG_UNITS) {
    for (const c of u.children) {
      const s = (c.staff || []).find((x) => x.id === id);
      if (s) return { region: u, unit: c, staff: s };
    }
  }
  return null;
}

/** Qabul qiluvchi to'liq nomi (filial yoki xodim) */
export function recipientLabel(id) {
  const unit = findUnit(id);
  if (unit) return `${unit.region.name} · ${unit.unit.name}`;
  const st = findStaff(id);
  if (st) return `${st.staff.name} (${st.staff.position}) · ${st.unit.name}`;
  return id;
}

/** Filial yoki xodim haqida ma'lumot */
export function findRecipient(id) {
  const unit = findUnit(id);
  if (unit) {
    return {
      type: 'unit',
      id: unit.unit.id,
      name: unit.unit.name,
      region: unit.region.name,
      regionId: unit.region.id,
      label: `${unit.region.name} · ${unit.unit.name}`,
    };
  }
  const st = findStaff(id);
  if (st) {
    return {
      type: 'staff',
      id: st.staff.id,
      name: st.staff.name,
      position: st.staff.position,
      unitName: st.unit.name,
      unitId: st.unit.id,
      region: st.region.name,
      regionId: st.region.id,
      label: `${st.staff.name} (${st.staff.position}) · ${st.unit.name}`,
    };
  }
  return null;
}

/** Eski funksiya nomi bilan mos kelish uchun */
export function unitFullName(id) {
  return recipientLabel(id);
}

/** Barcha xodimlarni yig'ish */
export function getAllStaff() {
  const out = [];
  ORG_UNITS.forEach((u) => {
    u.children.forEach((c) => {
      (c.staff || []).forEach((s) =>
        out.push({
          ...s,
          regionId: u.id,
          regionName: u.name,
          unitId: c.id,
          unitName: c.name,
        })
      );
    });
  });
  return out;
}