import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function Step1Form({
  email, setEmail,
  password, setPassword,
  konfirmasi, setKonfirmasi,
  onLanjut,
  onMasuk,
}) {
  return (
    <View>
      <Text className="text-4xl font-bold text-green-600 text-center mb-2">
        🥗 NutriScan
      </Text>
      <Text className="text-base text-gray-400 text-center mb-10">
        Buat akun baru
      </Text>

      <TextInput
        className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-base mb-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-base mb-4"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-base mb-6"
        placeholder="Konfirmasi Password"
        value={konfirmasi}
        onChangeText={setKonfirmasi}
        secureTextEntry
      />

      <TouchableOpacity
        className="bg-green-600 py-4 rounded-xl items-center mb-4"
        onPress={onLanjut}
      >
        <Text className="text-white font-bold text-base">Lanjut</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onMasuk}>
        <Text className="text-green-600 text-center text-sm">
          Sudah punya akun? Masuk
        </Text>
      </TouchableOpacity>
    </View>
  );
}
