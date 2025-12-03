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
        <Text style={styles.btnText}>FÁCIL</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => onSelect("MEDIO")}>
        <Text style={styles.btnText}>MÉDIO</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => onSelect("DIFICIL")}>
        <Text style={styles.btnText}>DIFÍCIL</Text>
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
    color: "#00ff66",
    fontSize: 48,
    marginBottom: 40,
    fontFamily: "VT323_400Regular",
    letterSpacing: 2,
  },

  btn: {
    width: 220,
    paddingVertical: 12,
    backgroundColor: "#222",
    borderColor: "#00ff66",
    borderWidth: 3,
    marginVertical: 12,
  },

  btnText: {
    color: "#00ff66",
    fontSize: 32,
    textAlign: "center",
    fontFamily: "VT323_400Regular",
    letterSpacing: 1,
  },
});
