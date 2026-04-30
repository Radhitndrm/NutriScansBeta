import React from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { TIPS } from "../../data/tipsData";
import useUserProfil from "./hooks/useUserProfil";

import { C } from "../../theme/colors";

const LABEL = { ibu_hamil: "Ibu Hamil 🤰", balita: "Balita 👶" };

export default function TipsListScreen({ navigation }) {
  const profil = useUserProfil();
  const kategori = profil?.kategori;

  const filtered = kategori
    ? TIPS.filter((t) => t.kategori.includes(kategori))
    : TIPS;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.skyWarm }} contentContainerStyle={{ padding: 20 }}>
      {/* Badge kategori */}
      {kategori && (
        <View style={{
          backgroundColor: C.smoke,
          borderRadius: 20,
          paddingHorizontal: 14,
          paddingVertical: 6,
          alignSelf: "flex-start",
          marginBottom: 20,
        }}>
          <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>
            {LABEL[kategori] ?? kategori}
          </Text>
        </View>
      )}

      {filtered.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => navigation.navigate("TipsDetail", { tips: item })}
          style={{
            backgroundColor: C.card,
            borderRadius: 16,
            padding: 18,
            marginBottom: 14,
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 14,
          }}
        >
          <Text style={{ fontSize: 36 }}>{item.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: "bold", color: C.smoke, marginBottom: 4 }}>
              {item.judul}
            </Text>
            <Text style={{ fontSize: 13, color: C.smoke, opacity: 0.75, lineHeight: 19 }}>
              {item.ringkasan}
            </Text>
            <View style={{
              backgroundColor: C.smoke,
              borderRadius: 10,
              paddingHorizontal: 8,
              paddingVertical: 2,
              alignSelf: "flex-start",
              marginTop: 8,
            }}>
              <Text style={{ color: "#fff", fontSize: 10 }}>{item.tag}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
