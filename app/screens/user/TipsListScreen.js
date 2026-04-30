import React from "react";
import { ScrollView, View, Text, TouchableOpacity, Platform } from "react-native";
import { TIPS } from "../../data/tipsData";
import useUserProfil from "./hooks/useUserProfil";

// Import Google Fonts Inter
import { useFonts } from "expo-font";
import { Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";

import { C } from "../../theme/colors";

const LABEL = { ibu_hamil: "Ibu Hamil 🤰", balita: "Balita 👶" };

export default function TipsListScreen({ navigation }) {
  const profil = useUserProfil();
  const kategori = profil?.kategori;

  // Load Font Inter
  const [fontsLoaded] = useFonts({ 
    Inter_400Regular, 
    Inter_700Bold 
  });

  const filtered = kategori
    ? TIPS.filter((t) => t.kategori.includes(kategori))
    : TIPS;

  
  if (!fontsLoaded) return null;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.skyWarm }} contentContainerStyle={{ padding: 20 }}>
      {/* Badge kategori */}
      {kategori && (
        <View style={{
          backgroundColor: C.smoke,
          borderRadius: 20,
          paddingHorizontal: 14,
          paddingVertical: 6,
          alignSelf: "flex-start",
          marginBottom: 20,
        }}>
          <Text style={{ 
            color: "#fff", 
            fontSize: 12, 
            fontFamily: "Inter_700Bold" 
          }}>
            {LABEL[kategori] ?? kategori}
          </Text>
        </View>
      )}

      {filtered.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => navigation.navigate("TipsDetail", { tips: item })}
          style={{
            backgroundColor: C.card,
            borderRadius: 16,
            padding: 18,
            marginBottom: 16,
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 14,
            
            
            elevation: 5, 
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
          }}
        >
          {/* Icon tetap menggunakan font sistem/emoji */}
          <Text style={{ fontSize: 36 }}>{item.icon}</Text>
          
          <View style={{ flex: 1 }}>
            <Text style={{ 
              fontSize: 15, 
              color: C.smoke, 
              marginBottom: 4,
              fontFamily: "Inter_700Bold" 
            }}>
              {item.judul}
            </Text>
            
            <Text style={{ 
              fontSize: 13, 
              color: C.smoke, 
              opacity: 0.75, 
              lineHeight: 19,
              fontFamily: "Inter_400Regular" 
            }}>
              {item.ringkasan}
            </Text>
            
            <View style={{
              backgroundColor: C.smoke,
              borderRadius: 10,
              paddingHorizontal: 8,
              paddingVertical: 2,
              alignSelf: "flex-start",
              marginTop: 8,
            }}>
              <Text style={{ 
                color: "#fff", 
                fontSize: 10,
                fontFamily: "Inter_400Regular" 
              }}>
                {item.tag}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}