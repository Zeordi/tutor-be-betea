import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { getToken } from "@/lib/api";

export default function ProgressReportScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const res = await fetch(`\( {process.env.EXPO_PUBLIC_API_URL}/progress/ \){id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setReport(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!report) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Report not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Week {report.weekNumber} Report
        </Text>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Topics Covered</Text>
          <Text style={{ color: colors.textSecondary, marginTop: 6 }}>
            {report.topicsCovered}
          </Text>
        </View>

        {report.quizScore && (
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Quiz Score</Text>
            <Text style={[styles.score, { color: colors.primary }]}>
              {report.quizScore}%
            </Text>
          </View>
        )}

        {report.strengthsNotes && (
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardTitle, { color: colors.success || "#16A34A" }]}>
              Strengths
            </Text>
            <Text style={{ color: colors.textSecondary, marginTop: 6 }}>
              {report.strengthsNotes}
            </Text>
          </View>
        )}

        {report.improvementAreas && (
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardTitle, { color: colors.warning || "#D97706" }]}>
              Areas to Improve
            </Text>
            <Text style={{ color: colors.textSecondary, marginTop: 6 }}>
              {report.improvementAreas}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  score: { fontSize: 28, fontWeight: "700", marginTop: 6 },
});
