// src/components/Game.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableOpacity,
  Easing,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { GRID_SIZE, CELULA, DIRECOES, gerarComida, igual } from "../utils/constants";
import { Posicao } from "../types/types";

// Intervalo de movimento da cobra em ms
const MOVE_INTERVAL_MS = 300;

const STORAGE_KEY_MELHOR = "@JogoCobra_MelhorPontuacao";
const STORAGE_KEY_COR = "@JogoCobra_CorCobra";

export default function Game() {
  // Posição inicial da cobra (centro do tabuleiro)
  const startX = Math.floor(GRID_SIZE / 2);
  const startY = Math.floor(GRID_SIZE / 2);

  // Estados principais do jogo
  const [cobra, setCobra] = useState<Posicao[]>([{ x: startX, y: startY }]);
  const [direcao, setDirecao] = useState<Posicao>(DIRECOES.DIREITA);
  const [comida, setComida] = useState<Posicao>(() => gerarComida([{ x: startX, y: startY }]));
  const [pontos, setPontos] = useState<number>(0);
  const [melhor, setMelhor] = useState<number>(0);

  const [jogando, setJogando] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [contador, setContador] = useState<number | null>(null);

  const [menuDefinicoes, setMenuDefinicoes] = useState<boolean>(false);
  const [corCobra, setCorCobra] = useState<string>("#43a047");

  // Referências para otimização e animação
  const latestDirRef = useRef<Posicao>(direcao);
  const comidaRef = useRef<Posicao>(comida);
  const eatAnim = useRef(new Animated.Value(1)).current;
  const lastTimeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // Para animação suave da cobra
  const animSegments = useRef<Animated.ValueXY[]>(
    [new Animated.ValueXY({ x: startX * CELULA, y: startY * CELULA })]
  );

  // Carregar melhor pontuação e cor guardada
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY_MELHOR);
        if (raw) setMelhor(Number(raw));
        const savedCor = await AsyncStorage.getItem(STORAGE_KEY_COR);
        if (savedCor) setCorCobra(savedCor);
      } catch {}
    })();
  }, []);

  // Atualiza referência da direção
  useEffect(() => {
    latestDirRef.current = direcao;
  }, [direcao]);

  // Atualiza referência da comida
  useEffect(() => {
    comidaRef.current = comida;
  }, [comida]);

  // Loop principal do jogo usando requestAnimationFrame para fluidez
  const loop = (timestamp?: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp || 0;
    const delta = (timestamp || 0) - lastTimeRef.current;

    if (delta >= MOVE_INTERVAL_MS && jogando) {
      step(); // mover a cobra
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

  // Função de movimento da cobra
  function step() {
    setCobra((prev) => {
      const head = prev[0];
      const dir = latestDirRef.current;
      const novaHead: Posicao = { x: head.x + dir.x, y: head.y + dir.y };

      // Colisão com paredes
      if (novaHead.x < 0 || novaHead.x >= GRID_SIZE || novaHead.y < 0 || novaHead.y >= GRID_SIZE) {
        terminarJogo();
        return prev;
      }

      // Colisão com o próprio corpo
      if (prev.some((seg) => igual(seg, novaHead))) {
        terminarJogo();
        return prev;
      }

      let novaCobra = [novaHead, ...prev];

      // Comer a maçã
      if (igual(novaHead, comidaRef.current)) {
        setPontos((p) => {
          const np = p + 1;
          if (np > melhor) {
            setMelhor(np);
            AsyncStorage.setItem(STORAGE_KEY_MELHOR, String(np)).catch(() => {});
          }
          return np;
        });

        // Animação da maçã ao ser comida
        Animated.sequence([
          Animated.timing(eatAnim, { toValue: 1.4, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(eatAnim, { toValue: 1, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ]).start();

        // Gerar nova posição da maçã
        const next = gerarComida(novaCobra);
        setComida(next);
        comidaRef.current = next;

      } else {
        // Remove cauda se não comer
        novaCobra.pop();
      }

      // Animação suave de cada segmento
      while (animSegments.current.length < novaCobra.length) {
        const idx = animSegments.current.length;
        animSegments.current.push(new Animated.ValueXY({ x: novaCobra[idx].x * CELULA, y: novaCobra[idx].y * CELULA }));
      }

      novaCobra.forEach((seg, idx) => {
        Animated.timing(animSegments.current[idx], {
          toValue: { x: seg.x * CELULA, y: seg.y * CELULA },
          duration: MOVE_INTERVAL_MS,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      });

      return novaCobra;
    });
  }

  // Função para atualizar direção (evita inversão)
  function requestDirecao(nova: Posicao) {
    const atual = latestDirRef.current;
    if (nova.x === -atual.x && nova.y === -atual.y) return;
    latestDirRef.current = nova;
    setDirecao(nova);
    step(); // resposta imediata
  }

  // Configuração do PanResponder para swipe
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (_evt, gestureState) => {
        const { dx, dy } = gestureState;
        const thresh = 12;
        if (Math.abs(dx) > Math.abs(dy)) {
          dx > thresh ? requestDirecao(DIRECOES.DIREITA) : dx < -thresh && requestDirecao(DIRECOES.ESQUERDA);
        } else {
          dy > thresh ? requestDirecao(DIRECOES.BAIXO) : dy < -thresh && requestDirecao(DIRECOES.CIMA);
        }
      },
    })
  ).current;

  // Terminar jogo
  function terminarJogo() {
    setJogando(false);
    setGameOver(true);
  }

  // Reiniciar jogo
  function reiniciar() {
    setCobra([{ x: startX, y: startY }]);
    latestDirRef.current = DIRECOES.DIREITA;
    setDirecao(DIRECOES.DIREITA);

    const initComida = gerarComida([{ x: startX, y: startY }]);
    setComida(initComida);
    comidaRef.current = initComida;

    setPontos(0);
    animSegments.current = [new Animated.ValueXY({ x: startX * CELULA, y: startY * CELULA })];
    setGameOver(false);
    iniciarContagem();
  }

  // Contagem inicial antes de começar
  function iniciarContagem() {
    setContador(3);
    let c = 3;
    const id = setInterval(() => {
      c -= 1;
      setContador(c);
      if (c <= 0) {
        clearInterval(id);
        setContador(null);
        setJogando(true);
        lastTimeRef.current = 0;
      }
    }, 1350);
  }

  // Alterar cor da cobra
  async function selecionarCor(cor: string) {
    setCorCobra(cor);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_COR, cor);
    } catch {}
  }

  // ------------------ RENDER ------------------
  // Tela inicial
  if (!jogando && !gameOver && contador === null && !menuDefinicoes) {
    return (
      <View style={styles.root}>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => setMenuDefinicoes(true)}>
          <Text style={styles.settingsText}>⚙</Text>
        </TouchableOpacity>

        <Text style={styles.title}> Jogo da Cobra </Text>

        <TouchableOpacity style={styles.playBtn} onPress={iniciarContagem}>
          <Text style={styles.playText}>PLAY</Text>
        </TouchableOpacity>

        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsTitle}>Como Jogar</Text>
          <Text style={styles.instructionsText}>• Deslize o dedo (swipe) no tabuleiro para mover a cobra.</Text>
          <Text style={styles.instructionsText}>• Movimentos permitidos: cima, baixo, esquerda, direita.</Text>
          <Text style={styles.instructionsText}>• Coma a maçã para ganhar pontos. Evite paredes e o próprio corpo.</Text>
        </View>
      </View>
    );
  }

  // Tela de definições
  if (menuDefinicoes) {
    return (
      <View style={styles.root}>
        <Text style={styles.title}>Definições</Text>
        <Text style={styles.instructionsTitle}>Cor da Cobra</Text>
        <View style={{ flexDirection: "row", marginTop: 18 }}>
          {["#43a047", "#1e88e5", "#fb8c00", "#8e24aa"].map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => selecionarCor(c)}
              style={[styles.colorSwatch, { backgroundColor: c, borderWidth: corCobra === c ? 3 : 0 }]}
            />
          ))}
        </View>
        <TouchableOpacity style={[styles.playBtn, { marginTop: 30 }]} onPress={() => setMenuDefinicoes(false)}>
          <Text style={styles.playText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Contagem inicial
  if (contador !== null) {
    return (
      <View style={styles.root}>
        <Text style={styles.countdown}>{contador > 0 ? String(contador) : "JÁ!"}</Text>
      </View>
    );
  }

  // Tela de Game Over
  if (gameOver) {
    return (
      <View style={styles.root}>
        <Text style={styles.gameOverTitle}>GAME OVER</Text>
        <Text style={styles.score}>Pontuação: {pontos}</Text>
        <Text style={styles.score}>Melhor: {melhor}</Text>
        <TouchableOpacity style={styles.playBtn} onPress={reiniciar}>
          <Text style={styles.playText}>REINICIAR</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ----------------- Jogo ativo -----------------
  return (
    <View style={styles.root} {...pan.panHandlers}>
      <Text style={styles.scoreTop}>Pontos: {pontos} · Melhor: {melhor}</Text>
      <View style={styles.board}>
        {/* Grid tracejada */}
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
                borderColor: "#999",
                borderStyle: "dashed",
              }}
            />
          ))
        )}

        {/* Cobra */}
        {cobra.map((seg, idx) => {
          const isHead = idx === 0;
          const anim = animSegments.current[idx];
          const transformStyle = anim
            ? [{ translateX: anim.x }, { translateY: anim.y }]
            : [{ translateX: seg.x * CELULA }, { translateY: seg.y * CELULA }];
          return (
            <Animated.View
              key={`seg-${idx}-${seg.x}-${seg.y}`}
              style={[
                styles.segment,
                { backgroundColor: corCobra },
                { transform: transformStyle },
              ]}
            />
          );
        })}

        {/* Maçã */}
        <Animated.View
          style={{
            position: "absolute",
            left: comida.x * CELULA + 2,
            top: comida.y * CELULA + 2,
            width: CELULA - 4,
            height: CELULA - 4,
            borderRadius: 6,
            backgroundColor: "#d32f2f",
            transform: [{ scale: eatAnim }],
          }}
        />
      </View>

      <Text style={styles.playHint}>Deslize no ecrã para mudar a direção</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#222", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 28, color: "#fff", marginBottom: 14, fontWeight: "700" },
  playBtn: { backgroundColor: "#4caf50", paddingHorizontal: 36, paddingVertical: 12, borderRadius: 10, marginTop: 8 },
  playText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  settingsBtn: { position: "absolute", top: 40, right: 24, zIndex: 20 },
  settingsText: { color: "#fff", fontSize: 26 },
  instructionsBox: { marginTop: 18, backgroundColor: "#333", padding: 14, borderRadius: 10, width: "82%" },
  instructionsTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 8, textAlign: "center" },
  instructionsText: { color: "#ccc", fontSize: 14, marginBottom: 4 },
  countdown: { color: "#fff", fontSize: 72, fontWeight: "700" },
  scoreTop: { color: "#fff", marginBottom: 12 },
  board: {
    width: GRID_SIZE * CELULA,
    height: GRID_SIZE * CELULA,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#555",
    position: "relative",
    overflow: "hidden", // limita ao tabuleiro
  },
  segment: { position: "absolute", width: CELULA - 4, height: CELULA - 4, borderRadius: 6 },
  playHint: { color: "#ddd", marginTop: 12 },
  gameOverTitle: { fontSize: 36, color: "#ff5252", marginBottom: 10 },
  score: { fontSize: 20, color: "#fff", marginBottom: 6 },
  colorSwatch: { width: 44, height: 44, borderRadius: 8, marginHorizontal: 8, borderColor: "#fff" },
});
