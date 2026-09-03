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

const SCHEDULE = [
  { day: "Mon", slots: ["09:00–11:00", "16:00–19:00"] },
  { day: "Tue", slots: ["14:00–18:00"] },
  { day: "Wed", slots: [] as string[] },
  { day: "Thu", slots: ["09:00–11:00", "16:00–19:00"] },
  { day: "Fri", slots: ["16:00–20:00"] },
  { day: "Sat", slots: ["09:00–13:00", "14:00–17:00"] },
  { day: "Sun", slots: [] as string[] },
];

const PACKAGES = [
  { name: "Standard", sessions: 8, hrs: 1, total: 3600, popular: false },
  { name: "Intensive", sessions: 12, hrs: 1.5, total: 8100, popular: true },
  { name: "Weekend Boost", sessions: 6, hrs: 2, total: 5040, popular: false },
];

export default function AvailabilityPackagesScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [tab, setTab] = useState<"weekly" | "packages">("weekly");

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, flex: 1, marginLeft: 10 }]}>
          Availability & Packages
        </Text>
        <TouchableOpacity>
          <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 12 }}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.tabs, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {(["weekly", "packages"] as const).map((t) => (
          <TouchableOpacity key={t} style={styles.tabBtn} onPress={() => setTab(t)}>
            <Text
              style={{
                color: tab === t ? colors.primary : colors.sub,
                fontWeight: "700",
                fontSize: 12,
              }}
            >
              {t === "weekly" ? "📅 Weekly Hours" : "📦 Packages"}
            </Text>
            {tab === t && <View style={[styles.tabUnderline, { backgroundColor: colors.primary }]} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {tab === "weekly" ? (
          <>
            <View
              style={[
                styles.infoBanner,
                {
                  backgroundColor: isDark ? "#1e3a5f55" : "#eff6ff",
                  borderColor: isDark ? "#1e40af" : "#bfdbfe",
                },
              ]}
            >
              <Text style={{ color: isDark ? "#93c5fd" : "#1d4ed8", fontSize: 11 }}>
                ⏱ Weekly capacity: <Text style={{ fontWeight: "800" }}>22 hrs</Text> · Max recommended: 30 hrs/week
              </Text>
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.label, { color: colors.sub }]}>RECURRING SCHEDULE</Text>
              {SCHEDULE.map((d) => (
                <View
                  key={d.day}
                  style={[styles.dayRow, { borderBottomColor: colors.border }]}
                >
                  <View
                    style={[
                      styles.dayBadge,
                      {
                        backgroundColor:
                          d.slots.length > 0
                            ? isDark
                              ? "#134e4a55"
                              : "#ccfbf1"
                            : isDark
                              ? "#1e293b"
                              : "#f1f5f9",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: d.slots.length > 0 ? colors.primary : colors.sub,
                        fontWeight: "800",
                        fontSize: 11,
                      }}
                    >
                      {d.day}
                    </Text>
                  </View>
                  <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                    {d.slots.length > 0 ? (
                      <>
                        {d.slots.map((s) => (
                          <View
                            key={s}
                            style={[
                              styles.slotChip,
                              {
                                backgroundColor: isDark ? "#134e4a55" : "#f0fdfa",
                                borderColor: isDark ? "#0f766e" : "#99f6e4",
                              },
                            ]}
                          >
                            <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "600" }}>
                              {s}
                            </Text>
                          </View>
                        ))}
                        <TouchableOpacity>
                          <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "700" }}>
                            + Add
                          </Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <TouchableOpacity>
                        <Text style={{ color: colors.sub, fontSize: 11 }}>+ Add slots</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.rowBetween}>
                <Text style={[styles.label, { color: colors.sub }]}>BLOCK DATES</Text>
                <TouchableOpacity>
                  <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "700" }}>+ Block</Text>
                </TouchableOpacity>
              </View>
              {[
                ["Oct 20–22", "University exam period"],
                ["Nov 5", "Family event — Meskel celebration"],
              ].map(([d, r]) => (
                <View key={d} style={styles.blockRow}>
                  <View style={styles.amberDot} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontWeight: "700", fontSize: 12 }}>{d}</Text>
                    <Text style={{ color: colors.sub, fontSize: 10 }}>{r}</Text>
                  </View>
                  <Text style={{ color: colors.sub }}>🗑</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            {PACKAGES.map((p) => (
              <View
                key={p.name}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card,
                    borderColor: p.popular ? colors.primary : colors.border,
                    borderWidth: p.popular ? 2 : 1,
                  },
                ]}
              >
                <View style={styles.rowBetween}>
                  <Text style={{ color: colors.text, fontWeight: "800", fontSize: 15 }}>{p.name}</Text>
                  {p.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={{ color: "#047857", fontSize: 10, fontWeight: "700" }}>Popular</Text>
                    </View>
                  )}
                </View>
                <View style={styles.pkgStats}>
                  {[
                    [`${p.sessions}`, "Sessions"],
                    [`${p.hrs}h`, "Per session"],
                    [p.total.toLocaleString(), "ETB total"],
                  ].map(([v, l]) => (
                    <View
                      key={l}
                      style={[styles.pkgStat, { backgroundColor: isDark ? "#1e293b" : "#f8fafc" }]}
                    >
                      <Text style={{ color: colors.text, fontWeight: "800", fontSize: 13 }}>{v}</Text>
                      <Text style={{ color: colors.sub, fontSize: 9 }}>{l}</Text>
                    </View>
                  ))}
                </View>
                <Text style={{ color: colors.sub, fontSize: 10, marginBottom: 4 }}>
                  ✅ Valid 60 days · Escrow per session · Telebirr / CBE Birr
                </Text>
                <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                  <TouchableOpacity
                    style={[styles.pkgBtn, { borderColor: colors.border }]}
                  >
                    <Text style={{ color: colors.sub, fontWeight: "700", fontSize: 11 }}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.pkgBtn,
                      {
                        backgroundColor: p.popular ? colors.primary : "transparent",
                        borderColor: p.popular ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: p.popular ? "#fff" : colors.sub,
                        fontWeight: "700",
                        fontSize: 11,
                      }}
                    >
                      {p.popular ? "Active ✓" : "Activate"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <TouchableOpacity
              style={[styles.dashedBtn, { borderColor: colors.border }]}
            >
              <Text style={{ color: colors.sub, fontWeight: "700", fontSize: 12 }}>
                + Create Custom Package
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
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
  tabs: { flexDirection: "row", borderBottomWidth: 1 },
  tabBtn: { flex: 1, alignItems: "center", paddingVertical: 12 },
  tabUnderline: { height: 2, width: "60%", marginTop: 6, borderRadius: 2 },
  content: { padding: 14, paddingBottom: 40 },
  infoBanner: { borderRadius: 12, padding: 12, borderWidth: 1, marginBottom: 12 },
  card: { borderRadius: 16, padding: 14, borderWidth: 1, marginBottom: 12 },
  label: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5, marginBottom: 10 },
  dayRow: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    alignItems: "flex-start",
  },
  dayBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  slotChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  blockRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  amberDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#f59e0b" },
  popularBadge: {
    backgroundColor: "#d1fae5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  pkgStats: { flexDirection: "row", gap: 8, marginVertical: 10 },
  pkgStat: { flex: 1, borderRadius: 12, padding: 10, alignItems: "center" },
  pkgBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  dashedBtn: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
});