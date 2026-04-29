import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { C } from "../../theme/colors";
import useHistory from "./hooks/useHistory";

function formatTanggal(iso) {
  const [y, m, d] = iso.split("-");
  const bulan = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  return `${d} ${bulan[parseInt(m) - 1]} ${y}`;
}

function TotalHarian({ total }) {
  return (
    <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
      {[
        { label: "kkal",    val: Math.round(total.kalori) },
        { label: "protein", val: `${total.protein.toFixed(1)}g` },
        { label: "karbo",   val: `${total.karbohidrat.toFixed(1)}g` },
        { label: "lemak",   val: `${total.lemak.toFixed(1)}g` },
      ].map((item) => (
        <View key={item.label} style={{ flex: 1, alignItems: "center", paddingVertical: 8, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.15)" }}>
          <Text style={{ fontWeight: "bold", fontSize: 13, color: C.white, fontFamily: "Inter_600SemiBold" }}>{item.val}</Text>
          <Text style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular" }}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

function EntryCard({ entry, onHapus }) {
  return (
    <View style={{ backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 8 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={{ color: C.smoke, fontWeight: "600", fontSize: 13, fontFamily: "Inter_600SemiBold" }} numberOfLines={1}>
            {entry.makananList.map((m) => m.nama).join(", ")}
          </Text>
          <Text style={{ color: C.smoke, opacity: 0.55, fontSize: 12, marginTop: 2, fontFamily: "Inter_400Regular" }}>{entry.waktu}</Text>
        </View>
        <TouchableOpacity
          onPress={() => Alert.alert("Hapus", "Hapus riwayat ini?", [
            { text: "Batal", style: "cancel" },
            { text: "Hapus", style: "destructive", onPress: onHapus },
          ])}
        >
          <Ionicons name="trash-outline" size={16} color={C.smoke} style={{ opacity: 0.5 }} />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", gap: 6 }}>
        {[
          { label: `${Math.round(entry.total.kalori)} kkal` },
          { label: `${entry.total.protein.toFixed(1)}g protein` },
          { label: `${entry.total.karbohidrat.toFixed(1)}g karbo` },
        ].map(({ label }) => (
          <View key={label} style={{ backgroundColor: C.cardDark, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
            <Text style={{ color: C.smoke, fontSize: 11, fontFamily: "Inter_400Regular" }}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const { groupedList, loading, hapusEntry, refresh } = useHistory();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: C.skyWarm }}>
        <ActivityIndicator size="large" color={C.smoke} />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.skyWarm }} contentContainerStyle={{ padding: 20 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <View>
          <Text style={{ color: C.smoke, fontWeight: "bold", fontSize: 20, fontFamily: "Inter_700Bold" }}>Riwayat</Text>
          <Text style={{ color: C.smoke, opacity: 0.6, fontSize: 13, fontFamily: "Inter_400Regular" }}>Histori nutrisi harianmu</Text>
        </View>
        <TouchableOpacity onPress={refresh} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Ionicons name="refresh-outline" size={16} color={C.smoke} />
          <Text style={{ color: C.smoke, fontSize: 13, fontFamily: "Inter_500Medium" }}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {groupedList.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 80 }}>
          <Ionicons name="clipboard-outline" size={52} color={C.smoke} style={{ opacity: 0.3, marginBottom: 12 }} />
          <Text style={{ color: C.smoke, fontWeight: "600", fontFamily: "Inter_600SemiBold" }}>Belum ada riwayat</Text>
          <Text style={{ color: C.smoke, opacity: 0.55, fontSize: 13, marginTop: 4, fontFamily: "Inter_400Regular" }}>
            Scan makanan dulu untuk mulai mencatat
          </Text>
        </View>
      ) : (
        groupedList.map((group) => (
          <View key={group.tanggal} style={{ marginBottom: 20 }}>
            <View style={{ backgroundColor: C.smoke, borderRadius: 16, padding: 16, marginBottom: 10 }}>
              <Text style={{ color: C.white, fontWeight: "bold", fontSize: 15, fontFamily: "Inter_700Bold" }}>
                {formatTanggal(group.tanggal)}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 2, fontFamily: "Inter_400Regular" }}>
                {group.entries.length} kali scan
              </Text>
              <TotalHarian total={group.totalHarian} />
            </View>
            {group.entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} onHapus={() => hapusEntry(entry.id)} />
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}
