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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password harus diisi");
      return;
    }
    try {
      setLoading(true);
      await login(email, password);
    } catch (error) {
      Alert.alert("Login Gagal", "Email atau password salah");
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
        Masuk ke akun kamu
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
        className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-base mb-6"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        className="bg-red-600 py-4 rounded-xl items-center mb-4"
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-bold">Masuk</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text className="text-green-600 text-center text-sm">
          Belum punya akun? Daftar
        </Text>
      </TouchableOpacity>
    </View>
  );
}
