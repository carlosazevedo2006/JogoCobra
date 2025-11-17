// src/screens/GameOverScreen.tsx
// Ecrã que mostra a pontuação final e opções para reiniciar ou voltar ao menu.

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GameOverScreen({ route, navigation }: any) {
  const { score = 0 } = route.params || {};
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    // ao montar, actualizar e ler melhor pontuação
    (async () => {
      try {
        const b = await AsyncStorage.getItem("snake_best_pt");
        const bestStored = b ? Number(b) : 0;
        // se a pontuação actual for maior, armazenar
        if (score > bestStored) {
          await AsyncStorage.setItem("snake_best_pt", String(score));
          setBest(score);
        } else {
          setBest(bestStored);
        }
      } catch (e) {
        console.warn("Erro AsyncStorage:", e);
      }
    })();
  }, [score]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fim de Jogo</Text>
      <Text style={styles.big}>Pontuação: {score}</Text>
      <Text style={styles.small}>Melhor: {best ?? "-"}</Text>

      <View style={{ height: 18 }} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace("Game", { cols: 10, rows: 10 })}
      >
        <Text style={styles.buttonText}>Jogar novamente</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#ccc" }]} onPress={() => navigation.navigate("Home")}>
        <Text style={[styles.buttonText, { color: "#222" }]}>Voltar ao menu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center", justifyContent: "center", flex: 1 },
  title: { fontSize: 28, fontWeight: "700" },
  big: { fontSize: 22, marginTop: 12 },
  small: { marginTop: 6, color: "#666" },
  button: { marginTop: 10, backgroundColor: "#2ecc71", padding: 12, borderRadius: 10 },
  buttonText: { color: "#fff" },
});
