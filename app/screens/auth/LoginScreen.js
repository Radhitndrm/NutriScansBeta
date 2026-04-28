import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
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
    <View className="flex-1 justify-center px-6 bg-sky-warm">

      <View className="items-center mb-6">
        <Image
          source={require("../../../assets/Logo.png")} 
          className="w-80 h-80"
          resizeMode="contain"
        />
      </View>

      <Text 
      className="text-4xl font-bold text-smoke text-center tracking-widest">
        LOGIN
      </Text>
      <Text className="text-base text-smoke-400 text-center mt-2 opacity-70">
        To access NutriScan
      </Text>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text className="text-smok text-xs text-center mb-8 opacity-50">
          Belum punya akun? Daftar
        </Text>
      </TouchableOpacity>

      <TextInput
        className="bg-white/70 rounded-full px-5 py-4 mb-4 flex-row items-center"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        className="bg-white/70 rounded-full px-5 py-4 mb-4 flex-row items-center"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        className="bg-smoke py-4 rounded-full items-center mb-4"
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold tracking-wide">LOGIN</Text>
        )}
      </TouchableOpacity>
      
      <Text className="text-smoke text-center text-xs opacity-70">
      FORGET PASSWORD?
      </Text>

    </View>
  );
}
