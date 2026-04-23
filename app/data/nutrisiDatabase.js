// Database nutrisi berdasarkan class yang dideteksi Roboflow
// Sumber: TKPI (Tabel Komposisi Pangan Indonesia) + data umum
const nutrisiDatabase = {
  rice: {
    nama: "Nasi Putih",
    porsi: "100 gram",
    kalori: 175,
    protein: 3,
    karbohidrat: 40,
    lemak: 0.2,
    serat: 0.3,
  },
  hamburger: {
    nama: "Burger",
    porsi: "150 gram",
    kalori: 354,
    protein: 17,
    karbohidrat: 29,
    lemak: 17,
    serat: 1.3,
  },
  sandwich: {
    nama: "Sandwich",
    porsi: "120 gram",
    kalori: 250,
    protein: 10,
    karbohidrat: 32,
    lemak: 9,
    serat: 2,
  },
  apple: {
    nama: "Apel",
    porsi: "150 gram",
    kalori: 78,
    protein: 0.4,
    karbohidrat: 21,
    lemak: 0.2,
    serat: 3.6,
  },
  orange: {
    nama: "Jeruk",
    porsi: "130 gram",
    kalori: 61,
    protein: 1.2,
    karbohidrat: 15,
    lemak: 0.2,
    serat: 3.1,
  },
  banana: {
    nama: "Pisang",
    porsi: "120 gram",
    kalori: 107,
    protein: 1.3,
    karbohidrat: 27,
    lemak: 0.4,
    serat: 3.1,
  },
  tomato: {
    nama: "Tomat",
    porsi: "100 gram",
    kalori: 18,
    protein: 0.9,
    karbohidrat: 3.9,
    lemak: 0.2,
    serat: 1.2,
  },
  carrot: {
    nama: "Wortel",
    porsi: "100 gram",
    kalori: 41,
    protein: 0.9,
    karbohidrat: 9.6,
    lemak: 0.2,
    serat: 2.8,
  },
  broccoli: {
    nama: "Brokoli",
    porsi: "100 gram",
    kalori: 34,
    protein: 2.8,
    karbohidrat: 6.6,
    lemak: 0.4,
    serat: 2.6,
  },
  cucumber: {
    nama: "Timun",
    porsi: "100 gram",
    kalori: 15,
    protein: 0.7,
    karbohidrat: 3.6,
    lemak: 0.1,
    serat: 0.5,
  },
  onion: {
    nama: "Bawang",
    porsi: "50 gram",
    kalori: 20,
    protein: 0.6,
    karbohidrat: 4.7,
    lemak: 0.1,
    serat: 0.9,
  },
  lemon: {
    nama: "Lemon",
    porsi: "80 gram",
    kalori: 22,
    protein: 0.8,
    karbohidrat: 7,
    lemak: 0.2,
    serat: 2.1,
  },
  kiwi: {
    nama: "Kiwi",
    porsi: "100 gram",
    kalori: 61,
    protein: 1.1,
    karbohidrat: 15,
    lemak: 0.5,
    serat: 3,
  },
  chicken_nuggets: {
    nama: "Nugget Ayam",
    porsi: "100 gram",
    kalori: 297,
    protein: 14,
    karbohidrat: 17,
    lemak: 19,
    serat: 0.5,
  },
  chinese_cabbage: {
    nama: "Sawi Putih",
    porsi: "100 gram",
    kalori: 13,
    protein: 1.2,
    karbohidrat: 2.2,
    lemak: 0.2,
    serat: 1,
  },
  pizza: {
    nama: "Pizza",
    porsi: "150 gram",
    kalori: 266,
    protein: 11,
    karbohidrat: 33,
    lemak: 10,
    serat: 2,
  },
};

// Cari nutrisi berdasarkan nama class dari Roboflow
export function getNutrisi(classNama) {
  const key = classNama.toLowerCase().replace(" ", "_");
  return (
    nutrisiDatabase[key] || {
      nama: classNama,
      porsi: "100 gram",
      kalori: 0,
      protein: 0,
      karbohidrat: 0,
      lemak: 0,
      serat: 0,
    }
  );
}

// Rekomendasikan makanan berdasarkan nutrisi yang paling kurang
export function getRekomendasiMakanan(kurangNutrisi) {
  if (!kurangNutrisi || kurangNutrisi.length === 0) return [];
  const utama = kurangNutrisi[0]; // nutrisi paling defisit
  return Object.values(nutrisiDatabase)
    .sort((a, b) => b[utama] - a[utama])
    .slice(0, 4);
}
