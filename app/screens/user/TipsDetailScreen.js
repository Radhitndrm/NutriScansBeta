import React from "react";
import { ScrollView, View, Text, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";

import { C } from "../../theme/colors";

export default function TipsDetailScreen({ route, navigation }) {
  const { tips } = route.params;

  // Load Font Inter
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  if (!fontsLoaded) return null;

  const renderKonten = (konten) =>
    konten.split("\n").map((line, i) => {
      const isBold = line.startsWith("**") && line.includes("**", 2);
      const text = line.replace(/\*\*/g, "");
      if (!text.trim()) return null;

      return (
        <Text
          key={i}
          style={{
            fontSize: 14,
            color: C.smoke,
            lineHeight: 22,
            // Menggunakan font Inter sesuai kondisi bold
            fontFamily: isBold ? "Inter_700Bold" : "Inter_400Regular",
            marginTop: isBold ? 12 : 4,
          }}
        >
          {text}
        </Text>
      );
    });

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: C.skyWarm }} 
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >


      {/* Icon + judul */}
      <View style={{ alignItems: "center", marginBottom: 25 }}>
        <Text style={{ fontSize: 60, marginBottom: 10 }}>{tips.icon}</Text>
        <Text style={{ 
          fontSize: 22, 
          color: C.smoke, 
          textAlign: "center",
          fontFamily: "Inter_700Bold",
          lineHeight: 30
        }}>
          {tips.judul}
        </Text>
        <View style={{
          backgroundColor: C.smoke,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 4,
          marginTop: 10,
        }}>
          <Text style={{ 
            color: "#fff", 
            fontSize: 11,
            fontFamily: "Inter_700Bold" 
          }}>
            {tips.tag}
          </Text>
        </View>
      </View>

      {/* Konten dengan Bayangan (Shadow) */}
      <View style={{ 
        backgroundColor: C.card, 
        borderRadius: 20, 
        padding: 22,
        marginBottom: 20,
        // Shadow untuk iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, // Tidak terlalu tebal
        shadowRadius: 10,
        // Shadow untuk Android
        elevation: 4, 
      }}>
        {renderKonten(tips.konten)}
      </View>
    </ScrollView>
  );
}