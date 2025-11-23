import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
} from "react-native";

import { GRID_SIZE, CELULA, DIRECOES, gerarComida } from "../utils/constants";
import { useSettings } from "../context/SettingsContext"; // ← (ALTERAÇÃO 1)

// -------------------------------------------------------------
// GAME COMPONENT
// -------------------------------------------------------------
export default function Game({ navigation }: any) {
  // ← (ALTERAÇÃO 2) Ler cor do tabuleiro escolhida no menu
  const { corTabuleiro } = useSettings();

  // Estado da cobra (array de posições)
  const [cobra, setCobra] = useState([{ x: 5, y: 5 }]);

  // Direção inicial da cobra
  const direcao = useRef(DIRECOES.DIREITA).current;

  // Animação
  const anim = useRef(new Animated.ValueXY({ x: 5 * CELULA, y: 5 * CELULA }))
    .current;

  // Comida
  const [comida, setComida] = useState(gerarComida(cobra));

  // Pontuação
  const [pontos, setPontos] = useState(0);

  // Swipe (PanResponder)
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (Math.abs(gesture.dx) > Math.abs(gesture.dy)) {
          // Movimento horizontal
          if (gesture.dx > 10 && direcao !== DIRECOES.ESQUERDA) {
            direcao.x = 1;
            direcao.y = 0;
          } else if (gesture.dx < -10 && direcao !== DIRECOES.DIREITA) {
            direcao.x = -1;
            direcao.y = 0;
          }
        } else {
          // Movimento vertical
          if (gesture.dy > 10 && direcao !== DIRECOES.CIMA) {
            direcao.x = 0;
            direcao.y = 1;
          } else if (gesture.dy < -10 && direcao !== DIRECOES.BAIXO) {
            direcao.x = 0;
            direcao.y = -1;
          }
        }
      },
    })
  ).current;

  // -------------------------------------------------------------
  // Movimento automático da cobra
  // -------------------------------------------------------------
  useEffect(() => {
    const intervalo = setInterval(() => {
      moverCobra();
    }, 150); // velocidade estável

    return () => clearInterval(intervalo);
  }, [cobra]);

  // -------------------------------------------------------------
  // Função principal que move a cobra
  // -------------------------------------------------------------
  function moverCobra() {
    const novaCabeca = {
      x: cobra[0].x + direcao.x,
      y: cobra[0].y + direcao.y,
    };

    // Verificar colisões com paredes
    if (
      novaCabeca.x < 0 ||
      novaCabeca.x >= GRID_SIZE ||
      novaCabeca.y < 0 ||
      novaCabeca.y >= GRID_SIZE
    ) {
      navigation.navigate("GameOver", { pontos });
      return;
    }

    // Verificar colisão com o próprio corpo
    if (cobra.some((seg) => seg.x === novaCabeca.x && seg.y === novaCabeca.y)) {
      navigation.navigate("GameOver", { pontos });
      return;
    }

    // Comer maçã
    if (novaCabeca.x === comida.x && novaCabeca.y === comida.y) {
      const nova = [novaCabeca, ...cobra];
      setCobra(nova);
      setPontos(pontos + 1);
      setComida(gerarComida(nova)); // ← maçã muda corretamente
    } else {
      const nova = [novaCabeca, ...cobra.slice(1)];
      setCobra(nova);
    }

    // Animar suavemente a cabeça da cobra
    Animated.timing(anim, {
      toValue: { x: novaCabeca.x * CELULA, y: novaCabeca.y * CELULA },
      duration: 120,
      useNativeDriver: false,
    }).start();
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
      }}
      {...panResponder.panHandlers}
    >
      {/* -------------------------------------------------------------
         BOTÃO DE DEFINIÇÕES (opcional)
      ------------------------------------------------------------- */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Settings")}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          backgroundColor: "#333",
          padding: 10,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white", fontSize: 22 }}>⚙️</Text>
      </TouchableOpacity>

      {/* -------------------------------------------------------------
         TABULEIRO (usa a cor das definições)
      ------------------------------------------------------------- */}
      <View
        style={{
          width: GRID_SIZE * CELULA,
          height: GRID_SIZE * CELULA,
          backgroundColor: corTabuleiro, // ← (ALTERAÇÃO 3)
          borderWidth: 2,
          borderColor: "#555",
        }}
      >
        {/* Cabeça da cobra */}
        <Animated.View
          style={{
            width: CELULA,
            height: CELULA,
            backgroundColor: "lime",
            position: "absolute",
            transform: [
              { translateX: anim.x },
              { translateY: anim.y },
            ],
          }}
        />

        {/* Corpo */}
        {cobra.slice(1).map((seg, i) => (
          <View
            key={i}
            style={{
              width: CELULA,
              height: CELULA,
              backgroundColor: "green",
              position: "absolute",
              left: seg.x * CELULA,
              top: seg.y * CELULA,
            }}
          />
        ))}

        {/* Maçã */}
        <View
          style={{
            width: CELULA,
            height: CELULA,
            backgroundColor: "red",
            position: "absolute",
            left: comida.x * CELULA,
            top: comida.y * CELULA,
          }}
        />
      </View>

      {/* Pontuação */}
      <Text style={{ color: "white", marginTop: 20, fontSize: 20 }}>
        Pontos: {pontos}
      </Text>
    </View>
  );
}
