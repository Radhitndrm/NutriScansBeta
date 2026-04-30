import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../../context/AuthContext";

export default function useHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const key = user ? `@nutriscan_history_${user.uid}` : null;

  const loadHistory = useCallback(async () => {
    if (!key) return;
    try {
      setLoading(true);
      const raw = await AsyncStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      setHistory(parsed);
    } catch (err) {
      console.log("Error load history:", err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  async function hapusEntry(id) {
    if (!key) return;
    const baru = history.filter((h) => h.id !== id);
    setHistory(baru);
    await AsyncStorage.setItem(key, JSON.stringify(baru));
  }

  const grouped = history.reduce((acc, entry) => {
    if (!acc[entry.tanggal]) acc[entry.tanggal] = [];
    acc[entry.tanggal].push(entry);
    return acc;
  }, {});

  const groupedList = Object.entries(grouped)
    .map(([tanggal, entries]) => {
      const totalHarian = entries.reduce(
        (acc, e) => ({
          kalori: acc.kalori + (e.total?.kalori || 0),
          protein: acc.protein + (e.total?.protein || 0),
          karbohidrat: acc.karbohidrat + (e.total?.karbohidrat || 0),
          lemak: acc.lemak + (e.total?.lemak || 0),
          serat: acc.serat + (e.total?.serat || 0),
        }),
        { kalori: 0, protein: 0, karbohidrat: 0, lemak: 0, serat: 0 }
      );

      return {
        tanggal,
        entries,
        totalHarian,
      };
    })
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal));

  const weeklySummary = groupedList.slice(0, 7).reduce(
    (acc, day) => ({
      kalori: acc.kalori + day.totalHarian.kalori,
      protein: acc.protein + day.totalHarian.protein,
      karbohidrat: acc.karbohidrat + day.totalHarian.karbohidrat,
      lemak: acc.lemak + day.totalHarian.lemak,
    }),
    { kalori: 0, protein: 0, karbohidrat: 0, lemak: 0 }
  );

  return {
    groupedList,
    weeklySummary,
    loading,
    hapusEntry,
    refresh: loadHistory,
  };
}
