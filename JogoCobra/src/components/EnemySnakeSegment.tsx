// src/components/EnemySnakeSegment.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Posicao } from "../types/types";
import { CELULA } from "../utils/constants";

interface Props {
  segment: Posicao;
}

export default function EnemySnakeSegment({ segment }: Props) {
  return (
    <View
      style={[
        styles.segment,
        {
          left: segment.x * CELULA + 2,
          top: segment.y * CELULA + 2,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  segment: {
    position: "absolute",
    width: CELULA - 4,
    height: CELULA - 4,
    backgroundColor: "#d32f2f",
    borderRadius: 6,
  },
});
