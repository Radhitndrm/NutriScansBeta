import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const C = {
  smoke: "#4a4f42",
  inputBg: "#d4d2c9",
  placeholder: "#8a8880",
};

function InputRow({ icon, placeholder, value, onChangeText, secureTextEntry, rightIcon, onRightIconPress, keyboardType, autoCapitalize }) {
  return (
    <View style={{
      backgroundColor: C.inputBg,
      borderRadius: 30,
      paddingHorizontal: 18,
      paddingVertical: 14,
      marginBottom: 14,
      flexDirection: "row",
      alignItems: "center",
    }}>
      <Ionicons name={icon} size={18} color={C.smoke} style={{ marginRight: 10, opacity: 0.6 }} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={C.placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize ?? "none"}
        style={{ flex: 1, color: C.smoke, fontWeight: "500", fontSize: 13, letterSpacing: 1 }}
      />
      {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress}>
          <Ionicons name={rightIcon} size={18} color={C.smoke} style={{ opacity: 0.6 }} />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function Step1Form({ username, setUsername, email, setEmail, password, setPassword, konfirmasi, setKonfirmasi, onLanjut, onMasuk }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);

  return (
    <View>
      <InputRow
        icon="person-outline"
        placeholder="USERNAME"
        value={username}
        onChangeText={setUsername}
      />
      <InputRow
        icon="mail-outline"
        placeholder="EMAIL"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <InputRow
        icon="key-outline"
        placeholder="PASSWORD"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        rightIcon={showPassword ? "eye-outline" : "eye-off-outline"}
        onRightIconPress={() => setShowPassword(!showPassword)}
      />

      <InputRow
        icon="lock-closed-outline"
        placeholder="KONFIRMASI PASSWORD"
        value={konfirmasi}
        onChangeText={setKonfirmasi}
        secureTextEntry={!showKonfirmasi}
        rightIcon={showKonfirmasi ? "eye-outline" : "eye-off-outline"}
        onRightIconPress={() => setShowKonfirmasi(!showKonfirmasi)}
      />

      <TouchableOpacity
        onPress={onLanjut}
        style={{
          backgroundColor: C.smoke,
          borderRadius: 30,
          paddingVertical: 16,
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15, letterSpacing: 2 }}>
          REGISTER
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onMasuk} style={{ alignItems: "center" }}>
        <Text style={{ color: C.smoke, fontSize: 12 }}>
          Have an account? <Text style={{ fontWeight: "bold" }}>Login now</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
