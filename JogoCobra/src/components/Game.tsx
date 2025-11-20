import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
  Easing,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Posicao } from "../types/types";
import { GRID_SIZE, CELULA, DIRECOES, gerarComida, igual } from "../utils/constants";
import Controls from "./Controls";

const STORAGE_KEY = "@JogoCobra_melhorPontuacao";
const MOVE_INTERVAL_MS = 150; // intervalo mais rápido para resposta imediata

export default function Game() {
  const [cobra, setCobra] = useState<Posicao[]>([{ x: 5, y: 5 }]);
  const [direcao, setDirecao] = useState<Posicao>(DIRECOES.DIREITA);
  const [comida, setComida] = useState<Posicao>(() => gerarComida([{ x: 5, y: 5 }]));
  const [pontos, setPontos] = useState<number>(0);
  const [melhor, setMelhor] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const intervalRef = useRef<number | null>(null);
  const latestDirRef = useRef<Posicao>(direcao);
  const eatAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    carregarMelhor();
    startLoop();
    return () => stopLoop();
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

  function startLoop() {
    stopLoop();
    intervalRef.current = setInterval(step, MOVE_INTERVAL_MS) as unknown as number;
  }

  function stopLoop() {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  // aplica nova direção imediatamente
  function requestDirecao(nova: Posicao) {
    const atual = latestDirRef.current;
    if (nova.x === -atual.x && nova.y === -atual.y) return;
    setDirecao(nova);
    latestDirRef.current = nova;
  }

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

        const next = gerarComida(novaCobra);
        setComida(next);
      } else {
        novaCobra.pop();
      }

      return novaCobra;
    });
  }

  function acabarJogo() {
    stopLoop();
    setGameOver(true);
  }

  function reiniciar() {
    setCobra([{ x: 5, y: 5 }]);
    setDirecao(DIRECOES.DIREITA);
    latestDirRef.current = DIRECOES.DIREITA;
    setComida(gerarComida([{ x: 5, y: 5 }]));
    setPontos(0);
    setGameOver(false);
    startLoop();
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

  const winW = Math.min(Dimensions.get("window").width, 520);
  const boardSize = CELULA * GRID_SIZE;
  const offsetX = Math.floor((winW - boardSize) / 2);

  let appleImg: any = null;
  try {
    appleImg = require("../../assets/apple.png");
  } catch {
    appleImg = null;
  }

  return (
    <View style={styles.root} {...pan.panHandlers}>
      <Text style={styles.title}>JogoCobra — SNAKE (PT)</Text>
      <View style={styles.scoreRow}>
        <Text style={styles.score}>Pontos: {pontos}</Text>
        <Text style={styles.score}>Melhor: {melhor}</Text>
      </View>

      <View style={[styles.boardWrapper, { width: boardSize, height: boardSize, left: offsetX }]}>
        <View style={[styles.board, { width: boardSize, height: boardSize }]}>
          {cobra.map((seg, idx) => {
            const isHead = idx === 0;
            const left = seg.x * CELULA;
            const top = seg.y * CELULA;
            return (
              <View
                key={`seg-${idx}-${seg.x}-${seg.y}`}
                style={[
                  styles.segment,
                  { width: CELULA - 2, height: CELULA - 2, left, top, backgroundColor: isHead ? "#1b5e20" : "#43a047" },
                ]}
              />
            );
          })}

          {appleImg ? (
            <Animated.Image
              source={appleImg}
              style={{
                position: "absolute",
                left: comida.x * CELULA,
                top: comida.y * CELULA,
                width: CELULA - 4,
                height: CELULA - 4,
                transform: [{ scale: eatAnim }],
              }}
            />
          ) : (
            <Animated.View
              style={{
                position: "absolute",
                left: comida.x * CELULA + 2,
                top: comida.y * CELULA + 2,
                width: CELULA - 6,
                height: CELULA - 6,
                borderRadius: 4,
                backgroundColor: "#d32f2f",
                transform: [{ scale: eatAnim }],
              }}
            />
          )}
        </View>
      </View>

      <Controls onChangeDirecao={requestDirecao} />

      <TouchableOpacity style={styles.reiniciarBtn} onPress={reiniciar}>
        <Text style={styles.actionText}>{gameOver ? "Reiniciar" : "Reiniciar"}</Text>
      </TouchableOpacity>

      {gameOver && <Text style={styles.gameOver}>GAME OVER</Text>}
      <Text style={styles.hint}>Sem diagonais — desliza (swipe) ou usa as setas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: "center", padding: 12, width: "100%" },
  title: { fontSize: 20, color: "#fff", marginBottom: 8 },
  scoreRow: { width: "90%", flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  score: { color: "#fff", fontSize: 16 },
  boardWrapper: { backgroundColor: "#fafafa", borderRadius: 8, overflow: "hidden", marginBottom: 12 },
  board: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd", position: "relative" },
  segment: { position: "absolute", alignItems: "center", justifyContent: "center" },
  reiniciarBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: "#f57c00",
  },
  actionText: { color: "#fff", fontWeight: "600" },
  gameOver: { color: "#ff5252", fontSize: 18, marginTop: 8 },
  hint: { color: "#ddd", marginTop: 8, fontSize: 12 },
});
