import { useState } from "react";
import {
  View, Text, TouchableOpacity, Image,
  ActivityIndicator, Alert, ScrollView, TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import { deteksiMakanan } from "../../utils/geminiHelper";
import { useAuth } from "../../context/AuthContext";
import { C } from "../../theme/colors";

const NUTRISI_FIELDS = [
  { key: "kalori",      label: "Kalori",      satuan: "kkal" },
  { key: "protein",     label: "Protein",     satuan: "g" },
  { key: "karbohidrat", label: "Karbohidrat", satuan: "g" },
  { key: "lemak",       label: "Lemak",       satuan: "g" },
  { key: "serat",       label: "Serat",       satuan: "g" },
];

const MANUAL_EMPTY = {
  nama: "", porsi: "", kalori: "", protein: "",
  karbohidrat: "", lemak: "", serat: "",
};

async function simpanHistory(uid, data) {
  const now = new Date();
  await addDoc(collection(db, "users", uid, "history"), {
    tanggal: now.toISOString().split("T")[0],
    waktu: now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    makananList: data.makananList,
    total: data.total,
    createdAt: serverTimestamp(),
  });
}

function hitungTotal(list) {
  return list.reduce(
    (acc, item) => ({
      kalori:      acc.kalori      + (parseFloat(item.kalori)      || 0),
      protein:     acc.protein     + (parseFloat(item.protein)     || 0),
      karbohidrat: acc.karbohidrat + (parseFloat(item.karbohidrat) || 0),
      lemak:       acc.lemak       + (parseFloat(item.lemak)       || 0),
      serat:       acc.serat       + (parseFloat(item.serat)       || 0),
    }),
    { kalori: 0, protein: 0, karbohidrat: 0, lemak: 0, serat: 0 }
  );
}

/* ── Kartu satu makanan ── */
function KartuMakanan({ item }) {
  return (
    <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 10 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
        <Text style={{ color: C.smoke, fontWeight: "bold", fontSize: 15, fontFamily: "Inter_600SemiBold", flex: 1 }}>
          {item.nama}
        </Text>
        {item.confidence != null && (
          <Text style={{ color: C.smoke, opacity: 0.55, fontSize: 12, fontFamily: "Inter_400Regular" }}>
            {item.confidence}% yakin
          </Text>
        )}
      </View>
      {item.porsi ? (
        <Text style={{ color: C.smoke, opacity: 0.5, fontSize: 12, marginBottom: 10, fontFamily: "Inter_400Regular" }}>
          per {item.porsi}
        </Text>
      ) : null}
      <View style={{ flexDirection: "row", gap: 6 }}>
        {[
          { val: item.kalori,      label: "kkal" },
          { val: item.protein,     label: "protein" },
          { val: item.karbohidrat, label: "karbo" },
          { val: item.lemak,       label: "lemak" },
        ].map(({ val, label }) => (
          <View key={label} style={{ flex: 1, backgroundColor: C.cardDark, borderRadius: 10, padding: 8, alignItems: "center" }}>
            <Text style={{ color: C.smoke, fontWeight: "bold", fontSize: 13, fontFamily: "Inter_600SemiBold" }}>
              {typeof val === "number" ? val.toFixed(0) : val ?? "-"}
            </Text>
            <Text style={{ color: C.smoke, opacity: 0.55, fontSize: 11, fontFamily: "Inter_400Regular" }}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/* ── Kartu total nutrisi ── */
function KartuTotal({ total }) {
  return (
    <View style={{ backgroundColor: C.smoke, borderRadius: 16, padding: 18, marginTop: 4 }}>
      <Text style={{ color: C.white, fontWeight: "bold", fontSize: 14, marginBottom: 12, fontFamily: "Inter_600SemiBold" }}>
        Total Nutrisi
      </Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {[
          { val: Math.round(total.kalori),          label: "kkal" },
          { val: total.protein.toFixed(1) + "g",    label: "protein" },
          { val: total.karbohidrat.toFixed(1) + "g", label: "karbo" },
          { val: total.lemak.toFixed(1) + "g",      label: "lemak" },
        ].map(({ val, label }) => (
          <View key={label} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 8, alignItems: "center" }}>
            <Text style={{ color: C.white, fontWeight: "bold", fontSize: 13, fontFamily: "Inter_600SemiBold" }}>{val}</Text>
            <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, fontFamily: "Inter_400Regular" }}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/* ══════════════════════════════
   TAB 1 — SCAN FOTO
══════════════════════════════ */
function TabScan() {
  const { user } = useAuth();
  const [foto, setFoto] = useState(null);
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);

  async function bukaKamera() {
    const izin = await ImagePicker.requestCameraPermissionsAsync();
    if (!izin.granted) { Alert.alert("Izin Ditolak", "Aplikasi butuh akses kamera"); return; }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.5, base64: true, allowsEditing: true, aspect: [4, 3] });
    if (!result.canceled) { setFoto(result.assets[0]); setHasil(null); }
  }

  async function bukaGaleri() {
    const izin = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!izin.granted) { Alert.alert("Izin Ditolak", "Aplikasi butuh akses galeri"); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.5, base64: true });
    if (!result.canceled) { setFoto(result.assets[0]); setHasil(null); }
  }

  async function analisis() {
    if (!foto) { Alert.alert("Belum ada foto", "Pilih foto makanan terlebih dahulu"); return; }
    try {
      setLoading(true);
      const data = await deteksiMakanan(foto.base64);
      setHasil(data);
      await simpanHistory(user.uid, data);
    } catch (error) {
      Alert.alert("Gagal", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
      {/* Preview foto */}
      {foto ? (
        <Image source={{ uri: foto.uri }} style={{ width: "100%", height: 210, borderRadius: 16, marginBottom: 14 }} resizeMode="cover" />
      ) : (
        <View style={{ width: "100%", height: 210, backgroundColor: C.card, borderRadius: 16, marginBottom: 14, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="fast-food-outline" size={52} color={C.smoke} style={{ opacity: 0.3, marginBottom: 8 }} />
          <Text style={{ color: C.smoke, opacity: 0.45, fontSize: 13, fontFamily: "Inter_400Regular" }}>Belum ada foto</Text>
        </View>
      )}

      {/* Kamera & Galeri */}
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
        <TouchableOpacity
          onPress={bukaKamera}
          style={{ flex: 1, backgroundColor: C.card, borderRadius: 12, paddingVertical: 13, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          <Ionicons name="camera-outline" size={18} color={C.smoke} />
          <Text style={{ color: C.smoke, fontWeight: "bold", fontSize: 13, fontFamily: "Inter_600SemiBold" }}>Kamera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={bukaGaleri}
          style={{ flex: 1, backgroundColor: C.card, borderRadius: 12, paddingVertical: 13, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          <Ionicons name="image-outline" size={18} color={C.smoke} />
          <Text style={{ color: C.smoke, fontWeight: "bold", fontSize: 13, fontFamily: "Inter_600SemiBold" }}>Galeri</Text>
        </TouchableOpacity>
      </View>

      {/* Tombol Analisis */}
      <TouchableOpacity
        onPress={analisis}
        disabled={loading || !foto}
        style={{ backgroundColor: foto ? C.smoke : C.card, borderRadius: 30, paddingVertical: 15, alignItems: "center", marginBottom: 6 }}
      >
        {loading ? (
          <ActivityIndicator color={C.white} />
        ) : (
          <Text style={{ color: foto ? C.white : C.placeholder, fontWeight: "bold", fontSize: 14, letterSpacing: 1, fontFamily: "Inter_700Bold" }}>
            ANALISIS MAKANAN
          </Text>
        )}
      </TouchableOpacity>

      {/* Hasil */}
      {hasil && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: C.smoke, fontWeight: "bold", marginBottom: 10, fontFamily: "Inter_600SemiBold" }}>
            Terdeteksi {hasil.makananList.length} makanan
          </Text>
          {hasil.makananList.map((item, i) => <KartuMakanan key={i} item={item} />)}
          <KartuTotal total={hasil.total} />
        </View>
      )}
    </ScrollView>
  );
}

/* ══════════════════════════════
   TAB 2 — INPUT MANUAL
══════════════════════════════ */
function TabManual() {
  const { user } = useAuth();
  const [manualList, setManualList] = useState([]);
  const [form, setForm] = useState(MANUAL_EMPTY);

  function tambah() {
    if (!form.nama) { Alert.alert("Error", "Nama makanan harus diisi"); return; }
    if (!form.kalori) { Alert.alert("Error", "Kalori harus diisi"); return; }
    setManualList((prev) => [...prev, { ...form }]);
    setForm(MANUAL_EMPTY);
  }

  function hapus(index) {
    setManualList((prev) => prev.filter((_, i) => i !== index));
  }

  async function simpan() {
    if (manualList.length === 0) { Alert.alert("Kosong", "Tambahkan minimal satu makanan"); return; }
    const total = hitungTotal(manualList);
    await simpanHistory(user.uid, { makananList: manualList, total });
    Alert.alert("Tersimpan", "Data gizi berhasil disimpan ke riwayat");
    setManualList([]);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">

      {/* Form tambah makanan */}
      <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <Text style={{ color: C.smoke, fontWeight: "bold", marginBottom: 14, fontFamily: "Inter_600SemiBold" }}>
          Tambah Makanan
        </Text>

        {/* Nama & Porsi */}
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
          <View style={{ flex: 2 }}>
            <Text style={{ color: C.smoke, fontSize: 11, marginBottom: 4, opacity: 0.65, fontFamily: "Inter_400Regular" }}>Nama Makanan *</Text>
            <TextInput
              value={form.nama}
              onChangeText={(v) => setForm({ ...form, nama: v })}
              placeholder="cth: Nasi Goreng"
              placeholderTextColor={C.placeholder}
              style={{ backgroundColor: C.skyWarm, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: C.smoke, fontSize: 13, fontFamily: "Inter_400Regular" }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.smoke, fontSize: 11, marginBottom: 4, opacity: 0.65, fontFamily: "Inter_400Regular" }}>Porsi</Text>
            <TextInput
              value={form.porsi}
              onChangeText={(v) => setForm({ ...form, porsi: v })}
              placeholder="100g"
              placeholderTextColor={C.placeholder}
              style={{ backgroundColor: C.skyWarm, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: C.smoke, fontSize: 13, fontFamily: "Inter_400Regular" }}
            />
          </View>
        </View>

        {/* Nutrisi grid */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
          {NUTRISI_FIELDS.map(({ key, label, satuan }) => (
            <View key={key} style={{ width: "47%" }}>
              <Text style={{ color: C.smoke, fontSize: 11, marginBottom: 4, opacity: 0.65, fontFamily: "Inter_400Regular" }}>
                {label} ({satuan}){key === "kalori" ? " *" : ""}
              </Text>
              <TextInput
                value={form[key]}
                onChangeText={(v) => setForm({ ...form, [key]: v })}
                placeholder="0"
                placeholderTextColor={C.placeholder}
                keyboardType="decimal-pad"
                style={{ backgroundColor: C.skyWarm, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: C.smoke, fontSize: 13, fontFamily: "Inter_400Regular" }}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={tambah}
          style={{ backgroundColor: C.smoke, borderRadius: 12, paddingVertical: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          <Ionicons name="add-circle-outline" size={18} color={C.white} />
          <Text style={{ color: C.white, fontWeight: "bold", fontSize: 13, fontFamily: "Inter_600SemiBold" }}>Tambah ke Daftar</Text>
        </TouchableOpacity>
      </View>

      {/* Daftar item yang sudah ditambah */}
      {manualList.length > 0 && (
        <View>
          <Text style={{ color: C.smoke, fontWeight: "bold", marginBottom: 10, fontFamily: "Inter_600SemiBold" }}>
            Daftar ({manualList.length} item)
          </Text>
          {manualList.map((item, i) => (
            <View key={i} style={{ backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 8, flexDirection: "row", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.smoke, fontWeight: "bold", fontSize: 14, fontFamily: "Inter_600SemiBold" }}>{item.nama}</Text>
                <Text style={{ color: C.smoke, opacity: 0.55, fontSize: 12, marginTop: 2, fontFamily: "Inter_400Regular" }}>
                  {item.kalori} kkal · {item.protein || 0}g protein{item.porsi ? ` · ${item.porsi}` : ""}
                </Text>
              </View>
              <TouchableOpacity onPress={() => hapus(i)} style={{ padding: 4 }}>
                <Ionicons name="trash-outline" size={18} color={C.smoke} style={{ opacity: 0.45 }} />
              </TouchableOpacity>
            </View>
          ))}

          <KartuTotal total={hitungTotal(manualList)} />

          <TouchableOpacity
            onPress={simpan}
            style={{ backgroundColor: C.smoke, borderRadius: 30, paddingVertical: 15, alignItems: "center", marginTop: 14 }}
          >
            <Text style={{ color: C.white, fontWeight: "bold", fontSize: 14, letterSpacing: 1, fontFamily: "Inter_700Bold" }}>
              SIMPAN KE RIWAYAT
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

/* ══════════════════════════════
   SCREEN UTAMA dengan Tab Switcher
══════════════════════════════ */
const TABS = [
  { key: "scan",   label: "Scan Foto",     icon: "camera-outline" },
  { key: "manual", label: "Input Manual",  icon: "create-outline" },
];

export default function ScanScreen() {
  const [activeTab, setActiveTab] = useState("scan");

  return (
    <View style={{ flex: 1, backgroundColor: C.skyWarm }}>
      {/* Tab Switcher */}
      <View style={{ flexDirection: "row", margin: 16, backgroundColor: C.card, borderRadius: 14, padding: 4 }}>
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                paddingVertical: 10,
                borderRadius: 10,
                backgroundColor: active ? C.smoke : "transparent",
              }}
            >
              <Ionicons name={tab.icon} size={16} color={active ? C.white : C.smoke} style={{ opacity: active ? 1 : 0.5 }} />
              <Text style={{
                color: active ? C.white : C.smoke,
                opacity: active ? 1 : 0.5,
                fontWeight: "bold",
                fontSize: 13,
                fontFamily: active ? "Inter_600SemiBold" : "Inter_400Regular",
              }}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Konten tab aktif */}
      {activeTab === "scan" ? <TabScan /> : <TabManual />}
    </View>
  );
}
