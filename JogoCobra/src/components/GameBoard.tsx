// src/components/GameBoard.tsx
import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { CELULA } from "../utils/constants";

export default function GameBoard({
  cobra,
  cobraInimiga,
  comida,
  animSegments,
  enemyAnimSegments,   // <-- ADICIONADO AQUI
  eatAnim,
  corCobra,
  modoSelecionado,
  panHandlers,
}: any) {
  return (
    <View style={styles.wrapper} {...panHandlers}>
      {/* Pixel Border */}
      <View pointerEvents="none" style={styles.crtOverlay}/>
      <View style={styles.pixelBorder} />

      {/* Main Grid */}
      <View style={styles.board}>

        {/* --- Comida (pixel) --- */}
        <Animated.View
          style={[
            styles.food,
            {
              transform: [
                { translateX: comida.x * CELULA },
                { translateY: comida.y * CELULA },
                { scale: eatAnim },
              ],
            },
          ]}
        />

        {/* --- Cobra (pixel) --- */}
        {cobra.map((seg: any, i: number) => {
          const anim = animSegments[i];
          return (
            <Animated.View
              key={i}
              style={[
                styles.snake,
                { backgroundColor: corCobra },
                anim && {
                  transform: [
                    { translateX: anim.x },
                    { translateY: anim.y },
                  ],
                },
              ]}
            />
          );
        })}

        {/* --- Cobra Inimiga (pixel) --- */}
        {modoSelecionado === "DIFICIL" &&
          cobraInimiga.map((seg: any, idx: number) => {
            const enemyAnim = enemyAnimSegments[idx];   // <-- USO CORRETO DO ANIMADOR

            return (
              <Animated.View
                key={"enemy-" + idx}
                style={[
                  styles.enemy,
                  enemyAnim && {
                    transform: [
                      { translateX: enemyAnim.x },
                      { translateY: enemyAnim.y }
                    ],
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
    width: CELULA * 10,
    height: CELULA * 10,
    position: "relative",
  },

  scorePixel: {
    color: "#00ff66",
    fontSize: 28,
    fontFamily: "VT323_400Regular",
    letterSpacing: 2,
    marginBottom: 10,
  },

  // Borda estilo CRT retro
  pixelBorder: {
    position: "absolute",
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderWidth: 6,
    borderColor: "#00ff66",
  },

  board: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },

  // Pixel quadrado da cobra
  snake: {
    width: CELULA,
    height: CELULA,
    backgroundColor: "#43a047",
  },

  // Pixel quadrado da cobra inimiga
  enemy: {
    width: CELULA,
    height: CELULA,
    backgroundColor: "#ff3333",
    position: "absolute",
  },

  // Pixel quadrado da comida
  food: {
    width: CELULA,
    height: CELULA,
    backgroundColor: "#ffff00",
    position: "absolute",
  },
});
