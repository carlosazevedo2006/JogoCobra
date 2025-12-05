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
  const { colors } = useTheme();

  const size = GRID_SIZE * CELULA;

  return (
    <View
      style={[
        styles.wrapper,
        { width: size, height: size, backgroundColor: colors.boardBg },
      ]}
      {...panHandlers}
    >
      <View style={[styles.board]}>

        {/* === COMIDA === */}
        <Animated.View
          style={[
            styles.food,
            {
              backgroundColor: colors.foodColor,
              transform: [
                { translateX: comida.x * CELULA },
                { translateY: comida.y * CELULA },
                { scale: eatAnim },
              ],
            },
          ]}
        />

        {/* === COBRA DO JOGADOR === */}
        {cobra.map((seg: any, i: number) => {
          const anim = animSegments[i];

          if (anim) {
            return (
              <Animated.View
                key={`s-${i}`}
                style={[
                  styles.snake,
                  { backgroundColor: corCobra || "#43a047" },
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
              key={`s-static-${i}`}
              style={[
                styles.snake,
                { backgroundColor: corCobra || "#43a047" },
                {
                  left: seg.x * CELULA,
                  top: seg.y * CELULA,
                },
              ]}
            />
          );
        })}

        {/* === COBRA INIMIGA (apenas modo difícil) === */}
        {modoSelecionado === "DIFICIL" &&
          cobraInimiga.map((seg: any, i: number) => {
            const anim = enemyAnimSegments?.[i];

            if (anim) {
              return (
                <Animated.View
                  key={`e-${i}`}
                  style={[
                    styles.enemy,
                    {
                      backgroundColor: "#ff3b3b",
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
                  {
                    left: seg.x * CELULA,
                    top: seg.y * CELULA,
                    backgroundColor: "#ff3b3b",
                  },
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
    borderRadius: 14,
    overflow: "hidden",
    elevation: 8,
  },

  board: {
    width: "100%",
    height: "100%",
    position: "relative",
  },

  snake: {
    position: "absolute",
    width: CELULA,
    height: CELULA,
    borderRadius: 6,
  },

  enemy: {
    position: "absolute",
    width: CELULA,
    height: CELULA,
    borderRadius: 6,
  },

  food: {
    position: "absolute",
    width: CELULA,
    height: CELULA,
    borderRadius: 6,
  },
});
