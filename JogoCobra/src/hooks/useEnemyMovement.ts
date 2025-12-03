// src/hooks/useEnemyMovement.ts
import { useState } from "react";
import { Animated } from "react-native";     // <-- ADICIONADO
import { Posicao } from "../types/types";
import { GRID_SIZE, CELULA, igual } from "../utils/constants";

export default function useEnemyMovement({
  modoSelecionado,
  cobra,
  enemyAnimSegments,   // <-- ADICIONADO
  terminarJogo,
}: any) {

  const [cobraInimiga, setCobraInimiga] = useState<Posicao[]>([
    { x: GRID_SIZE - 2, y: GRID_SIZE - 2 },
  ]);

  function moverCobraInimiga() {
    if (modoSelecionado !== "DIFICIL") return;

    setCobraInimiga((prev) => {
      if (!prev || prev.length === 0) return prev;

      const head = prev[0];
      const alvo = cobra[0];

      const dx = Math.sign(alvo.x - head.x);
      const dy = Math.sign(alvo.y - head.y);

      const novaHead = { x: head.x + dx, y: head.y + dy };

      // colisão com jogador
      if (igual(novaHead, alvo)) {
        terminarJogo();
        return prev;
      }

      // evitar sair da grelha
      if (
        novaHead.x < 0 ||
        novaHead.x >= GRID_SIZE ||
        novaHead.y < 0 ||
        novaHead.y >= GRID_SIZE
      ) {
        return prev;
      }

      // NOVO — criar segmento animado se faltar
      if (enemyAnimSegments.current.length === 0) {
        enemyAnimSegments.current = [
          new Animated.ValueXY({
            x: prev[0].x * CELULA,
            y: prev[0].y * CELULA,
          }),
        ];
      }

      // atualizar animação da cabeça inimiga
      Animated.timing(enemyAnimSegments.current[0], {
        toValue: { x: novaHead.x * CELULA, y: novaHead.y * CELULA },
        duration: 160,      // velocidade suave
        useNativeDriver: false,
      }).start();

      return [novaHead];
    });
  }

  return {
    cobraInimiga,
    setCobraInimiga,
    moverCobraInimiga,
  };
}
