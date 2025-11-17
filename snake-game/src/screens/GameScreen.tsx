// src/screens/GameScreen.tsx
// Este ecrã contém o componente SnakeGame que tem toda a lógica do jogo.
// A separação facilita testes e manutenção.

import React from "react";
import { View, StyleSheet } from "react-native";
import SnakeGame from "../components/SnakeGame";

export default function GameScreen({ route, navigation }: any) {
  // ler parâmetros passados (cols, rows) do Home
  const { cols = 10, rows = 10 } = route.params || {};

  return (
    <View style={styles.container}>
      {/* SnakeGame recebe props para personalizar o jogo */}
      <SnakeGame
        cols={cols}
        rows={rows}
        onGameOver={(score: number) => {
          // quando o jogo termina, navegar para o ecrã GameOver com a pontuação
          navigation.replace("GameOver", { score });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#fff" },
});
