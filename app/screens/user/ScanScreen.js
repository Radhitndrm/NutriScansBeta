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
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import { deteksiMakanan } from "../../utils/geminiHelper";
import { useAuth } from "../../context/AuthContext";
import { C } from "../../theme/colors";
import { getFoodIcon } from "../../utils/foodIcon";

const NUTRISI_FIELDS = [
  { key: "kalori", label: "Kalori", satuan: "kkal" },
  { key: "protein", label: "Protein", satuan: "g" },
  { key: "karbohidrat", label: "Karbohidrat", satuan: "g" },
  { key: "lemak", label: "Lemak", satuan: "g" },
  { key: "serat", label: "Serat", satuan: "g" },
];

const NUTRISI_COLORS = {
  kalori: "#E8935A",
  protein: "#5A8BE8",
  karbohidrat: "#5ABF8E",
  lemak: "#BF7A5A",
  serat: "#8A8E5A",
};

const MANUAL_EMPTY = {
  nama: "",
  porsi: "",
  kalori: "",
  protein: "",
  karbohidrat: "",
  lemak: "",
  serat: "",
};

async function simpanHistory(uid, data) {
  const now = new Date();
  const tanggal = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
  await addDoc(collection(db, "users", uid, "history"), {
    tanggal,
    waktu: now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    makananList: data.makananList,
    total: data.total,
    createdAt: serverTimestamp(),
  });
}

function hitungTotal(list) {
  return list.reduce(
    (acc, item) => ({
      kalori: acc.kalori + (parseFloat(item.kalori) || 0),
      protein: acc.protein + (parseFloat(item.protein) || 0),
      karbohidrat: acc.karbohidrat + (parseFloat(item.karbohidrat) || 0),
      lemak: acc.lemak + (parseFloat(item.lemak) || 0),
      serat: acc.serat + (parseFloat(item.serat) || 0),
    }),
    { kalori: 0, protein: 0, karbohidrat: 0, lemak: 0, serat: 0 },
  );
}

/* ── Kartu satu makanan ── */
function KartuMakanan({ item }) {
  const nutrisiDisplay = [
    { key: "kalori", val: item.kalori, label: "kkal" },
    { key: "protein", val: item.protein, label: "protein" },
    { key: "karbohidrat", val: item.karbohidrat, label: "karbo" },
    { key: "lemak", val: item.lemak, label: "lemak" },
    { key: "serat", val: item.serat, label: "serat" },
  ];
  const { icon, color } = getFoodIcon(item.nama);

  return (
    <LinearGradient
      colors={[C.smoke, "#2d3028"]}
      style={{
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
      }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 6,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1, marginRight: 8 }}>
          <View style={{
            width: 34, height: 34, borderRadius: 10,
            backgroundColor: "rgba(255,255,255,0.10)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
            alignItems: "center", justifyContent: "center",
          }}>
            <Ionicons name={icon} size={16} color="rgba(255,255,255,0.80)" />
          </View>
          <Text
            style={{
              color: C.white,
              fontWeight: "bold",
              fontSize: 15,
              fontFamily: "Inter_600SemiBold",
              flex: 1,
            }}
          >
            {item.nama}
          </Text>
        </View>
        {item.confidence != null && (
          <View
            style={{
              backgroundColor: "rgba(90,191,142,0.25)",
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: NUTRISI_COLORS.karbohidrat,
                fontSize: 11,
                fontFamily: "Inter_600SemiBold",
              }}
            >
              {item.confidence}% yakin
            </Text>
          </View>
        )}
      </View>
      {item.porsi ? (
        <Text
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: 12,
            marginBottom: 12,
            fontFamily: "Inter_400Regular",
          }}
        >
          Per {item.porsi}
        </Text>
      ) : (
        <View style={{ marginBottom: 10 }} />
      )}
      <View style={{ flexDirection: "row", gap: 6 }}>
        {nutrisiDisplay.map(({ key, val, label }) => (
          <View
            key={key}
            style={{
              flex: 1,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: 8,
              alignItems: "center",
              borderTopWidth: 2,
              borderTopColor: NUTRISI_COLORS[key],
            }}
          >
            <Text
              style={{
                color: C.white,
                fontWeight: "bold",
                fontSize: 13,
                fontFamily: "Inter_600SemiBold",
              }}
            >
              {typeof val === "number" ? val.toFixed(0) : (val ?? "-")}
            </Text>
            <Text
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 10,
                fontFamily: "Inter_400Regular",
                marginTop: 1,
              }}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

/* ── Kartu total nutrisi ── */
function KartuTotal({ total }) {
  const makros = [
    { key: "protein",     label: "Protein",      val: total.protein.toFixed(1) + "g" },
    { key: "karbohidrat", label: "Karbohidrat",  val: total.karbohidrat.toFixed(1) + "g" },
    { key: "lemak",       label: "Lemak",         val: total.lemak.toFixed(1) + "g" },
    { key: "serat",       label: "Serat",         val: total.serat.toFixed(1) + "g" },
  ];

  return (
    <LinearGradient
      colors={["#3a3f36", "#1e211b"]}
      style={{ borderRadius: 18, padding: 18, marginTop: 4 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Hero kalori */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 14,
        }}
      >
        <View>
          <Text
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 10,
              fontFamily: "Inter_600SemiBold",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 4,
            }}
          >
            Total Nutrisi
          </Text>
          <Text
            style={{
              color: C.white,
              fontSize: 38,
              fontWeight: "bold",
              fontFamily: "Inter_700Bold",
              lineHeight: 40,
            }}
          >
            {Math.round(total.kalori)}
          </Text>
          <Text
            style={{
              color: NUTRISI_COLORS.kalori,
              fontSize: 12,
              fontFamily: "Inter_600SemiBold",
              marginTop: 2,
            }}
          >
            kkal
          </Text>
        </View>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: "rgba(255,255,255,0.08)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="flame" size={24} color={NUTRISI_COLORS.kalori} />
        </View>
      </View>

      {/* Divider */}
      <View
        style={{
          height: 1,
          backgroundColor: "rgba(255,255,255,0.1)",
          marginBottom: 14,
        }}
      />

      {/* Makro rows */}
      {makros.map(({ key, label, val }) => (
        <View
          key={key}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <View
            style={{
              width: 3,
              height: 18,
              borderRadius: 2,
              backgroundColor: NUTRISI_COLORS[key],
              marginRight: 10,
            }}
          />
          <Text
            style={{
              flex: 1,
              color: "rgba(255,255,255,0.65)",
              fontSize: 13,
              fontFamily: "Inter_400Regular",
            }}
          >
            {label}
          </Text>
          <Text
            style={{
              color: C.white,
              fontWeight: "bold",
              fontSize: 13,
              fontFamily: "Inter_600SemiBold",
            }}
          >
            {val}
          </Text>
        </View>
      ))}
    </LinearGradient>
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
    if (!izin.granted) {
      Alert.alert("Izin Ditolak", "Aplikasi butuh akses kamera");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      setFoto(result.assets[0]);
      setHasil(null);
    }
  }

  async function bukaGaleri() {
    const izin = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!izin.granted) {
      Alert.alert("Izin Ditolak", "Aplikasi butuh akses galeri");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled) {
      setFoto(result.assets[0]);
      setHasil(null);
    }
  }

  async function analisis() {
    if (!foto) {
      Alert.alert("Belum ada foto", "Pilih foto makanan terlebih dahulu");
      return;
    }
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
    <ScrollView
      contentContainerStyle={{ padding: 20, paddingTop: 4 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Empty state hint */}
      {!foto && (
        <Text
          style={{
            color: C.placeholder,
            fontSize: 13,
            textAlign: "center",
            marginBottom: 14,
            fontFamily: "Inter_400Regular",
          }}
        >
          Foto makananmu untuk analisis nutrisi instan
        </Text>
      )}

      {/* Preview foto / Empty state */}
      {foto ? (
        <View style={{ marginBottom: 12 }}>
          <Image
            source={{ uri: foto.uri }}
            style={{ width: "100%", height: 220, borderRadius: 18 }}
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={bukaGaleri}
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 5,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Ionicons name="swap-horizontal-outline" size={13} color="#fff" />
            <Text
              style={{
                color: "#fff",
                fontSize: 11,
                fontFamily: "Inter_400Regular",
              }}
            >
              Ganti foto
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            width: "100%",
            height: 210,
            borderRadius: 18,
            borderWidth: 2,
            borderColor: C.cardDark,
            borderStyle: "dashed",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: C.card,
            marginBottom: 14,
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: C.cardDark,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Ionicons
              name="fast-food-outline"
              size={34}
              color={C.smoke}
              style={{ opacity: 0.45 }}
            />
          </View>
          <Text
            style={{
              color: C.smoke,
              fontWeight: "bold",
              fontSize: 14,
              fontFamily: "Inter_600SemiBold",
              opacity: 0.7,
            }}
          >
            Belum ada foto
          </Text>
          <Text
            style={{
              color: C.placeholder,
              fontSize: 12,
              fontFamily: "Inter_400Regular",
              marginTop: 4,
            }}
          >
            Gunakan kamera atau pilih dari galeri
          </Text>
        </View>
      )}

      {/* Kamera & Galeri */}
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 14 }}>
        <TouchableOpacity
          onPress={bukaKamera}
          style={{
            flex: 1,
            backgroundColor: C.smoke,
            borderRadius: 12,
            paddingVertical: 14,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Ionicons name="camera" size={18} color={C.white} />
          <Text
            style={{
              color: C.white,
              fontWeight: "bold",
              fontSize: 13,
              fontFamily: "Inter_600SemiBold",
            }}
          >
            Kamera
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={bukaGaleri}
          style={{
            flex: 1,
            borderWidth: 1.5,
            borderColor: C.smoke,
            borderRadius: 12,
            paddingVertical: 14,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Ionicons name="images-outline" size={18} color={C.smoke} />
          <Text
            style={{
              color: C.smoke,
              fontWeight: "bold",
              fontSize: 13,
              fontFamily: "Inter_600SemiBold",
            }}
          >
            Galeri
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tombol Analisis */}
      <TouchableOpacity
        onPress={analisis}
        disabled={loading || !foto}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={foto ? [C.smoke, "#2d3028"] : [C.cardDark, C.cardDark]}
          style={{
            borderRadius: 30,
            paddingVertical: 16,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {loading ? (
            <>
              <ActivityIndicator color={C.white} size="small" />
              <Text
                style={{
                  color: C.white,
                  fontWeight: "bold",
                  fontSize: 14,
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                Menganalisis...
              </Text>
            </>
          ) : (
            <>
              <Ionicons
                name="scan-outline"
                size={18}
                color={foto ? C.white : C.placeholder}
              />
              <Text
                style={{
                  color: foto ? C.white : C.placeholder,
                  fontWeight: "bold",
                  fontSize: 14,
                  letterSpacing: 0.5,
                  fontFamily: "Inter_700Bold",
                }}
              >
                Analisis Makanan
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Hasil analisis */}
      {hasil && (
        <View style={{ marginTop: 26 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: "#E8F5E9",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="checkmark" size={16} color="#388E3C" />
            </View>
            <Text
              style={{
                color: C.smoke,
                fontWeight: "bold",
                fontSize: 15,
                fontFamily: "Inter_600SemiBold",
              }}
            >
              {hasil.makananList.length} makanan terdeteksi
            </Text>
          </View>

          {hasil.makananList.map((item, i) => (
            <KartuMakanan key={i} item={item} />
          ))}
          <KartuTotal total={hasil.total} />

          <TouchableOpacity
            onPress={() => {
              setFoto(null);
              setHasil(null);
            }}
            style={{
              marginTop: 14,
              paddingVertical: 12,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Ionicons name="refresh-outline" size={16} color={C.placeholder} />
            <Text
              style={{
                color: C.placeholder,
                fontSize: 13,
                fontFamily: "Inter_400Regular",
              }}
            >
              Scan ulang
            </Text>
          </TouchableOpacity>
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
    if (!form.nama) {
      Alert.alert("Error", "Nama makanan harus diisi");
      return;
    }
    if (!form.kalori) {
      Alert.alert("Error", "Kalori harus diisi");
      return;
    }
    setManualList((prev) => [...prev, { ...form }]);
    setForm(MANUAL_EMPTY);
  }

  function hapus(index) {
    setManualList((prev) => prev.filter((_, i) => i !== index));
  }

  async function simpan() {
    if (manualList.length === 0) {
      Alert.alert("Kosong", "Tambahkan minimal satu makanan");
      return;
    }
    const total = hitungTotal(manualList);
    await simpanHistory(user.uid, { makananList: manualList, total });
    Alert.alert("Tersimpan", "Data gizi berhasil disimpan ke riwayat");
    setManualList([]);
  }

  return (
    <ScrollView
      contentContainerStyle={{ padding: 20, paddingTop: 4 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Form tambah makanan */}
      <LinearGradient
        colors={[C.smoke, "#2d3028"]}
        style={{
          borderRadius: 18,
          padding: 18,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.18,
          shadowRadius: 10,
          elevation: 5,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "rgba(255,255,255,0.15)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="add" size={20} color={C.white} />
          </View>
          <Text
            style={{
              color: C.white,
              fontWeight: "bold",
              fontSize: 15,
              fontFamily: "Inter_600SemiBold",
            }}
          >
            Tambah Makanan
          </Text>
        </View>

        {/* Nama & Porsi */}
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 14 }}>
          <View style={{ flex: 2 }}>
            <Text
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 11,
                marginBottom: 6,
                fontFamily: "Inter_600SemiBold",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Nama Makanan *
            </Text>
            <TextInput
              value={form.nama}
              onChangeText={(v) => setForm({ ...form, nama: v })}
              placeholder="cth: Nasi Goreng"
              placeholderTextColor="rgba(255,255,255,0.35)"
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 11,
                color: C.white,
                fontSize: 13,
                fontFamily: "Inter_400Regular",
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 11,
                marginBottom: 6,
                fontFamily: "Inter_600SemiBold",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Porsi
            </Text>
            <TextInput
              value={form.porsi}
              onChangeText={(v) => setForm({ ...form, porsi: v })}
              placeholder="100g"
              placeholderTextColor="rgba(255,255,255,0.35)"
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 11,
                color: C.white,
                fontSize: 13,
                fontFamily: "Inter_400Regular",
              }}
            />
          </View>
        </View>

        {/* Nutrisi grid */}
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
              color: "rgba(255,255,255,0.6)",
              fontSize: 11,
              fontFamily: "Inter_600SemiBold",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Kandungan Gizi
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 16,
          }}
        >
          {NUTRISI_FIELDS.map(({ key, label, satuan }) => (
            <View key={key} style={{ width: "47%" }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  marginBottom: 5,
                }}
              >
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: NUTRISI_COLORS[key],
                  }}
                />
                <Text
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 11,
                    fontFamily: "Inter_400Regular",
                  }}
                >
                  {label} ({satuan}){key === "kalori" ? " *" : ""}
                </Text>
              </View>
              <TextInput
                value={form[key]}
                onChangeText={(v) => setForm({ ...form, [key]: v })}
                placeholder="0"
                placeholderTextColor="rgba(255,255,255,0.35)"
                keyboardType="decimal-pad"
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 11,
                  color: C.white,
                  fontSize: 13,
                  fontFamily: "Inter_400Regular",
                  borderTopWidth: 2,
                  borderTopColor: NUTRISI_COLORS[key],
                }}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={tambah}
          style={{
            backgroundColor: C.white,
            borderRadius: 12,
            paddingVertical: 13,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Ionicons name="add-circle-outline" size={18} color={C.smoke} />
          <Text
            style={{
              color: C.smoke,
              fontWeight: "bold",
              fontSize: 13,
              fontFamily: "Inter_600SemiBold",
            }}
          >
            Tambah ke Daftar
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Daftar item yang sudah ditambah */}
      {manualList.length > 0 && (
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                color: C.smoke,
                fontWeight: "bold",
                fontSize: 15,
                fontFamily: "Inter_600SemiBold",
              }}
            >
              Daftar Makanan
            </Text>
            <View
              style={{
                backgroundColor: C.smoke,
                paddingHorizontal: 10,
                paddingVertical: 3,
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
                {manualList.length} item
              </Text>
            </View>
          </View>

          {manualList.map((item, i) => (
            <View
              key={i}
              style={{
                backgroundColor: C.smoke,
                borderRadius: 14,
                padding: 14,
                marginBottom: 8,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
                elevation: 1,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: C.skyWarm,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Text
                  style={{
                    color: C.smoke,
                    fontWeight: "bold",
                    fontSize: 14,
                    fontFamily: "Inter_600SemiBold",
                  }}
                >
                  {i + 1}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: C.white,
                    fontWeight: "bold",
                    fontSize: 14,
                    fontFamily: "Inter_600SemiBold",
                  }}
                >
                  {item.nama}
                </Text>
                <Text
                  style={{
                    color: C.placeholder,
                    fontSize: 12,
                    marginTop: 2,
                    fontFamily: "Inter_400Regular",
                  }}
                >
                  {item.kalori} kkal · {item.protein || 0}g protein
                  {item.porsi ? ` · ${item.porsi}` : ""}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => hapus(i)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: "#FFF0F0",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="trash-outline" size={16} color="#E53935" />
              </TouchableOpacity>
            </View>
          ))}

          <KartuTotal total={hitungTotal(manualList)} />

          <TouchableOpacity
            onPress={simpan}
            activeOpacity={0.85}
            style={{ marginTop: 14 }}
          >
            <LinearGradient
              colors={[C.smoke, "#2d3028"]}
              style={{
                borderRadius: 30,
                paddingVertical: 16,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color={C.white}
              />
              <Text
                style={{
                  color: C.white,
                  fontWeight: "bold",
                  fontSize: 14,
                  letterSpacing: 0.5,
                  fontFamily: "Inter_700Bold",
                }}
              >
                Simpan ke Riwayat
              </Text>
            </LinearGradient>
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
  { key: "scan", label: "Scan Foto", icon: "camera" },
  { key: "manual", label: "Input Manual", icon: "create" },
];

export default function ScanScreen() {
  const [activeTab, setActiveTab] = useState("scan");

  return (
    <View style={{ flex: 1, backgroundColor: C.skyWarm }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <Text
          style={{
            color: C.smoke,
            fontSize: 22,
            fontWeight: "bold",
            fontFamily: "Inter_700Bold",
          }}
        >
          Scan Makanan
        </Text>
        <Text
          style={{
            color: C.placeholder,
            fontSize: 13,
            fontFamily: "Inter_400Regular",
            marginTop: 2,
          }}
        >
          Analisis nutrisi dengan AI
        </Text>
      </View>

      {/* Tab Switcher */}
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 20,
          marginBottom: 14,
          backgroundColor: C.card,
          borderRadius: 14,
          padding: 4,
        }}
      >
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
              <Ionicons
                name={tab.icon}
                size={16}
                color={active ? C.white : C.smoke}
                style={{ opacity: active ? 1 : 0.45 }}
              />
              <Text
                style={{
                  color: active ? C.white : C.smoke,
                  opacity: active ? 1 : 0.5,
                  fontWeight: "bold",
                  fontSize: 13,
                  fontFamily: active ? "Inter_600SemiBold" : "Inter_400Regular",
                }}
              >
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
