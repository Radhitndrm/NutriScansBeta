import React from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";

const C = { smoke: "#4a4f42", skyWarm: "#ccc9be", card: "#e6e3db" };

export default function ArtikelDetailScreen({ route, navigation }) {
  const { artikel } = route.params;

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    });

  // Render konten: baris "**bold**" jadi tebal, sisanya normal
  const renderKonten = (konten) =>
    konten.split("\n").map((line, i) => {
      const isBold = line.startsWith("**") && line.includes("**", 2);
      const text = line.replace(/\*\*/g, "");

      return (
        <Text
          key={i}
          style={{
            fontSize: 14,
            color: C.smoke,
            lineHeight: 22,
            fontFamily: isBold ? "Inter_600SemiBold" : "Inter_400Regular",
            marginTop: isBold ? 12 : 4,
          }}>
        
          {text}
        </Text>
      );
    });

  return (
    <ScrollView 
    style={{ 
      flex: 1, 
      backgroundColor: C.skyWarm 
      }} 
    contentContainerStyle={{ 
      padding: 20 
    }}>
    

      {/* Tombol kembali */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ 
          flexDirection: "row", 
          alignItems: "center", 
          marginBottom: 20 
        }}>
      

        <Ionicons name="arrow-back" size={20} color={C.smoke} />
        <Text style={{ 
          color: C.smoke, 
          marginLeft: 6, 
          fontSize: 14,
          fontFamily:"Inter_500Medium"
          }}>Kembali</Text>
      </TouchableOpacity>

      {/* Judul */}
      <Text style={{ 
        fontSize: 20, 
        fontFamily: "Inter_700Bold", 
        color: C.smoke, 
        marginBottom: 6,
        letterSpacing: 0.2
        }}>
        {artikel.judul}
      </Text>

      {/* Meta */}
      <View style={{ 
        flexDirection: "row", 
        justifyContent: "space-between", 
        marginBottom: 18 
        }}>

        <Text style={{ 
          fontSize: 12, 
          color: C.smoke, 
          opacity: 0.55,
          fontFamily:"Inter_400Regular"
          }}>{artikel.sumber}</Text>

        <Text style={{ 
          fontSize: 12, 
          color: C.smoke, 
          opacity: 0.55,
          fontFamily: "Inter_400Regural"
          }}>{artikel.tanggal}</Text>

      </View>

      {/* Konten */}
      <View style={{ 
        backgroundColor: C.card, 
        borderRadius: 18, 
        padding: 20,
        
        shadowColor:"#000",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity:0.1,
        shadowRadius:8,
        elevation: 2,
        }}>
        {renderKonten(artikel.konten)}
      </View>
    </ScrollView>
  );
}
