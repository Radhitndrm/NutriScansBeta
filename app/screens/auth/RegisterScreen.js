import React from "react";
import { ScrollView, View, Text, Image, TouchableOpacity } from "react-native";
import useRegister from "./hooks/useRegister";
import Step1Form from "./components/Step1Form";
import Step2Form from "./components/Step2Form";

import { C } from "../../theme/colors";

export default function RegisterScreen({ navigation }) {
  const reg = useRegister(navigation);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.skyWarm }}
      contentContainerStyle={{
        paddingHorizontal: 30,
        paddingTop: 60,
        paddingBottom: 40,
      }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header: logo + judul — hanya tampil di step 1 */}
      {reg.step === 1 && (
        <View style={{ alignItems: "center", marginBottom: 36 }}>
          <Image
            source={require("../../../assets/Logo.png")}
            style={{ width: 290, height: 290 }}
            resizeMode="contain"
          />
          <Text
            style={{
              fontSize: 34,
              fontWeight: "bold",
              color: C.smoke,
              letterSpacing: 3,
              marginTop: 8,
            }}
          >
            REGISTER
          </Text>
          <Text
            style={{
              color: C.smoke,
              opacity: 0.75,
              fontSize: 13,
              marginTop: 2,
            }}
          >
            To access NutriScan
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginTop: 6 }}
          >
            <Text style={{ color: C.smoke, fontSize: 12 }}>
              Have an account?{" "}
              <Text style={{ fontWeight: "bold" }}>Login now</Text>
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {reg.step === 1 ? (
        <Step1Form
          username={reg.username}
          setUsername={reg.setUsername}
          email={reg.email}
          setEmail={reg.setEmail}
          password={reg.password}
          setPassword={reg.setPassword}
          konfirmasi={reg.konfirmasi}
          setKonfirmasi={reg.setKonfirmasi}
          onLanjut={reg.handleLanjut}
          onMasuk={() => navigation.goBack()}
        />
      ) : (
        <Step2Form
          kategori={reg.kategori}
          setKategori={reg.setKategori}
          trimester={reg.trimester}
          setTrimester={reg.setTrimester}
          namaAnak={reg.namaAnak}
          setNamaAnak={reg.setNamaAnak}
          usiaBalita={reg.usiaBalita}
          setUsiaBalita={reg.setUsiaBalita}
          loading={reg.loading}
          onDaftar={reg.handleDaftar}
          onKembali={reg.handleKembali}
        />
      )}
    </ScrollView>
  );
}
