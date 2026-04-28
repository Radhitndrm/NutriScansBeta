import React from "react";
import { 
  ScrollView, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator 
} from "react-native";
import useRegister from "./hooks/useRegister"; // Pastikan path hook ini benar

export default function RegisterScreen({ navigation }) {
  const register = useRegister(navigation);

  // Palet Warna Foto No 3
  const colors = {
    smoke: '#4a4f42',     // Gelap
    skyBlue: '#ccc9be',   // Background
    inputBg: '#dbdad2',   // Warna input (sedikit lebih gelap dari bg)
    white: '#ffffff'
  };

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: colors.skyBlue }}
      contentContainerStyle={{ paddingHorizontal: 30, paddingVertical: 60 }}
    >
      {/* HEADER: LOGO & JUDUL (Sesuai Foto No 2) */}
      <View style={{ alignItems: 'center', marginBottom: 40 }}>
        <View style={{ 
          width: 140, 
          height: 140, 
          justifyContent: 'center', 
          alignItems: 'center',
          marginBottom: 10 
        }}>
          {/* Ganti source logo sesuai path di folder assets Anda */}
          <Image
            source={require("../../../assets/Logo.png")} 
            className="w-80 h-80"
            resizeMode="contain"
          />
        </View>
        <Text style={{ 
          fontSize: 32, 
          fontWeight: 'bold', 
          color: colors.smoke, 
          letterSpacing: 2 
        }}>REGISTER</Text>
        <Text style={{ color: colors.smoke, opacity: 0.8 }}>To access NutriScan</Text>
        
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.smoke, fontSize: 12, marginTop: 5 }}>
            Have an account? <Text style={{ fontWeight: 'bold' }}>Login now</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* FORM LOGIC */}
      {register.step === 1 ? (
        /* --- STEP 1 FORM --- */
        <View>
          <CustomInput 
            placeholder="EMAIL" 
            value={register.email} 
            onChangeText={register.setEmail} 
            colors={colors}
          />
          <CustomInput 
            placeholder="PASSWORD" 
            value={register.password} 
            onChangeText={register.setPassword} 
            secureTextEntry 
            colors={colors}
          />
          <CustomInput 
            placeholder="KONFIRMASI PASSWORD" 
            value={register.konfirmasi} 
            onChangeText={register.setKonfirmasi} 
            secureTextEntry 
            colors={colors}
          />

          <TouchableOpacity 
            onPress={register.handleLanjut}
            style={{ 
              backgroundColor: colors.smoke, 
              borderRadius: 25, 
              paddingVertical: 15, 
              alignItems: 'center', 
              marginTop: 20 
            }}
          >
            <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: 16 }}>LANJUT</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* --- STEP 2 FORM --- */
        <View>
          <CustomInput 
            placeholder="DAFTAR SEBAGAI (Kategori)" 
            value={register.kategori} 
            onChangeText={register.setKategori} 
            colors={colors}
          />
          <CustomInput 
            placeholder="NAMA ANAK / DETAIL" 
            value={register.namaAnak} 
            onChangeText={register.setNamaAnak} 
            colors={colors}
          />

          <TouchableOpacity 
            onPress={register.handleDaftar}
            disabled={register.loading}
            style={{ 
              backgroundColor: colors.smoke, 
              borderRadius: 25, 
              paddingVertical: 15, 
              alignItems: 'center', 
              marginTop: 20 
            }}
          >
            {register.loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: 16 }}>REGISTER</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={register.handleKembali}
            style={{ marginTop: 15, alignItems: 'center' }}
          >
            <Text style={{ color: colors.smoke }}>Kembali</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

// Komponen Input Custom agar kode lebih rapi dan konsisten dengan desain No 2
const CustomInput = ({ placeholder, value, onChangeText, secureTextEntry, colors }) => (
  <View style={{
    backgroundColor: colors.inputBg,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  }}>
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#7a7a7a"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      style={{ flex: 1, color: colors.smoke, fontWeight: '500' }}
    />
  </View>
);