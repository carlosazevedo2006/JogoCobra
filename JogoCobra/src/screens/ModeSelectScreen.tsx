// src/screens/ModeSelectScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Modo } from "../types/types";

export default function ModeSelectionScreen({
  onSelect,
}: {
  onSelect: (modo: Modo) => void;
}) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Selecionar Modo</Text>

      <TouchableOpacity style={styles.btn} onPress={() => onSelect("FACIL")}>
        <Text style={styles.btnText}>Fácil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => onSelect("MEDIO")}>
        <Text style={styles.btnText}>Médio</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => onSelect("DIFICIL")}>
        <Text style={styles.btnText}>Difícil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#0f0",
    fontSize: 36,
    marginBottom: 40,
  },
  btn: {
    backgroundColor: "#0f0",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: 200,
    alignItems: "center",
  },
  btnText: {
    color: "#111",
    fontSize: 20,
    fontWeight: "bold",
  },
});
