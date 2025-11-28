// src/hooks/useEnemyMovement.ts
import { useState } from "react";
import { Posicao } from "../types/types";
import { GRID_SIZE, igual } from "../utils/constants";

interface Params {
  modoSelecionado: string | null;
  cobra: Posicao[];
  terminarJogo: () => void;
}

export default function useEnemyMovement({ modoSelecionado, cobra, terminarJogo }: Params) {
  const [cobraInimiga, setCobraInimiga] = useState<Posicao[]>([
    { x: GRID_SIZE - 2, y: GRID_SIZE - 2 },
  ]);

  function moverCobraInimiga() {
    if (modoSelecionado !== "DIFICIL") return;

    setCobraInimiga((prev) => {
      const head = prev[0];
      const target = cobra[0];

      if (!target) return prev;

      // movimento lento: 1 passo na direção do jogador
      let dx = target.x - head.x;
      let dy = target.y - head.y;

      const stepX = dx === 0 ? 0 : dx > 0 ? 1 : -1;
      const stepY = dy === 0 ? 0 : dy > 0 ? 1 : -1;

      const novaPos = { x: head.x + stepX, y: head.y + stepY };

      // colisão com jogador = game over
      if (igual(novaPos, target)) {
        terminarJogo();
        return prev;
      }

      // parede
      if (
        novaPos.x < 0 ||
        novaPos.x >= GRID_SIZE ||
        novaPos.y < 0 ||
        novaPos.y >= GRID_SIZE
      ) {
        return prev;
      }

      return [novaPos];
    });
  }

  return { cobraInimiga, setCobraInimiga, moverCobraInimiga };
}
