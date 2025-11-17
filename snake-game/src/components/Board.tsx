import React from "react";
import { View } from "react-native";
import { GameState } from "../logic/gameTypes";

interface Props {
  state: GameState;
  snakeColor: string;
  foodColor: string;
}

export default function Board({ state, snakeColor, foodColor }: Props) {
  const size = state.boardSize;
  const cell = 300 / size;

  return (
    <View
      style={{
        width: 300,
        height: 300,
        backgroundColor: "#111",
        borderWidth: 3,
        borderColor: "#444",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {Array.from({ length: size * size }).map((_, index) => {
        const x = index % size;
        const y = Math.floor(index / size);

        const isSnake = state.snake.some((p) => p.x === x && p.y === y);
        const isFood = state.food.x === x && state.food.y === y;

        return (
          <View
            key={index}
            style={{
              width: cell,
              height: cell,
              backgroundColor: isSnake
                ? snakeColor
                : isFood
                ? foodColor
                : "#222",
            }}
          />
        );
      })}
    </View>
  );
}
