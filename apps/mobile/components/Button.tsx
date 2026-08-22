import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

export function Button({
  title,
  onPress,
  loading = false,
  variant = "primary",
  disabled = false,
}: Props) {
  const { colors } = useTheme();

  const backgroundColor =
    variant === "primary"
      ? colors.primary
      : variant === "danger"
      ? "#DC2626"
      : colors.surface;

  const textColor = variant === "secondary" ? colors.text : "#FFFFFF";

  return (
    <Pressable
      style={[
        styles.button,
        { backgroundColor, opacity: disabled || loading ? 0.6 : 1 },
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
  },
});
