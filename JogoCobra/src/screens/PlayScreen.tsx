// src/screens/PlayScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function PlayScreen({
  onChooseMode,
}: {
  onChooseMode: () => void;
}) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Pronto para jogar?</Text>

      <TouchableOpacity style={styles.btn} onPress={onChooseMode}>
        <Text style={styles.btnText}>Selecionar Modo</Text>
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
    color: "#fff",
    fontSize: 32,
    marginBottom: 40,
  },
  btn: {
    backgroundColor: "#0f0",
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 10,
  },
  btnText: {
    color: "#111",
    fontSize: 20,
    fontWeight: "bold",
  },
});
