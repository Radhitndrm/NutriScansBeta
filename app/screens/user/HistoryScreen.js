import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { C } from "../../theme/colors";
import useHistory from "./hooks/useHistory";
import useUserProfil from "./hooks/useUserProfil";
import { getAKG } from "../../data/akgData";
import { getRekomendasiMakanan } from "../../data/nutrisiDatabase";
import { getFoodIcon } from "../../utils/foodIcon";

const HARI_SINGKAT = ["S", "S", "R", "K", "J", "S", "M"];
const HARI_FULL = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];
const BULAN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];
const GIZI_KEYS = [
  { key: "kalori", label: "Kalori", satuan: "kkal" },
  { key: "protein", label: "Protein", satuan: "g" },
  { key: "karbohidrat", label: "Karbohidrat", satuan: "g" },
  { key: "lemak", label: "Lemak", satuan: "g" },
  { key: "serat", label: "Serat", satuan: "g" },
];

function toISO(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function namaHari(isoStr) {
  const d = new Date(isoStr + "T00:00:00");
  const idx = d.getDay();
  return idx === 0 ? "Minggu" : HARI_FULL[idx - 1];
}

function formatTanggal(isoStr) {
  const d = new Date(isoStr + "T00:00:00");
  return `${namaHari(isoStr)}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

function getWeek() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i)); // 6 hari lalu → hari ini
    return d;
  });
}

function WeekStrip({ selectedDate, onSelect }) {
  const week = getWeek();
  const todayISO = toISO(new Date());
  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: 12,
        paddingVertical: 10,
      }}
    >
      {week.map((date, i) => {
        const iso = toISO(date);
        const isToday = iso === todayISO;
        const isSel = iso === selectedDate;
        const hariIdx = date.getDay() === 0 ? 6 : date.getDay() - 1;
        return (
          <TouchableOpacity
            key={iso}
            onPress={() => onSelect(iso)}
            style={{ flex: 1, alignItems: "center", gap: 4 }}
          >
            <Text
              style={{
                color: C.smoke,
                opacity: 0.55,
                fontSize: 12,
                fontFamily: "Inter_400Regular",
              }}
            >
              {HARI_SINGKAT[hariIdx]}
            </Text>
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: isToday
                  ? C.smoke
                  : isSel
                    ? C.card
                    : "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: isToday ? C.white : C.smoke,
                  fontSize: 14,
                  fontFamily:
                    isToday || isSel ? "Inter_700Bold" : "Inter_400Regular",
                }}
              >
                {date.getDate()}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function BarNutrisi({ label, satuan, dapat, target }) {
  const pct = target ? Math.min((dapat / target) * 100, 100) : 0;
  return (
    <View style={{ marginBottom: 10 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <Text
          style={{
            color: C.smoke,
            fontWeight: "600",
            fontSize: 13,
            fontFamily: "Inter_600SemiBold",
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            color: C.smoke,
            opacity: 0.6,
            fontSize: 12,
            fontFamily: "Inter_400Regular",
          }}
        >
          {Math.round((dapat ?? 0) * 10) / 10} / {target ?? "?"} {satuan}
        </Text>
      </View>
      <View
        style={{ backgroundColor: C.cardDark, borderRadius: 99, height: 9 }}
      >
        <View
          style={{
            width: `${pct}%`,
            backgroundColor: C.smoke,
            borderRadius: 99,
            height: 9,
          }}
        />
      </View>
    </View>
  );
}

const REKOMENDASI_GREEN = "#6b8f5e";

function ItemRekomendasi({ item, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#c8d4c0",
        borderRadius: 16,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#b0c4a8",
      }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          backgroundColor: "#b0c4a8",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Ionicons name="leaf-outline" size={26} color={REKOMENDASI_GREEN} />
      </View>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginBottom: 2,
          }}
        >
          <View
            style={{
              backgroundColor: REKOMENDASI_GREEN,
              borderRadius: 6,
              paddingHorizontal: 7,
              paddingVertical: 2,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontFamily: "Inter_600SemiBold",
                fontSize: 10,
              }}
            >
              Rekomendasi
            </Text>
          </View>
        </View>
        <Text
          style={{
            color: REKOMENDASI_GREEN,
            fontWeight: "bold",
            fontSize: 15,
            fontFamily: "Inter_700Bold",
          }}
        >
          {item.nama}
        </Text>
        <Text
          style={{
            color: REKOMENDASI_GREEN,
            opacity: 0.8,
            fontSize: 12,
            fontFamily: "Inter_400Regular",
          }}
        >
          {Math.round(item.kalori ?? 0)} kkal
        </Text>
        <Text
          style={{
            color: REKOMENDASI_GREEN,
            opacity: 0.8,
            fontSize: 12,
            fontFamily: "Inter_400Regular",
          }}
        >
          {item.protein ?? 0} g protein
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={16}
        color={REKOMENDASI_GREEN}
        style={{ opacity: 0.5 }}
      />
    </TouchableOpacity>
  );
}

function FoodDetailModal({ item, onClose }) {
  const detail = [
    { label: "Kalori", nilai: Math.round(item?.kalori ?? 0), satuan: "kkal" },
    {
      label: "Protein",
      nilai: Math.round((item?.protein ?? 0) * 10) / 10,
      satuan: "g",
    },
    {
      label: "Karbohidrat",
      nilai: Math.round((item?.karbohidrat ?? 0) * 10) / 10,
      satuan: "g",
    },
    {
      label: "Lemak",
      nilai: Math.round((item?.lemak ?? 0) * 10) / 10,
      satuan: "g",
    },
    {
      label: "Serat",
      nilai: Math.round((item?.serat ?? 0) * 10) / 10,
      satuan: "g",
    },
  ];
  return (
    <Modal
      transparent
      animationType="slide"
      visible={!!item}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "flex-end",
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{
            backgroundColor: C.card,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 24,
            paddingBottom: 40,
          }}
        >
          <View
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              backgroundColor: C.cardDark,
              alignSelf: "center",
              marginBottom: 20,
            }}
          />

          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              marginBottom: 20,
            }}
          >
            {(() => {
              const { icon, bg, color } = getFoodIcon(item?.nama ?? "");
              return (
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    backgroundColor: bg,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name={icon} size={26} color={color} />
                </View>
              );
            })()}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: C.smoke,
                  fontFamily: "Inter_700Bold",
                  fontSize: 17,
                }}
              >
                {item?.nama}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  marginTop: 3,
                  flexWrap: "wrap",
                }}
              >
                {item?.porsi && (
                  <Text
                    style={{
                      color: C.smoke,
                      fontFamily: "Inter_400Regular",
                      fontSize: 12,
                      opacity: 0.5,
                    }}
                  >
                    {item.porsi}
                  </Text>
                )}
                {item?.waktu && (
                  <Text
                    style={{
                      color: C.smoke,
                      fontFamily: "Inter_400Regular",
                      fontSize: 12,
                      opacity: 0.5,
                    }}
                  >
                    · {item.waktu}
                  </Text>
                )}
                {item?.confidence != null && (
                  <Text
                    style={{
                      color: C.smoke,
                      fontFamily: "Inter_400Regular",
                      fontSize: 12,
                      opacity: 0.5,
                    }}
                  >
                    · {item.confidence}% akurasi
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Tabel gizi */}
          <View
            style={{
              backgroundColor: C.skyWarm,
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {detail.map(({ label, nilai, satuan }, i) => (
              <View
                key={label}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 16,
                  paddingVertical: 13,
                  borderBottomWidth: i < detail.length - 1 ? 1 : 0,
                  borderBottomColor: C.cardDark,
                }}
              >
                <Text
                  style={{
                    color: C.smoke,
                    fontFamily: "Inter_400Regular",
                    fontSize: 14,
                    opacity: 0.75,
                  }}
                >
                  {label}
                </Text>
                <Text
                  style={{
                    color: C.smoke,
                    fontFamily: "Inter_700Bold",
                    fontSize: 14,
                  }}
                >
                  {nilai}{" "}
                  <Text
                    style={{ fontFamily: "Inter_400Regular", opacity: 0.6 }}
                  >
                    {satuan}
                  </Text>
                </Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

function ItemMakanan({ item, onPress }) {
  const { icon, bg, color } = getFoodIcon(item.nama);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: C.card,
        borderRadius: 16,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          backgroundColor: bg,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Ionicons name={icon} size={26} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: C.smoke,
            fontWeight: "bold",
            fontSize: 15,
            fontFamily: "Inter_700Bold",
          }}
        >
          {item.nama}
        </Text>
        <Text
          style={{
            color: C.smoke,
            opacity: 0.6,
            fontSize: 12,
            fontFamily: "Inter_400Regular",
          }}
        >
          {Math.round(item.kalori ?? 0)} kkal · {item.porsi ?? ""}
        </Text>
        <Text
          style={{
            color: C.smoke,
            opacity: 0.6,
            fontSize: 12,
            fontFamily: "Inter_400Regular",
          }}
        >
          {item.protein ?? 0}g protein · {item.karbohidrat ?? 0}g karbo
        </Text>
      </View>
      <View style={{ alignItems: "flex-end", gap: 6 }}>
        {item.waktu && (
          <Text
            style={{
              color: C.smoke,
              opacity: 0.45,
              fontSize: 13,
              fontFamily: "Inter_400Regular",
            }}
          >
            {item.waktu}
          </Text>
        )}
        <Ionicons
          name="chevron-forward"
          size={16}
          color={C.smoke}
          style={{ opacity: 0.35 }}
        />
      </View>
    </TouchableOpacity>
  );
}

// Sub-item ringkas di dalam ScanGroup yang sudah di-expand
function ItemMakananKompak({ item, onPress }) {
  const { icon, bg, color } = getFoodIcon(item.nama);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 8,
        paddingHorizontal: 4,
      }}
    >
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 9,
          backgroundColor: bg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <Text
        style={{
          flex: 1,
          color: C.smoke,
          fontFamily: "Inter_400Regular",
          fontSize: 13,
        }}
        numberOfLines={1}
      >
        {item.nama}
      </Text>
      <Text
        style={{
          color: C.smoke,
          opacity: 0.5,
          fontFamily: "Inter_400Regular",
          fontSize: 12,
        }}
      >
        {item.porsi ?? ""}
      </Text>
      <Text
        style={{
          color: C.smoke,
          fontFamily: "Inter_600SemiBold",
          fontSize: 13,
          width: 58,
          textAlign: "right",
        }}
      >
        {Math.round(item.kalori ?? 0)} kkal
      </Text>
    </TouchableOpacity>
  );
}

// Satu sesi scan — bisa di-expand untuk lihat makanan di dalamnya
function ScanGroup({ entry, scanIndex, onPressFood }) {
  const [expanded, setExpanded] = useState(false);
  const count   = entry.makananList?.length ?? 0;
  const kalori  = Math.round(entry.total?.kalori ?? 0);
  const preview = (entry.makananList ?? []).slice(0, 3);

  return (
    <View style={{ marginBottom: 12 }}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.85}
        style={{
          backgroundColor: C.smoke,
          borderRadius: 16,
          borderBottomLeftRadius: expanded ? 0 : 16,
          borderBottomRightRadius: expanded ? 0 : 16,
          paddingHorizontal: 16,
          paddingVertical: 14,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {/* Badge nomor scan */}
          <View style={{
            width: 38, height: 38, borderRadius: 19,
            backgroundColor: "rgba(255,255,255,0.13)",
            borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
            alignItems: "center", justifyContent: "center",
          }}>
            <Text style={{ color: C.white, fontFamily: "Inter_700Bold", fontSize: 16 }}>
              {scanIndex + 1}
            </Text>
          </View>

          {/* Label + preview icon */}
          <View style={{ flex: 1, gap: 5 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text style={{ color: C.white, fontFamily: "Inter_700Bold", fontSize: 14 }}>
                Scan ke-{scanIndex + 1}
              </Text>
              {entry.waktu && (
                <Text style={{ color: "rgba(255,255,255,0.45)", fontFamily: "Inter_400Regular", fontSize: 12 }}>
                  · {entry.waktu}
                </Text>
              )}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Text style={{ color: "rgba(255,255,255,0.45)", fontFamily: "Inter_400Regular", fontSize: 12 }}>
                {count} makanan
              </Text>
              {preview.map((m, i) => {
                const { icon } = getFoodIcon(m.nama);
                return (
                  <View key={i} style={{
                    width: 22, height: 22, borderRadius: 6,
                    backgroundColor: "rgba(255,255,255,0.10)",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <Ionicons name={icon} size={12} color="rgba(255,255,255,0.65)" />
                  </View>
                );
              })}
              {count > 3 && (
                <Text style={{ color: "rgba(255,255,255,0.35)", fontFamily: "Inter_400Regular", fontSize: 11 }}>
                  +{count - 3}
                </Text>
              )}
            </View>
          </View>

          {/* Kalori + chevron */}
          <View style={{ alignItems: "flex-end", gap: 2 }}>
            <Text style={{ color: C.white, fontFamily: "Inter_700Bold", fontSize: 18, lineHeight: 22 }}>
              {kalori}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.45)", fontFamily: "Inter_400Regular", fontSize: 11 }}>
              kkal
            </Text>
          </View>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={16}
            color="rgba(255,255,255,0.4)"
            style={{ marginLeft: -4 }}
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={{
          backgroundColor: C.card,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          borderTopWidth: 1,
          borderColor: C.cardDark,
          paddingHorizontal: 14,
          paddingTop: 4,
          paddingBottom: 10,
        }}>
          {entry.makananList?.map((item, i) => (
            <ItemMakananKompak
              key={i}
              item={{ ...item, waktu: entry.waktu }}
              onPress={() => onPressFood({ ...item, waktu: entry.waktu })}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function GiziSelector({ selected, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginBottom: 14 }}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 2 }}
    >
      {GIZI_KEYS.map(({ key, label }) => {
        const aktif = selected === key;
        return (
          <TouchableOpacity
            key={key}
            onPress={() => onSelect(key)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: aktif ? C.smoke : C.card,
            }}
          >
            <Text
              style={{
                color: aktif ? C.skyWarm : C.smoke,
                fontFamily: aktif ? "Inter_600SemiBold" : "Inter_400Regular",
                fontSize: 13,
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function BarChart({ week, groupedList, giziKey }) {
  const data = week.map((date) => {
    const group = groupedList.find((g) => g.tanggal === toISO(date));
    return group ? Math.round(group.totalHarian[giziKey] ?? 0) : 0;
  });
  const max = Math.max(...data, 1);

  return (
    <View
      style={{
        backgroundColor: C.card,
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "flex-end", height: 160 }}
      >
        <View
          style={{
            justifyContent: "space-between",
            height: 130,
            marginRight: 4,
            paddingBottom: 2,
          }}
        >
          {[100, 80, 60, 40, 20, 0].map((v) => (
            <Text
              key={v}
              style={{
                color: C.smoke,
                opacity: 0.4,
                fontSize: 10,
                fontFamily: "Inter_400Regular",
                textAlign: "right",
                width: 26,
              }}
            >
              {v}
            </Text>
          ))}
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "flex-end",
            height: 130,
            gap: 5,
          }}
        >
          {data.map((val, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "flex-end",
                height: 120,
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: Math.max((val / max) * 120, val > 0 ? 6 : 0),
                  backgroundColor: C.smoke,
                  borderRadius: 6,
                }}
              />
            </View>
          ))}
        </View>
      </View>
      <View
        style={{ flexDirection: "row", marginLeft: 32, marginTop: 6, gap: 5 }}
      >
        {week.map((date, i) => (
          <Text
            key={i}
            style={{
              flex: 1,
              textAlign: "center",
              color: C.smoke,
              opacity: 0.5,
              fontSize: 11,
              fontFamily: "Inter_400Regular",
            }}
          >
            {HARI_SINGKAT[date.getDay() === 0 ? 6 : date.getDay() - 1]}
          </Text>
        ))}
      </View>
    </View>
  );
}

function statusNutrisi(dapat, target) {
  if (!target || !dapat) return null;
  const pct = (dapat / target) * 100;
  if (pct >= 80 && pct <= 110)
    return { label: "terpenuhi", warna: "#4caf50", ikon: "✓" };
  if (pct < 80) return { label: "kurang", warna: "#ff9800", ikon: "↓" };
  return { label: "lebih", warna: "#ef5350", ikon: "↑" };
}

function DayModal({ group, akg, rataGizi, selectedGizi, onClose, onDetail }) {
  if (!group) return null;

  const { totalHarian, entries, tanggal } = group;
  const giziInfo =
    GIZI_KEYS.find((g) => g.key === selectedGizi) ?? GIZI_KEYS[0];
  const rataAktif = rataGizi[selectedGizi] ?? 0;
  const nilaiAktif = totalHarian[selectedGizi] ?? 0;
  const diff = Math.round(nilaiAktif - rataAktif);
  const diffLabel =
    diff > 0
      ? `+${diff} ${giziInfo.satuan} di atas rata-rata`
      : diff < 0
        ? `${diff} ${giziInfo.satuan} di bawah rata-rata`
        : `Sama dengan rata-rata minggu ini`;

  const semuaMakanan = entries.flatMap((e) => e.makananList ?? []);
  const top3 = [...semuaMakanan]
    .sort((a, b) => (b.kalori ?? 0) - (a.kalori ?? 0))
    .slice(0, 3);

  return (
    <Modal
      transparent
      animationType="slide"
      visible={!!group}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "flex-end",
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{
            backgroundColor: C.card,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 24,
            paddingBottom: 36,
          }}
        >
          {/* Handle bar */}
          <View
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              backgroundColor: C.cardDark,
              alignSelf: "center",
              marginBottom: 18,
            }}
          />

          {/* Header */}
          <Text
            style={{
              color: C.smoke,
              fontFamily: "Inter_700Bold",
              fontSize: 17,
              marginBottom: 4,
            }}
          >
            {formatTanggal(tanggal)}
          </Text>
          <Text
            style={{
              color: C.smoke,
              fontFamily: "Inter_400Regular",
              fontSize: 13,
              opacity: 0.55,
              marginBottom: 20,
            }}
          >
            {Math.round(totalHarian.kalori)} kkal hari ini
          </Text>

          {/* Nutrisi aktif vs rata-rata */}
          {rataAktif > 0 && (
            <View
              style={{
                backgroundColor: C.skyWarm,
                borderRadius: 14,
                padding: 14,
                marginBottom: 18,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Ionicons
                name="stats-chart-outline"
                size={20}
                color={C.smoke}
                style={{ opacity: 0.6 }}
              />
              <View>
                <Text
                  style={{
                    color: C.smoke,
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 13,
                  }}
                >
                  {giziInfo.label}: {diffLabel}
                </Text>
                <Text
                  style={{
                    color: C.smoke,
                    fontFamily: "Inter_400Regular",
                    fontSize: 12,
                    opacity: 0.5,
                  }}
                >
                  Rata-rata: {Math.round(rataAktif)} {giziInfo.satuan}/hari
                </Text>
              </View>
            </View>
          )}

          {/* Rata-rata semua nutrisi */}
          <View style={{ marginBottom: 18 }}>
            <Text
              style={{
                color: C.smoke,
                fontFamily: "Inter_600SemiBold",
                fontSize: 13,
                marginBottom: 10,
              }}
            >
              Rata-rata per Hari (7 hari)
            </Text>
            {GIZI_KEYS.map(({ key, label, satuan }) => (
              <View
                key={key}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 6,
                  borderBottomWidth: 1,
                  borderBottomColor: C.cardDark,
                }}
              >
                <Text
                  style={{
                    color: C.smoke,
                    fontFamily: "Inter_400Regular",
                    fontSize: 13,
                    opacity: 0.7,
                  }}
                >
                  {label}
                </Text>
                <Text
                  style={{
                    color: C.smoke,
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 13,
                  }}
                >
                  {Math.round((rataGizi[key] ?? 0) * 10) / 10} {satuan}
                </Text>
              </View>
            ))}
          </View>

          {/* Status nutrisi */}
          {akg && (
            <View style={{ marginBottom: 18 }}>
              <Text
                style={{
                  color: C.smoke,
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 13,
                  marginBottom: 10,
                }}
              >
                Status Nutrisi
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {GIZI_KEYS.map(({ key, label }) => {
                  const st = statusNutrisi(totalHarian[key], akg[key]);
                  if (!st) return null;
                  return (
                    <View
                      key={key}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        backgroundColor: C.skyWarm,
                        borderRadius: 20,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                      }}
                    >
                      <Text
                        style={{
                          color: st.warna,
                          fontFamily: "Inter_700Bold",
                          fontSize: 12,
                        }}
                      >
                        {st.ikon}
                      </Text>
                      <Text
                        style={{
                          color: C.smoke,
                          fontFamily: "Inter_400Regular",
                          fontSize: 12,
                        }}
                      >
                        {label}
                      </Text>
                      <Text
                        style={{
                          color: st.warna,
                          fontFamily: "Inter_600SemiBold",
                          fontSize: 12,
                        }}
                      >
                        {st.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Top makanan */}
          {top3.length > 0 && (
            <View style={{ marginBottom: 22 }}>
              <Text
                style={{
                  color: C.smoke,
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 13,
                  marginBottom: 10,
                }}
              >
                Makanan Terbanyak Kalori
              </Text>
              {top3.map((m, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 7,
                    borderBottomWidth: i < top3.length - 1 ? 1 : 0,
                    borderBottomColor: C.cardDark,
                  }}
                >
                  <Text
                    style={{
                      color: C.smoke,
                      fontFamily: "Inter_400Regular",
                      fontSize: 13,
                      flex: 1,
                    }}
                    numberOfLines={1}
                  >
                    {i + 1}. {m.nama}
                  </Text>
                  <Text
                    style={{
                      color: C.smoke,
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 13,
                      marginLeft: 8,
                      opacity: 0.7,
                    }}
                  >
                    {Math.round(m.kalori ?? 0)} kkal
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Tombol lihat detail */}
          <TouchableOpacity
            onPress={onDetail}
            style={{
              backgroundColor: C.skyWarm,
              borderRadius: 16,
              paddingVertical: 14,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Text
              style={{
                color: C.smoke,
                fontFamily: "Inter_600SemiBold",
                fontSize: 14,
              }}
            >
              Lihat Detail Lengkap
            </Text>
            <Ionicons name="arrow-forward" size={16} color={C.smoke} />
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

function RowHari7({ group, giziKey, onPress }) {
  const giziInfo  = GIZI_KEYS.find((g) => g.key === giziKey) ?? GIZI_KEYS[0];
  const nilai     = Math.round((group.totalHarian[giziKey] ?? 0) * 10) / 10;
  const kalori    = Math.round(group.totalHarian.kalori ?? 0);
  const scanCount = group.entries?.length ?? 0;
  const d         = new Date(group.tanggal + "T00:00:00");
  const isKalori  = giziKey === "kalori";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: C.smoke,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 12,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        {/* Badge tanggal */}
        <View style={{
          width: 38, height: 38, borderRadius: 19,
          backgroundColor: "rgba(255,255,255,0.13)",
          borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
          alignItems: "center", justifyContent: "center",
        }}>
          <Text style={{ color: C.white, fontFamily: "Inter_700Bold", fontSize: 15 }}>
            {d.getDate()}
          </Text>
        </View>

        {/* Nama hari + info */}
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ color: C.white, fontFamily: "Inter_700Bold", fontSize: 14 }}>
            {namaHari(group.tanggal)}, {BULAN[d.getMonth()]}
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.45)", fontFamily: "Inter_400Regular", fontSize: 12 }}>
            {scanCount} scan{!isKalori ? ` · ${kalori.toLocaleString()} kkal` : ""}
          </Text>
        </View>

        {/* Nilai gizi */}
        <View style={{ alignItems: "flex-end", gap: 2 }}>
          <Text style={{ color: C.white, fontFamily: "Inter_700Bold", fontSize: 18, lineHeight: 22 }}>
            {nilai.toLocaleString()}
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.45)", fontFamily: "Inter_400Regular", fontSize: 11 }}>
            {giziInfo.satuan} {giziInfo.label}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.4)" style={{ marginLeft: -4 }} />
      </View>
    </TouchableOpacity>
  );
}

export default function HistoryScreen() {
  const { groupedList, loading, refresh } = useHistory();
  const profil = useUserProfil();
  const akg = profil ? getAKG(profil.kategori, profil.subKategori) : null;

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, []),
  );

  const todayISO = toISO(new Date());
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [showGrafik, setShowGrafik] = useState(false);
  const [modalGroup, setModalGroup] = useState(null);
  const [selectedGizi, setSelectedGizi] = useState("kalori");
  const [selectedFood, setSelectedFood] = useState(null);

  const week = getWeek();
  const selectedGroup = groupedList.find((g) => g.tanggal === selectedDate);
  const totalSel = selectedGroup?.totalHarian ?? {
    kalori: 0,
    protein: 0,
    karbohidrat: 0,
    lemak: 0,
    serat: 0,
  };
  const makananList =
    selectedGroup?.entries.flatMap((e) =>
      e.makananList.map((m) => ({ ...m, waktu: e.waktu })),
    ) ?? [];
  const batasAwal = toISO((() => { const d = new Date(); d.setDate(d.getDate() - 6); return d; })());
  const hari7 = groupedList.filter(g => g.tanggal >= batasAwal);

  const rekomendasiHari = (() => {
    if (!akg) return null;
    const kurang = GIZI_KEYS.map((g) => g.key)
      .filter((k) => akg[k] && (totalSel[k] ?? 0) / akg[k] < 0.8)
      .sort(
        (a, b) => (totalSel[a] ?? 0) / akg[a] - (totalSel[b] ?? 0) / akg[b],
      );
    const hasil = getRekomendasiMakanan(kurang);
    return hasil.length > 0 ? hasil[0] : null;
  })();

  const rataGizi = hari7.length
    ? GIZI_KEYS.reduce(
        (acc, { key }) => ({
          ...acc,
          [key]:
            hari7.reduce((sum, g) => sum + (g.totalHarian[key] ?? 0), 0) /
            hari7.length,
        }),
        {},
      )
    : {};

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: C.skyWarm,
        }}
      >
        <ActivityIndicator size="large" color={C.smoke} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.skyWarm }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 }}>
        <Text
          style={{
            color: C.smoke,
            fontSize: 22,
            fontWeight: "bold",
            fontFamily: "Inter_700Bold",
          }}
        >
          Riwayat
        </Text>
        <Text
          style={{
            color: C.placeholder,
            fontSize: 13,
            fontFamily: "Inter_400Regular",
            marginTop: 2,
          }}
        >
          Pantau asupan nutrisi harian
        </Text>
      </View>

      <WeekStrip
        selectedDate={selectedDate}
        onSelect={(iso) => {
          setSelectedDate(iso);
          setShowGrafik(false);
        }}
      />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
      >
        {!showGrafik ? (
          <>
            {/* Ringkasan nutrisi */}
            <View
              style={{
                backgroundColor: C.card,
                borderRadius: 20,
                padding: 18,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  color: C.smoke,
                  fontWeight: "bold",
                  fontSize: 15,
                  fontFamily: "Inter_700Bold",
                  marginBottom: 14,
                }}
              >
                Ringkasan Nutrisi Hari Ini - {formatTanggal(selectedDate)}
              </Text>
              {GIZI_KEYS.map(({ key, label, satuan }) => (
                <BarNutrisi
                  key={key}
                  label={label}
                  satuan={satuan}
                  dapat={totalSel[key] ?? 0}
                  target={akg?.[key] ?? null}
                />
              ))}
            </View>

            {/* History makanan */}
            <Text
              style={{
                color: C.smoke,
                fontWeight: "bold",
                fontSize: 20,
                fontFamily: "Inter_700Bold",
                marginBottom: 14,
              }}
            >
              History Makanan
            </Text>
            {rekomendasiHari && (
              <ItemRekomendasi
                item={rekomendasiHari}
                onPress={() => setSelectedFood(rekomendasiHari)}
              />
            )}
            {!selectedGroup || selectedGroup.entries.length === 0 ? (
              <View style={{ alignItems: "center", paddingVertical: 40 }}>
                <Ionicons
                  name="fast-food-outline"
                  size={48}
                  color={C.smoke}
                  style={{ opacity: 0.2, marginBottom: 10 }}
                />
                <Text
                  style={{
                    color: C.smoke,
                    opacity: 0.4,
                    fontFamily: "Inter_400Regular",
                  }}
                >
                  Belum ada makanan di hari ini
                </Text>
              </View>
            ) : (
              selectedGroup.entries.map((entry, i) => (
                <ScanGroup
                  key={entry.id ?? i}
                  entry={entry}
                  scanIndex={i}
                  onPressFood={setSelectedFood}
                />
              ))
            )}
          </>
        ) : (
          <>
            <GiziSelector selected={selectedGizi} onSelect={setSelectedGizi} />
            <BarChart
              week={week}
              groupedList={groupedList}
              giziKey={selectedGizi}
            />
            <Text
              style={{
                color: C.smoke,
                fontWeight: "bold",
                fontSize: 20,
                fontFamily: "Inter_700Bold",
                marginBottom: 14,
              }}
            >
              History 7 Hari
            </Text>
            {hari7.length === 0 ? (
              <View style={{ alignItems: "center", paddingVertical: 40 }}>
                <Ionicons
                  name="bar-chart-outline"
                  size={48}
                  color={C.smoke}
                  style={{ opacity: 0.2, marginBottom: 10 }}
                />
                <Text
                  style={{
                    color: C.smoke,
                    opacity: 0.4,
                    fontFamily: "Inter_400Regular",
                  }}
                >
                  Belum ada data
                </Text>
              </View>
            ) : (
              hari7.map((group) => (
                <RowHari7
                  key={group.tanggal}
                  group={group}
                  giziKey={selectedGizi}
                  onPress={() => setModalGroup(group)}
                />
              ))
            )}
          </>
        )}
      </ScrollView>

      <FoodDetailModal
        item={selectedFood}
        onClose={() => setSelectedFood(null)}
      />

      <DayModal
        group={modalGroup}
        akg={akg}
        rataGizi={rataGizi}
        selectedGizi={selectedGizi}
        onClose={() => setModalGroup(null)}
        onDetail={() => {
          setSelectedDate(modalGroup.tanggal);
          setShowGrafik(false);
          setModalGroup(null);
        }}
      />

      {/* Tombol toggle fixed di bawah */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 16,
          backgroundColor: C.skyWarm,
        }}
      >
        <TouchableOpacity
          onPress={() => setShowGrafik(!showGrafik)}
          style={{
            backgroundColor: C.card,
            borderRadius: 20,
            paddingVertical: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Ionicons
            name={showGrafik ? "list-outline" : "bar-chart-outline"}
            size={18}
            color={C.smoke}
          />
          <Text
            style={{
              color: C.smoke,
              fontWeight: "bold",
              fontSize: 14,
              fontFamily: "Inter_600SemiBold",
            }}
          >
            {showGrafik ? "Ringkasan Harian" : "Grafik Mingguan"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
