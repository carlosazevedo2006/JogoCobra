// App.tsx
// Adiciona menu inicial para escolher o modo de jogo

import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Game from "./src/screens/Game";
import { useFonts, VT323_400Regular } from "@expo-google-fonts/vt323";


export default function App() {
  const [fontsLoaded] = useFonts({
  VT323_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Game/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    color: "white",
    fontSize: 32,
    marginBottom: 40,
    fontWeight: "bold",
  },
  botao: {
    backgroundColor: "#1f1f1f",
    padding: 20,
    borderRadius: 12,
    marginVertical: 10,
    width: 220,
    alignItems: "center",
  },
  botaoTexto: {
    color: "white",
    fontSize: 20,
  },
});
