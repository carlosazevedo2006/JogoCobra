// src/hooks/useEnemyMovement.ts
import { useRef, useState } from "react";
import { Animated } from "react-native";
import { Posicao } from "../types/types";
import { GRID_SIZE, igual } from "../utils/constants";

const ENEMY_SPEED = 180;

export default function useEnemyMovement({
  modoSelecionado,
  cobra,
  terminarJogo,
}: any) {

  const [cobraInimiga, setCobraInimiga] = useState<Posicao[]>([
    { x: GRID_SIZE - 2, y: GRID_SIZE - 2 },
  ]);

  const enemyAnim = useRef(
    new Animated.ValueXY({
      x: (GRID_SIZE - 2) * 32,
      y: (GRID_SIZE - 2) * 32,
    })
  ).current;

  function moverCobraInimiga() {
    if (modoSelecionado !== "DIFICIL") return;

    setCobraInimiga((prev) => {
      const head = prev[0];
      const alvo = cobra[0];

      if (!alvo) return prev;

      // direção para seguir a cobra
      const dx = Math.sign(alvo.x - head.x);
      const dy = Math.sign(alvo.y - head.y);

      const novaHead = { x: head.x + dx, y: head.y + dy };

      // -----------------------------
      //  💀 DETECÇÃO DE COLISÃO (OPÇÃO B)
      // -----------------------------

      // Se a nova cabeça da INIMIGA colide com QUALQUER segment da tua cobra → game over
      if (cobra.some((seg) => igual(seg, novaHead))) {
        terminarJogo();
        return prev;
      }

      // Se a tua cabeça colidir com a cabeça da inimiga
      if (igual(cobra[0], novaHead)) {
        terminarJogo();
        return prev;
      }

      // -----------------------------
      //  evitar sair do mapa (respawn simples)
      // -----------------------------
      if (
        novaHead.x < 0 ||
        novaHead.x >= GRID_SIZE ||
        novaHead.y < 0 ||
        novaHead.y >= GRID_SIZE
      ) {
        return [{ x: GRID_SIZE - 2, y: GRID_SIZE - 2 }];
      }

      // movimento básico
      const novaCobra = [novaHead, ...prev];
      novaCobra.pop();

      // animação suave
      Animated.timing(enemyAnim, {
        toValue: { x: novaHead.x * 32, y: novaHead.y * 32 },
        duration: ENEMY_SPEED,
        useNativeDriver: false,
      }).start();

      // garantir Animated.ValueXY para cada segmento inimigo
      while (enemyAnimSegments.current.length < novaCobra.length) {
        const last = novaCobra[enemyAnimSegments.current.length] || novaCobra[novaCobra.length - 1];
        enemyAnimSegments.current.push(
        new Animated.ValueXY({ x: last.x * CELULA, y: last.y * CELULA })
  );
}

if (enemyAnimSegments.current.length > novaCobra.length) {
    enemyAnimSegments.current.splice(novaCobra.length);
}

// animar cada segmento inimigo
novaCobra.forEach((seg, idx) => {
  const anim = enemyAnimSegments.current[idx];
  if (anim) {
    Animated.timing(anim, {
      toValue: { x: seg.x * CELULA, y: seg.y * CELULA },
      duration: 120,
      useNativeDriver: false,
    }).start();
  }
});

return novaCobra;

    });
  }

  return {
    cobraInimiga,
    setCobraInimiga,
    moverCobraInimiga,
    enemyAnim,
  };
}
