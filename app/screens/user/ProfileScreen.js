import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <ScrollView className="flex-1 bg-gray-50 px-6 py-8">
      {/* Avatar & info akun */}
      <View className="items-center mb-8">
        <View className="bg-green-600 w-24 h-24 rounded-full items-center justify-center mb-4">
          <Text className="text-5xl">👤</Text>
        </View>
        <Text className="text-gray-800 font-bold text-lg">{user?.email}</Text>
        <Text className="text-gray-400 text-sm mt-1">Anggota NutriScan</Text>
      </View>

      {/* Data profil */}
      <Text className="text-gray-700 font-bold text-base mb-3">
        Data Pribadi
      </Text>
      <View className="bg-white rounded-2xl mb-6">
        <View className="flex-row justify-between p-4 border-b border-gray-100">
          <Text className="text-gray-500">Usia</Text>
          <Text className="text-gray-800 font-semibold">Belum diisi</Text>
        </View>
        <View className="flex-row justify-between p-4 border-b border-gray-100">
          <Text className="text-gray-500">Berat Badan</Text>
          <Text className="text-gray-800 font-semibold">Belum diisi</Text>
        </View>
        <View className="flex-row justify-between p-4 border-b border-gray-100">
          <Text className="text-gray-500">Tinggi Badan</Text>
          <Text className="text-gray-800 font-semibold">Belum diisi</Text>
        </View>
        <View className="flex-row justify-between p-4">
          <Text className="text-gray-500">Jenis Kelamin</Text>
          <Text className="text-gray-800 font-semibold">Belum diisi</Text>
        </View>
      </View>

      {/* Target gizi */}
      <Text className="text-gray-700 font-bold text-base mb-3">
        Target Gizi Harian (AKG)
      </Text>
      <View className="bg-white rounded-2xl p-5 mb-8">
        <Text className="text-gray-400 text-sm text-center py-2">
          Lengkapi data pribadi untuk menghitung kebutuhan gizimu 📊
        </Text>
      </View>

      {/* Tombol Logout */}
      <TouchableOpacity
        className="bg-red-500 py-4 rounded-2xl items-center"
        onPress={logout}
      >
        <Text className="text-white font-bold text-base">Keluar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
