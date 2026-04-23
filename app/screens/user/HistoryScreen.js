import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import useHistory from "./hooks/useHistory";

function formatTanggal(iso) {
  const [y, m, d] = iso.split("-");
  const bulan = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  return `${d} ${bulan[parseInt(m) - 1]} ${y}`;
}

function TotalHarian({ total }) {
  return (
    <View className="flex-row gap-2 mt-3">
      {[
        { label: "kkal", val: Math.round(total.kalori) },
        { label: "protein", val: `${total.protein.toFixed(1)}g` },
        { label: "karbo", val: `${total.karbohidrat.toFixed(1)}g` },
        { label: "lemak", val: `${total.lemak.toFixed(1)}g` },
      ].map((item) => (
        <View key={item.label} className="flex-1 items-center py-2 rounded-xl bg-white/20">
          <Text className="font-bold text-sm text-white">{item.val}</Text>
          <Text className="text-green-100 text-xs">{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

function EntryCard({ entry, onHapus }) {
  return (
    <View className="bg-white rounded-xl p-4 mb-2 border border-gray-100">
      <View className="flex-row justify-between items-start mb-1">
        <View className="flex-1 mr-2">
          <Text className="text-gray-700 font-semibold text-sm" numberOfLines={1}>
            {entry.makananList.map((m) => m.nama).join(", ")}
          </Text>
          <Text className="text-gray-400 text-xs mt-0.5">{entry.waktu}</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Hapus", "Hapus riwayat ini?", [
              { text: "Batal", style: "cancel" },
              { text: "Hapus", style: "destructive", onPress: onHapus },
            ])
          }
        >
          <Text className="text-red-400 text-xs">Hapus</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row gap-2 mt-2">
        <Text className="bg-orange-50 text-orange-500 text-xs px-2 py-1 rounded-lg">
          {Math.round(entry.total.kalori)} kkal
        </Text>
        <Text className="bg-blue-50 text-blue-500 text-xs px-2 py-1 rounded-lg">
          {entry.total.protein.toFixed(1)}g protein
        </Text>
        <Text className="bg-yellow-50 text-yellow-600 text-xs px-2 py-1 rounded-lg">
          {entry.total.karbohidrat.toFixed(1)}g karbo
        </Text>
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const { groupedList, loading, hapusEntry, refresh } = useHistory();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 px-6 py-6">
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-gray-800 font-bold text-xl">Riwayat Scan</Text>
          <Text className="text-gray-400 text-sm">Histori nutrisi harianmu</Text>
        </View>
        <TouchableOpacity onPress={refresh}>
          <Text className="text-green-600 text-sm font-semibold">Refresh</Text>
        </TouchableOpacity>
      </View>

      {groupedList.length === 0 ? (
        <View className="items-center mt-20">
          <Text className="text-5xl mb-4">📋</Text>
          <Text className="text-gray-500 font-semibold">Belum ada riwayat</Text>
          <Text className="text-gray-400 text-sm mt-1">
            Scan makanan dulu untuk mulai mencatat
          </Text>
        </View>
      ) : (
        groupedList.map((group) => (
          <View key={group.tanggal} className="mb-6">
            <View className="bg-green-600 rounded-2xl p-4 mb-3">
              <Text className="text-white font-bold text-base">
                {formatTanggal(group.tanggal)}
              </Text>
              <Text className="text-green-100 text-xs mt-0.5">
                {group.entries.length} kali scan
              </Text>
              <TotalHarian total={group.totalHarian} />
            </View>

            {group.entries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onHapus={() => hapusEntry(entry.id)}
              />
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}
