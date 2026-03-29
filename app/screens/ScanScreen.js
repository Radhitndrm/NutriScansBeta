import { View, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  text: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  sub: { fontSize: 14, color: '#888', marginTop: 8 },
});

export default function ScanScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Halaman Scan Makanan</Text>
      <Text style={styles.sub}>Kamera akan tampil di sini</Text>
    </View>
  );
}

