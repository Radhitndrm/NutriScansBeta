import { useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../../context/AuthContext";

function validasiStep1(email, password, konfirmasi) {
  if (!email || !password || !konfirmasi) return "Semua kolom harus diisi";
  if (password !== konfirmasi) return "Password dan konfirmasi tidak sama";
  if (password.length < 6) return "Password minimal 6 karakter";
  return null;
}

function validasiStep2(kategori, trimester, namaAnak, usiaBalita) {
  if (!kategori) return "Pilih kategori terlebih dahulu";
  if (kategori === "ibu_hamil" && !trimester) return "Pilih trimester kehamilan";
  if (kategori === "balita" && !namaAnak) return "Masukkan nama anak";
  if (kategori === "balita" && !usiaBalita) return "Pilih kelompok usia anak";
  return null;
}

export default function useRegister(navigation) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [kategori, setKategori] = useState(null);
  const [trimester, setTrimester] = useState(null);
  const [namaAnak, setNamaAnak] = useState("");
  const [usiaBalita, setUsiaBalita] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  function handleLanjut() {
    const error = validasiStep1(email, password, konfirmasi);
    if (error) { Alert.alert("Error", error); return; }
    setStep(2);
  }

  async function handleDaftar() {
    const error = validasiStep2(kategori, trimester, namaAnak, usiaBalita);
    if (error) { Alert.alert("Error", error); return; }

    try {
      setLoading(true);
      const userCredential = await register(email, password);
      const profil = {
        uid: userCredential.user.uid,
        email,
        kategori,
        subKategori: kategori === "ibu_hamil" ? trimester : usiaBalita,
        namaAnak: kategori === "balita" ? namaAnak : null,
      };
      await AsyncStorage.setItem("@nutriscan_profil", JSON.stringify(profil));
    } catch (error) {
      Alert.alert("Gagal Daftar", "Email sudah dipakai atau tidak valid");
    } finally {
      setLoading(false);
    }
  }

  return {
    step,
    email, setEmail,
    password, setPassword,
    konfirmasi, setKonfirmasi,
    kategori, setKategori,
    trimester, setTrimester,
    namaAnak, setNamaAnak,
    usiaBalita, setUsiaBalita,
    loading,
    handleLanjut,
    handleDaftar,
    handleKembali: () => setStep(1),
  };
}
