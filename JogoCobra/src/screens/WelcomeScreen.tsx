import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function WelcomeScreen({
  onContinue,
  onSettings,
}: {
  onContinue: () => void;
  onSettings?: () => void;
}) {
  const { colors } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Jogo da Cobra</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Minimal — responsivo — jogável
      </Text>

      <TouchableOpacity
        onPress={onContinue}
        style={[styles.bigBtn, { backgroundColor: colors.buttonBg }]}
        activeOpacity={0.8}
      >
        <Text style={[styles.btnText, { color: colors.buttonText }]}>Jogar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onSettings}
        style={[styles.mediumBtn, { borderColor: colors.primary }]}
        activeOpacity={0.8}
      >
        <Text style={[styles.mediumText, { color: colors.primary }]}>Definições</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          // fechar app não é tratado aqui, mas pode ser hookado
        }}
        style={[styles.smallBtn]}
        activeOpacity={0.8}
      >
        <Text style={[styles.smallText, { color: colors.textSecondary }]}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 36, fontWeight: "700", marginBottom: 6 },
  subtitle: { fontSize: 14, marginBottom: 28 },
  bigBtn: {
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 12,
    marginBottom: 16,
    width: "70%",
    alignItems: "center",
  },
  btnText: { fontSize: 18, fontWeight: "700" },
  mediumBtn: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 12,
  },
  mediumText: { fontSize: 16, fontWeight: "600" },
  smallBtn: { paddingVertical: 8, paddingHorizontal: 18, marginTop: 6 },
  smallText: { fontSize: 14 },
});
