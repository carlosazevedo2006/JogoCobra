import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function CountdownScreen({ value }: { value: number }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.text, { color: colors.textPrimary }]}>{value > 0 ? value : "JÁ!"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: {
    width: 160,
    height: 160,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
  text: { fontSize: 56, fontWeight: "800" },
});
