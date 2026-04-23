import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";

const KATEGORI = [
  { id: "ibu_hamil", label: "Ibu Hamil", icon: "🤰" },
  { id: "balita", label: "Balita", icon: "👶" },
];

const TRIMESTER = [
  { id: "trimester_1", label: "Trimester 1", sub: "0 - 12 minggu" },
  { id: "trimester_2", label: "Trimester 2", sub: "13 - 26 minggu" },
  { id: "trimester_3", label: "Trimester 3", sub: "27 - 40 minggu" },
];

const USIA_BALITA = [
  { id: "0-6_bulan", label: "0 - 6 Bulan" },
  { id: "7-11_bulan", label: "7 - 11 Bulan" },
  { id: "1-3_tahun", label: "1 - 3 Tahun" },
  { id: "4-6_tahun", label: "4 - 6 Tahun" },
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
    <View>
      <Text className="text-xl font-bold text-gray-800 mb-2">
        Pilih Kategori
      </Text>
      <Text className="text-gray-400 text-sm mb-6">
        Pilih sesuai kondisi pengguna aplikasi ini
      </Text>

      {/* Pilih kategori */}
      <View className="flex-row gap-4 mb-6">
        {KATEGORI.map((item) => (
          <TouchableOpacity
            key={item.id}
            className={`flex-1 rounded-2xl p-5 items-center border-2 ${
              kategori === item.id
                ? "bg-green-50 border-green-600"
                : "bg-white border-gray-200"
            }`}
            onPress={() => {
              setKategori(item.id);
              setTrimester(null);
              setUsiaBalita(null);
            }}
          >
            <Text className="text-4xl mb-2">{item.icon}</Text>
            <Text className={`font-bold text-sm ${
              kategori === item.id ? "text-green-700" : "text-gray-700"
            }`}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Detail Ibu Hamil */}
      {kategori === "ibu_hamil" && (
        <View className="mb-6">
          <Text className="text-gray-700 font-bold mb-3">
            Trimester Kehamilan
          </Text>
          {TRIMESTER.map((item) => (
            <TouchableOpacity
              key={item.id}
              className={`flex-row justify-between items-center rounded-xl p-4 mb-2 border-2 ${
                trimester === item.id
                  ? "bg-green-50 border-green-600"
                  : "bg-white border-gray-200"
              }`}
              onPress={() => setTrimester(item.id)}
            >
              <Text className={`font-semibold ${
                trimester === item.id ? "text-green-700" : "text-gray-700"
              }`}>
                {item.label}
              </Text>
              <Text className="text-gray-400 text-sm">{item.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Detail Balita */}
      {kategori === "balita" && (
        <View className="mb-6">
          <TextInput
            className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-base mb-4"
            placeholder="Nama Anak"
            value={namaAnak}
            onChangeText={setNamaAnak}
          />
          <Text className="text-gray-700 font-bold mb-3">Kelompok Usia</Text>
          {USIA_BALITA.map((item) => (
            <TouchableOpacity
              key={item.id}
              className={`rounded-xl p-4 mb-2 border-2 ${
                usiaBalita === item.id
                  ? "bg-green-50 border-green-600"
                  : "bg-white border-gray-200"
              }`}
              onPress={() => setUsiaBalita(item.id)}
            >
              <Text className={`font-semibold ${
                usiaBalita === item.id ? "text-green-700" : "text-gray-700"
              }`}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        className={`py-4 rounded-xl items-center mb-4 ${
          kategori ? "bg-green-600" : "bg-gray-300"
        }`}
        onPress={onDaftar}
        disabled={loading || !kategori}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-base">Daftar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={onKembali}>
        <Text className="text-green-600 text-center text-sm">← Kembali</Text>
      </TouchableOpacity>
    </View>
  );
}
