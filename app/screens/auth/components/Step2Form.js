import React from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const C = {
  smoke: "#4a4f42",
  skyWarm: "#ccc9be",
  inputBg: "#d4d2c9",
  selectedBg: "#b8bdb2",
  placeholder: "#8a8880",
};

const KATEGORI = [
  { id: "ibu_hamil", label: "Ibu Hamil", icon: "heart-circle-outline" },
  { id: "balita",    label: "Balita",    icon: "happy-outline" },
];

const TRIMESTER = [
  { id: "trimester_1", label: "Trimester 1", sub: "0 - 12 minggu" },
  { id: "trimester_2", label: "Trimester 2", sub: "13 - 26 minggu" },
  { id: "trimester_3", label: "Trimester 3", sub: "27 - 40 minggu" },
];

const USIA_BALITA = [
  { id: "0-6_bulan",  label: "0 - 6 Bulan" },
  { id: "7-11_bulan", label: "7 - 11 Bulan" },
  { id: "1-3_tahun",  label: "1 - 3 Tahun" },
  { id: "4-6_tahun",  label: "4 - 6 Tahun" },
];

export default function Step2Form({
  kategori, setKategori,
  trimester, setTrimester,
  namaAnak, setNamaAnak,
  usiaBalita, setUsiaBalita,
  loading,
  onDaftar,
  onKembali,
}) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", color: C.smoke, marginBottom: 4 }}>
        PILIH KATEGORI
      </Text>
      <Text style={{ fontSize: 13, color: C.smoke, opacity: 0.7, marginBottom: 24 }}>
        Pilih sesuai kondisi pengguna aplikasi ini
      </Text>

      {/* Kartu kategori */}
      <View style={{ flexDirection: "row", gap: 14, marginBottom: 24 }}>
        {KATEGORI.map((item) => {
          const selected = kategori === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                setKategori(item.id);
                setTrimester(null);
                setUsiaBalita(null);
              }}
              style={{
                flex: 1,
                borderRadius: 16,
                paddingVertical: 20,
                alignItems: "center",
                backgroundColor: selected ? C.selectedBg : C.inputBg,
                borderWidth: 2,
                borderColor: selected ? C.smoke : "transparent",
              }}
            >
              <Ionicons name={item.icon} size={40} color={C.smoke} style={{ marginBottom: 6 }} />
              <Text style={{ fontWeight: "bold", fontSize: 13, color: C.smoke }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Detail: Ibu Hamil */}
      {kategori === "ibu_hamil" && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontWeight: "bold", color: C.smoke, marginBottom: 12 }}>
            Trimester Kehamilan
          </Text>
          {TRIMESTER.map((item) => {
            const selected = trimester === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setTrimester(item.id)}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  marginBottom: 8,
                  backgroundColor: selected ? C.selectedBg : C.inputBg,
                  borderWidth: 2,
                  borderColor: selected ? C.smoke : "transparent",
                }}
              >
                <Text style={{ fontWeight: "600", color: C.smoke, fontSize: 14 }}>
                  {item.label}
                </Text>
                <Text style={{ color: C.smoke, opacity: 0.6, fontSize: 13 }}>
                  {item.sub}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Detail: Balita */}
      {kategori === "balita" && (
        <View style={{ marginBottom: 20 }}>
          <TextInput
            placeholder="Nama Anak"
            placeholderTextColor={C.placeholder}
            value={namaAnak}
            onChangeText={setNamaAnak}
            style={{
              backgroundColor: C.inputBg,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              color: C.smoke,
              fontSize: 14,
              marginBottom: 16,
            }}
          />
          <Text style={{ fontWeight: "bold", color: C.smoke, marginBottom: 12 }}>
            Kelompok Usia
          </Text>
          {USIA_BALITA.map((item) => {
            const selected = usiaBalita === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setUsiaBalita(item.id)}
                style={{
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  marginBottom: 8,
                  backgroundColor: selected ? C.selectedBg : C.inputBg,
                  borderWidth: 2,
                  borderColor: selected ? C.smoke : "transparent",
                }}
              >
                <Text style={{ fontWeight: "600", color: C.smoke, fontSize: 14 }}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <TouchableOpacity
        onPress={onDaftar}
        disabled={loading || !kategori}
        style={{
          backgroundColor: kategori ? C.smoke : C.inputBg,
          borderRadius: 30,
          paddingVertical: 16,
          alignItems: "center",
          marginTop: 4,
          marginBottom: 14,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: kategori ? "#fff" : C.placeholder, fontWeight: "bold", fontSize: 15, letterSpacing: 1 }}>
            Daftar
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={onKembali} style={{ alignItems: "center" }}>
        <Text style={{ color: C.smoke, fontSize: 13 }}>◆ Kembali</Text>
      </TouchableOpacity>
    </View>
  );
}
