// src/components/SnakeGame.tsx
// Componente principal do jogo Snake.
// Implementa:
// - Tabuleiro configurável (cols x rows)
// - Cobra (lista de pontos), movimento automático
// - Swipe (gestures), botões de controlo
// - Comida aleatória, crescimento, pontuação, AsyncStorage para melhor resultado
// - Velocidade crescente, efeito visual ao comer, vibração/haptics
// - Cobra inimiga simples (opcional) — se colisão entre cobras, game over

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  Dimensions,
  Vibration,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

// tipos para coordenadas e direções
type Point = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

// Props do componente
export default function SnakeGame({
  cols = 10, // colunas do tabuleiro
  rows = 10, // linhas do tabuleiro
  onGameOver, // callback quando o jogo termina (pontuação)
}: {
  cols?: number;
  rows?: number;
  onGameOver: (score: number) => void;
}) {
  // --- Estados principais ---
  // cobra: array de pontos, cabeça é elemento 0
  const [snake, setSnake] = useState<Point[]>(() => [
    { x: Math.floor(cols / 2), y: Math.floor(rows / 2) },
  ]);
  // direcção atual (para onde a cobra se está a mover)
  const [direction, setDirection] = useState<Direction>("RIGHT");
  // direção pedida pelo utilizador (usada para validar mudanças entre frames)
  const requestedDirectionRef = useRef<Direction | null>(null);
  // comida (alvo)
  const [food, setFood] = useState<Point>(() => randomFoodPosition(cols, rows, snake));
  // pontuação atual
  const [score, setScore] = useState<number>(0);
  // melhor pontuação lida de AsyncStorage
  const [best, setBest] = useState<number>(0);
  // velocidade — ms entre movimentos (quanto menor, mais rápido)
  const [speed, setSpeed] = useState<number>(350);
  // flag de correr / pausa
  const [running, setRunning] = useState<boolean>(true);
  // cor da cobra (configurável)
  const [snakeColor, setSnakeColor] = useState<string>("#2ecc71");
  // efeito visual ao comer (toggle breve)
  const [eatPulse, setEatPulse] = useState<boolean>(false);

  // (opcional) cobra inimiga simples — controlo automático
  const [enemySnake, setEnemySnake] = useState<Point[] | null>(null);
  const [enemyActive] = useState<boolean>(false); // colocar true para ativar cobra inimiga

  // refs para estar disponível dentro de timers sem closure stale values
  const snakeRef = useRef<Point[]>(snake);
  const directionRef = useRef<Direction>(direction);
  const runningRef = useRef<boolean>(running);
  const speedRef = useRef<number>(speed);

  // atualizar refs quando estados mudam
  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { runningRef.current = running; }, [running]);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  // --- Inicialização: ler melhor pontuação ---
  useEffect(() => {
    (async () => {
      try {
        const b = await AsyncStorage.getItem("snake_best_pt");
        if (b) setBest(Number(b));
      } catch (e) {
        console.warn("Erro a ler AsyncStorage:", e);
      }
    })();
  }, []);

  // --- Funções utilitárias internas (curtas) ---
  const toIndex = (p: Point) => p.y * cols + p.x;
  const equal = (a: Point, b: Point) => a.x === b.x && a.y === b.y;
  const randInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  function randomFoodPosition(c: number, r: number, snakeArr: Point[]) {
    // gera posição aleatória não ocupada pela cobra
    const occupied = new Set(snakeArr.map((p) => p.y * c + p.x));
    const maxAttempts = c * r * 2;
    for (let i = 0; i < maxAttempts; i++) {
      const x = randInt(0, c - 1);
      const y = randInt(0, r - 1);
      const idx = y * c + x;
      if (!occupied.has(idx)) return { x, y };
    }
    // fallback: procurar linearmente
    for (let y = 0; y < r; y++) {
      for (let x = 0; x < c; x++) {
        const idx = y * c + x;
        if (!occupied.has(idx)) return { x, y };
      }
    }
    // se ocupar tudo, retorna 0,0 (situação rara)
    return { x: 0, y: 0 };
  }

  function nextPoint(head: Point, dir: Direction) {
    // calcula próxima posição da cabeça conforme direcção
    if (dir === "UP") return { x: head.x, y: head.y - 1 };
    if (dir === "DOWN") return { x: head.x, y: head.y + 1 };
    if (dir === "LEFT") return { x: head.x - 1, y: head.y };
    return { x: head.x + 1, y: head.y };
  }

  function isOutOfBounds(p: Point) {
    // verifica colisão com paredes
    return p.x < 0 || p.y < 0 || p.x >= cols || p.y >= rows;
  }

  function opposite(d: Direction) {
    // retorna direcção oposta
    if (d === "UP") return "DOWN";
    if (d === "DOWN") return "UP";
    if (d === "LEFT") return "RIGHT";
    return "LEFT";
  }

  // --- Movimento automático (loop do jogo) ---
  useEffect(() => {
    // função que executa um passo do jogo
    const step = () => {
      if (!runningRef.current) return; // se pausado, não faz nada

      // aplicar direção pedida (se existir e não for inversa direta)
      const req = requestedDirectionRef.current;
      if (req && opposite(req) !== directionRef.current) {
        setDirection(req);
        directionRef.current = req;
        requestedDirectionRef.current = null;
      }

      const current = snakeRef.current;
      const head = current[0];
      const newHead = nextPoint(head, directionRef.current);

      // colisão com parede?
      if (isOutOfBounds(newHead)) {
        // game over
        endGame();
        return;
      }

      // colisão com o próprio corpo?
      if (current.some((p) => equal(p, newHead))) {
        endGame();
        return;
      }

      // colisão com inimigo (se activo)
      if (enemyActive && enemySnake) {
        if (enemySnake.some((p) => equal(p, newHead))) {
          endGame();
          return;
        }
      }

      // mover: adicionar cabeça
      const newSnake = [newHead, ...current];

      // comer comida?
      if (equal(newHead, food)) {
        // pontuar
        setScore((s) => s + 1);
        // efeito visual
        setEatPulse(true);
        setTimeout(() => setEatPulse(false), 140);
        // haptics suave
        try {
          Haptics.selectionAsync();
        } catch (e) {
          Vibration.vibrate(30);
        }
        // gerar nova comida
        const nf = randomFoodPosition(cols, rows, newSnake);
        setFood(nf);
        // aumentar velocidade gradualmente
        setSpeed((sp) => {
          const next = Math.max(80, sp - 18); // tornar mais rápido
          speedRef.current = next;
          return next;
        });
      } else {
        // não comeu → remover cauda (mantém o tamanho)
        newSnake.pop();
      }

      // atualizar snake
      setSnake(newSnake);
    };

    // cria um interval que chama step com base em speedRef
    const tick = () => {
      step();
    };

    // usar setInterval; quando speedRef mudar, effect não recria automaticamente
    // por isso, criamos um loop recursivo com setTimeout que lê speedRef.current
    let mounted = true;
    const loop = async () => {
      while (mounted) {
        await new Promise((res) => setTimeout(res, speedRef.current));
        if (!mounted) break;
        tick();
      }
    };
    loop();

    // cleanup
    return () => {
      mounted = false;
    };
    // NOTA: dependências vazias porque usamos refs para ler estados mutáveis
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Função para terminar jogo ---
  const endGame = async () => {
    setRunning(false);
    runningRef.current = false;
    // atualizar melhor pontuação
    try {
      const b = await AsyncStorage.getItem("snake_best_pt");
      const bestStored = b ? Number(b) : 0;
      if (score > bestStored) {
        await AsyncStorage.setItem("snake_best_pt", String(score));
        setBest(score);
      } else {
        setBest(bestStored);
      }
    } catch (e) {
      console.warn("Erro AsyncStorage:", e);
    }
    // chamar callback do ecrã (ex: navegar para GameOver)
    onGameOver(score);
  };

  // --- Pedir mudança de direção (respeita regra de não inverter) ---
  const requestDirection = (d: Direction) => {
    if (opposite(d) === directionRef.current) return; // não permitir inversão direta
    requestedDirectionRef.current = d; // será aplicada no próximo passo
  };

  // --- Controles por Touch (swipe) simples ---
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const minSwipe = 16;

  const handleTouchStart = (e: GestureResponderEvent) => {
    const t = e.nativeEvent;
    touchStartRef.current = { x: t.pageX, y: t.pageY };
  };

  const handleTouchEnd = (e: GestureResponderEvent) => {
    if (!touchStartRef.current) return;
    const t = e.nativeEvent;
    const dx = t.pageX - touchStartRef.current.x;
    const dy = t.pageY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dx) < minSwipe && Math.abs(dy) < minSwipe) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      // horizontal
      if (dx > 0) requestDirection("RIGHT");
      else requestDirection("LEFT");
    } else {
      if (dy > 0) requestDirection("DOWN");
      else requestDirection("UP");
    }
  };

  // --- Render helpers (grid, células) ---
  const cells: Point[] = [];
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) cells.push({ x, y });

  const snakeSet = new Set(snake.map((p) => toIndex(p)));
  const foodIndex = toIndex(food);

  // layout: cálculo de tamanho do tabuleiro com base no ecrã
  const windowWidth = Dimensions.get("window").width;
  const gridSize = Math.min(windowWidth - 32, 360);
  const cellSize = gridSize / cols;

  // --- JSX do componente ---
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.score}>Pontuação: {score}</Text>
        <Text style={styles.best}>Melhor: {best}</Text>
      </View>

      {/* Grid do jogo — captura touch para swipe */}
      <View
        style={[styles.grid, { width: gridSize, height: gridSize, gridTemplateColumns: `repeat(${cols}, ${cellSize}px)` } as any]}
        onStartShouldSetResponder={() => true}
        onResponderStart={handleTouchStart}
        onResponderRelease={handleTouchEnd}
      >
        {cells.map((c, i) => {
          const idx = c.y * cols + c.x;
          const isSnake = snakeSet.has(idx);
          const isHead = snake.length > 0 && equal(c, snake[0]);
          const isFood = idx === foodIndex;

          return (
            <View key={i} style={[styles.cell, { width: cellSize, height: cellSize }]}>
              {isSnake ? (
                <View
                  style={[
                    styles.snakeSeg,
                    { backgroundColor: snakeColor, transform: isHead && eatPulse ? [{ scale: 1.1 }] : [{ scale: 1 }] },
                    isHead ? styles.head : null,
                  ]}
                />
              ) : isFood ? (
                <View style={[styles.food, eatPulse ? { transform: [{ scale: 1.12 }] } : {}]} />
              ) : null}
            </View>
          );
        })}
      </View>

      {/* Controles por botões */}
      <View style={styles.controls}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.ctrlBtn} onPress={() => requestDirection("UP")}>
            <Text>⬆️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.ctrlBtn} onPress={() => requestDirection("LEFT")}>
            <Text>⬅️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.ctrlBtn, { backgroundColor: "#f0f0f0" }]} onPress={() => { /* pausa */ setRunning((r) => { runningRef.current = !r; return !r; }); }}>
            <Text>{running ? "Pausar" : "Retomar"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctrlBtn} onPress={() => requestDirection("RIGHT")}>
            <Text>➡️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.ctrlBtn} onPress={() => requestDirection("DOWN")}>
            <Text>⬇️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Configs simples: cor e reiniciar */}
      <View style={styles.footer}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            style={[styles.smallBtn, { backgroundColor: "#2ecc71" }]}
            onPress={() => setSnakeColor("#2ecc71")}
          >
            <Text style={styles.smallBtnText}>Verde</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.smallBtn, { backgroundColor: "#e67e22" }]}
            onPress={() => setSnakeColor("#e67e22")}
          >
            <Text style={styles.smallBtnText}>Laranja</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.smallBtn, { backgroundColor: "#3498db" }]}
            onPress={() => setSnakeColor("#3498db")}
          >
            <Text style={styles.smallBtnText}>Azul</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.smallBtn, { marginTop: 12, backgroundColor: "#fff", borderWidth: 1 }]}
          onPress={() => {
            // reiniciar jogo localmente (sem navegar)
            setSnake([{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }]);
            setDirection("RIGHT");
            requestedDirectionRef.current = null;
            setFood(randomFoodPosition(cols, rows, [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }]));
            setScore(0);
            setSpeed(350);
            setRunning(true);
          }}
        >
          <Text>Reiniciar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- estilos ---
// muitos estilos para visual simples e limpo
const styles = StyleSheet.create({
  root: { alignItems: "center" },
  header: { flexDirection: "row", justifyContent: "space-between", width: "90%", marginBottom: 12 },
  score: { fontSize: 16, fontWeight: "600" },
  best: { fontSize: 14, color: "#555" },
  grid: {
    backgroundColor: "#dfe6e9",
    borderRadius: 8,
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: { borderWidth: 0.4, borderColor: "rgba(0,0,0,0.06)", alignItems: "center", justifyContent: "center" },
  snakeSeg: { width: "86%", height: "86%", borderRadius: 6, shadowColor: "#000", shadowOpacity: 0.08 },
  head: { shadowOffset: { width: 0, height: 4 }, shadowRadius: 6 },
  food: { width: "70%", height: "70%", backgroundColor: "#e74c3c", borderRadius: 4 },
  controls: { marginTop: 14 },
  row: { flexDirection: "row", justifyContent: "center", marginVertical: 6 },
  ctrlBtn: { width: 84, height: 44, alignItems: "center", justifyContent: "center", backgroundColor: "#fff", borderRadius: 8, marginHorizontal: 8, elevation: 2 },
  footer: { marginTop: 12, alignItems: "center" },
  smallBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginHorizontal: 4 },
  smallBtnText: { color: "#fff", fontWeight: "600" },
});
