// Data AKG berdasarkan Kemenkes Indonesia 2019
const akgData = {
  ibu_hamil: {
    trimester_1: {
      label: "Ibu Hamil Trimester 1",
      kalori: 2430,
      protein: 57,
      lemak: 75,
      karbohidrat: 340,
      serat: 28,
    },
    trimester_2: {
      label: "Ibu Hamil Trimester 2",
      kalori: 2550,
      protein: 66,
      lemak: 75,
      karbohidrat: 365,
      serat: 28,
    },
    trimester_3: {
      label: "Ibu Hamil Trimester 3",
      kalori: 2550,
      protein: 66,
      lemak: 75,
      karbohidrat: 365,
      serat: 28,
    },
  },
  balita: {
    "0-6_bulan": {
      label: "Balita 0–6 Bulan",
      kalori: 550,
      protein: 12,
      lemak: 34,
      karbohidrat: 58,
      serat: 0,
    },
    "7-11_bulan": {
      label: "Balita 7–11 Bulan",
      kalori: 725,
      protein: 18,
      lemak: 45,
      karbohidrat: 82,
      serat: 10,
    },
    "1-3_tahun": {
      label: "Balita 1–3 Tahun",
      kalori: 1125,
      protein: 26,
      lemak: 44,
      karbohidrat: 155,
      serat: 16,
    },
    "4-6_tahun": {
      label: "Balita 4–6 Tahun",
      kalori: 1600,
      protein: 40,
      lemak: 62,
      karbohidrat: 220,
      serat: 22,
    },
  },
};

// Ambil Target AKG berdasarkan profil user
export function getAKG(kategori, subKategori) {
  return akgData[kategori]?.[subKategori] || null;
}

export default akgData;
