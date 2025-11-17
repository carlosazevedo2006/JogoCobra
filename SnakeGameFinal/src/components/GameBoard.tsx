import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Position } from '../types/gameTypes';
import Snake from './Snake';
import Food from './Food';

interface GameBoardProps {
  boardSize: number;
  snake: Position[];
  food: Position;
  snakeColor: string;
  foodColor: string;
}

const GameBoard: React.FC<GameBoardProps> = ({
  boardSize,
  snake,
  food,
  snakeColor,
  foodColor
}) => {
  const renderCell = (x: number, y: number) => {
    const isSnake = snake.some(segment => segment[0] === x && segment[1] === y);
    const isFood = food[0] === x && food[1] === y;
    const isHead = snake[0][0] === x && snake[0][1] === y;

    return (
      <View
        key={`${x}-${y}`}
        style={[
          styles.cell,
          isSnake && { backgroundColor: snakeColor },
          isFood && { backgroundColor: foodColor }
        ]}
      >
        {isSnake && (
          <Snake 
            isHead={isHead} 
            color={snakeColor} 
          />
        )}
        {isFood && (
          <Food color={foodColor} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.board, { 
        width: boardSize * 32,
        height: boardSize * 32 
      }]}>
        {Array.from({ length: boardSize * boardSize }).map((_, index) => {
          const x = index % boardSize;
          const y = Math.floor(index / boardSize);
          return renderCell(x, y);
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#ddd',
  },
  cell: {
    width: 30,
    height: 30,
    margin: 1,
    backgroundColor: '#eee',
  },
});

export default GameBoard;