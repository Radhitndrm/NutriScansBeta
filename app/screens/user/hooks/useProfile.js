import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, onSnapshot, setDoc, collection, query, where } from "firebase/firestore";
import { db } from "../../../utils/firebaseConfig";
import { useAuth } from "../../../context/AuthContext";
import { getAKG } from "../../../data/akgData";
import { getRekomendasiMakanan } from "../../../data/nutrisiDatabase";
import { resolveKategori } from "../../../utils/artikelConfig";

const NUTRISI_KEYS = ["kalori", "protein", "karbohidrat", "lemak", "serat"];

export default function useProfile() {
  const [profil, setProfil] = useState(null);
  const [akg, setAkg] = useState(null);
  const [todayTotal, setTodayTotal] = useState({ kalori: 0, protein: 0, karbohidrat: 0, lemak: 0, serat: 0 });
  const [rekomendasi, setRekomendasi] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, logout } = useAuth();

  // Listener 1: profil user
  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) {
        const parsed = snap.data();
        if (!parsed.kategori) parsed.kategori = resolveKategori(parsed);
        setProfil(parsed);
        setAkg(getAKG(parsed.kategori, parsed.subKategori));
      }
      setLoading(false);
    }, (err) => {
      console.log("Error load profil:", err);
      setLoading(false);
    });

    return unsub;
  }, [user]);

  // Listener 2: history hari ini — update real-time setiap ada scan baru
  useEffect(() => {
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];
    const q = query(
      collection(db, "users", user.uid, "history"),
      where("tanggal", "==", today)
    );

    const unsub = onSnapshot(q, (snap) => {
      const entries = snap.docs.map((d) => d.data());
      const total = entries.reduce(
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
    }, (err) => {
      console.log("Error load today history:", err);
    });

    return unsub;
  }, [user]);

  // Rekomendasi dihitung ulang setiap akg atau todayTotal berubah
  useEffect(() => {
    if (!akg || !todayTotal) return;
    const kurang = NUTRISI_KEYS
      .filter((k) => todayTotal[k] / akg[k] < 0.5)
      .sort((a, b) => todayTotal[a] / akg[a] - todayTotal[b] / akg[b]);
    setRekomendasi(getRekomendasiMakanan(kurang));
  }, [akg, todayTotal]);

  async function updateProfil(patch) {
    const updated = { ...profil, ...patch };
    await setDoc(doc(db, "users", user.uid), updated, { merge: true });
    setProfil(updated);

    if (patch.subKategori && patch.subKategori !== profil?.subKategori) {
      const akgBaru = getAKG(updated.kategori, updated.subKategori);
      setAkg(akgBaru);
      await AsyncStorage.removeItem(`@nutriscan_artikel_${updated.kategori ?? "all"}`);
    }
  }

  return { profil, akg, todayTotal, rekomendasi, loading, user, logout, updateProfil };
}
