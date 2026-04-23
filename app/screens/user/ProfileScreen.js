import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import useProfile from "./hooks/useProfile";

const GIZI = [
  { key: "kalori", label: "Kalori", satuan: "kkal", warna: "bg-orange-400" },
  { key: "protein", label: "Protein", satuan: "g", warna: "bg-blue-400" },
  { key: "karbohidrat", label: "Karbohidrat", satuan: "g", warna: "bg-yellow-400" },
  { key: "lemak", label: "Lemak", satuan: "g", warna: "bg-red-400" },
  { key: "serat", label: "Serat", satuan: "g", warna: "bg-green-400" },
];

function persen(dapat, target) {
  if (!target || target === 0) return 0;
  return Math.min(Math.round((dapat / target) * 100), 100);
}

function lebarBar(dapat, target) {
  const p = persen(dapat, target);
  if (p <= 0) return "w-0";
  if (p <= 10) return "w-[10%]";
  if (p <= 20) return "w-1/5";
  if (p <= 25) return "w-1/4";
  if (p <= 33) return "w-1/3";
  if (p <= 40) return "w-2/5";
  if (p <= 50) return "w-1/2";
  if (p <= 60) return "w-3/5";
  if (p <= 66) return "w-2/3";
  if (p <= 75) return "w-3/4";
  if (p <= 90) return "w-[90%]";
  return "w-full";
}

function BarGizi({ label, satuan, warna, target, dapat }) {
  const p = persen(dapat, target);
  return (
    <View className="mb-4">
      <View className="flex-row justify-between mb-1">
        <Text className="text-gray-700 font-semibold text-sm">{label}</Text>
        <Text className="text-gray-400 text-sm">
          {dapat != null ? `${Math.round(dapat * 10) / 10} / ${target} ${satuan}` : `${target} ${satuan}/hari`}
        </Text>
      </View>
      <View className="bg-gray-100 rounded-full h-3">
        <View className={`${warna} ${lebarBar(dapat, target)} rounded-full h-3`} />
      </View>
      {dapat != null && (
        <Text className={`text-xs mt-1 ${p >= 80 ? "text-green-600" : p >= 50 ? "text-yellow-600" : "text-red-400"}`}>
          {p}% terpenuhi
        </Text>
      )}
    </View>
  );
}

function InfoBaris({ label, nilai }) {
  return (
    <View className="flex-row justify-between p-4 border-b border-gray-100">
      <Text className="text-gray-500">{label}</Text>
      <Text className="text-gray-800 font-semibold">{nilai}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { profil, akg, todayTotal, rekomendasi, loading, user, logout } = useProfile();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  const labelKategori = profil?.kategori === "ibu_hamil" ? "Ibu Hamil" : "Balita";

  return (
    <ScrollView className="flex-1 bg-gray-50 px-6 py-8">
      {/* Avatar & email */}
      <View className="items-center mb-8">
        <View className="bg-green-600 w-24 h-24 rounded-full items-center justify-center mb-4">
          <Text className="text-5xl">{profil?.kategori === "ibu_hamil" ? "🤰" : "👶"}</Text>
        </View>
        <Text className="text-gray-800 font-bold text-lg">{user?.email}</Text>
        <View className="bg-green-100 px-4 py-1 rounded-full mt-2">
          <Text className="text-green-700 font-semibold text-sm">{labelKategori}</Text>
        </View>
      </View>

      {/* Data profil */}
      <Text className="text-gray-700 font-bold text-base mb-3">Data Profil</Text>
      <View className="bg-white rounded-2xl mb-6 overflow-hidden">
        <InfoBaris label="Kategori" nilai={labelKategori} />
        <InfoBaris label="Sub Kategori" nilai={akg?.label || profil?.subKategori || "-"} />
        {profil?.namaAnak && <InfoBaris label="Nama Anak" nilai={profil.namaAnak} />}
        <View className="flex-row justify-between p-4">
          <Text className="text-gray-500">Email</Text>
          <Text className="text-gray-800 font-semibold" numberOfLines={1}>{user?.email}</Text>
        </View>
      </View>

      {/* Progress AKG hari ini */}
      <Text className="text-gray-700 font-bold text-base mb-3">
        Pemenuhan Gizi Hari Ini
      </Text>
      {akg ? (
        <View className="bg-white rounded-2xl p-5 mb-6">
          <Text className="text-gray-400 text-xs mb-4">
            Berdasarkan AKG Kemenkes 2019 · {akg.label}
          </Text>
          {GIZI.map((g) => (
            <BarGizi
              key={g.key}
              label={g.label}
              satuan={g.satuan}
              warna={g.warna}
              target={akg[g.key]}
              dapat={todayTotal?.[g.key] ?? null}
            />
          ))}
        </View>
      ) : (
        <View className="bg-white rounded-2xl p-5 mb-6">
          <Text className="text-gray-400 text-sm text-center py-2">
            Data AKG tidak tersedia
          </Text>
        </View>
      )}

      {/* Rekomendasi makanan */}
      {rekomendasi.length > 0 && (
        <>
          <Text className="text-gray-700 font-bold text-base mb-1">
            Rekomendasi Makanan
          </Text>
          <Text className="text-gray-400 text-xs mb-3">
            Berdasarkan nutrisi yang masih kurang hari ini
          </Text>
          <View className="mb-6">
            {rekomendasi.map((item, i) => (
              <View key={i} className="bg-white rounded-2xl p-4 mb-3 flex-row items-center">
                <View className="bg-green-100 w-12 h-12 rounded-xl items-center justify-center mr-4">
                  <Text className="text-2xl">🍽️</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-bold text-sm">{item.nama}</Text>
                  <Text className="text-gray-400 text-xs">per {item.porsi}</Text>
                  <View className="flex-row gap-2 mt-1">
                    <Text className="text-orange-500 text-xs">{item.kalori} kkal</Text>
                    <Text className="text-blue-500 text-xs">{item.protein}g protein</Text>
                    <Text className="text-yellow-600 text-xs">{item.karbohidrat}g karbo</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Logout */}
      <TouchableOpacity
        className="bg-red-500 py-4 rounded-2xl items-center mb-8"
        onPress={logout}
      >
        <Text className="text-white font-bold text-base">Keluar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
