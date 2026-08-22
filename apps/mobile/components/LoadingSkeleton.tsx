import { View, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { useTheme } from "@/hooks/useTheme";

export function LoadingSkeleton({ height = 80 }: { height?: number }) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          height,
          backgroundColor: colors.surface,
          opacity,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    borderRadius: 16,
    marginBottom: 12,
  },
});
