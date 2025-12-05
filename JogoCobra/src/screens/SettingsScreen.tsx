import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function SettingsScreen({ onClose, onApply }: { onClose: () => void; onApply: () => void }) {
  const { colors, themeName, setThemeName } = useTheme();
  const [snakeColor, setSnakeColor] = useState("#43a047");

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Definições</Text>

        <View style={{ width: "100%", marginTop: 8 }}>
          <Text style={{ color: colors.textSecondary, marginBottom: 6 }}>Tema</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={() => setThemeName("light")}
              style={[styles.smallBtn, themeName === "light" ? { borderColor: colors.primary, borderWidth: 2 } : { borderColor: "#888" }]}
            >
              <Text>Claro</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setThemeName("dark")}
              style={[styles.smallBtn, themeName === "dark" ? { borderColor: colors.primary, borderWidth: 2 } : { borderColor: "#888" }]}
            >
              <Text>Escuro</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ width: "100%", marginTop: 12 }}>
          <Text style={{ color: colors.textSecondary, marginBottom: 6 }}>Cor da cobra (hex)</Text>
          <TextInput
            value={snakeColor}
            onChangeText={setSnakeColor}
            style={[styles.input, { backgroundColor: colors.boardBg, color: colors.textPrimary }]}
            placeholder="#43a047"
            placeholderTextColor={colors.textSecondary}
          />
          <Text style={{ color: colors.textSecondary, marginTop: 6, fontSize: 12 }}>
            (Esta opção apenas altera a aparência; não altera lógica.)
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 16 }}>
          <TouchableOpacity onPress={onApply} style={[styles.btn, { backgroundColor: colors.buttonBg }]}>
            <Text style={{ color: colors.buttonText }}>Aplicar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={[styles.btnOutline]}>
            <Text style={{ color: colors.textSecondary }}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  card: { width: "95%", padding: 16, borderRadius: 12 },
  title: { fontSize: 22, fontWeight: "800" },
  smallBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, marginRight: 8 },
  input: { padding: 10, borderRadius: 8, fontSize: 16 },
  btn: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10, marginRight: 8 },
  btnOutline: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10, borderWidth: 0, marginLeft: 8 },
});
