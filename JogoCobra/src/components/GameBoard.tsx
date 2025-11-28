// src/components/GameBoard.tsx
import React from "react";
import { View, StyleSheet } from "react-native";

import SnakeSegment from "./SnakeSegment";
import EnemySnakeSegment from "./EnemySnakeSegment";
import Food from "./Food";

import { GRID_SIZE, CELULA } from "../utils/constants";
import { Posicao } from "../types/types";

interface GameBoardProps {
  cobra: Posicao[];
  cobraInimiga: Posicao[];
  comida: Posicao;

  animSegments: any[];
  eatAnim: any;

  corCobra: string;
  modoSelecionado: string | null;

  onRequestDirecao?: (dir: Posicao) => void;
  panHandlers?: any;
}

export default function GameBoard({
  cobra,
  cobraInimiga,
  comida,
  animSegments,
  eatAnim,
  corCobra,
  modoSelecionado,
  panHandlers = {},
}: GameBoardProps) {
  return (
    <View style={styles.board} {...panHandlers}>
      {/* GRELHA */}
      {Array.from({ length: GRID_SIZE }).map((_, row) =>
        Array.from({ length: GRID_SIZE }).map((_, col) => (
          <View
            key={`grid-${row}-${col}`}
            style={{
              position: "absolute",
              width: CELULA,
              height: CELULA,
              left: col * CELULA,
              top: row * CELULA,
              borderWidth: 0.5,
              borderColor: "#ddd",
              borderStyle: "dashed",
            }}
          />
        ))
      )}

      {/* COBRA DO JOGADOR */}
      {cobra.map((seg, idx) => (
        <SnakeSegment
          key={`snake-${idx}`}
          segment={seg}
          animation={animSegments[idx]}
          color={corCobra}
        />
      ))}

      {/* COBRA INIMIGA — apenas modo difícil */}
      {modoSelecionado === "DIFICIL" &&
        cobraInimiga.map((seg, idx) => <EnemySnakeSegment key={`enemy-${idx}`} segment={seg} />)}

      {/* COMIDA */}
      <Food comida={comida} eatAnim={eatAnim} />
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: GRID_SIZE * CELULA,
    height: GRID_SIZE * CELULA,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#555",
    position: "relative",
    overflow: "hidden",
  },
});
