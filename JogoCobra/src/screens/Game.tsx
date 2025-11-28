// src/Game.tsx
import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

import { Modo } from "../types/types";

import WelcomeScreen from "../screens/WelcomeScreen";
import PlayScreen from "../screens/PlayScreen";
import ModeSelectScreen from "../screens/ModeSelectScreen";
import CountdownScreen from "../screens/CountdownScreen";
import GameOverScreen from "../screens/GameOverScreen";

import GameBoard from "../components/GameBoard";

import useSnakeMovement from "../hooks/useSnakeMovement";
import useEnemyMovement from "../hooks/useEnemyMovement";
import useGameLoop from "../hooks/useGameLoop";

import { DIRECOES } from "../utils/constants";

export default function Game() {
  // Fluxo de telas
  const [showWelcome, setShowWelcome] = useState(true);
  const [showPlayScreen, setShowPlayScreen] = useState(false);
  const [showModeSelection, setShowModeSelection] = useState(false);

  const [modoSelecionado, setModoSelecionado] = useState<Modo | null>(null);
  const [contador, setContador] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);

  // Refs e animação
  const latestDirRef = useRef(DIRECOES.DIREITA);
  const eatAnim = useRef(new Animated.Value(1)).current; // CORRIGIDO: Animated.Value válido
  const animSegments = useRef<any[]>([]);

  // Hook da cobra (movement + state)
  const {
    cobra,
    direcao,
    comida,
    pontos,
    melhor,
    velocidade,
    corCobra,

    setCobra,
    setComida,
    setPontos,
    setVelocidade,
    setMelhor,
    setCorCobra,

    requestDirecao,
    step,
    resetCobra,
  } = useSnakeMovement({
    latestDirRef,
    eatAnim,
    animSegments,
    modoSelecionado,
    onGameOver: () => setGameOver(true),
  });

  // Hook inimigo (modo difícil)
  const { cobraInimiga, setCobraInimiga } = useEnemyMovement({
    modoSelecionado,
    cobra,
    terminarJogo: () => setGameOver(true),
  });

  // Loop do jogo
  const [jogando, setJogando] = useState(false);
  useGameLoop(jogando, velocidade, () => {
    step();
  });

  function isJogando() {
    return (
      !showWelcome &&
      !showPlayScreen &&
      !showModeSelection &&
      !gameOver &&
      contador === null
    );
  }

  // Contagem inicial
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
      }
    }, 1000);
  }

  // Reiniciar
  function reiniciar() {
    resetCobra();
    setCobraInimiga([{ x: 8, y: 8 }]);
    setPontos(0);
    setGameOver(false);
    setVelocidade(undefined as any); // manter velocidade padrão do hook
    iniciarContagem();
  }

  // Render flow
  if (showWelcome) {
    return (
      <WelcomeScreen
        onContinue={() => {
          setShowWelcome(false);
          setShowPlayScreen(true);
        }}
      />
    );
  }

  if (showPlayScreen) {
    return (
      <PlayScreen
        onChooseMode={() => {
          setShowPlayScreen(false);
          setShowModeSelection(true);
        }}
      />
    );
  }

  if (showModeSelection) {
    return (
      <ModeSelectScreen
        onSelect={(modo: Modo) => {
          setModoSelecionado(modo);
          setShowModeSelection(false);
          iniciarContagem();
        }}
      />
    );
  }

  if (contador !== null) {
    return <CountdownScreen value={contador} />;
  }

  if (gameOver) {
    return (
      <GameOverScreen
        pontos={pontos}
        melhor={melhor}
        onRestart={reiniciar}
        onMenu={() => {
          setShowModeSelection(true);
          setModoSelecionado(null);
        }}
      />
    );
  }

  // Jogo ativo
  return (
    <View style={styles.root}>
      <Text style={styles.score}>
        Modo: {modoSelecionado} | Pontos: {pontos} | Melhor: {melhor}
      </Text>

      <GameBoard
        cobra={cobra}
        cobraInimiga={cobraInimiga}
        comida={comida}
        animSegments={animSegments.current}
        eatAnim={eatAnim}
        corCobra={corCobra}
        modoSelecionado={modoSelecionado}
        panHandlers={{}} // podes atribuir o PanResponder se quiseres
        onRequestDirecao={requestDirecao}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#111", alignItems: "center", justifyContent: "center" },
  score: { color: "#fff", marginBottom: 16, fontSize: 16 },
});
