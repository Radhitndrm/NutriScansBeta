import React from "react";
import { ScrollView, View, Text, TouchableOpacity, Linking, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
          fontWeight: isBold ? "bold" : "normal",
          marginTop: isBold ? 10 : 0,
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

export default function TipsDetailScreen({ route }) {
  const { tips } = route.params;
  const isExternal = !!tips.isExternal;

  const judulBersih = isExternal
    ? tips.judul.replace(/\s*-\s*[^-]+$/, "").trim()
    : tips.judul;
  const namaMedia = isExternal
    ? (tips.judul.match(/\s*-\s*([^-]+)$/) ?? [])[1]?.trim() ?? tips.sumber
    : tips.sumber;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.skyWarm }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
      {/* Icon + judul (statis) */}
      {!isExternal && (
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          {tips.icon && <Text style={{ fontSize: 52, marginBottom: 10 }}>{tips.icon}</Text>}
          <Text style={{ fontSize: 20, fontWeight: "bold", color: C.smoke, textAlign: "center" }}>
            {tips.judul}
          </Text>
          {tips.tag && (
            <View style={{
              backgroundColor: C.smoke,
              borderRadius: 12,
              paddingHorizontal: 10,
              paddingVertical: 3,
              marginTop: 8,
            }}>
              <Text style={{ color: "#fff", fontSize: 11 }}>{tips.tag}</Text>
            </View>
          )}
        </View>
      )}

      {/* Judul eksternal */}
      {isExternal && (
        <>
          <Text style={{
            fontSize: 20,
            fontWeight: "bold",
            color: C.smoke,
            marginBottom: 8,
            lineHeight: 28,
          }}>
            {judulBersih}
          </Text>
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="newspaper-outline" size={13} color={C.smoke} style={{ opacity: 0.5 }} />
              <Text style={{ fontSize: 12, color: C.smoke, opacity: 0.55 }}>{namaMedia}</Text>
            </View>
            <Text style={{ fontSize: 12, color: C.smoke, opacity: 0.55 }}>{tips.tanggal}</Text>
          </View>
        </>
      )}

      {/* Konten */}
      <View style={{
        backgroundColor: C.card,
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
      }}>
        {isExternal ? (
          <>
            <Text style={{ fontSize: 14, color: C.smoke, lineHeight: 22 }}>
              {tips.ringkasan || tips.konten || "Tidak ada ringkasan tersedia."}
            </Text>
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
              <Text style={{ fontSize: 12, color: C.smoke, opacity: 0.45, flex: 1 }}>
                Ini adalah ringkasan. Baca selengkapnya di sumber aslinya.
              </Text>
            </View>
          </>
        ) : (
          renderKonten(tips.konten || "")
        )}
      </View>

      {/* Tombol baca selengkapnya (hanya eksternal) */}
      {isExternal && tips.url ? (
        <TouchableOpacity
          onPress={() => bukaUrl(tips.url)}
          style={{
            backgroundColor: C.smoke,
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
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
            Baca Tips Lengkap
          </Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}
