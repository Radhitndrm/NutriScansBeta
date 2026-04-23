import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    const raw = await AsyncStorage.getItem("@nutriscan_history");
    setHistory(raw ? JSON.parse(raw) : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadHistory();
  }, []);

  async function hapusEntry(id) {
    const baru = history.filter((h) => h.id !== id);
    setHistory(baru);
    await AsyncStorage.setItem("@nutriscan_history", JSON.stringify(baru));
  }

  // Kelompokkan history berdasarkan tanggal
  const grouped = history.reduce((acc, entry) => {
    if (!acc[entry.tanggal]) acc[entry.tanggal] = [];
    acc[entry.tanggal].push(entry);
    return acc;
  }, {});

  const groupedList = Object.entries(grouped).map(([tanggal, entries]) => ({
    tanggal,
    entries,
    totalHarian: entries.reduce(
      (acc, e) => ({
        kalori: acc.kalori + e.total.kalori,
        protein: acc.protein + e.total.protein,
        karbohidrat: acc.karbohidrat + e.total.karbohidrat,
        lemak: acc.lemak + e.total.lemak,
        serat: acc.serat + e.total.serat,
      }),
      { kalori: 0, protein: 0, karbohidrat: 0, lemak: 0, serat: 0 }
    ),
  }));

  return { groupedList, loading, hapusEntry, refresh: loadHistory };
}
