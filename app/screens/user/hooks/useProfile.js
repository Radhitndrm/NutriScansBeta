import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../../context/AuthContext";
import { getAKG } from "../../../data/akgData";
import { getRekomendasiMakanan } from "../../../data/nutrisiDatabase";

const NUTRISI_KEYS = ["kalori", "protein", "karbohidrat", "lemak", "serat"];

export default function useProfile() {
  const [profil, setProfil] = useState(null);
  const [akg, setAkg] = useState(null);
  const [todayTotal, setTodayTotal] = useState(null);
  const [rekomendasi, setRekomendasi] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) loadProfil();
  }, [user]);

  async function loadProfil() {
    try {
      const data = await AsyncStorage.getItem(`@nutriscan_profil_${user.uid}`);
      if (data) {
        const parsed = JSON.parse(data);
        setProfil(parsed);
        const akgData = getAKG(parsed.kategori, parsed.subKategori);
        setAkg(akgData);

        const today = new Date().toISOString().split("T")[0];
        const raw = await AsyncStorage.getItem(`@nutriscan_history_${user.uid}`);
        const history = raw ? JSON.parse(raw) : [];
        const todayEntries = history.filter((h) => h.tanggal === today);
        const total = todayEntries.reduce(
          (acc, e) => ({
            kalori: acc.kalori + e.total.kalori,
            protein: acc.protein + e.total.protein,
            karbohidrat: acc.karbohidrat + e.total.karbohidrat,
            lemak: acc.lemak + e.total.lemak,
            serat: acc.serat + (e.total.serat ?? 0),
          }),
          { kalori: 0, protein: 0, karbohidrat: 0, lemak: 0, serat: 0 }
        );
        setTodayTotal(total);

        if (akgData) {
          const kurang = NUTRISI_KEYS
            .filter((k) => total[k] / akgData[k] < 0.5)
            .sort((a, b) => total[a] / akgData[a] - total[b] / akgData[b]);
          setRekomendasi(getRekomendasiMakanan(kurang));
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfil(patch) {
    const updated = { ...profil, ...patch };
    await AsyncStorage.setItem(`@nutriscan_profil_${user.uid}`, JSON.stringify(updated));
    setProfil(updated);
  }

  return { profil, akg, todayTotal, rekomendasi, loading, user, logout, updateProfil };
}
