import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../../context/AuthContext";
import { resolveKategori } from "../../../utils/artikelConfig";

export default function useUserProfil() {
  const { user } = useAuth();
  const [profil, setProfil] = useState(null);

  useEffect(() => {
    if (!user) return;
    AsyncStorage.getItem(`@nutriscan_profil_${user.uid}`).then((raw) => {
      if (!raw) return;
      const parsed = JSON.parse(raw);
      // Infer kategori dari subKategori kalau field-nya hilang di data lama
      if (!parsed.kategori) parsed.kategori = resolveKategori(parsed);
      setProfil(parsed);
    });
  }, [user]);

  return profil;
}
