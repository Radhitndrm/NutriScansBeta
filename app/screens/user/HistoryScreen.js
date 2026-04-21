import { View, Text, ScrollView } from "react-native";

export default function HistoryScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50 px-6 py-8">
      {/* Header */}
      <View className="bg-green-600 rounded-2xl p-6 mb-6">
        <Text className="text-3xl mb-2">🗒️</Text>
        <Text className="text-white text-xl font-bold">Riwayat Makan</Text>
        <Text className="text-green-100 text-sm mt-1">
          Pantau asupan gizimu setiap hari
        </Text>
      </View>

      {/* Ringkasan hari ini */}
      <Text className="text-gray-700 font-bold text-base mb-3">Hari Ini</Text>
      <View className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
        <Text className="text-gray-400 text-center text-sm py-4">
          Belum ada makanan yang dicatat hari ini.{"\n"}
          Mulai scan makananmu! 🍱
        </Text>
      </View>

      {/* Statistik gizi */}
      <Text className="text-gray-700 font-bold text-base mb-3">
        Ringkasan Gizi Hari Ini
      </Text>
      <View className="flex-row gap-3 mb-6">
        <View className="flex-1 bg-white rounded-2xl p-4 items-center">
          <Text className="text-2xl font-bold text-green-600">0</Text>
          <Text className="text-gray-400 text-xs mt-1">Kalori</Text>
        </View>
        <View className="flex-1 bg-white rounded-2xl p-4 items-center">
          <Text className="text-2xl font-bold text-blue-500">0g</Text>
          <Text className="text-gray-400 text-xs mt-1">Protein</Text>
        </View>
        <View className="flex-1 bg-white rounded-2xl p-4 items-center">
          <Text className="text-2xl font-bold text-yellow-500">0g</Text>
          <Text className="text-gray-400 text-xs mt-1">Karbo</Text>
        </View>
        <View className="flex-1 bg-white rounded-2xl p-4 items-center">
          <Text className="text-2xl font-bold text-red-400">0g</Text>
          <Text className="text-gray-400 text-xs mt-1">Lemak</Text>
        </View>
      </View>
    </ScrollView>
  );
}
