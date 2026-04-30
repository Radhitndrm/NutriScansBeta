import React from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { ARTIKEL } from "../../data/artikelData";
import useUserProfil from "./hooks/useUserProfil";
import { useFonts } from "expo-font";
import { Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";

import { C } from "../../theme/colors";

const LABEL = { ibu_hamil: "Ibu Hamil 🤰🏿", balita: "Balita 👶🏿" };

export default function ArtikelListScreen({ navigation }) {
  const profil = useUserProfil();
  const kategori = profil?.kategori;

  const [fontsLoaded] = useFonts({
  Inter_400Regular,
  Inter_700Bold,
  });

  if (!fontsLoaded) return null;

  const filtered = kategori
    ? ARTIKEL.filter((a) => a.kategori.includes(kategori))
    : ARTIKEL;

  return (
    <ScrollView
      style={{ 
        flex: 1, 
        backgroundColor: "#ccc9be" 
      }}
      contentContainerStyle={{ 
        padding: 20 
      }}
    >
      {/* Header kategori */}
      {kategori && (
        <View
          style={{
            backgroundColor: "#3f4338",
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 6,
            alignSelf: "flex-start",
            marginBottom: 20,
          }}
        >
          <Text style={{ 
            color: "#fff", 
            fontSize: 12, 
            fontFamily: "Inter_600SemiBold" }}>
            {LABEL[kategori] ?? kategori}
          </Text>
        </View>
      )}

      {filtered.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() =>
            navigation.navigate("ArtikelDetail", { artikel: item })
          }
          activeOpacity={0.85}
          style={{
            backgroundColor: "#e6e3db",
            borderRadius: 18,
            padding: 20,
            marginBottom: 14,

            // shadow iOS
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,

            // shadow Android
            elevation: 2,
          }}
        >
          {/* Judul */}
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_700Bold",
              color: "#4a4f42",
              marginBottom: 6,
              letterSpacing: 0.2
            }}
          >
            {item.judul}
          </Text>

          {/* Ringkasan */}
          <Text
            style={{
              fontSize: 13,
              color: "#7a7a7a",
              lineHeight: 21,
              marginBottom: 10,
              fontFamily:"Inter_400Regular"
            }}
            numberOfLines={2}
          >
            {item.ringkasan}
          </Text>

          {/* Footer */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ 
              fontSize: 11, 
              color: "#8a8a8a", 
              fontFamily:"Inter_400Regular",
              }}>
              {item.sumber}
            </Text>
            <Text style={{ 
              fontSize: 11, 
              color: "#8a8a8a", 
              fontFamily:"Inter_400Regular",
              }}>
              {item.tanggal}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
