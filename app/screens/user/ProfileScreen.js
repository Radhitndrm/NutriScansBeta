import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { C } from "../../theme/colors";
import useProfile from "./hooks/useProfile";
import { LinearGradient } from "expo-linear-gradient";

const LABEL_SUB = {
  trimester_1: "Trimester 1",
  trimester_2: "Trimester 2",
  trimester_3: "Trimester 3",
  "0-6_bulan": "0 – 6 Bulan",
  "7-11_bulan": "7 – 11 Bulan",
  "1-3_tahun": "1 – 3 Tahun",
  "4-6_tahun": "4 – 6 Tahun",
};

const TRIMESTER = [
  { id: "trimester_1", label: "Trimester 1", sub: "0 – 12 minggu" },
  { id: "trimester_2", label: "Trimester 2", sub: "13 – 26 minggu" },
  { id: "trimester_3", label: "Trimester 3", sub: "27 – 40 minggu" },
];

const USIA_BALITA = [
  { id: "0-6_bulan", label: "0 – 6 Bulan" },
  { id: "7-11_bulan", label: "7 – 11 Bulan" },
  { id: "1-3_tahun", label: "1 – 3 Tahun" },
  { id: "4-6_tahun", label: "4 – 6 Tahun" },
];

const GIZI = [
  { key: "kalori", label: "Kalori", satuan: "kkal" },
  { key: "protein", label: "Protein", satuan: "g" },
  { key: "karbohidrat", label: "Karbohidrat", satuan: "g" },
  { key: "lemak", label: "Lemak", satuan: "g" },
  { key: "serat", label: "Serat", satuan: "g" },
];

function persen(dapat, target) {
  if (!target || target === 0) return 0;
  return Math.min(Math.round((dapat / target) * 100), 100);
}

function BarGizi({ label, satuan, target, dapat }) {
  const p = persen(dapat, target);
  const warnaTeks = p >= 80 ? "#4a7a4a" : p >= 50 ? "#8a7040" : "#8a4040";
  return (
    <View style={{ marginBottom: 16 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <Text
          style={{
            color: C.smoke,
            fontWeight: "600",
            fontSize: 13,
            fontFamily: "Inter_600SemiBold",
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            color: C.smoke,
            opacity: 0.6,
            fontSize: 13,
            fontFamily: "Inter_400Regular",
          }}
        >
          {dapat != null
            ? `${Math.round(dapat * 10) / 10} / ${target} ${satuan}`
            : `${target} ${satuan}/hari`}
        </Text>
      </View>
      <View
        style={{ backgroundColor: C.cardDark, borderRadius: 99, height: 10 }}
      >
        <View
          style={{
            backgroundColor: C.smoke,
            borderRadius: 99,
            height: 10,
            width: `${p}%`,
            opacity: 0.7 + (p / 100) * 0.3,
          }}
        />
      </View>
      {dapat != null && (
        <Text
          style={{
            fontSize: 11,
            marginTop: 4,
            color: warnaTeks,
            fontFamily: "Inter_400Regular",
          }}
        >
          {p}% terpenuhi
        </Text>
      )}
    </View>
  );
}

function InfoBaris({ label, nilai }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: C.cardDark,
      }}
    >
      <Text
        style={{ color: C.smoke, opacity: 0.6, fontFamily: "Inter_400Regular" }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: C.smoke,
          fontWeight: "600",
          fontFamily: "Inter_600SemiBold",
        }}
      >
        {nilai}
      </Text>
    </View>
  );
}

/* ── Modal Ganti Sub Kategori ── */
function ModalGantiSubKategori({ visible, profil, onSimpan, onBatal }) {
  const [pilihan, setPilihan] = useState(profil?.subKategori ?? null);
  const opsi = profil?.kategori === "ibu_hamil" ? TRIMESTER : USIA_BALITA;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onBatal}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)" }}
        activeOpacity={1}
        onPress={onBatal}
      />
      <View
        style={{
          backgroundColor: C.skyWarm,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: 40,
        }}
      >
        <View
          style={{
            width: 40,
            height: 4,
            backgroundColor: C.cardDark,
            borderRadius: 2,
            alignSelf: "center",
            marginBottom: 24,
          }}
        />

        <Text
          style={{
            color: C.smoke,
            fontFamily: "Inter_700Bold",
            fontSize: 18,
            marginBottom: 6,
          }}
        >
          Ganti Sub Kategori
        </Text>
        <Text
          style={{
            color: C.smoke,
            opacity: 0.55,
            fontSize: 13,
            fontFamily: "Inter_400Regular",
            marginBottom: 20,
          }}
        >
          {profil?.kategori === "ibu_hamil"
            ? "Pilih trimester kehamilan saat ini"
            : "Pilih kelompok usia anak"}
        </Text>

        {opsi.map((item) => {
          const selected = pilihan === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => setPilihan(item.id)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: selected ? C.selectedBg : C.inputBg,
                borderWidth: 2,
                borderColor: selected ? C.smoke : "transparent",
                borderRadius: 14,
                paddingHorizontal: 16,
                paddingVertical: 14,
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: C.smoke,
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 14,
                }}
              >
                {item.label}
              </Text>
              {item.sub && (
                <Text
                  style={{
                    color: C.smoke,
                    opacity: 0.55,
                    fontSize: 13,
                    fontFamily: "Inter_400Regular",
                  }}
                >
                  {item.sub}
                </Text>
              )}
              {selected && (
                <Ionicons name="checkmark-circle" size={20} color={C.smoke} />
              )}
            </TouchableOpacity>
          );
        })}

        <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
          <TouchableOpacity
            onPress={onBatal}
            style={{
              flex: 1,
              borderRadius: 14,
              paddingVertical: 14,
              alignItems: "center",
              backgroundColor: C.card,
            }}
          >
            <Text style={{ color: C.smoke, fontFamily: "Inter_600SemiBold" }}>
              Batal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => pilihan && onSimpan(pilihan)}
            disabled={!pilihan}
            style={{
              flex: 2,
              borderRadius: 14,
              paddingVertical: 14,
              alignItems: "center",
              backgroundColor: pilihan ? C.smoke : C.cardDark,
            }}
          >
            <Text style={{ color: C.white, fontFamily: "Inter_600SemiBold" }}>
              Simpan
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* ── Modal Edit Profil ── */
function ModalEditProfil({ visible, profil, onSimpan, onBatal }) {
  const [username, setUsername] = useState(profil?.username ?? "");
  const [fotoUri, setFotoUri] = useState(profil?.fotoUri ?? null);
  const [kategori, setKategori] = useState(profil?.kategori ?? "ibu_hamil");
  const [subKategori, setSubKategori] = useState(profil?.subKategori ?? null);
  const [namaAnak, setNamaAnak] = useState(profil?.namaAnak ?? "");

  const opsiSub = kategori === "ibu_hamil" ? TRIMESTER : USIA_BALITA;

  async function pilihFoto() {
    const izin = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!izin.granted) {
      Alert.alert("Izin Ditolak", "Butuh akses galeri");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setFotoUri(result.assets[0].uri);
    }
  }

  async function ambilFoto() {
    const izin = await ImagePicker.requestCameraPermissionsAsync();
    if (!izin.granted) {
      Alert.alert("Izin Ditolak", "Butuh akses kamera");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setFotoUri(result.assets[0].uri);
    }
  }

  function pilihSumber() {
    Alert.alert("Foto Profil", "Pilih sumber", [
      { text: "Kamera", onPress: ambilFoto },
      { text: "Galeri", onPress: pilihFoto },
      { text: "Batal", style: "cancel" },
    ]);
  }

  function pilihKategori(val) {
    setKategori(val);
    setSubKategori(null);

    if (val === "ibu_hamil") {
      setNamaAnak(""); // reset biar ga kebawa
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
          activeOpacity={1}
          onPress={onBatal}
        />
        <ScrollView
          style={{
            backgroundColor: "#EAE7DF",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          }}
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 14,
              textAlign: "center",
            }}
          >
            Edit Profil
          </Text>

          <TouchableOpacity onPress={pilihSumber} activeOpacity={0.8}>
            <View style={{ position: "relative" }}>
              {fotoUri ? (
                <Image
                  source={{ uri: fotoUri }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: "#ccc",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="person" size={30} color="#333" />
                </View>
              )}

              {/* icon kecil */}
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  backgroundColor: "#333",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: "#EAE7DF",
                }}
              >
                <Ionicons name="camera" size={14} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* NAMA */}
        <Text>Nama</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            padding: 12,
            marginBottom: 14,
          }}
        />

        {/* KATEGORI */}
        <Text>Kategori</Text>
        <View style={{ flexDirection: "row", marginBottom: 14 }}>
          {["ibu_hamil", "balita"].map((k) => (
            <TouchableOpacity
              key={k}
              onPress={() => pilihKategori(k)}
              style={{
                flex: 1,
                padding: 12,
                marginRight: 6,
                backgroundColor: kategori === k ? "#333" : "#D6D3C8",
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: kategori === k ? "#fff" : "#333",
                }}
              >
                {k === "ibu_hamil" ? "Ibu Hamil" : "Balita"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SUB */}
        <Text>Sub Kategori</Text>
        {opsiSub.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setSubKategori(item.id)}
            style={{
              padding: 12,
              backgroundColor: subKategori === item.id ? "#333" : "#fff",
              borderRadius: 10,
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                color: subKategori === item.id ? "#fff" : "#333",
              }}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}

        {/* NAMA ANAK (hanya balita) */}
        {kategori === "balita" && (
          <>
            <Text>Nama Anak</Text>
            <TextInput
              value={namaAnak}
              onChangeText={setNamaAnak}
              style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                padding: 12,
                marginTop: 6,
                marginBottom: 14,
              }}
            />
          </>
        )}

        {/* BUTTON */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            onPress={onBatal}
            style={{
              flex: 1,
              padding: 14,
              backgroundColor: "#ccc",
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text>Batal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              onSimpan({
                username,
                fotoUri,
                kategori,
                subKategori,
                namaAnak: kategori === "balita" ? namaAnak : null,
              })
            }
            style={{
              flex: 2,
              padding: 14,
              backgroundColor: "#333",
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff" }}>Simpan</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ── Screen utama ── */
export default function ProfileScreen() {
  const { profil, akg, todayTotal, loading, user, logout, updateProfil } =
    useProfile();
  const [showEdit, setShowEdit] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: C.skyWarm,
        }}
      >
        <ActivityIndicator size="large" color={C.smoke} />
      </View>
    );
  }

  const isIbuHamil = profil?.kategori === "ibu_hamil";
  const labelKategori = isIbuHamil ? "Ibu Hamil" : "Balita";

  async function handleSimpan(patch) {
    if (!patch.username) {
      Alert.alert("Error", "Nama pengguna tidak boleh kosong");
      return;
    }
    await updateProfil(patch);
    setShowEdit(false);
  }

  async function handleSimpanSubKat(subKategori) {
    await updateProfil({ subKategori });
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#EAE7DF" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* HEADER */}
        <LinearGradient
          colors={["#5d6256", "#AAB0A3"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            paddingTop: 20,
            paddingHorizontal: 20,
            paddingBottom: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Avatar */}
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "#AAB0A3",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {profil?.fotoUri ? (
                <Image
                  source={{ uri: profil.fotoUri }}
                  style={{ width: 60, height: 60, borderRadius: 30 }}
                />
              ) : (
                <Ionicons name="person" size={28} color="#333" />
              )}
            </View>

            {/* CARD INFO */}
            <View
              style={{
                marginLeft: 12,
                backgroundColor: "#C1C3BD",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 12,
                flex: 1,
              }}
            >
              <Text style={{ fontSize: 11, color: "#444", marginBottom: 2 }}>
                {isIbuHamil ? "Ibu Hamil" : "Balita"}
              </Text>

              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: "#2E2E2E",
                }}
                numberOfLines={1}
              >
                {profil?.username || user?.email}
              </Text>
            </View>

            {/* Edit */}
            <TouchableOpacity
              onPress={() => setShowEdit(true)}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="create-outline" size={18} color="#CCCABD" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* CONTENT */}
        <View style={{ padding: 20 }}>
          {/* DATA PROFIL */}
          <Text
            style={{
              backgroundColor: "#D6D3C8",
              alignSelf: "flex-start",
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 10,
              marginBottom: 10,
              fontSize: 12,
            }}
          >
            Data Profil
          </Text>

          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              overflow: "hidden",
              marginBottom: 20,
            }}
          >
            <InfoBaris label="Kategori" nilai={labelKategori} />

            <InfoBaris
              label="Sub Kategori"
              nilai={LABEL_SUB[profil?.subKategori] || akg?.label || "-"}
            />

            {profil?.kategori === "balita" && (
              <InfoBaris label="Nama Anak" nilai={profil?.namaAnak || "-"} />
            )}

            <InfoBaris label="Email" nilai={user?.email} />
          </View>

          {/* GIZI */}
          <Text
            style={{
              backgroundColor: "#D6D3C8",
              alignSelf: "flex-start",
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 10,
              marginBottom: 10,
              fontSize: 12,
            }}
          >
            Pemenuhan Gizi Hari Ini
          </Text>

          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 16,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                color: "#777",
                marginBottom: 12,
              }}
            >
              Berdasarkan AKG Kemenkes 2019 · {akg?.label}
            </Text>

            {GIZI.map((g) => (
              <BarGizi
                key={g.key}
                label={g.label}
                satuan={g.satuan}
                target={akg?.[g.key] ?? 0}
                dapat={todayTotal?.[g.key] ?? 0}
              />
            ))}
          </View>

          {/* LOGOUT */}
          <TouchableOpacity
            onPress={() => setShowLogout(true)}
            style={{
              marginTop: 30,
              backgroundColor: "#333",
              borderRadius: 30,
              paddingVertical: 14,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Keluar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODALS */}
      {showEdit && (
        <ModalEditProfil
          visible={showEdit}
          profil={profil}
          onSimpan={handleSimpan}
          onBatal={() => setShowEdit(false)}
        />
      )}

      {/* Modal Konfirmasi Logout */}
      <Modal visible={showLogout} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center", paddingHorizontal: 32 }}>
          <View style={{ backgroundColor: "#EAE7DF", borderRadius: 24, padding: 28, width: "100%", alignItems: "center" }}>
            <Ionicons name="log-out-outline" size={40} color="#333" style={{ marginBottom: 12 }} />
            <Text style={{ fontSize: 17, fontWeight: "700", color: "#2E2E2E", marginBottom: 8 }}>
              Keluar dari Akun?
            </Text>
            <Text style={{ fontSize: 13, color: "#777", textAlign: "center", marginBottom: 24 }}>
              Kamu perlu login kembali untuk menggunakan NutriScan.
            </Text>
            <View style={{ flexDirection: "row", gap: 12, width: "100%" }}>
              <TouchableOpacity
                onPress={() => setShowLogout(false)}
                style={{ flex: 1, paddingVertical: 13, backgroundColor: "#D6D3C8", borderRadius: 14, alignItems: "center" }}
              >
                <Text style={{ fontWeight: "600", color: "#444" }}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setShowLogout(false); logout(); }}
                style={{ flex: 1, paddingVertical: 13, backgroundColor: "#333", borderRadius: 14, alignItems: "center" }}
              >
                <Text style={{ fontWeight: "600", color: "#fff" }}>Keluar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
