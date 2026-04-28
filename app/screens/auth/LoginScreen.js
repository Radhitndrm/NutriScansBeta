import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";

const C = {
  smoke: "#4a4f42",
  skyWarm: "#ccc9be",
  inputBg: "#d4d2c9",
  placeholder: "#8a8880",
};

function InputRow({ icon, placeholder, value, onChangeText, secureTextEntry, rightIcon, onRightIconPress, keyboardType }) {
  return (
    <View style={{
      backgroundColor: C.inputBg,
      borderRadius: 30,
      paddingHorizontal: 18,
      paddingVertical: 14,
      marginBottom: 14,
      flexDirection: "row",
      alignItems: "center",
    }}>
      <Ionicons name={icon} size={18} color={C.smoke} style={{ marginRight: 10, opacity: 0.6 }} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={C.placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        style={{ flex: 1, color: C.smoke, fontWeight: "500", fontSize: 13, letterSpacing: 1 }}
      />
      {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress}>
          <Ionicons name={rightIcon} size={18} color={C.smoke} style={{ opacity: 0.6 }} />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    } catch {
      Alert.alert("Login Gagal", "Email atau password salah");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.skyWarm }}
      contentContainerStyle={{ paddingHorizontal: 30, paddingTop: 60, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ alignItems: "center", marginBottom: 36 }}>
        <Image
          source={require("../../../assets/Logo.png")}
          style={{ width: 160, height: 160 }}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 34, fontWeight: "bold", color: C.smoke, letterSpacing: 3, marginTop: 8 }}>
          LOGIN
        </Text>
        <Text style={{ color: C.smoke, opacity: 0.75, fontSize: 13, marginTop: 2 }}>
          To access NutriScan
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")} style={{ marginTop: 6 }}>
          <Text style={{ color: C.smoke, fontSize: 12 }}>
            Belum punya akun? <Text style={{ fontWeight: "bold" }}>Daftar sekarang</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <InputRow
        icon="mail-outline"
        placeholder="EMAIL"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <InputRow
        icon="key-outline"
        placeholder="PASSWORD"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        rightIcon={showPassword ? "eye-outline" : "eye-off-outline"}
        onRightIconPress={() => setShowPassword(!showPassword)}
      />

      <TouchableOpacity style={{ alignItems: "flex-end", marginBottom: 28 }}>
        <Text style={{ color: C.smoke, fontSize: 12, opacity: 0.7 }}>FORGET PASSWORD?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: C.smoke,
          borderRadius: 30,
          paddingVertical: 16,
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15, letterSpacing: 2 }}>
            LOGIN
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
