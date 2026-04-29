import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../../context/AuthContext";

export default function useUserProfil() {
  const { user } = useAuth();
  const [profil, setProfil] = useState(null);

  useEffect(() => {
    if (!user) return;
    AsyncStorage.getItem(`@nutriscan_profil_${user.uid}`).then((raw) => {
      if (raw) setProfil(JSON.parse(raw));
    });
  }, [user]);

  return profil;
}
