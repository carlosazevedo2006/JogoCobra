import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Modo } from "../types/types";
import { useTheme } from "../context/ThemeContext";

export default function ModeSelectScreen({ onSelect }: { onSelect: (modo: Modo) => void }) {
  const { colors } = useTheme();

  const modos: { key: Modo; label: string; desc: string }[] = [
    { key: "FACIL", label: "Fácil", desc: "Lento — ideal para aprender" },
    { key: "MEDIO", label: "Médio", desc: "Velocidade progressiva" },
    { key: "DIFICIL", label: "Difícil", desc: "Cobra inimiga + desafio" },
  ];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Selecionar Modo</Text>

      {modos.map((m) => (
        <TouchableOpacity
          key={m.key}
          style={[styles.modeBtn, { backgroundColor: colors.card }]}
          onPress={() => onSelect(m.key)}
          activeOpacity={0.85}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.modeLabel, { color: colors.textPrimary }]}>{m.label}</Text>
            <Text style={[styles.modeDesc, { color: colors.textSecondary }]}>{m.desc}</Text>
          </View>
          <View style={[styles.pill, { backgroundColor: colors.primary }]}>
            <Text style={{ color: colors.buttonText }}>{m.label === "Fácil" ? "★" : m.label === "Médio" ? "☆" : "⚑"}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 20, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 28, marginBottom: 18, fontWeight: "700" },
  modeBtn: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  modeLabel: { fontSize: 18, fontWeight: "700" },
  modeDesc: { fontSize: 13, marginTop: 4 },
  pill: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
});
