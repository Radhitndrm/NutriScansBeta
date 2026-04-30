import React from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { C } from "../../theme/colors";

export default function TipsDetailScreen({ route, navigation }) {
  const { tips } = route.params;

  const renderKonten = (konten) =>
    konten.split("\n").map((line, i) => {
      const isBold = line.startsWith("**") && line.includes("**", 2);
      const text = line.replace(/\*\*/g, "");
      return (
        <Text
          key={i}
          style={{
            fontSize: 14,
            color: C.smoke,
            lineHeight: 22,
            fontWeight: isBold ? "bold" : "normal",
            marginTop: isBold ? 10 : 0,
          }}
        >
          {text}
        </Text>
      );
    });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.skyWarm }} contentContainerStyle={{ padding: 20 }}>
      {/* Tombol kembali */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
      >
        <Ionicons name="arrow-back" size={20} color={C.smoke} />
        <Text style={{ color: C.smoke, marginLeft: 6, fontSize: 14 }}>Kembali</Text>
      </TouchableOpacity>

      {/* Icon + judul */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Text style={{ fontSize: 52, marginBottom: 10 }}>{tips.icon}</Text>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: C.smoke, textAlign: "center" }}>
          {tips.judul}
        </Text>
        <View style={{
          backgroundColor: C.smoke,
          borderRadius: 12,
          paddingHorizontal: 10,
          paddingVertical: 3,
          marginTop: 8,
        }}>
          <Text style={{ color: "#fff", fontSize: 11 }}>{tips.tag}</Text>
        </View>
      </View>

      {/* Konten */}
      <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 18 }}>
        {renderKonten(tips.konten)}
      </View>
    </ScrollView>
  );
}
