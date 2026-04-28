import React from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { ARTIKEL } from "../../data/artikelData";
import useUserProfil from "./hooks/useUserProfil";

const C = { smoke: "#4a4f42", skyWarm: "#ccc9be", card: "#d4d2c9" };

const LABEL = { ibu_hamil: "Ibu Hamil 🤰", balita: "Balita 👶" };

export default function ArtikelListScreen({ navigation }) {
  const profil = useUserProfil();
  const kategori = profil?.kategori;

  const filtered = kategori
    ? ARTIKEL.filter((a) => a.kategori.includes(kategori))
    : ARTIKEL;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.skyWarm }} contentContainerStyle={{ padding: 20 }}>
      {/* Header kategori */}
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
          onPress={() => navigation.navigate("ArtikelDetail", { artikel: item })}
          style={{
            backgroundColor: C.card,
            borderRadius: 16,
            padding: 18,
            marginBottom: 14,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "bold", color: C.smoke, marginBottom: 6 }}>
            {item.judul}
          </Text>
          <Text style={{ fontSize: 13, color: C.smoke, opacity: 0.75, lineHeight: 20, marginBottom: 10 }}>
            {item.ringkasan}
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 11, color: C.smoke, opacity: 0.5 }}>{item.sumber}</Text>
            <Text style={{ fontSize: 11, color: C.smoke, opacity: 0.5 }}>{item.tanggal}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
