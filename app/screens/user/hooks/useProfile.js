import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, onSnapshot, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../utils/firebaseConfig";
import { useAuth } from "../../../context/AuthContext";
import { getAKG } from "../../../data/akgData";
import { getRekomendasiMakanan } from "../../../data/nutrisiDatabase";
import { resolveKategori } from "../../../utils/artikelConfig";

const NUTRISI_KEYS = ["kalori", "protein", "karbohidrat", "lemak", "serat"];

export default function useProfile() {
  const [profil, setProfil] = useState(null);
  const [akg, setAkg] = useState(null);
  const [todayTotal, setTodayTotal] = useState(null);
  const [rekomendasi, setRekomendasi] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const unsub = onSnapshot(doc(db, "users", user.uid), async (snap) => {
      if (snap.exists()) {
        const parsed = snap.data();
        if (!parsed.kategori) parsed.kategori = resolveKategori(parsed);
        setProfil(parsed);

        const akgData = getAKG(parsed.kategori, parsed.subKategori);
        setAkg(akgData);

        const today = new Date().toISOString().split("T")[0];
        const q = query(
          collection(db, "users", user.uid, "history"),
          where("tanggal", "==", today)
        );
        const histSnap = await getDocs(q);
        const todayEntries = histSnap.docs.map((d) => d.data());
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
      setLoading(false);
    }, (err) => {
      console.log("Error load profil:", err);
      setLoading(false);
    });

    return unsub;
  }, [user]);

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
