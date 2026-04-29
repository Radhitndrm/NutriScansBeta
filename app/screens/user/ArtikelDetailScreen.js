import React from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { C } from "../../theme/colors";

export default function ArtikelDetailScreen({ route, navigation }) {
  const { artikel } = route.params;

  // Render konten: baris "**bold**" jadi tebal, sisanya normal
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

      {/* Judul */}
      <Text style={{ fontSize: 20, fontWeight: "bold", color: C.smoke, marginBottom: 8 }}>
        {artikel.judul}
      </Text>

      {/* Meta */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
        <Text style={{ fontSize: 12, color: C.smoke, opacity: 0.55 }}>{artikel.sumber}</Text>
        <Text style={{ fontSize: 12, color: C.smoke, opacity: 0.55 }}>{artikel.tanggal}</Text>
      </View>

      {/* Konten */}
      <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 18 }}>
        {renderKonten(artikel.konten)}
      </View>
    </ScrollView>
  );
}
