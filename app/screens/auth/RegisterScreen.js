import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  async function handleRegister() {
    if (!email || !password || !konfirmasi) {
      Alert.alert("Error", "Semua kolom harus diisi");
      return;
    }
    if (password !== konfirmasi) {
      Alert.alert("Error", "Password dan konfirmasi tidak sama");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password minimal 6 karakter");
      return;
    }
    try {
      setLoading(true);
      await register(email, password);
      // Jika berhasil, AuthContext otomatis update user → App.js pindah ke MainTabs
    } catch (error) {
      Alert.alert("Gagal Daftar", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 justify-center px-6 bg-gray-50">
      <Text className="text-4xl font-bold text-green-600 text-center mb-2">
        🥗 NutriScan
      </Text>
      <Text className="text-base text-gray-400 text-center mb-10">
        Buat akun baru
      </Text>

      <TextInput
        className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-base mb-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-base mb-4"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-base mb-6"
        placeholder="Konfirmasi Password"
        value={konfirmasi}
        onChangeText={setKonfirmasi}
        secureTextEntry
      />

      <TouchableOpacity
        className="bg-green-600 py-4 rounded-xl items-center mb-4"
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-bold">Daftar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text className="text-green-600 text-center text-sm">
          Sudah punya akun? Masuk
        </Text>
      </TouchableOpacity>
    </View>
  );
}
