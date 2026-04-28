import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useUserProfil() {
  const [profil, setProfil] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("@nutriscan_profil").then((raw) => {
      if (raw) setProfil(JSON.parse(raw));
    });
  }, []);

  return profil;
}
