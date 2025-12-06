// src/hooks/useEnemyMovement.ts
import { useState, useEffect } from "react";
import { Animated } from "react-native";
import { Posicao } from "../types/types";
import { GRID_SIZE, CELULA, igual } from "../utils/constants";

export default function useEnemyMovement({
  modoSelecionado,
  cobra,
  enemyAnimSegments,
  terminarJogo,
}: any) {

  // posição segura inicial
  const initialEnemyPos = { x: GRID_SIZE - 3, y: GRID_SIZE - 3 };

  const [cobraInimiga, setCobraInimiga] = useState<Posicao[]>([
    initialEnemyPos,
  ]);

  // 🔥 RESET automático quando muda de modo 
  // (EVITA GAME OVER IMEDIATO AO TROCAR DE MODO)
  useEffect(() => {
    if (modoSelecionado !== "DIFICIL") {
      // remover cobra inimiga completamente nos outros modos
      setCobraInimiga([]);
      enemyAnimSegments.current = [];
      return;
    }

    // modo dificil → cria cobra inimiga de raiz numa posição segura
    setCobraInimiga([initialEnemyPos]);
    enemyAnimSegments.current = [
      new Animated.ValueXY({
        x: initialEnemyPos.x * CELULA,
        y: initialEnemyPos.y * CELULA,
      }),
    ];
  }, [modoSelecionado]);

  function moverCobraInimiga() {
    if (modoSelecionado !== "DIFICIL") return;
    if (cobraInimiga.length === 0) return;

    setCobraInimiga((prev) => {
      if (!prev || prev.length === 0) return prev;

      const head = prev[0];
      const alvo = cobra[0];

      if (!alvo) return prev; // segurança

      // calcula direção na grelha
      const dx = Math.sign(alvo.x - head.x);
      const dy = Math.sign(alvo.y - head.y);

      const novaHead = { x: head.x + dx, y: head.y + dy };

      // verificar colisão direta com jogador
      if (igual(novaHead, alvo)) {
        terminarJogo();
        return prev;
      }

      // impedir sair do mapa
      if (
        novaHead.x < 0 ||
        novaHead.x >= GRID_SIZE ||
        novaHead.y < 0 ||
        novaHead.y >= GRID_SIZE
      ) {
        return prev;
      }

      // garantir que há animSegment
      if (enemyAnimSegments.current.length === 0) {
        enemyAnimSegments.current = [
          new Animated.ValueXY({
            x: head.x * CELULA,
            y: head.y * CELULA,
          }),
        ];
      }

      // animação suave
      Animated.timing(enemyAnimSegments.current[0], {
        toValue: {
          x: novaHead.x * CELULA,
          y: novaHead.y * CELULA,
        },
        duration: 160,
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
