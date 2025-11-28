// src/screens/WelcomeScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function WelcomeScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Jogo da Cobra</Text>

      <TouchableOpacity style={styles.btn} onPress={onContinue}>
        <Text style={styles.btnText}>Começar</Text>
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
    fontSize: 40,
    color: "#0f0",
    marginBottom: 40,
    fontWeight: "bold",
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
