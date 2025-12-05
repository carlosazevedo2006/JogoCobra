import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function GameOverScreen({
  pontos,
  melhor,
  onRestart,
  onMenu,
}: {
  pontos: number;
  melhor: number;
  onRestart: () => void;
  onMenu: () => void;
}) {
  const { colors } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Game Over</Text>
        <Text style={[styles.score, { color: colors.textSecondary }]}>Pontos: {pontos}</Text>
        <Text style={[styles.score, { color: colors.textSecondary }]}>Record: {melhor}</Text>

        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.buttonBg }]} onPress={onRestart}>
          <Text style={[styles.btnText, { color: colors.buttonText }]}>Recomeçar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnOutline]} onPress={onMenu}>
          <Text style={[styles.btnOutlineText, { color: colors.textSecondary }]}>Voltar ao menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  card: { width: "90%", padding: 18, borderRadius: 12, alignItems: "center" },
  title: { fontSize: 28, fontWeight: "800", marginBottom: 6 },
  score: { fontSize: 16, marginBottom: 6 },
  btn: { marginTop: 12, paddingVertical: 12, paddingHorizontal: 28, borderRadius: 10 },
  btnText: { fontWeight: "700", fontSize: 16 },
  btnOutline: { marginTop: 10, paddingVertical: 10 },
  btnOutlineText: { fontSize: 15 },
});
