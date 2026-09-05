import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";

export interface QuickActionsProps {
  visible: boolean;
  onClose: () => void;
}

const ACTIONS = [
  {
    icon: "📍",
    title: "Live location",
    sub: "Geofence session map",
    href: "/(shared)/location-sharing" as const,
  },
  {
    icon: "🚨",
    title: "Emergency SOS",
    sub: "Hold to alert contacts",
    href: "/(shared)/sos-confirm" as const,
    danger: true,
  },
  {
    icon: "📷",
    title: "Document capture",
    sub: "Fayda / degree / selfie",
    href: "/(shared)/camera-capture" as const,
  },
  {
    icon: "📡",
    title: "Offline logger",
    sub: "Pending GPS sync",
    href: "/(shared)/offline-session" as const,
  },
  {
    icon: "🔔",
    title: "Notifications",
    sub: "Sessions · Escrow · Chat",
    href: "/(shared)/notification-center" as const,
  },
];

/** V3 · Quick Actions long-press menu overlay */
export default function QuickActions({ visible, onClose }: QuickActionsProps) {
  const router = useRouter();
  const { isDark } = useTheme();

  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";
  const primary = "#0D9488";

  const go = (href: string) => {
    onClose();
    router.push(href as any);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: card, borderColor: border }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.handle} />
          <Text style={[styles.title, { color: text }]}>Quick actions</Text>
          <Text style={[styles.subtitle, { color: sub }]}>
            Safety · attendance · vault capture
          </Text>

          {ACTIONS.map((a) => (
            <TouchableOpacity
              key={a.title}
              style={[
                styles.row,
                {
                  borderColor: border,
                  backgroundColor: isDark ? "#0A1628" : "#F8FAFC",
                },
              ]}
              onPress={() => go(a.href)}
              activeOpacity={0.85}
            >
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: a.danger
                      ? isDark
                        ? "rgba(220,38,38,0.2)"
                        : "#FEE2E2"
                      : isDark
                        ? "rgba(13,148,136,0.2)"
                        : "#CCFBF1",
                  },
                ]}
              >
                <Text style={{ fontSize: 18 }}>{a.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: a.danger ? "#DC2626" : text,
                    fontWeight: "800",
                    fontSize: 14,
                  }}
                >
                  {a.title}
                </Text>
                <Text style={{ color: sub, fontSize: 11, marginTop: 2 }}>{a.sub}</Text>
              </View>
              <Text style={{ color: primary, fontWeight: "800" }}>→</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.cancel, { borderColor: border }]}
            onPress={onClose}
          >
            <Text style={{ color: sub, fontWeight: "700" }}>Close</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingBottom: 28,
    paddingTop: 10,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#94A3B8",
    marginBottom: 12,
    opacity: 0.5,
  },
  title: { fontSize: 17, fontWeight: "900" },
  subtitle: { fontSize: 12, marginBottom: 14, marginTop: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cancel: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
});