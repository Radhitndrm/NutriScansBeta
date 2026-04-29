import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../utils/firebaseConfig";
import { C } from "../../theme/colors";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleApply() {
    if (!email) {
      Alert.alert("Error", "Masukkan email terlebih dahulu");
      return;
    }
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Email Terkirim",
        "Link reset password telah dikirim ke " + email + ". Periksa inbox atau folder spam.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch {
      Alert.alert("Gagal", "Email tidak ditemukan atau tidak valid");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.skyWarm }}
      contentContainerStyle={{ flex: 1, paddingHorizontal: 30, justifyContent: "center" }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Judul */}
      <View style={{ alignItems: "center", marginBottom: 36 }}>
        <Text style={{
          fontSize: 34,
          fontWeight: "bold",
          color: C.smoke,
          letterSpacing: 2,
          fontFamily: "Inter_700Bold",
          textAlign: "center",
        }}>
          FORGOT PASSWORD
        </Text>
        <Text style={{
          color: C.smoke,
          opacity: 0.75,
          fontSize: 13,
          marginTop: 4,
          fontFamily: "Inter_400Regular",
        }}>
          To access NutriScan
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 6 }}>
          <Text style={{ color: C.smoke, fontSize: 12, fontFamily: "Inter_400Regular" }}>
            ← <Text style={{ fontWeight: "bold", fontFamily: "Inter_600SemiBold" }}>Back to Login</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Input email */}
      <View style={{
        backgroundColor: C.inputBg,
        borderRadius: 30,
        paddingHorizontal: 18,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
      }}>
        <Ionicons name="mail-outline" size={18} color={C.smoke} style={{ marginRight: 10, opacity: 0.6 }} />
        <TextInput
          placeholder="EMAIL"
          placeholderTextColor={C.placeholder}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            flex: 1,
            color: C.smoke,
            fontWeight: "500",
            fontSize: 13,
            letterSpacing: 1,
            fontFamily: "Inter_500Medium",
          }}
        />
      </View>

      {/* Tombol Apply */}
      <TouchableOpacity
        onPress={handleApply}
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
          <Text style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 15,
            letterSpacing: 2,
            fontFamily: "Inter_700Bold",
          }}>
            APPLY
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
