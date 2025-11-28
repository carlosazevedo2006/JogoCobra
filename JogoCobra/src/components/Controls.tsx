// src/components/Controls.tsx
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function Controls({ onPress }: { onPress: (dir: string) => void }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={() => onPress("UP")}>
        <Text style={styles.txt}>↑</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <TouchableOpacity style={styles.btn} onPress={() => onPress("LEFT")}>
          <Text style={styles.txt}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => onPress("RIGHT")}>
          <Text style={styles.txt}>→</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btn} onPress={() => onPress("DOWN")}>
        <Text style={styles.txt}>↓</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginTop: 16 },
  row: { flexDirection: "row" },
  btn: {
    backgroundColor: "#333",
    padding: 14,
    borderRadius: 8,
    margin: 6,
  },
  txt: { color: "#fff", fontSize: 20 },
});
