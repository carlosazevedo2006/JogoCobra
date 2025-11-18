import { Snake, Position } from './types';
import { moveSnake, changeDirection } from './snakeMovement';
import { getNextDirection } from './aiController';
import { checkWallCollision, checkSelfCollision, checkSnakeCollision } from './collision';
import { getNextPosition, positionsEqual } from './utils';

export const processPlayerMove = (
  player: Snake,
  food: Position,
  gridSize: number
): { newPlayer: Snake; ateFood: boolean; collision: boolean } => {
  const head = player.body[0];
  const newHead = getNextPosition(head, player.direction);

  if (
    checkWallCollision(newHead, gridSize) ||
    checkSelfCollision(newHead, player.body.slice(1))
  ) {
    return { newPlayer: player, ateFood: false, collision: true };
  }

  const ateFood = positionsEqual(newHead, food);
  const newPlayer = moveSnake(player, ateFood);

  return { newPlayer, ateFood, collision: false };
};

export const processAIMove = (ai: Snake, food: Position, gridSize: number): Snake => {
  const newDirection = getNextDirection(ai, food, gridSize);
  const updatedAI = { ...ai, direction: newDirection };
  return moveSnake(updatedAI, false);
};

export const checkGameOver = (player: Snake, ai: Snake): boolean => {
  return (
    checkSnakeCollision(player, ai) ||
    checkSnakeCollision(ai, player)
  );
};