import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import { C } from "../../theme/colors";

function renderKonten(konten) {
  return konten.split("\n").map((line, i) => {
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
          fontFamily: isBold ? "Inter_700Bold" : "Inter_400Regular",
          marginTop: isBold ? 12 : 4,
        }}
      >
        {text}
      </Text>
    );
  });
}

async function bukaUrl(url) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert("Tidak bisa membuka artikel.");
  }
}

export default function ArtikelDetailScreen({ route }) {
  const { artikel } = route.params;

  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });
  if (!fontsLoaded) return null;

  const isExternal = !!artikel.isExternal;

  // Judul artikel eksternal dari Google News biasanya "Judul - Nama Media"
  // Pisahkan supaya nama media tidak tampil dua kali
  const judulBersih = isExternal
    ? artikel.judul.replace(/\s*-\s*[^-]+$/, "").trim()
    : artikel.judul;
  const namaMedia = isExternal
    ? (artikel.judul.match(/\s*-\s*([^-]+)$/) ?? [])[1]?.trim() ?? artikel.sumber
    : artikel.sumber;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.skyWarm }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
      {/* Judul */}
      <Text
        style={{
          fontSize: 20,
          fontFamily: "Inter_700Bold",
          color: C.smoke,
          marginBottom: 8,
          letterSpacing: 0.2,
          lineHeight: 28,
        }}
      >
        {judulBersih}
      </Text>

      {/* Meta: media + tanggal */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20, alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="newspaper-outline" size={13} color={C.smoke} style={{ opacity: 0.5 }} />
          <Text style={{ fontSize: 12, color: C.smoke, opacity: 0.55, fontFamily: "Inter_400Regular" }}>
            {namaMedia}
          </Text>
        </View>
        <Text style={{ fontSize: 12, color: C.smoke, opacity: 0.55, fontFamily: "Inter_400Regular" }}>
          {artikel.tanggal}
        </Text>
      </View>

      {/* Konten / ringkasan */}
      <View
        style={{
          backgroundColor: C.card,
          borderRadius: 18,
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 2,
          marginBottom: 16,
        }}
      >
        {isExternal ? (
          <>
            <Text style={{ fontSize: 14, color: C.smoke, lineHeight: 22, fontFamily: "Inter_400Regular" }}>
              {artikel.ringkasan || artikel.konten || "Tidak ada ringkasan tersedia."}
            </Text>
            {/* Penanda bahwa ini ringkasan, bukan full artikel */}
            <View style={{
              marginTop: 16,
              paddingTop: 14,
              borderTopWidth: 1,
              borderTopColor: C.cardDark,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}>
              <Ionicons name="information-circle-outline" size={15} color={C.smoke} style={{ opacity: 0.45 }} />
              <Text style={{ fontSize: 12, color: C.smoke, opacity: 0.45, fontFamily: "Inter_400Regular", flex: 1 }}>
                Ini adalah ringkasan. Baca artikel lengkap di sumber aslinya.
              </Text>
            </View>
          </>
        ) : (
          renderKonten(artikel.konten || artikel.ringkasan || "")
        )}
      </View>

      {/* Tombol baca selengkapnya (hanya artikel eksternal) */}
      {isExternal && artikel.url ? (
        <TouchableOpacity
          onPress={() => bukaUrl(artikel.url)}
          style={{
            backgroundColor: "#3f4338",
            borderRadius: 14,
            paddingVertical: 14,
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Ionicons name="open-outline" size={18} color="#fff" />
          <Text style={{ color: "#fff", fontFamily: "Inter_700Bold", fontSize: 14 }}>
            Baca Artikel Lengkap
          </Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}
