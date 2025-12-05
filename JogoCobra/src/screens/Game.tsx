// src/Game.tsx
import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, PanResponder, Animated } from "react-native";

import { useTheme } from "../context/ThemeContext";
import { Modo } from "../types/types";

import WelcomeScreen from "../screens/WelcomeScreen";
import ModeSelectScreen from "../screens/ModeSelectScreen";
import CountdownScreen from "../screens/CountdownScreen";
import GameOverScreen from "../screens/GameOverScreen";
import SettingsScreen from "../screens/SettingsScreen";

import GameBoard from "../components/GameBoard";

import useSnakeMovement from "../hooks/useSnakeMovement";
import useEnemyMovement from "../hooks/useEnemyMovement";
import useGameLoop from "../hooks/useGameLoop";

import { DIRECOES } from "../utils/constants";

export default function Game() {
  const { colors } = useTheme();

  // Flow das telas
  const [showWelcome, setShowWelcome] = useState(true);
  const [showModeSelection, setShowModeSelection] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [modoSelecionado, setModoSelecionado] = useState<Modo | null>(null);
  const [contador, setContador] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [jogando, setJogando] = useState(false);

  // refs principais
  const latestDirRef = useRef(DIRECOES.DIREITA);
  const animSegments = useRef<any[]>([]);
  const enemyAnimSegments = useRef<any[]>([]);
  const eatAnim = useRef(new Animated.Value(1)).current;

  // Cobra principal
  const {
    cobra,
    comida,
    pontos,
    melhor,
    velocidade,
    corCobra,
    requestDirecao,
    step,
    resetCobra,
    setPontos,
  } = useSnakeMovement({
    latestDirRef,
    eatAnim,
    animSegments,
    modoSelecionado,
    onGameOver: () => {
      setJogando(false);
      setGameOver(true);
    },
  });

  // Cobra inimiga (modo difícil)
  const {
    cobraInimiga,
    setCobraInimiga,
    moverCobraInimiga,
  } = useEnemyMovement({
    modoSelecionado,
    cobra,
    enemyAnimSegments,
    terminarJogo: () => {
      setJogando(false);
      setGameOver(true);
    },
  });

  // Loop do jogo
  useGameLoop(jogando, velocidade, () => {
    step();
    moverCobraInimiga();
  });

  // Contagem antes de começar
  function iniciarContagem() {
    setJogando(false);
    setContador(3);

    let c = 3;

    const id = setInterval(() => {
      c--;
      setContador(c);

      if (c <= 0) {
        clearInterval(id);
        setContador(null);
        setJogando(true);
      }
    }, 1000);
  }

  // Reiniciar jogo
  function reiniciar() {
    resetCobra();
    latestDirRef.current = DIRECOES.DIREITA;

    setCobraInimiga([{ x: 8, y: 8 }]);
    enemyAnimSegments.current = [];

    setPontos(0);
    setGameOver(false);
    iniciarContagem();
  }

  // Swipe super responsivo
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_evt, g) => {
        const { dx, dy } = g;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);

        if (absX < 10 && absY < 10) return;

        if (absX > absY) {
          requestDirecao(dx > 0 ? DIRECOES.DIREITA : DIRECOES.ESQUERDA);
        } else {
          requestDirecao(dy > 0 ? DIRECOES.BAIXO : DIRECOES.CIMA);
        }
      },
    })
  ).current;

  // =============================
  //        RENDER FLOW
  // =============================

  if (showSettings)
    return (
      <SettingsScreen
        onClose={() => setShowSettings(false)}
        onApply={() => setShowSettings(false)}
      />
    );

  if (showWelcome)
    return (
      <WelcomeScreen
        onContinue={() => {
          setShowWelcome(false);
          setShowModeSelection(true);
        }}
        onSettings={() => setShowSettings(true)}
      />
    );

  if (showModeSelection)
    return (
      <ModeSelectScreen
        onSelect={(modo: Modo) => {
          setModoSelecionado(modo);

          resetCobra();
          setCobraInimiga([{ x: 8, y: 8 }]);
          enemyAnimSegments.current = [];

          setShowModeSelection(false);
          iniciarContagem();
        }}
      />
    );

  if (contador !== null) return <CountdownScreen value={contador} />;

  if (gameOver)
    return (
      <GameOverScreen
        pontos={pontos}
        melhor={melhor}
        onRestart={reiniciar}
        onMenu={() => {
          resetCobra();
          setShowModeSelection(true);
          setModoSelecionado(null);
        }}
      />
    );

  // =============================
  //      JOGO A DECORRER
  // =============================
  return (
    <View
      style={[
        styles.root,
        { backgroundColor: colors.background },
      ]}
    >
      <Text style={[styles.score, { color: colors.textPrimary }]}>
        {modoSelecionado} • {pontos} pts • REC {melhor}
      </Text>

      <GameBoard
        cobra={cobra}
        cobraInimiga={cobraInimiga}
        comida={comida}
        animSegments={animSegments.current}
        enemyAnimSegments={enemyAnimSegments.current}
        eatAnim={eatAnim}
        corCobra={corCobra}
        modoSelecionado={modoSelecionado}
        panHandlers={panResponder.panHandlers}
      />

      <Text style={[styles.tip, { color: colors.textSecondary }]}>
        Deslize para mover a cobra
      </Text>
    </View>
  );
}

// =============================
//           STYLES
// =============================
const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },

  score: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 14,
  },

  tip: {
    fontSize: 13,
    marginTop: 20,
  },
});
