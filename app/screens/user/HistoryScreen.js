import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BarChart } from "react-native-chart-kit";
import useHistory from "./hooks/useHistory";

const screenWidth = Dimensions.get("window").width;

// CONFIG TARGET (sementara)
const TARGET = {
  kalori: 2000,
  protein: 60,
  karbohidrat: 300,
  lemak: 65
};

// HELPERS
function getColor(percent) {
  if (percent < 50) return "#EF4444";
  if (percent < 80) return "#F59E0B";
  return "#22C55E";
}

// COMPONENTS
function ProgressBar({ percent }) {
  return (
    <View style={{ height: 6, backgroundColor: "#E5E7EB", borderRadius: 10 }}>
      <View
        style={{
          width: `${percent}%`,
          height: "100%",
          backgroundColor: getColor(percent),
          borderRadius: 10,
        }}
      />
    </View>
  );
}

function SummaryCard({ total }) {
  const items = [
    { label: "Kalori", value: total.kalori, target: TARGET.kalori, unit: "kkal" },
    { label: "Protein", value: total.protein, target: TARGET.protein, unit: "g" },
    { label: "Karbohidrat", value: total.karbohidrat, target: TARGET.karbohidrat, unit: "g" },
    { label: "Lemak", value: total.lemak, target: TARGET.lemak, unit: "g" },
  ];

  return (
    <View style={{
      backgroundColor: "#1F2937",
      borderRadius: 18,
      padding: 16,
      marginBottom: 16
    }}>
      <Text style={{ color: "white", fontSize: 16, fontWeight: "700", marginBottom: 12 }}>
        Ringkasan Nutrisi Hari Ini
      </Text>

      {items.map((item) => {
        const percent = Math.min((item.value / item.target) * 100, 100);

        return (
          <View key={item.label} style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: "white" }}>{item.label}</Text>
              <Text style={{ color: "white" }}>
                {Math.round(item.value)} / {item.target}{item.unit}
              </Text>
            </View>
            <View style={{ marginTop: 4 }}>
              <ProgressBar percent={percent} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

function CalendarStrip({ data, selectedDate, onSelect }) {
  const days = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
      {data.map((item) => {
        const active = item.tanggal === selectedDate;
        const date = new Date(item.tanggal);

        return (
          <TouchableOpacity
            key={item.tanggal}
            onPress={() => onSelect(item.tanggal)}
            style={{
              width: 55,
              height: 70,
              borderRadius: 16,
              marginRight: 10,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: active ? "#1F2937" : "#F3F4F6"
            }}
          >
            <Text style={{ fontSize: 11, color: active ? "white" : "#6B7280" }}>
              {days[date.getDay()]}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "600", color: active ? "white" : "#111827" }}>
              {item.tanggal.slice(8, 10)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function EntryCard({ entry, onHapus }) {
  return (
    <View style={{
      backgroundColor: "white",
      borderRadius: 16,
      padding: 14,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3
    }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "600", fontSize: 14 }}>
            {entry.makananList.map((m) => m.nama).join(", ")}
          </Text>
          <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
            {entry.waktu}
          </Text>
        </View>

        <TouchableOpacity onPress={onHapus}>
          <Ionicons name="trash-outline" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function WeeklyChart({ data }) {
  return (
    <BarChart
      data={data}
      width={screenWidth - 40}
      height={220}
      fromZero
      showValuesOnTopOfBars
      chartConfig={{
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        decimalPlaces: 0,
        color: () => "#2563EB",
        labelColor: () => "#6B7280",
      }}
      style={{ borderRadius: 16 }}
    />
  );
}

function WeeklyView({ data, onSelect, setMode }) {
  const weeklyData = data.slice(0, 7).reverse();

  const chartData = {
    labels: weeklyData.map((d) => d.tanggal.slice(8, 10)),
    datasets: [
      {
        data: weeklyData.map((d) => Math.round(d.totalHarian.kalori)),
      },
    ],
  };

  return (
    <View>
      <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 10 }}>
        Grafik Kalori 7 Hari
      </Text>

      <WeeklyChart data={chartData} />

      <View style={{ marginTop: 20 }}>
        {weeklyData.map((d) => (
          <TouchableOpacity
            key={d.tanggal}
            onPress={() => {
              onSelect(d.tanggal);
              setMode("daily");
            }}
            style={{
              backgroundColor: "white",
              padding: 14,
              borderRadius: 14,
              marginBottom: 12
            }}
          >
            <Text style={{ fontWeight: "600" }}>
              {d.tanggal}
            </Text>
            <Text style={{ color: "#6B7280", marginTop: 4 }}>
              Total {Math.round(d.totalHarian.kalori)} kkal
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function DetailModal({ visible, onClose, group }) {
  if (!group) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
          Detail {group.tanggal}
        </Text>

        <SummaryCard total={group.totalHarian} />

        {group.entries.map((e) => (
          <EntryCard key={e.id} entry={e} />
        ))}

        <TouchableOpacity onPress={onClose}>
          <Text style={{ color: "red", marginTop: 20 }}>Tutup</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
}

// MAIN SCREEN
export default function HistoryScreen() {
  const { groupedList, loading, hapusEntry } = useHistory();

  const [selectedDate, setSelectedDate] = useState(null);
  const [mode, setMode] = useState("daily");
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    if (groupedList.length > 0 && !selectedDate) {
      setSelectedDate(groupedList[0].tanggal);
    }
  }, [groupedList]);

  const selectedGroup = groupedList.find(
    (g) => g.tanggal === selectedDate
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F9FAFB" }} contentContainerStyle={{ padding: 20 }}>

      {/* HEADER */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: "700" }}>Riwayat</Text>

        <TouchableOpacity onPress={() => setMode(mode === "daily" ? "weekly" : "daily")}>
          <Text style={{ color: "#2563EB" }}>
            {mode === "daily" ? "Grafik Mingguan" : "Kembali"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* CALENDAR */}
      <CalendarStrip
        data={groupedList}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
      />

      {/* CONTENT */}
      {groupedList.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 80 }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            Belum ada riwayat hari ini
          </Text>
          <Text style={{ color: "#6B7280", marginTop: 6 }}>
            Yuk scan makanan pertama kamu 🍽️
          </Text>
        </View>
      ) : mode === "daily" ? (
        <>
          {selectedGroup && (
            <>
              <SummaryCard total={selectedGroup.totalHarian} />

              {selectedGroup.entries.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  onHapus={() => hapusEntry(entry.id)}
                />
              ))}

              <TouchableOpacity onPress={() => setShowDetail(true)}>
                <Text style={{ color: "#2563EB", marginTop: 10 }}>
                  Lihat Detail
                </Text>
              </TouchableOpacity>
            </>
          )}
        </>
      ) : (
        <WeeklyView
          data={groupedList}
          onSelect={setSelectedDate}
          setMode={setMode}
        />
      )}

      <DetailModal
        visible={showDetail}
        onClose={() => setShowDetail(false)}
        group={selectedGroup}
      />

    </ScrollView>
  );
}