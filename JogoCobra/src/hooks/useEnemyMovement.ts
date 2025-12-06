// src/hooks/useEnemyMovement.ts
import { useState } from "react";
import { Animated } from "react-native";
import { Posicao } from "../types/types";
import { GRID_SIZE, CELULA, igual } from "../utils/constants";

export default function useEnemyMovement({
  modoSelecionado,
  cobra,
  enemyAnimSegments,
  terminarJogo,
}: any) {
  
  // Inimigo começa sempre vazio. É o Game.tsx que decide quando ativar.
  const [cobraInimiga, setCobraInimiga] = useState<Posicao[]>([]);

  function moverCobraInimiga() {
    // Só existe no modo difícil
    if (modoSelecionado !== "DIFICIL") return;

    // Sem cobra inimiga → nada a fazer
    if (!cobraInimiga.length) return;

    setCobraInimiga((prev) => {
      if (!prev.length) return prev;

      const head = prev[0];
      const alvo = cobra[0];
      if (!alvo) return prev;

      // Movimento direto em direção ao jogador
      const dx = Math.sign(alvo.x - head.x);
      const dy = Math.sign(alvo.y - head.y);
      const novaHead = { x: head.x + dx, y: head.y + dy };

      // Colisão com jogador
      if (igual(novaHead, alvo)) {
        terminarJogo();
        return prev;
      }

      // Limites da grelha
      if (
        novaHead.x < 0 ||
        novaHead.x >= GRID_SIZE ||
        novaHead.y < 0 ||
        novaHead.y >= GRID_SIZE
      ) {
        return prev;
      }

      // Inicializa segmento animado, se necessário
      if (enemyAnimSegments.current.length === 0) {
        enemyAnimSegments.current = [
          new Animated.ValueXY({
            x: head.x * CELULA,
            y: head.y * CELULA,
          }),
        ];
      }

      // Anima a cabeça inimiga
      Animated.timing(enemyAnimSegments.current[0], {
        toValue: { x: novaHead.x * CELULA, y: novaHead.y * CELULA },
        duration: 160,
        useNativeDriver: false,
      }).start();

      // Retorna nova posição (cobra inimiga tem 1 segmento)
      return [novaHead];
    });
  }

  return {
    cobraInimiga,
    setCobraInimiga,
    moverCobraInimiga,
  };
}
