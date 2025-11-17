// src/screens/HomeScreen.tsx
// Ecrã inicial com instruções e botão para iniciar o jogo.

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Componente principal do ecrã Home
export default function HomeScreen() {
  const navigation = useNavigation<any>(); // hook para navegação

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐍 Snake (PT)</Text>
      <Text style={styles.subtitle}>
        Jogo clássico Snake — controla por botões, setas do teclado (web) ou deslize (swipe).
      </Text>

      <View style={{ height: 18 }} />

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          // navegar para o ecrã do jogo; podes passar props se quiseres personalizar
          navigation.navigate("Game", {
            cols: 10, // dimensão do tabuleiro por defeito
            rows: 10,
          })
        }
      >
        <Text style={styles.buttonText}>Jogar</Text>
      </TouchableOpacity>

      <View style={{ height: 10 }} />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#f0f0f0" }]}
        onPress={() =>
          // iniciar jogo com tabuleiro maior (exemplo)
          navigation.navigate("Game", {
            cols: 12,
            rows: 12,
          })
        }
      >
        <Text style={[styles.buttonText, { color: "#333" }]}>Jogar (12×12)</Text>
      </TouchableOpacity>

      <Text style={styles.small}>
        Dica: podes mudar cor da cobra no ecrã do jogo e a velocidade aumenta com a pontuação.
      </Text>
    </View>
  );
}

// Estilos simples
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "700" },
  subtitle: { marginTop: 8, fontSize: 14, color: "#555", textAlign: "center" },
  button: {
    marginTop: 10,
    backgroundColor: "#2ecc71",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  small: { marginTop: 18, color: "#666", fontSize: 12, textAlign: "center" },
});
