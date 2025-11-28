// src/components/SnakeSegment.tsx
import React from "react";
import { Animated, StyleSheet } from "react-native";
import { CELULA } from "../utils/constants";
import { Posicao } from "../types/types";

interface Props {
  segment: Posicao;
  animation?: any;
  color: string;
}

export default function SnakeSegment({ segment, animation, color }: Props) {
  const style = animation
    ? {
        transform: [
          { translateX: animation.x },
          { translateY: animation.y },
        ],
      }
    : {
        transform: [
          { translateX: segment.x * CELULA },
          { translateY: segment.y * CELULA },
        ],
      };

  return <Animated.View style={[styles.segment, { backgroundColor: color }, style]} />;
}

const styles = StyleSheet.create({
  segment: {
    position: "absolute",
    width: CELULA - 4,
    height: CELULA - 4,
    borderRadius: 6,
  },
});
