import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deteksiMakanan } from "../../utils/geminiHelper";

async function simpanHistory(data) {
  const raw = await AsyncStorage.getItem("@nutriscan_history");
  const history = raw ? JSON.parse(raw) : [];
  const now = new Date();
  const entry = {
    id: Date.now().toString(),
    tanggal: now.toISOString().split("T")[0],
    waktu: now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    makananList: data.makananList,
    total: data.total,
  };
  history.unshift(entry);
  await AsyncStorage.setItem("@nutriscan_history", JSON.stringify(history));
}

export default function ScanScreen() {
  const [foto, setFoto] = useState(null);
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);

  async function bukakamera() {
    const izin = await ImagePicker.requestCameraPermissionsAsync();
    if (!izin.granted) {
      Alert.alert("Izin Ditolak", "Aplikasi butuh akses kamera");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
      base64: true,
      exif: false,
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

  async function analisisMakanan() {
    if (!foto) {
      Alert.alert("Belum ada foto", "Pilih foto makanan terlebih dahulu");
      return;
    }
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

  return (
    <ScrollView className="flex-1 bg-gray-50 px-6 py-6">
      {/* Header */}
      <View className="bg-green-600 rounded-2xl p-5 mb-6">
        <Text className="text-white text-xl font-bold">Scan Makanan</Text>
        <Text className="text-green-100 text-sm mt-1">
          Foto makananmu dan ketahui kandungan gizinya
        </Text>
      </View>

      {/* Preview foto */}
      {foto ? (
        <Image
          source={{ uri: foto.uri }}
          className="w-full h-56 rounded-2xl mb-4"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-56 bg-gray-200 rounded-2xl mb-4 items-center justify-center">
          <Text className="text-gray-400 text-4xl mb-2">🍽️</Text>
          <Text className="text-gray-400 text-sm">Belum ada foto</Text>
        </View>
      )}

      {/* Tombol pilih foto */}
      <View className="flex-row gap-3 mb-4">
        <TouchableOpacity
          className="flex-1 bg-white border-2 border-green-600 rounded-xl py-3 items-center"
          onPress={bukakamera}
        >
          <Text className="text-green-700 font-bold">📷 Kamera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-white border-2 border-gray-200 rounded-xl py-3 items-center"
          onPress={bukaGaleri}
        >
          <Text className="text-gray-700 font-bold">🖼️ Galeri</Text>
        </TouchableOpacity>
      </View>

      {/* Tombol analisis */}
      <TouchableOpacity
        className="bg-green-600 py-4 rounded-xl items-center mb-6"
        onPress={analisisMakanan}
        disabled={loading || !foto}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-base">
            Analisis Makanan
          </Text>
        )}
      </TouchableOpacity>

      {/* Hasil deteksi */}
      {hasil && (
        <View className="mb-6">
          {/* List makanan terdeteksi */}
          <Text className="text-gray-700 font-bold text-base mb-3">
            Terdeteksi {hasil.makananList.length} Makanan
          </Text>

          {hasil.makananList.map((item, index) => (
            <View key={index} className="bg-white rounded-2xl p-4 mb-3">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-800 font-bold text-base">
                  {item.nama}
                </Text>
                <Text className="text-green-600 text-xs font-semibold">
                  {item.confidence}% yakin
                </Text>
              </View>
              <Text className="text-gray-400 text-xs mb-3">
                per {item.porsi}
              </Text>
              <View className="flex-row gap-2">
                <View className="bg-orange-50 rounded-lg px-2 py-1 flex-1 items-center">
                  <Text className="text-orange-500 font-bold text-sm">
                    {item.kalori}
                  </Text>
                  <Text className="text-gray-400 text-xs">kkal</Text>
                </View>
                <View className="bg-blue-50 rounded-lg px-2 py-1 flex-1 items-center">
                  <Text className="text-blue-500 font-bold text-sm">
                    {item.protein}g
                  </Text>
                  <Text className="text-gray-400 text-xs">protein</Text>
                </View>
                <View className="bg-yellow-50 rounded-lg px-2 py-1 flex-1 items-center">
                  <Text className="text-yellow-500 font-bold text-sm">
                    {item.karbohidrat}g
                  </Text>
                  <Text className="text-gray-400 text-xs">karbo</Text>
                </View>
                <View className="bg-red-50 rounded-lg px-2 py-1 flex-1 items-center">
                  <Text className="text-red-400 font-bold text-sm">
                    {item.lemak}g
                  </Text>
                  <Text className="text-gray-400 text-xs">lemak</Text>
                </View>
              </View>
            </View>
          ))}

          {/* Total nutrisi */}
          <View className="bg-green-600 rounded-2xl p-5">
            <Text className="text-white font-bold text-base mb-3">
              Total Nutrisi
            </Text>
            <View className="flex-row gap-2">
              <View className="bg-white/20 rounded-xl px-2 py-2 flex-1 items-center">
                <Text className="text-white font-bold">
                  {Math.round(hasil.total.kalori)}
                </Text>
                <Text className="text-green-100 text-xs">kkal</Text>
              </View>
              <View className="bg-white/20 rounded-xl px-2 py-2 flex-1 items-center">
                <Text className="text-white font-bold">
                  {hasil.total.protein.toFixed(1)}g
                </Text>
                <Text className="text-green-100 text-xs">protein</Text>
              </View>
              <View className="bg-white/20 rounded-xl px-2 py-2 flex-1 items-center">
                <Text className="text-white font-bold">
                  {hasil.total.karbohidrat.toFixed(1)}g
                </Text>
                <Text className="text-green-100 text-xs">karbo</Text>
              </View>
              <View className="bg-white/20 rounded-xl px-2 py-2 flex-1 items-center">
                <Text className="text-white font-bold">
                  {hasil.total.lemak.toFixed(1)}g
                </Text>
                <Text className="text-green-100 text-xs">lemak</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
