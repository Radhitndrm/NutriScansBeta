import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../utils/firebaseConfig";
import { useAuth } from "../../../context/AuthContext";
import { resolveKategori } from "../../../utils/artikelConfig";

export default function useUserProfil() {
  const { user } = useAuth();
  const [profil, setProfil] = useState(null);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (!snap.exists()) return;
      const parsed = snap.data();
      if (!parsed.kategori) parsed.kategori = resolveKategori(parsed);
      setProfil(parsed);
    });
    return unsub;
  }, [user]);

  return profil;
}
