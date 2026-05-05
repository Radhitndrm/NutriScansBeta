import { ROBOFLOW_API_KEY, ROBOFLOW_URL } from "./roboflowConfig";
import { getNutrisi } from "../data/nutrisiDatabase";

export async function deteksiMakanan(base64Image) {
  const response = await fetch(
    `${ROBOFLOW_URL}?api_key=${ROBOFLOW_API_KEY}&confidence=10&overlap=30`,
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

  if (predictions.length === 0) {
    throw new Error("Tidak ada makanan terdeteksi dalam foto");
  }

  const unikClass = {};
  predictions.forEach((pred) => {
    if (
      !unikClass[pred.class] ||
      pred.confidence > unikClass[pred.class].confidence
    ) {
      unikClass[pred.class] = pred;
    }
  });

  // Ambil nutrisi untuk setiap makanan terdeteksi
  const makananList = Object.values(unikClass).map((pred) => ({
    ...getNutrisi(pred.class),
    confidence: Math.round(pred.confidence * 100),
  }));

  // Hitung total nutrisi
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
