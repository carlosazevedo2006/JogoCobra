import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
  Easing,
  TouchableOpacity,
  Image,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Posicao } from "../types/types";
import { GRID_SIZE, CELULA, DIRECOES, gerarComida, igual } from "../utils/constants";
import Controls from "./Controls";

const STORAGE_KEY = "@JogoCobra_melhorPontuacao";
const MOVE_INTERVAL_MS = 300; // velocidade constante

// Helper para converter posição em pixels
const posToPixels = (pos: Posicao) => ({ left: pos.x * CELULA, top: pos.y * CELULA });

export default function Game() {
  const [cobra, setCobra] = useState<Posicao[]>([{ x: 5, y: 5 }]);
  const [direcao, setDirecao] = useState<Posicao>(DIRECOES.DIREITA);
  const [comida, setComida] = useState<Posicao>(() => gerarComida([{ x: 5, y: 5 }]));
  const [pontos, setPontos] = useState(0);
  const [melhor, setMelhor] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [jogando, setJogando] = useState(false);

  const latestDirRef = useRef(direcao);
  const eatAnim = useRef(new Animated.Value(1)).current;
  const lastTimeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // Animations para cada segmento
  const animSegments = useRef<Animated.ValueXY[]>([new Animated.ValueXY(posToPixels({ x: 5, y: 5 }))]);

  useEffect(() => {
    carregarMelhor();
  }, []);

  useEffect(() => {
    latestDirRef.current = direcao;
  }, [direcao]);

  async function carregarMelhor() {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) setMelhor(Number(raw));
  }

  async function guardarMelhor(novo: number) {
    await AsyncStorage.setItem(STORAGE_KEY, String(novo));
  }

  // Loop principal
  const loop = (timestamp?: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp || 0;
    const delta = (timestamp || 0) - lastTimeRef.current;

    if (delta >= MOVE_INTERVAL_MS && jogando) {
      step();
      lastTimeRef.current = timestamp || 0;
    }
    rafRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [jogando]);

  function step() {
    setCobra((prev) => {
      const head = prev[0];
      const dir = latestDirRef.current;
      const novaHead: Posicao = { x: head.x + dir.x, y: head.y + dir.y };

      if (novaHead.x < 0 || novaHead.x >= GRID_SIZE || novaHead.y < 0 || novaHead.y >= GRID_SIZE) {
        acabarJogo();
        return prev;
      }

      if (prev.some((seg) => igual(seg, novaHead))) {
        acabarJogo();
        return prev;
      }

      let novaCobra = [novaHead, ...prev];

      // Comer comida
      if (igual(novaHead, comida)) {
        setPontos((p) => {
          const np = p + 1;
          if (np > melhor) {
            setMelhor(np);
            guardarMelhor(np);
          }
          return np;
        });

        Animated.sequence([
          Animated.timing(eatAnim, { toValue: 1.4, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(eatAnim, { toValue: 1, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ]).start();

        setComida(gerarComida(novaCobra));
      } else {
        novaCobra.pop();
      }

      // Atualiza animações dos segmentos
      // Garantir que animSegments tenha o mesmo tamanho que a cobra
      while (animSegments.current.length < novaCobra.length) {
        animSegments.current.push(new Animated.ValueXY(posToPixels(novaCobra[animSegments.current.length])));
      }

      novaCobra.forEach((seg, idx) => {
        Animated.timing(animSegments.current[idx], {
          toValue: posToPixels(seg),
          duration: MOVE_INTERVAL_MS,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      });

      return novaCobra;
    });
  }

  function requestDirecao(nova: Posicao) {
    const atual = latestDirRef.current;
    if (nova.x === -atual.x && nova.y === -atual.y) return; // não inverte
    latestDirRef.current = nova;
    setDirecao(nova);
  }

  function acabarJogo() {
    setGameOver(true);
    setJogando(false);
  }

  function reiniciar() {
    setCobra([{ x: 5, y: 5 }]);
    setDirecao(DIRECOES.DIREITA);
    latestDirRef.current = DIRECOES.DIREITA;
    setComida(gerarComida([{ x: 5, y: 5 }]));
    setPontos(0);
    setGameOver(false);
    setJogando(true);

    // Reset anim segments
    animSegments.current = [new Animated.ValueXY(posToPixels({ x: 5, y: 5 }))];
  }

  // Swipe
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (_evt, gs) => {
        const { dx, dy } = gs;
        const thresh = 12;
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > thresh) requestDirecao(DIRECOES.DIREITA);
          else if (dx < -thresh) requestDirecao(DIRECOES.ESQUERDA);
        } else {
          if (dy > thresh) requestDirecao(DIRECOES.BAIXO);
          else if (dy < -thresh) requestDirecao(DIRECOES.CIMA);
        }
      },
    })
  ).current;

  let appleImg: any = null;
  try {
    appleImg = require("../../assets/apple.png");
  } catch {}

  // Tela inicial
  if (!jogando && !gameOver) {
    return (
      <View style={styles.root}>
        <Text style={styles.title}>JogoCobra — SNAKE (PT)</Text>
        <TouchableOpacity style={styles.reiniciarBtn} onPress={() => setJogando(true)}>
          <Text style={styles.actionText}>PLAY</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Tela game over
  if (gameOver) {
    return (
      <View style={styles.root}>
        <Text style={styles.title}>GAME OVER</Text>
        <Text style={styles.score}>Pontuação: {pontos}</Text>
        <TouchableOpacity style={styles.reiniciarBtn} onPress={reiniciar}>
          <Text style={styles.actionText}>REINICIAR</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Tela do jogo
  return (
    <View style={styles.root} {...pan.panHandlers}>
      <Text style={styles.title}>JogoCobra — SNAKE (PT)</Text>
      <View style={styles.scoreRow}>
        <Text style={styles.score}>Pontos: {pontos}</Text>
        <Text style={styles.score}>Melhor: {melhor}</Text>
      </View>

      <View style={styles.boardWrapper}>
        <View style={styles.board}>
          {cobra.map((seg, idx) => {
            const isHead = idx === 0;
            const animStyle = animSegments.current[idx]?.getLayout();
            return (
              <Animated.View
                key={`seg-${idx}-${seg.x}-${seg.y}`}
                style={[styles.segment, { backgroundColor: isHead ? "#1b5e20" : "#43a047" }, animStyle]}
              />
            );
          })}

          {appleImg ? (
            <Animated.Image
              source={appleImg}
              style={{ position: "absolute", left: comida.x * CELULA, top: comida.y * CELULA, width: CELULA - 4, height: CELULA - 4, transform: [{ scale: eatAnim }] }}
            />
          ) : (
            <Animated.View
              style={{ position: "absolute", left: comida.x * CELULA + 2, top: comida.y * CELULA + 2, width: CELULA - 6, height: CELULA - 6, borderRadius: 4, backgroundColor: "#d32f2f", transform: [{ scale: eatAnim }] }}
            />
          )}
        </View>
      </View>

      <Controls onChangeDirecao={requestDirecao} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#222", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 28, color: "#fff", marginBottom: 20, textAlign: "center" },
  scoreRow: { width: "90%", flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  score: { color: "#fff", fontSize: 18 },
  boardWrapper: { width: CELULA * GRID_SIZE, height: CELULA * GRID_SIZE, alignItems: "center", justifyContent: "center" },
  board: { width: CELULA * GRID_SIZE, height: CELULA * GRID_SIZE, backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd", position: "relative" },
  segment: { position: "absolute", width: CELULA - 2, height: CELULA - 2, borderRadius: 4 },
  reiniciarBtn: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, backgroundColor: "#f57c00", marginTop: 12 },
  actionText: { color: "#fff", fontWeight: "700", fontSize: 18 },
});
