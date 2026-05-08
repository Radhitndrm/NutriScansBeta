import React from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import useTips from "./hooks/useTips";
import useUserProfil from "./hooks/useUserProfil";
import { resolveKategori } from "../../utils/artikelConfig";
import { C } from "../../theme/colors";

const KATEGORI_META = {
  ibu_hamil: { label: "Ibu Hamil", icon: "heart-circle-outline" },
  balita:    { label: "Balita",    icon: "happy-outline" },
};

const LABEL_SUB = {
  trimester_1: "Trimester 1",
  trimester_2: "Trimester 2",
  trimester_3: "Trimester 3",
  "0-6_bulan":  "0 – 6 Bulan",
  "7-11_bulan": "7 – 11 Bulan",
  "1-3_tahun":  "1 – 3 Tahun",
  "4-6_tahun":  "4 – 6 Tahun",
};

export default function TipsListScreen({ navigation }) {
  const profil   = useUserProfil();
  const { tips, loading, error, refresh } = useTips();
  const [refreshing, setRefreshing] = React.useState(false);

  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });
  if (!fontsLoaded) return null;

  const kategori = resolveKategori(profil);
  const meta     = KATEGORI_META[kategori];

  async function handleRefresh() {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }

  function renderItem({ item }) {
    const judulBersih = item.isExternal
      ? item.judul.replace(/\s*-\s*[^-]+$/, "").trim()
      : item.judul;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("TipsDetail", { tips: item })}
        activeOpacity={0.85}
        style={{
          backgroundColor: C.card,
          borderRadius: 16,
          padding: 18,
          marginBottom: 14,
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 14,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        {/* Icon: emoji untuk statis, bulb untuk eksternal */}
        <View style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          backgroundColor: C.skyWarm,
          alignItems: "center",
          justifyContent: "center",
        }}>
          {item.icon ? (
            <Text style={{ fontSize: 26 }}>{item.icon}</Text>
          ) : (
            <Ionicons name="bulb-outline" size={24} color={C.smoke} style={{ opacity: 0.7 }} />
          )}
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: "Inter_700Bold",
              color: C.smoke,
              marginBottom: 4,
              lineHeight: 21,
            }}
            numberOfLines={2}
          >
            {judulBersih}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: C.smoke,
              opacity: 0.65,
              lineHeight: 19,
              fontFamily: "Inter_400Regular",
            }}
            numberOfLines={2}
          >
            {item.ringkasan}
          </Text>

          {/* Tag / sumber */}
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 8,
            gap: 8,
          }}>
            {item.tag && (
              <View style={{
                backgroundColor: C.smoke,
                borderRadius: 10,
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}>
                <Text style={{ color: "#fff", fontSize: 10, fontFamily: "Inter_400Regular" }}>
                  {item.tag}
                </Text>
              </View>
            )}
            {item.tanggal && (
              <Text style={{ fontSize: 11, color: C.smoke, opacity: 0.4, fontFamily: "Inter_400Regular" }}>
                {item.tanggal}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.skyWarm }}>
      <FlatList
        data={tips}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={C.smoke} />
        }
        ListHeaderComponent={
          <>
            {/* Header halaman */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: C.smoke, fontSize: 22, fontWeight: "bold", fontFamily: "Inter_700Bold" }}>
                Tips Gizi
              </Text>
              <Text style={{ color: C.placeholder, fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 }}>
                Panduan nutrisi untuk kesehatanmu
              </Text>
            </View>

            {/* Banner personalisasi kategori */}
            {meta && (
              <View style={{
                backgroundColor: C.smoke,
                borderRadius: 18,
                padding: 16,
                marginBottom: 16,
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
              }}>
                <View style={{
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                  backgroundColor: "rgba(255,255,255,0.12)",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <Ionicons name={meta.icon} size={26} color="#fff" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontFamily: "Inter_400Regular", marginBottom: 2 }}>
                    Tips untukmu
                  </Text>
                  <Text style={{ color: "#fff", fontSize: 15, fontFamily: "Inter_700Bold" }}>
                    {meta.label}
                    {profil?.subKategori && LABEL_SUB[profil.subKategori]
                      ? `  ·  ${LABEL_SUB[profil.subKategori]}`
                      : ""}
                  </Text>
                </View>

                <View style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}>
                  <Text style={{ color: "#fff", fontSize: 11, fontFamily: "Inter_400Regular" }}>
                    {tips.length} tips
                  </Text>
                </View>
              </View>
            )}

            {/* Error banner */}
            {error && (
              <View style={{
                backgroundColor: "#f0ebe0",
                borderRadius: 12,
                padding: 12,
                marginBottom: 14,
                borderLeftWidth: 3,
                borderLeftColor: "#a07850",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}>
                <Ionicons name="cloud-offline-outline" size={16} color="#a07850" />
                <Text style={{ fontSize: 12, color: "#7a6040", fontFamily: "Inter_400Regular", flex: 1 }}>
                  {error}
                </Text>
              </View>
            )}

            {loading && tips.length === 0 && (
              <ActivityIndicator size="large" color={C.smoke} style={{ marginTop: 40 }} />
            )}
          </>
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={{
              textAlign: "center",
              color: C.smoke,
              opacity: 0.4,
              marginTop: 40,
              fontFamily: "Inter_400Regular",
            }}>
              Belum ada tips tersedia.
            </Text>
          ) : null
        }
      />
    </View>
  );
}
