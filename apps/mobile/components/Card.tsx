import { View, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
  },
});
