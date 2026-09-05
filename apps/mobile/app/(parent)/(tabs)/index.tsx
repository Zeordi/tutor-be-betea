import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import FiltersBottomSheet, {
  type FiltersValue,
} from "@/components/FiltersBottomSheet";

const FILTERS = ["All", "Math", "Physics", "Chemistry", "English"];
const TUTORS = [
  {
    id: "1",
    name: "Selamawit Tadesse",
    sub: "Mathematics · Physics",
    rate: 450,
    rating: 4.9,
    dist: "1.2 km",
    idOk: true,
    deg: true,
    gold: true,
  },
  {
    id: "2",
    name: "Bereket Solomon",
    sub: "Physics · Chemistry",
    rate: 500,
    rating: 4.8,
    dist: "2.1 km",
    idOk: true,
    deg: true,
    gold: false,
  },
  {
    id: "3",
    name: "Tigist Haile",
    sub: "Mathematics · Stats",
    rate: 380,
    rating: 4.7,
    dist: "3.4 km",
    idOk: true,
    deg: false,
    gold: false,
  },
];

export default function FindTutorsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [active, setActive] = useState(0);
  const [q, setQ] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [advanced, setAdvanced] = useState<FiltersValue | null>(null);

  const filtered = TUTORS.filter((t) => {
    const mustVerified = verifiedOnly || advanced?.verifiedOnly;
    if (mustVerified && !t.idOk) return false;
    if (
      active > 0 &&
      !t.sub.toLowerCase().includes(FILTERS[active].toLowerCase())
    )
      return false;
    if (
      q &&
      !t.name.toLowerCase().includes(q.toLowerCase()) &&
      !t.sub.toLowerCase().includes(q.toLowerCase())
    )
      return false;
    if (advanced?.subjects?.length) {
      const hit = advanced.subjects.some((s) =>
        t.sub.toLowerCase().includes(s.toLowerCase())
      );
      if (!hit) return false;
    }
    if (advanced?.maxRate && t.rate > advanced.maxRate) return false;
    return true;
  });

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Find Tutors
          </Text>
          <Pressable
            onPress={() => setFiltersOpen(true)}
            style={[
              styles.filterBtn,
              {
                backgroundColor: isDark ? "#1E3A5F" : "#F1F5F9",
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={{ fontSize: 14 }}>⚙️</Text>
            <Text
              style={{
                color: colors.primary,
                fontSize: 12,
                fontWeight: "800",
              }}
            >
              Filters
            </Text>
          </Pressable>
        </View>

        <View
          style={[
            styles.search,
            { backgroundColor: isDark ? "#1E3A5F" : "#F1F5F9" },
          ]}
        >
          <Text>🔍</Text>
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search subjects, names..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 10 }}
        >
          {FILTERS.map((f, i) => (
            <Pressable
              key={f}
              onPress={() => setActive(i)}
              style={[
                styles.chip,
                {
                  backgroundColor:
                    active === i
                      ? colors.primary
                      : isDark
                        ? "#1E3A5F"
                        : "#F1F5F9",
                },
              ]}
            >
              <Text
                style={{
                  color:
                    active === i ? "#fff" : colors.mutedForeground,
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                {f}
              </Text>
            </Pressable>
          ))}
          <Pressable
            onPress={() => setVerifiedOnly((v) => !v)}
            style={[
              styles.chip,
              {
                backgroundColor: verifiedOnly
                  ? colors.primary
                  : isDark
                    ? "#1E3A5F"
                    : "#F1F5F9",
              },
            ]}
          >
            <Text
              style={{
                color: verifiedOnly ? "#fff" : colors.mutedForeground,
                fontSize: 12,
                fontWeight: "700",
              }}
            >
              🛡️ Verified only
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          gap: 12,
          paddingBottom: 100,
        }}
      >
        <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>
          {filtered.length} tutors nearby
        </Text>

        {filtered.map((t) => (
          <Pressable
            key={t.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => router.push(`/(parent)/tutor/${t.id}`)}
          >
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View
                style={[styles.avatar, { backgroundColor: colors.primary }]}
              >
                <Text style={{ color: "#fff", fontWeight: "800" }}>
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.rowBetween}>
                  <Text
                    style={[styles.name, { color: colors.foreground }]}
                  >
                    {t.name}
                  </Text>
                  <Text
                    style={{ color: colors.primary, fontWeight: "800" }}
                  >
                    {t.rate} ETB/hr
                  </Text>
                </View>
                <Text
                  style={{
                    color: colors.mutedForeground,
                    fontSize: 12,
                  }}
                >
                  {t.sub}
                </Text>
                <Text
                  style={{
                    color: colors.mutedForeground,
                    fontSize: 11,
                    marginTop: 2,
                  }}
                >
                  ⭐ {t.rating} · 📍 {t.dist}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 6,
                    marginTop: 6,
                    flexWrap: "wrap",
                  }}
                >
                  {t.idOk && <MiniBadge text="🛡️ ID" />}
                  {t.deg && <MiniBadge text="🎓 Degree" />}
                  {t.gold && <MiniBadge text="🥇 Gold" gold />}
                </View>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
              <Pressable
                style={[
                  styles.btn,
                  { backgroundColor: colors.primary, flex: 1 },
                ]}
                onPress={() => router.push(`/(parent)/tutor/${t.id}`)}
              >
                <Text style={styles.btnText}>Book</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.btnOutline,
                  { borderColor: colors.primary, flex: 1 },
                ]}
                onPress={() => router.push(`/(parent)/tutor/${t.id}`)}
              >
                <Text
                  style={[
                    styles.btnOutlineText,
                    { color: colors.primary },
                  ]}
                >
                  Profile
                </Text>
              </Pressable>
            </View>
          </Pressable>
        ))}

        {filtered.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Text style={{ fontSize: 32 }}>🔍</Text>
            <Text
              style={[
                styles.name,
                { color: colors.foreground, marginTop: 8 },
              ]}
            >
              No tutors found
            </Text>
            <Text
              style={{
                color: colors.mutedForeground,
                fontSize: 13,
                textAlign: "center",
                marginTop: 4,
              }}
            >
              Try adjusting filters or search nearby areas like Bole or
              Kazanchis.
            </Text>
            <Pressable
              onPress={() => setFiltersOpen(true)}
              style={[
                styles.btn,
                {
                  backgroundColor: colors.primary,
                  marginTop: 16,
                  paddingHorizontal: 24,
                },
              ]}
            >
              <Text style={styles.btnText}>Open Filters</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      <FiltersBottomSheet
        visible={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        resultCount={filtered.length}
        onApply={(f) => {
          setAdvanced(f);
          if (f.verifiedOnly) setVerifiedOnly(true);
        }}
      />
    </View>
  );
}

function MiniBadge({ text, gold }: { text: string; gold?: boolean }) {
  return (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        backgroundColor: gold ? "#FEF3C7" : "#CCFBF1",
      }}
    >
      <Text
        style={{
          fontSize: 10,
          fontWeight: "700",
          color: gold ? "#92400E" : "#0F766E",
        }}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: "800" },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 14 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    marginRight: 8,
  },
  card: { borderRadius: 16, borderWidth: 1, padding: 14 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 14, fontWeight: "700" },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  btn: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  btnOutline: {
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
  },
  btnOutlineText: { fontWeight: "700", fontSize: 13 },
});