// src/screens/GameOverScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

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
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Game Over</Text>

      <Text style={styles.score}>Pontos: {pontos}</Text>
      <Text style={styles.score}>Recorde: {melhor}</Text>

      <TouchableOpacity style={styles.btn} onPress={onRestart}>
        <Text style={styles.btnText}>Jogar novamente</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn2} onPress={onMenu}>
        <Text style={styles.btnText2}>Menu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  title: {
    color: "#f55",
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 30,
  },
  score: {
    color: "#fff",
    fontSize: 22,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#0f0",
    paddingVertical: 14,
    paddingHorizontal: 30,
    marginTop: 30,
    borderRadius: 10,
  },
  btn2: {
    borderColor: "#0f0",
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 30,
    marginTop: 20,
    borderRadius: 10,
  },
  btnText: {
    color: "#111",
    fontSize: 20,
    fontWeight: "bold",
  },
  btnText2: {
    color: "#0f0",
    fontSize: 20,
    fontWeight: "bold",
  },
});
