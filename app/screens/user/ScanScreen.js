import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deteksiMakanan } from "../../utils/geminiHelper";

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

async function simpanHistory(data) {
  const raw = await AsyncStorage.getItem("@nutriscan_history");
  const history = raw ? JSON.parse(raw) : [];
  const now = new Date();
  history.unshift({
    id: Date.now().toString(),
    tanggal: now.toISOString().split("T")[0],
    waktu: now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    makananList: data.makananList,
    total: data.total,
  });
  await AsyncStorage.setItem("@nutriscan_history", JSON.stringify(history));
}

function hitungTotal(list) {
  return list.reduce(
    (acc, item) => ({
      kalori:      acc.kalori      + (parseFloat(item.kalori)      || 0),
      protein:     acc.protein     + (parseFloat(item.protein)     || 0),
      karbohidrat: acc.karbohidrat + (parseFloat(item.karbohidrat) || 0),
      lemak:       acc.lemak       + (parseFloat(item.lemak)       || 0),
    }),
    { kalori: 0, protein: 0, karbohidrat: 0, lemak: 0 }
  );
}

/* ── Kartu hasil satu makanan ── */
function KartuMakanan({ item }) {
  return (
    <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 10 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
        <Text style={{ color: C.smoke, fontWeight: "bold", fontSize: 15, fontFamily: "Inter_600SemiBold", flex: 1 }}>
          {item.nama}
        </Text>
        {item.confidence != null && (
          <Text style={{ color: C.smoke, opacity: 0.6, fontSize: 12, fontFamily: "Inter_400Regular" }}>
            {item.confidence}% yakin
          </Text>
        )}
      </View>
      {item.porsi ? (
        <Text style={{ color: C.smoke, opacity: 0.55, fontSize: 12, marginBottom: 10, fontFamily: "Inter_400Regular" }}>
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
            <Text style={{ color: C.smoke, opacity: 0.6, fontSize: 11, fontFamily: "Inter_400Regular" }}>{label}</Text>
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
      <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14, marginBottom: 12, fontFamily: "Inter_600SemiBold" }}>
        Total Nutrisi
      </Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {[
          { val: Math.round(total.kalori),         label: "kkal" },
          { val: total.protein.toFixed(1) + "g",   label: "protein" },
          { val: total.karbohidrat.toFixed(1)+"g", label: "karbo" },
          { val: total.lemak.toFixed(1) + "g",     label: "lemak" },
        ].map(({ val, label }) => (
          <View key={label} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 8, alignItems: "center" }}>
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 13, fontFamily: "Inter_600SemiBold" }}>{val}</Text>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontFamily: "Inter_400Regular" }}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function ScanScreen() {
  const [foto, setFoto] = useState(null);
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);

  // state input manual
  const [showManual, setShowManual] = useState(false);
  const [manualList, setManualList] = useState([]);
  const [form, setForm] = useState(MANUAL_EMPTY);
  const [hasilManual, setHasilManual] = useState(null);

  /* ── Kamera & galeri ── */
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

  async function analisisMakanan() {
    if (!foto) { Alert.alert("Belum ada foto", "Pilih foto makanan terlebih dahulu"); return; }
    try {
      setLoading(true);
      const data = await deteksiMakanan(foto.base64);
      setHasil(data);
      await simpanHistory(data);
    } catch (error) {
      Alert.alert("Gagal", error.message);
    } finally {
      setLoading(false);
    }
  }

  /* ── Input manual ── */
  function tambahItemManual() {
    if (!form.nama) { Alert.alert("Error", "Nama makanan harus diisi"); return; }
    if (!form.kalori) { Alert.alert("Error", "Kalori harus diisi"); return; }
    setManualList((prev) => [...prev, { ...form }]);
    setForm(MANUAL_EMPTY);
  }

  function hapusItem(index) {
    setManualList((prev) => prev.filter((_, i) => i !== index));
  }

  async function simpanManual() {
    if (manualList.length === 0) { Alert.alert("Kosong", "Tambahkan minimal satu makanan"); return; }
    const total = hitungTotal(manualList);
    const data = { makananList: manualList, total };
    setHasilManual(data);
    await simpanHistory(data);
    Alert.alert("Tersimpan", "Data gizi berhasil disimpan ke riwayat");
    setManualList([]);
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.skyWarm }}
      contentContainerStyle={{ padding: 20 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* ══════════ SEKSI SCAN FOTO ══════════ */}
      <Text style={{ fontSize: 16, fontWeight: "bold", color: C.smoke, marginBottom: 14, fontFamily: "Inter_700Bold", letterSpacing: 1 }}>
        SCAN MAKANAN
      </Text>

      {/* Preview foto */}
      {foto ? (
        <Image source={{ uri: foto.uri }} style={{ width: "100%", height: 200, borderRadius: 16, marginBottom: 12 }} resizeMode="cover" />
      ) : (
        <View style={{ width: "100%", height: 200, backgroundColor: C.card, borderRadius: 16, marginBottom: 12, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="fast-food-outline" size={48} color={C.smoke} style={{ opacity: 0.4, marginBottom: 8 }} />
          <Text style={{ color: C.smoke, opacity: 0.5, fontSize: 13, fontFamily: "Inter_400Regular" }}>Belum ada foto</Text>
        </View>
      )}

      {/* Tombol kamera & galeri */}
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
        <TouchableOpacity
          onPress={bukaKamera}
          style={{ flex: 1, backgroundColor: C.card, borderRadius: 12, paddingVertical: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          <Ionicons name="camera-outline" size={18} color={C.smoke} />
          <Text style={{ color: C.smoke, fontWeight: "bold", fontSize: 13, fontFamily: "Inter_600SemiBold" }}>Kamera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={bukaGaleri}
          style={{ flex: 1, backgroundColor: C.card, borderRadius: 12, paddingVertical: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          <Ionicons name="image-outline" size={18} color={C.smoke} />
          <Text style={{ color: C.smoke, fontWeight: "bold", fontSize: 13, fontFamily: "Inter_600SemiBold" }}>Galeri</Text>
        </TouchableOpacity>
      </View>

      {/* Tombol analisis */}
      <TouchableOpacity
        onPress={analisisMakanan}
        disabled={loading || !foto}
        style={{ backgroundColor: foto ? C.smoke : C.card, borderRadius: 30, paddingVertical: 14, alignItems: "center", marginBottom: 8 }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: foto ? "#fff" : C.placeholder, fontWeight: "bold", fontSize: 14, letterSpacing: 1, fontFamily: "Inter_700Bold" }}>
            ANALISIS MAKANAN
          </Text>
        )}
      </TouchableOpacity>

      {/* Hasil scan */}
      {hasil && (
        <View style={{ marginTop: 16, marginBottom: 8 }}>
          <Text style={{ color: C.smoke, fontWeight: "bold", marginBottom: 10, fontFamily: "Inter_600SemiBold" }}>
            Terdeteksi {hasil.makananList.length} makanan
          </Text>
          {hasil.makananList.map((item, i) => <KartuMakanan key={i} item={item} />)}
          <KartuTotal total={hasil.total} />
        </View>
      )}

      {/* ══════════ DIVIDER ══════════ */}
      <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 24 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: C.cardDark }} />
        <Text style={{ color: C.smoke, opacity: 0.5, marginHorizontal: 12, fontSize: 12, fontFamily: "Inter_400Regular" }}>
          atau input manual
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: C.cardDark }} />
      </View>

      {/* ══════════ SEKSI INPUT MANUAL ══════════ */}
      <TouchableOpacity
        onPress={() => setShowManual(!showManual)}
        style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: showManual ? 16 : 0 }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold", color: C.smoke, fontFamily: "Inter_700Bold", letterSpacing: 1 }}>
          INPUT MANUAL
        </Text>
        <Ionicons name={showManual ? "chevron-up" : "chevron-down"} size={20} color={C.smoke} />
      </TouchableOpacity>

      {showManual && (
        <View>
          {/* Form input */}
          <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 14 }}>
            <Text style={{ color: C.smoke, fontWeight: "bold", marginBottom: 12, fontFamily: "Inter_600SemiBold" }}>
              Tambah Makanan
            </Text>

            {/* Nama & Porsi */}
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
              <View style={{ flex: 2 }}>
                <Text style={{ color: C.smoke, fontSize: 11, marginBottom: 4, opacity: 0.7, fontFamily: "Inter_400Regular" }}>Nama Makanan *</Text>
                <TextInput
                  value={form.nama}
                  onChangeText={(v) => setForm({ ...form, nama: v })}
                  placeholder="cth: Nasi Goreng"
                  placeholderTextColor={C.placeholder}
                  style={{ backgroundColor: C.skyWarm, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: C.smoke, fontSize: 13, fontFamily: "Inter_400Regular" }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.smoke, fontSize: 11, marginBottom: 4, opacity: 0.7, fontFamily: "Inter_400Regular" }}>Porsi</Text>
                <TextInput
                  value={form.porsi}
                  onChangeText={(v) => setForm({ ...form, porsi: v })}
                  placeholder="100g"
                  placeholderTextColor={C.placeholder}
                  style={{ backgroundColor: C.skyWarm, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: C.smoke, fontSize: 13, fontFamily: "Inter_400Regular" }}
                />
              </View>
            </View>

            {/* Nutrisi fields */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
              {NUTRISI_FIELDS.map(({ key, label, satuan }) => (
                <View key={key} style={{ width: "47%" }}>
                  <Text style={{ color: C.smoke, fontSize: 11, marginBottom: 4, opacity: 0.7, fontFamily: "Inter_400Regular" }}>
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
              onPress={tambahItemManual}
              style={{ backgroundColor: C.smoke, borderRadius: 12, paddingVertical: 12, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}
            >
              <Ionicons name="add-circle-outline" size={18} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 13, fontFamily: "Inter_600SemiBold" }}>Tambah ke Daftar</Text>
            </TouchableOpacity>
          </View>

          {/* Daftar makanan manual */}
          {manualList.length > 0 && (
            <View style={{ marginBottom: 14 }}>
              <Text style={{ color: C.smoke, fontWeight: "bold", marginBottom: 10, fontFamily: "Inter_600SemiBold" }}>
                Daftar ({manualList.length} item)
              </Text>
              {manualList.map((item, i) => (
                <View key={i} style={{ backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 8, flexDirection: "row", alignItems: "center" }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: C.smoke, fontWeight: "bold", fontSize: 14, fontFamily: "Inter_600SemiBold" }}>{item.nama}</Text>
                    <Text style={{ color: C.smoke, opacity: 0.6, fontSize: 12, marginTop: 2, fontFamily: "Inter_400Regular" }}>
                      {item.kalori} kkal · {item.protein || 0}g protein · {item.porsi || "-"}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => hapusItem(i)} style={{ padding: 4 }}>
                    <Ionicons name="trash-outline" size={18} color={C.smoke} style={{ opacity: 0.5 }} />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Total manual */}
              <KartuTotal total={hitungTotal(manualList)} />

              {/* Simpan */}
              <TouchableOpacity
                onPress={simpanManual}
                style={{ backgroundColor: C.smoke, borderRadius: 30, paddingVertical: 14, alignItems: "center", marginTop: 12 }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14, letterSpacing: 1, fontFamily: "Inter_700Bold" }}>
                  SIMPAN KE RIWAYAT
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}
