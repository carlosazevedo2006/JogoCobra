import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Board from "./src/components/Board";
import Controls from "./src/components/Controls";
import { GameState, Direction } from "./src/logic/gameTypes";
import { initGame, updateGame, nextDirection } from "./src/logic/gameEngine";
import { getBestScore, saveBestScore } from "./src/storage/highscore";

export default function App() {
  const [state, setState] = useState<GameState | null>(null);
  const [snakeColor, setSnakeColor] = useState("#00cc44");
  const [foodColor, setFoodColor] = useState("#ff3333");

  useEffect(() => {
    async function load() {
      const best = await getBestScore();
      setState(initGame(10, best));
    }
    load();
  }, []);

  // Loop do jogo
  useEffect(() => {
    if (!state || state.isGameOver) return;

    const id = setInterval(() => {
      setState((s) => (s ? updateGame(s) : s));
    }, 350);

    return () => clearInterval(id);
  }, [state]);

  if (!state) return null;

  const handleDirection = (dir: Direction) => {
    setState((s) =>
      s ? { ...s, direction: nextDirection(s.direction, dir) } : s
    );
  };

  const handleRestart = async () => {
    await saveBestScore(state.best);
    setState(initGame(10, state.best));
  };

  return (
    <View style={{ padding: 30, alignItems: "center" }}>
      <Text style={{ color: "white", fontSize: 28, marginBottom: 15 }}>
        Snake
      </Text>

      <Board state={state} snakeColor={snakeColor} foodColor={foodColor} />

      <Text style={{ color: "white", marginTop: 10 }}>
        Pontos: {state.score} | Melhor: {state.best}
      </Text>

      <Controls onChangeDir={handleDirection} onRestart={handleRestart} />
    </View>
  );
}
