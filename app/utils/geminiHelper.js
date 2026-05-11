import { ROBOFLOW_API_KEY, ROBOFLOW_URL } from "./roboflowConfig";
import { getNutrisi } from "../data/nutrisiDatabase";

// Estimasi gram berdasarkan luas bounding box relatif terhadap gambar.
// 6% luas gambar = porsi standar (gramBase). Diklem 0.25x – 4x gramBase.
function estimasiGram(gramBase, bboxArea, imageArea) {
  const relativeArea = bboxArea / imageArea;
  const factor = relativeArea / 0.06;
  const clamped = Math.min(4, Math.max(0.25, factor));
  return Math.round(gramBase * clamped);
}

export async function deteksiMakanan(base64Image) {
  const response = await fetch(
    `${ROBOFLOW_URL}?api_key=${ROBOFLOW_API_KEY}&confidence=10&overlap=20`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: base64Image,
    },
  );

  const data = await response.json();

  if (data.status === 402 || data.message?.includes("credit")) {
    throw new Error("Kredit habis. Hubungi pengembang.");
  }

  const predictions = data.predictions ?? [];
  console.log("Roboflow class names:", predictions.map((p) => p.class));
  console.log(
    "Roboflow bbox areas:",
    predictions.map((p) => ({
      class: p.class,
      area: Math.round(p.width * p.height),
      relPct: ((p.width * p.height) / ((data.image?.width ?? 640) * (data.image?.height ?? 480)) * 100).toFixed(1) + "%",
    })),
  );

  if (predictions.length === 0) {
    throw new Error("Tidak ada makanan terdeteksi dalam foto");
  }

  const imageArea = (data.image?.width ?? 640) * (data.image?.height ?? 480);

  // Setiap prediksi dari Roboflow (setelah NMS overlap=20) adalah objek berbeda.
  // Tidak deduplikasi — 2 telur → 2 entri dengan gram masing-masing.
  const makananList = predictions.map((pred) => {
    const nutrisi = getNutrisi(pred.class);
    const gramBase = nutrisi.gramBase ?? 100;
    const bboxArea = pred.width * pred.height;
    const gram = estimasiGram(gramBase, bboxArea, imageArea);
    const skala = gram / gramBase;

    return {
      nama: nutrisi.nama,
      porsi: `±${gram} gram`,
      kalori: Math.round(nutrisi.kalori * skala),
      protein: parseFloat((nutrisi.protein * skala).toFixed(1)),
      karbohidrat: parseFloat((nutrisi.karbohidrat * skala).toFixed(1)),
      lemak: parseFloat((nutrisi.lemak * skala).toFixed(1)),
      serat: parseFloat((nutrisi.serat * skala).toFixed(1)),
      confidence: Math.round(pred.confidence * 100),
    };
  });

  const total = makananList.reduce(
    (acc, item) => ({
      kalori: acc.kalori + item.kalori,
      protein: acc.protein + item.protein,
      karbohidrat: acc.karbohidrat + item.karbohidrat,
      lemak: acc.lemak + item.lemak,
      serat: acc.serat + item.serat,
    }),
    { kalori: 0, protein: 0, karbohidrat: 0, lemak: 0, serat: 0 },
  );

  return { makananList, total };
}
