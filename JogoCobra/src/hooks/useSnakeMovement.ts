// src/hooks/useSnakeMovement.ts
import { useState, useRef } from "react";
import { Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  DIRECOES,
  gerarComida,
  GRID_SIZE,
  CELULA,
  igual,
} from "../utils/constants";
import { Posicao } from "../types/types";

const MOVE_INTERVAL_MS = 300;
const STORAGE_KEY_MELHOR = "@JogoCobra_MelhorPontuacao";

interface Params {
  latestDirRef: any;
  eatAnim: Animated.Value;
  animSegments: any;
  modoSelecionado: string | null;
}

export default function useSnakeMovement({
  latestDirRef,
  eatAnim,
  animSegments,
  modoSelecionado,
}: Params) {
  const startX = Math.floor(GRID_SIZE / 2);
  const startY = Math.floor(GRID_SIZE / 2);

  const [cobra, setCobra] = useState<Posicao[]>([{ x: startX, y: startY }]);
  const [direcao, setDirecao] = useState(DIRECOES.DIREITA);
  const [comida, setComida] = useState<Posicao>(() =>
    gerarComida([{ x: startX, y: startY }])
  );
  const [pontos, setPontos] = useState(0);
  const [melhor, setMelhor] = useState(0);
  const [velocidade, setVelocidade] = useState(MOVE_INTERVAL_MS);
  const [corCobra, setCorCobra] = useState("#43a047");

  const comidaRef = useRef(comida);
  comidaRef.current = comida;

  // ----------------------------------------------------
  // RESET
  function resetCobra() {
    setCobra([{ x: startX, y: startY }]);
    setDirecao(DIRECOES.DIREITA);
    latestDirRef.current = DIRECOES.DIREITA;

    const novaComida = gerarComida([{ x: startX, y: startY }]);
    setComida(novaComida);
    comidaRef.current = novaComida;

    setPontos(0);
    setVelocidade(MOVE_INTERVAL_MS);

    animSegments.current = [
      new Animated.ValueXY({ x: startX * CELULA, y: startY * CELULA }),
    ];
  }

  // ----------------------------------------------------
  // STEP PRINCIPAL
  function step() {
    setCobra((prev) => {
      const head = prev[0];
      const dir = latestDirRef.current;

      const novaHead = { x: head.x + dir.x, y: head.y + dir.y };

      // colisão com paredes
      if (
        novaHead.x < 0 ||
        novaHead.x >= GRID_SIZE ||
        novaHead.y < 0 ||
        novaHead.y >= GRID_SIZE
      ) {
        return prev;
      }

      // colisão com o próprio corpo
      if (prev.some((seg) => igual(seg, novaHead))) {
        return prev;
      }

      let novaCobra = [novaHead, ...prev];

      // COME A COMIDA
      if (igual(novaHead, comidaRef.current)) {
        const novaPont = pontos + 1;
        setPontos(novaPont);

        if (novaPont > melhor) {
          setMelhor(novaPont);
          AsyncStorage.setItem(STORAGE_KEY_MELHOR, String(novaPont));
        }

        // velocidade aumenta APENAS no médio
        if (modoSelecionado === "MEDIO") {
          setVelocidade((v) => Math.max(80, v - 15));
        }

        const novaComida = gerarComida(novaCobra);
        setComida(novaComida);
        comidaRef.current = novaComida;

        Animated.sequence([
          Animated.timing(eatAnim, {
            toValue: 1.3,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(eatAnim, {
            toValue: 1,
            duration: 120,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        novaCobra.pop();
      }

      // animação suave
      while (animSegments.current.length < novaCobra.length) {
        const s = novaCobra[animSegments.current.length];
        animSegments.current.push(
          new Animated.ValueXY({ x: s.x * CELULA, y: s.y * CELULA })
        );
      }

      novaCobra.forEach((seg, idx) => {
        Animated.timing(animSegments.current[idx], {
          toValue: { x: seg.x * CELULA, y: seg.y * CELULA },
          duration: velocidade,
          useNativeDriver: false,
        }).start();
      });

      return novaCobra;
    });
  }

  // ----------------------------------------------------
  // DIREÇÃO
  function requestDirecao(nova: Posicao) {
    const atual = latestDirRef.current;

    if (nova.x === -atual.x && nova.y === -atual.y) return;

    latestDirRef.current = nova;
    setDirecao(nova);
  }

  return {
    cobra,
    direcao,
    comida,
    pontos,
    melhor,
    velocidade,
    corCobra,

    setDirecao,
    setCobra,
    setComida,
    setPontos,
    setVelocidade,
    setMelhor,
    setCorCobra,

    requestDirecao,
    step,
    resetCobra,
  };
}
