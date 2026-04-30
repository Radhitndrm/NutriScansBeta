import { useState } from "react";
import {
  View, Text, TouchableOpacity, ScrollView, ActivityIndicator,
  Modal, TextInput, Image, Alert, KeyboardAvoidingView, Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { C } from "../../theme/colors";
import useProfile from "./hooks/useProfile";

const LABEL_SUB = {
  trimester_1: "Trimester 1",
  trimester_2: "Trimester 2",
  trimester_3: "Trimester 3",
  "0-6_bulan":  "0 – 6 Bulan",
  "7-11_bulan": "7 – 11 Bulan",
  "1-3_tahun":  "1 – 3 Tahun",
  "4-6_tahun":  "4 – 6 Tahun",
};

const TRIMESTER = [
  { id: "trimester_1", label: "Trimester 1", sub: "0 – 12 minggu" },
  { id: "trimester_2", label: "Trimester 2", sub: "13 – 26 minggu" },
  { id: "trimester_3", label: "Trimester 3", sub: "27 – 40 minggu" },
];

const USIA_BALITA = [
  { id: "0-6_bulan",  label: "0 – 6 Bulan" },
  { id: "7-11_bulan", label: "7 – 11 Bulan" },
  { id: "1-3_tahun",  label: "1 – 3 Tahun" },
  { id: "4-6_tahun",  label: "4 – 6 Tahun" },
];

const GIZI = [
  { key: "kalori",      label: "Kalori",      satuan: "kkal" },
  { key: "protein",     label: "Protein",     satuan: "g" },
  { key: "karbohidrat", label: "Karbohidrat", satuan: "g" },
  { key: "lemak",       label: "Lemak",       satuan: "g" },
  { key: "serat",       label: "Serat",       satuan: "g" },
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
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
        <Text style={{ color: C.smoke, fontWeight: "600", fontSize: 13, fontFamily: "Inter_600SemiBold" }}>{label}</Text>
        <Text style={{ color: C.smoke, opacity: 0.6, fontSize: 13, fontFamily: "Inter_400Regular" }}>
          {dapat != null ? `${Math.round(dapat * 10) / 10} / ${target} ${satuan}` : `${target} ${satuan}/hari`}
        </Text>
      </View>
      <View style={{ backgroundColor: C.cardDark, borderRadius: 99, height: 10 }}>
        <View style={{ backgroundColor: C.smoke, borderRadius: 99, height: 10, width: `${p}%`, opacity: 0.7 + (p / 100) * 0.3 }} />
      </View>
      {dapat != null && (
        <Text style={{ fontSize: 11, marginTop: 4, color: warnaTeks, fontFamily: "Inter_400Regular" }}>
          {p}% terpenuhi
        </Text>
      )}
    </View>
  );
}

function InfoBaris({ label, nilai }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: C.cardDark }}>
      <Text style={{ color: C.smoke, opacity: 0.6, fontFamily: "Inter_400Regular" }}>{label}</Text>
      <Text style={{ color: C.smoke, fontWeight: "600", fontFamily: "Inter_600SemiBold" }}>{nilai}</Text>
    </View>
  );
}

/* ── Modal Ganti Sub Kategori ── */
function ModalGantiSubKategori({ visible, profil, onSimpan, onBatal }) {
  const [pilihan, setPilihan] = useState(profil?.subKategori ?? null);
  const opsi = profil?.kategori === "ibu_hamil" ? TRIMESTER : USIA_BALITA;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onBatal}>
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)" }}
        activeOpacity={1}
        onPress={onBatal}
      />
      <View style={{
        backgroundColor: C.skyWarm,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 40,
      }}>
        <View style={{ width: 40, height: 4, backgroundColor: C.cardDark, borderRadius: 2, alignSelf: "center", marginBottom: 24 }} />

        <Text style={{ color: C.smoke, fontFamily: "Inter_700Bold", fontSize: 18, marginBottom: 6 }}>
          Ganti Sub Kategori
        </Text>
        <Text style={{ color: C.smoke, opacity: 0.55, fontSize: 13, fontFamily: "Inter_400Regular", marginBottom: 20 }}>
          {profil?.kategori === "ibu_hamil" ? "Pilih trimester kehamilan saat ini" : "Pilih kelompok usia anak"}
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
              <Text style={{ color: C.smoke, fontFamily: "Inter_600SemiBold", fontSize: 14 }}>
                {item.label}
              </Text>
              {item.sub && (
                <Text style={{ color: C.smoke, opacity: 0.55, fontSize: 13, fontFamily: "Inter_400Regular" }}>
                  {item.sub}
                </Text>
              )}
              {selected && <Ionicons name="checkmark-circle" size={20} color={C.smoke} />}
            </TouchableOpacity>
          );
        })}

        <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
          <TouchableOpacity
            onPress={onBatal}
            style={{ flex: 1, borderRadius: 14, paddingVertical: 14, alignItems: "center", backgroundColor: C.card }}
          >
            <Text style={{ color: C.smoke, fontFamily: "Inter_600SemiBold" }}>Batal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => pilihan && onSimpan(pilihan)}
            disabled={!pilihan}
            style={{ flex: 2, borderRadius: 14, paddingVertical: 14, alignItems: "center", backgroundColor: pilihan ? C.smoke : C.cardDark }}
          >
            <Text style={{ color: C.white, fontFamily: "Inter_600SemiBold" }}>Simpan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* ── Modal Edit Profil ── */
function ModalEditProfil({ visible, profil, onSimpan, onBatal }) {
  const [username, setUsername] = useState(profil?.username ?? "");
  const [fotoUri, setFotoUri]   = useState(profil?.fotoUri ?? null);

  async function pilihFoto() {
    const izin = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!izin.granted) { Alert.alert("Izin Ditolak", "Aplikasi butuh akses galeri"); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setFotoUri(result.assets[0].uri);
  }

  async function ambilFoto() {
    const izin = await ImagePicker.requestCameraPermissionsAsync();
    if (!izin.granted) { Alert.alert("Izin Ditolak", "Aplikasi butuh akses kamera"); return; }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setFotoUri(result.assets[0].uri);
  }

  function pilihSumber() {
    Alert.alert("Ganti Foto", "Pilih sumber foto", [
      { text: "Kamera",  onPress: ambilFoto },
      { text: "Galeri",  onPress: pilihFoto },
      { text: "Batal",   style: "cancel" },
    ]);
  }

  const isIbuHamil = profil?.kategori === "ibu_hamil";

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onBatal}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Overlay */}
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)" }}
          activeOpacity={1}
          onPress={onBatal}
        />

        {/* Sheet */}
        <View style={{
          backgroundColor: C.skyWarm,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingHorizontal: 28,
          paddingTop: 12,
          paddingBottom: 40,
        }}>
          {/* Handle bar */}
          <View style={{ width: 40, height: 4, backgroundColor: C.cardDark, borderRadius: 2, alignSelf: "center", marginBottom: 24 }} />

          <Text style={{ color: C.smoke, fontWeight: "bold", fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 28 }}>
            Edit Profil
          </Text>

          {/* Avatar picker */}
          <View style={{ alignItems: "center", marginBottom: 28 }}>
            <TouchableOpacity onPress={pilihSumber} activeOpacity={0.8}>
              <View style={{ position: "relative" }}>
                {fotoUri ? (
                  <Image
                    source={{ uri: fotoUri }}
                    style={{ width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: C.smoke }}
                  />
                ) : (
                  <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: C.smoke, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: C.cardDark }}>
                    <Ionicons name={isIbuHamil ? "heart-circle-outline" : "happy-outline"} size={48} color={C.skyWarm} />
                  </View>
                )}
                {/* Edit badge */}
                <View style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 28, height: 28, borderRadius: 14,
                  backgroundColor: C.smoke,
                  alignItems: "center", justifyContent: "center",
                  borderWidth: 2, borderColor: C.skyWarm,
                }}>
                  <Ionicons name="camera" size={14} color={C.white} />
                </View>
              </View>
            </TouchableOpacity>
            <Text style={{ color: C.smoke, opacity: 0.55, fontSize: 12, marginTop: 10, fontFamily: "Inter_400Regular" }}>
              Ketuk foto untuk mengganti
            </Text>
          </View>

          {/* Input username */}
          <Text style={{ color: C.smoke, fontSize: 12, fontFamily: "Inter_600SemiBold", marginBottom: 8, opacity: 0.7 }}>
            NAMA PENGGUNA
          </Text>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: C.inputBg,
            borderRadius: 14,
            paddingHorizontal: 16,
            paddingVertical: 14,
            marginBottom: 28,
          }}>
            <Ionicons name="person-outline" size={18} color={C.smoke} style={{ marginRight: 10, opacity: 0.5 }} />
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Masukkan nama pengguna"
              placeholderTextColor={C.placeholder}
              autoCapitalize="words"
              style={{ flex: 1, color: C.smoke, fontSize: 15, fontFamily: "Inter_400Regular" }}
            />
          </View>

          {/* Tombol aksi */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={onBatal}
              style={{ flex: 1, borderRadius: 14, paddingVertical: 14, alignItems: "center", backgroundColor: C.card }}
            >
              <Text style={{ color: C.smoke, fontWeight: "bold", fontFamily: "Inter_600SemiBold" }}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onSimpan({ username: username.trim(), fotoUri })}
              style={{ flex: 2, borderRadius: 14, paddingVertical: 14, alignItems: "center", backgroundColor: C.smoke }}
            >
              <Text style={{ color: C.white, fontWeight: "bold", fontFamily: "Inter_600SemiBold" }}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ── Screen utama ── */
export default function ProfileScreen() {
  const { profil, akg, todayTotal, loading, user, logout, updateProfil } = useProfile();
  const [showEdit, setShowEdit] = useState(false);
  const [showEditSubKat, setShowEditSubKat] = useState(false);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: C.skyWarm }}>
        <ActivityIndicator size="large" color={C.smoke} />
      </View>
    );
  }

  const isIbuHamil = profil?.kategori === "ibu_hamil";
  const labelKategori = isIbuHamil ? "Ibu Hamil" : "Balita";

  async function handleSimpan(patch) {
    if (!patch.username) { Alert.alert("Error", "Nama pengguna tidak boleh kosong"); return; }
    await updateProfil(patch);
    setShowEdit(false);
  }

  async function handleSimpanSubKat(subKategori) {
    await updateProfil({ subKategori });
    setShowEditSubKat(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.skyWarm }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>

        {/* Avatar + edit button */}
        <View style={{ alignItems: "center", marginBottom: 28 }}>
          <View style={{ position: "relative" }}>
            {profil?.fotoUri ? (
              <Image
                source={{ uri: profil.fotoUri }}
                style={{ width: 88, height: 88, borderRadius: 44, borderWidth: 3, borderColor: C.smoke }}
              />
            ) : (
              <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: C.smoke, alignItems: "center", justifyContent: "center" }}>
                <Ionicons name={isIbuHamil ? "heart-circle-outline" : "happy-outline"} size={44} color={C.skyWarm} />
              </View>
            )}
            {/* Edit badge */}
            <TouchableOpacity
              onPress={() => setShowEdit(true)}
              style={{
                position: "absolute", bottom: 0, right: 0,
                width: 26, height: 26, borderRadius: 13,
                backgroundColor: C.smoke,
                alignItems: "center", justifyContent: "center",
                borderWidth: 2, borderColor: C.skyWarm,
              }}
            >
              <Ionicons name="pencil" size={13} color={C.white} />
            </TouchableOpacity>
          </View>

          <Text style={{ color: C.smoke, fontWeight: "bold", fontSize: 16, fontFamily: "Inter_700Bold", marginTop: 12 }}>
            {profil?.username || user?.email}
          </Text>
          <View style={{ backgroundColor: C.smoke, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 4, marginTop: 6 }}>
            <Text style={{ color: C.white, fontSize: 12, fontFamily: "Inter_600SemiBold" }}>{labelKategori}</Text>
          </View>
        </View>

        {/* Data profil */}
        <Text style={{ color: C.smoke, fontWeight: "bold", fontSize: 14, marginBottom: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.5 }}>
          DATA PROFIL
        </Text>
        <View style={{ backgroundColor: C.card, borderRadius: 16, marginBottom: 24, overflow: "hidden" }}>
          <InfoBaris label="Nama Pengguna" nilai={profil?.username || "-"} />
          <InfoBaris label="Kategori" nilai={labelKategori} />
          <TouchableOpacity
            onPress={() => setShowEditSubKat(true)}
            style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: C.cardDark }}
          >
            <Text style={{ color: C.smoke, opacity: 0.6, fontFamily: "Inter_400Regular" }}>Sub Kategori</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text style={{ color: C.smoke, fontWeight: "600", fontFamily: "Inter_600SemiBold" }}>
                {LABEL_SUB[profil?.subKategori] || akg?.label || profil?.subKategori || "-"}
              </Text>
              <Ionicons name="chevron-forward" size={14} color={C.smoke} style={{ opacity: 0.5 }} />
            </View>
          </TouchableOpacity>
          {profil?.namaAnak && <InfoBaris label="Nama Anak" nilai={profil.namaAnak} />}
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 14, paddingHorizontal: 16 }}>
            <Text style={{ color: C.smoke, opacity: 0.6, fontFamily: "Inter_400Regular" }}>Email</Text>
            <Text style={{ color: C.smoke, fontWeight: "600", fontFamily: "Inter_600SemiBold" }} numberOfLines={1}>{user?.email}</Text>
          </View>
        </View>

        {/* Progress AKG */}
        <Text style={{ color: C.smoke, fontWeight: "bold", fontSize: 14, marginBottom: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.5 }}>
          PEMENUHAN GIZI HARI INI
        </Text>
        {akg ? (
          <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 18, marginBottom: 24 }}>
            <Text style={{ color: C.smoke, opacity: 0.55, fontSize: 12, marginBottom: 16, fontFamily: "Inter_400Regular" }}>
              Berdasarkan AKG Kemenkes 2019 · {akg.label}
            </Text>
            {GIZI.map((g) => (
              <BarGizi key={g.key} label={g.label} satuan={g.satuan} target={akg[g.key]} dapat={todayTotal?.[g.key] ?? null} />
            ))}
          </View>
        ) : (
          <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 18, marginBottom: 24, alignItems: "center" }}>
            <Text style={{ color: C.smoke, opacity: 0.5, fontFamily: "Inter_400Regular" }}>Data AKG tidak tersedia</Text>
          </View>
        )}

        {/* Logout */}
        <TouchableOpacity
          onPress={logout}
          style={{ backgroundColor: C.smoke, borderRadius: 30, paddingVertical: 15, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8 }}
        >
          <Ionicons name="log-out-outline" size={18} color={C.white} />
          <Text style={{ color: C.white, fontWeight: "bold", fontSize: 14, letterSpacing: 1, fontFamily: "Inter_700Bold" }}>KELUAR</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal edit profil */}
      {showEdit && (
        <ModalEditProfil
          visible={showEdit}
          profil={profil}
          onSimpan={handleSimpan}
          onBatal={() => setShowEdit(false)}
        />
      )}

      {/* Modal ganti sub kategori */}
      {showEditSubKat && (
        <ModalGantiSubKategori
          visible={showEditSubKat}
          profil={profil}
          onSimpan={handleSimpanSubKat}
          onBatal={() => setShowEditSubKat(false)}
        />
      )}
    </View>
  );
}
