import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../../hooks/useTheme";

const DAYS = [
  { label: "Mon", date: "7", available: true },
  { label: "Tue", date: "8", available: true },
  { label: "Wed", date: "9", available: false },
  { label: "Thu", date: "10", available: true },
  { label: "Fri", date: "11", available: true },
  { label: "Sat", date: "12", available: true },
];

const SLOTS: Record<
  number,
  { time: string; status: "available" | "booked" | "unavailable" }[]
> = {
  0: [
    { time: "09:00", status: "available" },
    { time: "10:30", status: "booked" },
    { time: "14:00", status: "available" },
    { time: "16:00", status: "available" },
  ],
  1: [
    { time: "10:00", status: "available" },
    { time: "11:30", status: "available" },
    { time: "14:00", status: "booked" },
    { time: "16:00", status: "available" },
    { time: "17:30", status: "available" },
  ],
  2: [],
  3: [
    { time: "09:00", status: "unavailable" },
    { time: "14:00", status: "available" },
    { time: "16:00", status: "available" },
  ],
  4: [
    { time: "10:00", status: "available" },
    { time: "14:00", status: "available" },
    { time: "16:00", status: "available" },
    { time: "18:00", status: "available" },
  ],
  5: [
    { time: "09:00", status: "available" },
    { time: "11:00", status: "available" },
    { time: "14:00", status: "available" },
  ],
};

export default function AvailabilityCalendarScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>("16:00");
  const [duration, setDuration] = useState(90);

  const activeSlots = SLOTS[selectedDay] || [];
  const ratePerHour = 450;
  const hours = duration / 60;
  const total = Math.round(ratePerHour * hours);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Book Session</Text>
          <Text style={{ color: colors.sub, fontSize: 10 }}>Hana Bekele · Mathematics</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionLabel, { color: colors.sub }]}>SELECT DAY</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {DAYS.map((d, i) => {
            const selected = selectedDay === i;
            const disabled = !d.available;
            return (
              <TouchableOpacity
                key={d.date}
                disabled={disabled}
                onPress={() => {
                  setSelectedDay(i);
                  setSelectedSlot(null);
                }}
                style={[
                  styles.dayChip,
                  {
                    backgroundColor: selected
                      ? colors.primary
                      : disabled
                        ? isDark
                          ? "#1e293b"
                          : "#f1f5f9"
                        : colors.card,
                    borderColor: selected ? colors.primary : colors.border,
                    opacity: disabled ? 0.5 : 1,
                  },
                ]}
              >
                <Text style={{ color: selected ? "#fff" : colors.sub, fontSize: 10, fontWeight: "600" }}>
                  {d.label}
                </Text>
                <Text
                  style={{
                    color: selected ? "#fff" : colors.text,
                    fontSize: 16,
                    fontWeight: "800",
                    marginTop: 2,
                  }}
                >
                  {d.date}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={[styles.sectionLabel, { color: colors.sub }]}>AVAILABLE SLOTS</Text>
        {activeSlots.length === 0 ? (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={{ color: colors.sub, textAlign: "center", fontSize: 12 }}>
              No slots this day
            </Text>
          </View>
        ) : (
          <View style={styles.slotGrid}>
            {activeSlots.map((s) => {
              const selected = selectedSlot === s.time;
              const booked = s.status === "booked";
              const unavailable = s.status === "unavailable";
              return (
                <TouchableOpacity
                  key={s.time}
                  disabled={booked || unavailable}
                  onPress={() => setSelectedSlot(s.time)}
                  style={[
                    styles.slot,
                    {
                      backgroundColor: selected
                        ? colors.primary
                        : booked || unavailable
                          ? isDark
                            ? "#1e293b"
                            : "#f1f5f9"
                          : colors.card,
                      borderColor: selected ? colors.primary : colors.border,
                      opacity: booked || unavailable ? 0.55 : 1,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: selected ? "#fff" : colors.text,
                      fontWeight: "700",
                      fontSize: 13,
                    }}
                  >
                    {s.time}
                  </Text>
                  <Text
                    style={{
                      color: selected ? "rgba(255,255,255,0.8)" : colors.sub,
                      fontSize: 9,
                      marginTop: 2,
                    }}
                  >
                    {booked ? "Booked" : unavailable ? "Unavailable" : "Open"}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <Text style={[styles.sectionLabel, { color: colors.sub, marginTop: 8 }]}>DURATION</Text>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
          {[60, 90, 120].map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setDuration(m)}
              style={[
                styles.durationChip,
                {
                  backgroundColor: duration === m ? colors.primary : colors.card,
                  borderColor: duration === m ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={{
                  color: duration === m ? "#fff" : colors.text,
                  fontWeight: "700",
                  fontSize: 12,
                }}
              >
                {m} min
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.sub }]}>ESCROW SUMMARY</Text>
          <Row label="Rate" value={`${ratePerHour} ETB/hr`} colors={colors} />
          {/* FIXED: was broken escaped string */}
          <Row label="Duration" value={`\( {duration} min ( \){hours}h)`} colors={colors} />
          <Row label="Session total" value={`${total.toLocaleString()} ETB`} colors={colors} bold />
          <Text style={{ color: colors.sub, fontSize: 10, marginTop: 8, lineHeight: 15 }}>
            Funds are held in escrow and released only after verified attendance and parent confirmation.
          </Text>
        </View>

        <TouchableOpacity
          disabled={!selectedSlot}
          style={[
            styles.cta,
            { backgroundColor: selectedSlot ? colors.primary : isDark ? "#334155" : "#cbd5e1" },
          ]}
          onPress={() => router.push("/(parent)/booking")}
        >
          <Text style={styles.ctaText}>
            {selectedSlot ? `Confirm ${selectedSlot} · ${total} ETB` : "Select a slot"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  label,
  value,
  colors,
  bold,
}: {
  label: string;
  value: string;
  colors: any;
  bold?: boolean;
}) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
      <Text style={{ color: colors.sub, fontSize: 12 }}>{label}</Text>
      <Text style={{ color: bold ? colors.primary : colors.text, fontWeight: bold ? "800" : "600", fontSize: 12 }}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 15, fontWeight: "700" },
  content: { padding: 14, paddingBottom: 40 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  dayChip: {
    width: 56,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    marginRight: 8,
  },
  slotGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  slot: {
    width: "47%",
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
  },
  durationChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  card: { borderRadius: 16, padding: 14, borderWidth: 1, marginBottom: 16 },
  cta: { borderRadius: 16, paddingVertical: 14, alignItems: "center" },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: 14 },
});