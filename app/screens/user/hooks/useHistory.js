import { useState, useEffect } from "react";
import { collection, onSnapshot, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "../../../utils/firebaseConfig";
import { useAuth } from "../../../context/AuthContext";

export default function useHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "users", user.uid, "history"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setHistory(snap.docs.map((d) => ({ ...d.data(), id: d.id })));
      setLoading(false);
    }, (err) => {
      console.log("Error load history:", err);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  async function hapusEntry(id) {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "history", id));
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
      return { tanggal, entries, totalHarian };
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
    refresh: () => {},
  };
}
