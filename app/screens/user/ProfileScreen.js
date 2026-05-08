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
import { LinearGradient } from "expo-linear-gradient";
import { C } from "../../theme/colors";
import useProfile from "./hooks/useProfile";

const NUTRISI_COLORS = {
  kalori: "#E8935A",
  protein: "#5A8BE8",
  karbohidrat: "#5ABF8E",
  lemak: "#BF7A5A",
  serat: "#8A8E5A",
};

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

/* ── Progress bar per nutrisi ── */
function BarGizi({ label, satuan, target, dapat, colorKey }) {
  const p = persen(dapat, target);
  const color = NUTRISI_COLORS[colorKey] ?? C.smoke;
  const statusColor = p >= 80 ? "#4a7a4a" : p >= 50 ? "#8a7040" : "#8a4040";

  return (
    <View style={{ marginBottom: 14 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: color,
            }}
          />
          <Text
            style={{
              color: C.smoke,
              fontSize: 13,
              fontFamily: "Inter_600SemiBold",
            }}
          >
            {label}
          </Text>
        </View>
        <Text
          style={{
            color: C.placeholder,
            fontSize: 12,
            fontFamily: "Inter_400Regular",
          }}
        >
          {dapat != null
            ? `${Math.round(dapat * 10) / 10} / ${target} ${satuan}`
            : `${target} ${satuan}/hari`}
        </Text>
      </View>
      <View
        style={{ backgroundColor: C.cardDark, borderRadius: 99, height: 8 }}
      >
        <View
          style={{
            backgroundColor: color,
            borderRadius: 99,
            height: 8,
            width: `${p}%`,
          }}
        />
      </View>
      {dapat != null && (
        <Text
          style={{
            fontSize: 11,
            marginTop: 3,
            color: statusColor,
            fontFamily: "Inter_400Regular",
          }}
        >
          {p}% terpenuhi
        </Text>
      )}
    </View>
  );
}

/* ── Baris info profil ── */
function InfoBaris({ label, nilai, last }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: C.cardDark,
      }}
    >
      <Text
        style={{
          color: C.placeholder,
          fontFamily: "Inter_400Regular",
          fontSize: 14,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: C.smoke,
          fontFamily: "Inter_600SemiBold",
          fontSize: 14,
        }}
      >
        {nilai}
      </Text>
    </View>
  );
}

/* ── Label section ── */
function SectionLabel({ text }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 10,
      }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: NUTRISI_COLORS.karbohidrat,
        }}
      />
      <Text
        style={{
          color: C.placeholder,
          fontSize: 11,
          fontFamily: "Inter_600SemiBold",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {text}
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
            marginBottom: 4,
          }}
        >
          Ganti Sub Kategori
        </Text>
        <Text
          style={{
            color: C.placeholder,
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
                backgroundColor: selected ? C.smoke : C.card,
                borderRadius: 14,
                paddingHorizontal: 16,
                paddingVertical: 14,
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: selected ? C.white : C.smoke,
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 14,
                }}
              >
                {item.label}
              </Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                {item.sub && (
                  <Text
                    style={{
                      color: selected
                        ? "rgba(255,255,255,0.65)"
                        : C.placeholder,
                      fontSize: 13,
                      fontFamily: "Inter_400Regular",
                    }}
                  >
                    {item.sub}
                  </Text>
                )}
                {selected && (
                  <Ionicons name="checkmark-circle" size={20} color={C.white} />
                )}
              </View>
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

/* ── Input field helper ── */
function FormField({ label, children }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text
        style={{
          color: "rgba(255,255,255,0.6)",
          fontSize: 11,
          fontFamily: "Inter_600SemiBold",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: 6,
        }}
      >
        {label}
      </Text>
      {children}
    </View>
  );
}

/* ── Modal Edit Profil ── */
function ModalEditProfil({ visible, profil, onSimpan, onBatal }) {
  const [username, setUsername] = useState(profil?.username ?? "");
  const [fotoUri, setFotoUri] = useState(profil?.fotoUri ?? null);
  const [subKategori, setSubKategori] = useState(profil?.subKategori ?? null);
  const [namaAnak, setNamaAnak] = useState(profil?.namaAnak ?? "");

  const kategori = profil?.kategori ?? "ibu_hamil";
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
    if (!result.canceled) setFotoUri(result.assets[0].uri);
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
    if (!result.canceled) setFotoUri(result.assets[0].uri);
  }

  function pilihSumber() {
    Alert.alert("Foto Profil", "Pilih sumber", [
      { text: "Kamera", onPress: ambilFoto },
      { text: "Galeri", onPress: pilihFoto },
      { text: "Batal", style: "cancel" },
    ]);
  }

  const inputStyle = {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: C.white,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  };

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
        <LinearGradient
          colors={[C.smoke, "#2d3028"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
        >
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 16,
              paddingBottom: 48,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Handle bar */}
            <View
              style={{
                width: 40,
                height: 4,
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 2,
                alignSelf: "center",
                marginBottom: 20,
              }}
            />

            {/* Title */}
            <Text
              style={{
                color: C.white,
                fontFamily: "Inter_700Bold",
                fontSize: 18,
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              Edit Profil
            </Text>

            {/* Avatar */}
            <TouchableOpacity
              onPress={pilihSumber}
              activeOpacity={0.8}
              style={{ alignItems: "center", marginBottom: 24 }}
            >
              <View style={{ position: "relative" }}>
                {fotoUri ? (
                  <Image
                    source={{ uri: fotoUri }}
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 45,
                      borderWidth: 3,
                      borderColor: "rgba(255,255,255,0.3)",
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 45,
                      backgroundColor: "rgba(255,255,255,0.15)",
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 3,
                      borderColor: "rgba(255,255,255,0.2)",
                    }}
                  >
                    <Ionicons
                      name="person"
                      size={38}
                      color="rgba(255,255,255,0.7)"
                    />
                  </View>
                )}
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: C.white,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 2,
                    borderColor: C.smoke,
                  }}
                >
                  <Ionicons name="camera" size={14} color={C.smoke} />
                </View>
              </View>
              <Text
                style={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: 12,
                  fontFamily: "Inter_400Regular",
                  marginTop: 8,
                }}
              >
                Ketuk untuk ganti foto
              </Text>
            </TouchableOpacity>

            {/* Nama */}
            <FormField label="Nama">
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Masukkan nama"
                placeholderTextColor="rgba(255,255,255,0.35)"
                style={inputStyle}
              />
            </FormField>

            {/* Sub Kategori */}
            <FormField label="Sub Kategori">
              <View style={{ gap: 8 }}>
                {opsiSub.map((item) => {
                  const selected = subKategori === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => setSubKategori(item.id)}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 12,
                        borderRadius: 10,
                        backgroundColor: selected
                          ? C.white
                          : "rgba(255,255,255,0.08)",
                      }}
                    >
                      <Text
                        style={{
                          color: selected ? C.smoke : "rgba(255,255,255,0.75)",
                          fontFamily: selected
                            ? "Inter_600SemiBold"
                            : "Inter_400Regular",
                          fontSize: 14,
                        }}
                      >
                        {item.label}
                      </Text>
                      {item.sub && (
                        <Text
                          style={{
                            color: selected
                              ? C.placeholder
                              : "rgba(255,255,255,0.4)",
                            fontSize: 12,
                            fontFamily: "Inter_400Regular",
                          }}
                        >
                          {item.sub}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </FormField>

            {/* Nama Anak */}
            {kategori === "balita" && (
              <FormField label="Nama Anak">
                <TextInput
                  value={namaAnak}
                  onChangeText={setNamaAnak}
                  placeholder="Nama anak"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  style={inputStyle}
                />
              </FormField>
            )}

            {/* Buttons */}
            <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
              <TouchableOpacity
                onPress={onBatal}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 14,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    fontFamily: "Inter_600SemiBold",
                  }}
                >
                  Batal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  onSimpan({
                    username,
                    fotoUri,
                    subKategori,
                    namaAnak: kategori === "balita" ? namaAnak : null,
                  })
                }
                style={{
                  flex: 2,
                  paddingVertical: 14,
                  backgroundColor: C.white,
                  borderRadius: 14,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: C.smoke, fontFamily: "Inter_700Bold" }}>
                  Simpan
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ══════════════════════════════
   SCREEN UTAMA
══════════════════════════════ */
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
    <View style={{ flex: 1, backgroundColor: C.skyWarm }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HERO SECTION ── */}
        <LinearGradient
          colors={["#5d6256", "#AAB0A3"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 }}
        >
          {/* Avatar + edit button */}
          <View style={{ alignItems: "center", marginBottom: 16 }}>
            <View style={{ position: "relative" }}>
              <View
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  borderWidth: 3,
                  borderColor: "rgba(255,255,255,0.25)",
                  overflow: "hidden",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {profil?.fotoUri ? (
                  <Image
                    source={{ uri: profil.fotoUri }}
                    style={{ width: 90, height: 90 }}
                  />
                ) : (
                  <Ionicons
                    name="person"
                    size={40}
                    color="rgba(255,255,255,0.7)"
                  />
                )}
              </View>
              <TouchableOpacity
                onPress={() => setShowEdit(true)}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: C.white,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: C.smoke,
                }}
              >
                <Ionicons name="pencil" size={13} color={C.smoke} />
              </TouchableOpacity>
            </View>

            {/* Nama */}
            <Text
              style={{
                color: C.white,
                fontSize: 20,
                fontFamily: "Inter_700Bold",
                marginTop: 12,
              }}
            >
              {profil?.username || "Pengguna"}
            </Text>

            {/* Kategori badge */}
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                marginTop: 6,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    color: C.white,
                    fontSize: 12,
                    fontFamily: "Inter_600SemiBold",
                  }}
                >
                  {labelKategori}
                  {profil?.subKategori && LABEL_SUB[profil.subKategori]
                    ? `  ·  ${LABEL_SUB[profil.subKategori]}`
                    : ""}
                </Text>
              </View>
            </View>

            {/* Email */}
            <Text
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 12,
                fontFamily: "Inter_400Regular",
                marginTop: 6,
              }}
            >
              {user?.email}
            </Text>
          </View>

          {/* Quick stats */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            {[
              {
                label: "Kalori Hari Ini",
                val: `${Math.round(todayTotal?.kalori ?? 0)} kkal`,
                color: NUTRISI_COLORS.kalori,
              },
              {
                label: "Target Kalori",
                val: `${akg?.kalori ?? "–"} kkal`,
                color: NUTRISI_COLORS.protein,
              },
            ].map(({ label, val, color }) => (
              <View
                key={label}
                style={{
                  flex: 1,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 14,
                  padding: 12,
                  borderTopWidth: 2,
                  borderTopColor: color,
                }}
              >
                <Text
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    fontSize: 11,
                    fontFamily: "Inter_400Regular",
                    marginBottom: 4,
                  }}
                >
                  {label}
                </Text>
                <Text
                  style={{
                    color: C.white,
                    fontSize: 14,
                    fontFamily: "Inter_700Bold",
                  }}
                >
                  {val}
                </Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* ── CONTENT ── */}
        <View style={{ padding: 20, gap: 20 }}>
          {/* Data Profil */}
          <View>
            <SectionLabel text="Informasi Profil" />
            <View
              style={{
                backgroundColor: C.white,
                borderRadius: 16,
                overflow: "hidden",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <InfoBaris label="Kategori" nilai={labelKategori} />
              <InfoBaris
                label="Sub Kategori"
                nilai={LABEL_SUB[profil?.subKategori] || akg?.label || "-"}
              />
              {profil?.kategori === "balita" && (
                <InfoBaris
                  label="Nama Balita"
                  nilai={profil?.namaAnak || "-"}
                />
              )}
              <InfoBaris label="Email" nilai={user?.email} last />
            </View>
          </View>

          {/* Gizi Hari Ini */}
          <View>
            <SectionLabel text="Pemenuhan Gizi Hari Ini" />
            <View
              style={{
                backgroundColor: C.white,
                borderRadius: 16,
                padding: 18,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: C.placeholder,
                  marginBottom: 16,
                  fontFamily: "Inter_400Regular",
                }}
              >
                Berdasarkan AKG Kemenkes 2019 · {akg?.label}
              </Text>
              {GIZI.map((g) => (
                <BarGizi
                  key={g.key}
                  colorKey={g.key}
                  label={g.label}
                  satuan={g.satuan}
                  target={akg?.[g.key] ?? 0}
                  dapat={todayTotal?.[g.key] ?? 0}
                />
              ))}
            </View>
          </View>

          {/* Logout */}
          <TouchableOpacity
            onPress={() => setShowLogout(true)}
            activeOpacity={0.85}
            style={{
              backgroundColor: C.smoke,
              borderRadius: 16,
              paddingVertical: 15,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Ionicons name="log-out-outline" size={18} color={C.white} />
            <Text
              style={{
                color: C.white,
                fontFamily: "Inter_600SemiBold",
                fontSize: 14,
              }}
            >
              Keluar dari Akun
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal Edit */}
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
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 32,
          }}
        >
          <View
            style={{
              backgroundColor: C.card,
              borderRadius: 24,
              padding: 28,
              width: "100%",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: C.smoke,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <Ionicons name="log-out-outline" size={28} color={C.skyWarm} />
            </View>
            <Text
              style={{
                fontSize: 17,
                fontFamily: "Inter_700Bold",
                color: C.smoke,
                marginBottom: 8,
              }}
            >
              Keluar dari Akun?
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: C.placeholder,
                textAlign: "center",
                marginBottom: 24,
                fontFamily: "Inter_400Regular",
              }}
            >
              Kamu perlu login kembali untuk menggunakan NutriScan.
            </Text>
            <View style={{ flexDirection: "row", gap: 12, width: "100%" }}>
              <TouchableOpacity
                onPress={() => setShowLogout(false)}
                style={{
                  flex: 1,
                  paddingVertical: 13,
                  backgroundColor: C.skyWarm,
                  borderRadius: 14,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontFamily: "Inter_600SemiBold", color: C.smoke }}
                >
                  Batal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowLogout(false);
                  logout();
                }}
                style={{
                  flex: 1,
                  paddingVertical: 13,
                  backgroundColor: C.smoke,
                  borderRadius: 14,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontFamily: "Inter_600SemiBold", color: C.white }}
                >
                  Keluar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
