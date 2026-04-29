import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { C } from "../../theme/colors";
import useProfile from "./hooks/useProfile";

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
        <View style={{
          backgroundColor: C.smoke,
          borderRadius: 99,
          height: 10,
          width: `${p}%`,
          opacity: 0.7 + (p / 100) * 0.3,
        }} />
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

export default function ProfileScreen() {
  const { profil, akg, todayTotal, rekomendasi, loading, user, logout } = useProfile();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: C.skyWarm }}>
        <ActivityIndicator size="large" color={C.smoke} />
      </View>
    );
  }

  const isIbuHamil = profil?.kategori === "ibu_hamil";
  const labelKategori = isIbuHamil ? "Ibu Hamil" : "Balita";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.skyWarm }} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>

      {/* Avatar */}
      <View style={{ alignItems: "center", marginBottom: 28 }}>
        <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: C.smoke, alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
          <Ionicons name={isIbuHamil ? "heart-circle-outline" : "happy-outline"} size={44} color={C.skyWarm} />
        </View>
        <Text style={{ color: C.smoke, fontWeight: "bold", fontSize: 16, fontFamily: "Inter_700Bold" }}>
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
        <InfoBaris label="Kategori" nilai={labelKategori} />
        <InfoBaris label="Sub Kategori" nilai={akg?.label || profil?.subKategori || "-"} />
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

      {/* Rekomendasi */}
      {rekomendasi.length > 0 && (
        <>
          <Text style={{ color: C.smoke, fontWeight: "bold", fontSize: 14, fontFamily: "Inter_700Bold", letterSpacing: 0.5 }}>
            REKOMENDASI MAKANAN
          </Text>
          <Text style={{ color: C.smoke, opacity: 0.55, fontSize: 12, marginBottom: 10, marginTop: 2, fontFamily: "Inter_400Regular" }}>
            Berdasarkan nutrisi yang masih kurang hari ini
          </Text>
          <View style={{ marginBottom: 24 }}>
            {rekomendasi.map((item, i) => (
              <View key={i} style={{ backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: C.cardDark, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                  <Ionicons name="restaurant-outline" size={22} color={C.smoke} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: C.smoke, fontWeight: "bold", fontSize: 13, fontFamily: "Inter_600SemiBold" }}>{item.nama}</Text>
                  <Text style={{ color: C.smoke, opacity: 0.55, fontSize: 12, fontFamily: "Inter_400Regular" }}>per {item.porsi}</Text>
                  <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
                    <Text style={{ color: C.smoke, opacity: 0.7, fontSize: 11, fontFamily: "Inter_400Regular" }}>{item.kalori} kkal</Text>
                    <Text style={{ color: C.smoke, opacity: 0.7, fontSize: 11, fontFamily: "Inter_400Regular" }}>{item.protein}g protein</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </>
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
  );
}
