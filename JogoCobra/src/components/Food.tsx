// src/components/Food.tsx
import React from "react";
import { Animated, StyleSheet } from "react-native";
import { CELULA } from "../utils/constants";
import { Posicao } from "../types/types";

interface Props {
  comida: Posicao;
  eatAnim: Animated.Value;
}

export default function Food({ comida, eatAnim }: Props) {
  return (
    <Animated.View
      style={[
        styles.food,
        {
          left: comida.x * CELULA + 2,
          top: comida.y * CELULA + 2,
          transform: [{ scale: eatAnim }],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  food: {
    position: "absolute",
    width: CELULA - 4,
    height: CELULA - 4,
    borderRadius: 5,
    backgroundColor: "#e53935",
  },
});
