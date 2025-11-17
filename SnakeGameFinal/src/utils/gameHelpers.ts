import { Position, Direction } from '../types/gameTypes';

export const generateRandomPosition = (boardSize: number, exclude: Position[] = []): Position => {
  const position: Position = [
    Math.floor(Math.random() * boardSize),
    Math.floor(Math.random() * boardSize)
  ];
  
  const isExcluded = exclude.some(segment => 
    segment[0] === position[0] && segment[1] === position[1]
  );
  
  return isExcluded ? generateRandomPosition(boardSize, exclude) : position;
};

export const getNextHeadPosition = (head: Position, direction: Direction): Position => {
  const [x, y] = head;
  switch (direction) {
    case 'CIMA': return [x, y - 1];
    case 'BAIXO': return [x, y + 1];
    case 'ESQUERDA': return [x - 1, y];
    case 'DIREITA': return [x + 1, y];
    default: return head;
  }
};

export const checkCollision = (position: Position, boardSize: number, snake: Position[]): boolean => {
  const [x, y] = position;
  
  if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) {
    return true;
  }
  
  return snake.some(segment => segment[0] === x && segment[1] === y);
};

export const checkFoodCollision = (head: Position, food: Position): boolean => {
  return head[0] === food[0] && head[1] === food[1];
};

export const getOppositeDirection = (direction: Direction): Direction => {
  const opposites: Record<Direction, Direction> = {
    'CIMA': 'BAIXO',
    'BAIXO': 'CIMA',
    'ESQUERDA': 'DIREITA',
    'DIREITA': 'ESQUERDA'
  };
  return opposites[direction];
};