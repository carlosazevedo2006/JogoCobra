// src/components/GameBoard.tsx
import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { GRID_SIZE, CELULA } from "../utils/constants";
import { useTheme } from "../context/ThemeContext";

export default function GameBoard({
  cobra,
  cobraInimiga,
  comida,
  animSegments,
  enemyAnimSegments,
  eatAnim,
  corCobra,
  modoSelecionado,
  panHandlers,
}: any) {
  
  const { colors } = useTheme(); // ← tema aplicado

  const size = GRID_SIZE * CELULA;

  const safeEatAnim = eatAnim ?? new Animated.Value(1);

  return (
    <View
      style={[styles.wrapper, { width: size, height: size }]}
      {...panHandlers}
    >
      <View
        style={[
          styles.board,
          { backgroundColor: colors.card } // ← correto agora
        ]}
      >

        {/* --- COMIDA VISÍVEL SEMPRE --- */}
        <Animated.View
          style={[
            styles.food,
            {
              left: comida.x * CELULA,
              top: comida.y * CELULA,
              transform: [{ scale: safeEatAnim }],
            },
          ]}
        />

        {/* Cobra jogador */}
        {cobra.map((seg: any, i: number) => {
          const anim = animSegments?.[i];

          if (anim && typeof anim.x !== "undefined") {
            return (
              <Animated.View
                key={`s-${i}`}
                style={[
                  styles.snake,
                  { backgroundColor: corCobra ?? "#43a047" },
                  { transform: [{ translateX: anim.x }, { translateY: anim.y }] },
                ]}
              />
            );
          }

          return (
            <View
              key={`s-static-${i}`}
              style={[
                styles.snake,
                { backgroundColor: corCobra ?? "#43a047" },
                { left: seg.x * CELULA, top: seg.y * CELULA },
              ]}
            />
          );
        })}

        {/* Cobra inimiga */}
        {modoSelecionado === "DIFICIL" &&
          cobraInimiga?.map((seg: any, i: number) => {
            const anim = enemyAnimSegments?.[i];

            if (anim && typeof anim.x !== "undefined") {
              return (
                <Animated.View
                  key={`e-${i}`}
                  style={[
                    styles.enemy,
                    {
                      transform: [
                        { translateX: anim.x },
                        { translateY: anim.y },
                      ],
                    },
                  ]}
                />
              );
            }

            return (
              <View
                key={`e-static-${i}`}
                style={[
                  styles.enemy,
                  { left: seg.x * CELULA, top: seg.y * CELULA },
                ]}
              />
            );
          })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  board: {
    width: "100%",
    height: "100%",
    position: "relative",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#888",
    borderRadius: 8,
  },

  snake: {
    position: "absolute",
    width: CELULA,
    height: CELULA,
    borderRadius: 2,
  },

  enemy: {
    position: "absolute",
    width: CELULA,
    height: CELULA,
    borderRadius: 2,
    backgroundColor: "#ff3b3b",
  },

  food: {
    position: "absolute",
    width: CELULA,
    height: CELULA,
    backgroundColor: "#ffd400",
    borderRadius: 3,
    zIndex: 999,
    borderWidth: 1,
    borderColor: "#b88600",
  },
});
