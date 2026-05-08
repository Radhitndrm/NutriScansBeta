import React from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFonts } from "expo-font";
import { Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import { Ionicons } from "@expo/vector-icons";
import useArtikel from "./hooks/useArtikel";
import useUserProfil from "./hooks/useUserProfil";
import { resolveKategori } from "../../utils/artikelConfig";
import { C } from "../../theme/colors";

const KATEGORI_META = {
  ibu_hamil: {
    label: "Ibu Hamil",
    icon: "heart-circle-outline",
    warna: "#7a6a4a",
  },
  balita: { label: "Balita", icon: "happy-outline", warna: "#4a6a5a" },
};

const LABEL_SUB = {
  trimester_1: "Trimester 1",
  trimester_2: "Trimester 2",
  trimester_3: "Trimester 3",
  "0-6_bulan": "0 – 6 Bulan",
  "7-11_bulan": "7 – 11 Bulan",
  "1-3_tahun": "1 – 3 Tahun",
  "4-6_tahun": "4 – 6 Tahun",
};

export default function ArtikelListScreen({ navigation }) {
  const profil = useUserProfil();
  const { articles, loading, error, refresh } = useArtikel();
  const [refreshing, setRefreshing] = React.useState(false);

  const kategori = resolveKategori(profil);
  const meta = KATEGORI_META[kategori];

  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });
  if (!fontsLoaded) return null;

  async function handleRefresh() {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("ArtikelDetail", { artikel: item })}
        activeOpacity={0.85}
        style={{
          backgroundColor: "#e6e3db",
          borderRadius: 18,
          padding: 20,
          marginBottom: 14,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_700Bold",
            color: "#4a4f42",
            marginBottom: 6,
            letterSpacing: 0.2,
          }}
        >
          {item.judul}
        </Text>

        <Text
          style={{
            fontSize: 13,
            color: "#7a7a7a",
            lineHeight: 21,
            marginBottom: 10,
            fontFamily: "Inter_400Regular",
          }}
          numberOfLines={2}
        >
          {item.ringkasan}
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              fontSize: 11,
              color: "#8a8a8a",
              fontFamily: "Inter_400Regular",
            }}
          >
            {item.sumber}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: "#8a8a8a",
              fontFamily: "Inter_400Regular",
            }}
          >
            {item.tanggal}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#ccc9be" }}>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#3f4338"
          />
        }
        ListHeaderComponent={
          <>
            {/* Header halaman */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: C.smoke, fontSize: 22, fontWeight: "bold", fontFamily: "Inter_700Bold" }}>
                Artikel
              </Text>
              <Text style={{ color: C.placeholder, fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 }}>
                Informasi gizi {"&"} kesehatan terpilih
              </Text>
            </View>

            {/* Banner personalisasi kategori */}
            {meta && (
              <View
                style={{
                  backgroundColor: C.smoke,
                  borderRadius: 18,
                  padding: 16,
                  marginBottom: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <View
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 23,
                    backgroundColor: "rgba(255,255,255,0.12)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name={meta.icon} size={26} color="#fff" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: 11,
                      fontFamily: "Inter_400Regular",
                      marginBottom: 2,
                    }}
                  >
                    Artikel untukmu
                  </Text>
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 15,
                      fontFamily: "Inter_700Bold",
                    }}
                  >
                    {meta.label}
                    {profil?.subKategori && LABEL_SUB[profil.subKategori]
                      ? `  ·  ${LABEL_SUB[profil.subKategori]}`
                      : ""}
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.15)",
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 11,
                      fontFamily: "Inter_400Regular",
                    }}
                  >
                    {articles.length} artikel
                  </Text>
                </View>
              </View>
            )}

            {/* Error banner (offline fallback) */}
            {error && (
              <View
                style={{
                  backgroundColor: "#f0ebe0",
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 14,
                  borderLeftWidth: 3,
                  borderLeftColor: "#a07850",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Ionicons
                  name="cloud-offline-outline"
                  size={16}
                  color="#a07850"
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: "#7a6040",
                    fontFamily: "Inter_400Regular",
                    flex: 1,
                  }}
                >
                  {error}
                </Text>
              </View>
            )}

            {/* Loading spinner pertama kali */}
            {loading && articles.length === 0 && (
              <ActivityIndicator
                size="large"
                color="#3f4338"
                style={{ marginTop: 40 }}
              />
            )}
          </>
        }
        ListEmptyComponent={
          !loading ? (
            <Text
              style={{
                textAlign: "center",
                color: "#7a7a7a",
                marginTop: 40,
                fontFamily: "Inter_400Regular",
              }}
            >
              Belum ada artikel tersedia.
            </Text>
          ) : null
        }
      />
    </View>
  );
}
