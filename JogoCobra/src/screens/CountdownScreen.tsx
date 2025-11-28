// src/screens/CountdownScreen.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CountdownScreen({ value }: { value: number }) {
  return (
    <View style={styles.root}>
      <Text style={styles.count}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  count: {
    fontSize: 120,
    color: "#0f0",
    fontWeight: "bold",
  },
});
